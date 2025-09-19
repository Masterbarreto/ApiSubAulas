import { getDb } from "../../db.js";
import { ObjectId } from "mongodb";
import analytics from "../../../utils/segment.js";

export const concluirAula = async (req, res) => {
    try {
        const db = await getDb();
        const { turma } = req.body; // turma específica para concluir (opcional)
        
        // Primeiro busca a aula para ter informações completas
        const aula = await db.collection("aulas").findOne({ _id: new ObjectId(req.params.id) });
        
        if (!aula) {
            return res.status(404).json({ error: "Aula não encontrada." });
        }

        // Obtém as turmas da aula (compatibilidade com formato antigo e novo)
        const turmasAula = aula.turmas || (aula.Turma ? [aula.Turma] : []);
        const turmasConcluidas = aula.turmasConcluidas || [];

        let updateData = {};

        if (turma) {
            // Conclusão para turma específica
            if (!turmasAula.includes(turma)) {
                return res.status(400).json({ 
                    error: `Turma ${turma} não está associada a esta aula.`,
                    turmasDisponiveis: turmasAula 
                });
            }

            if (turmasConcluidas.includes(turma)) {
                return res.status(400).json({ 
                    error: `Turma ${turma} já está concluída.`,
                    turmasConcluidas 
                });
            }

            // Adiciona a turma ao array de concluídas
            const novasTurmasConcluidas = [...turmasConcluidas, turma];
            
            updateData = {
                turmasConcluidas: novasTurmasConcluidas,
                concluida: novasTurmasConcluidas.length === turmasAula.length // true se TODAS estão concluídas
            };
        } else {
            // Conclusão total (todas as turmas)
            updateData = {
                turmasConcluidas: turmasAula,
                concluida: true
            };
        }

        const result = await db.collection("aulas").updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updateData }
        );

        // Adiciona rastreamento do evento com mais informações
        analytics.track({
            userId: req.user?.id || "unknown",
            event: "Aula Concluída",
            properties: {
                aulaId: req.params.id,
                titulo: aula.titulo,
                cursos: aula.cursos || (aula.curso ? [aula.curso] : []),
                turmas: turmasAula,
                turmaConcluida: turma || "todas",
                turmasConcluidas: updateData.turmasConcluidas,
                concluida: updateData.concluida,
                professor: aula.professor,
                timestamp: new Date().toISOString(),
            },
        });

        return res.status(200).json({ 
            message: turma 
                ? `Aula concluída para a turma ${turma}!` 
                : "Aula concluída para todas as turmas!",
            aula: {
                id: req.params.id,
                titulo: aula.titulo,
                cursos: aula.cursos || (aula.curso ? [aula.curso] : []),
                turmas: turmasAula,
                turmasConcluidas: updateData.turmasConcluidas,
                concluida: updateData.concluida
            }
        });
    } catch (err) {
        console.error("Erro ao concluir aula:", err);
        return res.status(500).json({ error: "Erro ao concluir aula." });
    }
};