export const getAulas = async (req, res) => {
    try {
        const db = await getDb();
        const aulas = await db.collection('aulas').find({ concluida: false }).toArray();
        const resultado = aulas.map(aula => ({
            aulaId: aula._id,
            arquivosIds: aula.arquivosIds || [],
            titulo: aula.titulo,
            Horario: aula.Horario,
            DesAula: aula.DesAula,
            anoEscolar: aula.anoEscolar,
            curso: aula.curso,
            Turma: aula.Turma,
            Materia: aula.Materia,
            professor: aula.professor || "Não informado", // <-- AQUI O PULO DO GATO
        }));
        res.status(200).json(resultado);
    } catch (err) {
        console.error('Erro ao buscar aulas:', err);
        res.status(500).json({ error: 'Erro ao buscar aulas' });
    }
};
