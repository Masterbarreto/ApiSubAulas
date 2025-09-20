import { getDb } from "../../db.js"; // Adicionada a importação de getDb

export const getAulas = async (req, res) => {
    try {
        const db = await getDb();
        
        // Busca aulas que não estão completamente concluídas
        // (concluida: false OU tem turmas não concluídas)
        const aulas = await db.collection('aulas').find({
            $or: [
                { concluida: false },
                { concluida: { $exists: false } }, // compatibilidade com dados antigos
                { 
                    $and: [
                        { turmas: { $exists: true } },
                        { turmasConcluidas: { $exists: true } },
                        { $expr: { $ne: [{ $size: "$turmas" }, { $size: "$turmasConcluidas" }] } }
                    ]
                }
            ]
        }).toArray();

        const resultado = aulas.map(aula => {
            // Compatibilidade com formato antigo e novo
            const turmasAula = aula.turmas || (aula.Turma ? [aula.Turma] : []);
            const turmasConcluidas = aula.turmasConcluidas || [];
            const turmasNaoConcluidas = turmasAula.filter(t => !turmasConcluidas.includes(t));

            return {
                aulaId: aula._id,
                arquivosIds: aula.arquivosIds || [],
                titulo: aula.titulo,
                Horario: aula.Horario,
                DesAula: aula.DesAula,
                anoEscolar: aula.anoEscolar,
                // Suporta tanto o formato antigo quanto o novo
                cursos: aula.cursos || (aula.curso ? [aula.curso] : []),
                turmas: turmasAula,
                // Mantém compatibilidade com formato antigo para o frontend
                curso: aula.cursos ? aula.cursos[0] : aula.curso,
                Turma: aula.turmas ? aula.turmas[0] : aula.Turma,
                materias: aula.materias || aula.Materia, // Prioriza campo novo 'materias'
                Materia: aula.materias || aula.Materia, // Compatibilidade com campo antigo
                professor: aula.professor || "Não informado",
                // Informações sobre conclusão por turma
                turmasConcluidas: turmasConcluidas,
                turmasNaoConcluidas: turmasNaoConcluidas,
                concluida: aula.concluida || false,
                conclusaoParcial: turmasConcluidas.length > 0 && turmasConcluidas.length < turmasAula.length
            };
        });

        res.status(200).json(resultado);
    } catch (err) {
        console.error('Erro ao buscar aulas:', err);
        res.status(500).json({ error: 'Erro ao buscar aulas' });
    }
};
