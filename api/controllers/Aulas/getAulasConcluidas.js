import { getDb } from '../../db.js';

export const getAulasConcluidas = async (req, res) => {
    try {
        const db = await getDb();
        const aulas = await db.collection('aulas').find({ concluida: true }).toArray();
        const resultado = aulas.map(aula => ({
            _id: aula._id,
            anoEscolar: aula.anoEscolar,
            curso: aula.curso,
            titulo: aula.titulo,
            Turma: aula.Turma,
            Materia: aula.Materia,
            DayAula: aula.DayAula,
            Horario: aula.Horario,
            DesAula: aula.DesAula,
            LinkAula: aula.LinkAula,
            concluida: aula.concluida,
            arquivos: aula.arquivos || [],
            arquivosIds: aula.arquivosIds || [],
            professor: aula.professor,
        }));
        res.status(200).json(resultado);
    } catch (err) {
        console.error('Erro ao buscar aulas concluídas:', err);
        res.status(500).json({ error: 'Erro ao buscar aulas concluídas' });
    }
};
