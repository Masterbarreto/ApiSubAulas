import { getDb } from '../../db.js';

export const getAulasConcluidas = async (req, res) => {
    try {
        const db = await getDb();
        
        // Busca aulas que estão completamente concluídas
        // (concluida: true E todas as turmas estão no array de concluídas)
        const aulas = await db.collection('aulas').find({
            $or: [
                { concluida: true }, // compatibilidade com formato antigo
                { 
                    $and: [
                        { turmas: { $exists: true } },
                        { turmasConcluidas: { $exists: true } },
                        { $expr: { $eq: [{ $size: "$turmas" }, { $size: "$turmasConcluidas" }] } }
                    ]
                }
            ]
        }).toArray();

        const resultado = aulas.map(aula => {
            // Compatibilidade com formato antigo e novo
            const turmasAula = aula.turmas || (aula.Turma ? [aula.Turma] : []);
            const turmasConcluidas = aula.turmasConcluidas || turmasAula; // se não tem array, assume todas concluídas

            return {
                _id: aula._id,
                anoEscolar: aula.anoEscolar,
                // Suporta tanto o formato antigo quanto o novo
                cursos: aula.cursos || (aula.curso ? [aula.curso] : []),
                turmas: turmasAula,
                // Mantém compatibilidade com formato antigo
                curso: aula.cursos ? aula.cursos[0] : aula.curso,
                Turma: aula.turmas ? aula.turmas[0] : aula.Turma,
                titulo: aula.titulo,
                Materia: aula.Materia,
                DayAula: aula.DayAula,
                Horario: aula.Horario,
                DesAula: aula.DesAula,
                LinkAula: aula.LinkAula,
                concluida: aula.concluida,
                arquivos: aula.arquivos || [],
                arquivosIds: aula.arquivosIds || [],
                professor: aula.professor,
                // Informações sobre conclusão por turma
                turmasConcluidas: turmasConcluidas,
                conclusaoCompleta: turmasConcluidas.length === turmasAula.length
            };
        });

        res.status(200).json(resultado);
    } catch (err) {
        console.error('Erro ao buscar aulas concluídas:', err);
        res.status(500).json({ error: 'Erro ao buscar aulas concluídas' });
    }
};
