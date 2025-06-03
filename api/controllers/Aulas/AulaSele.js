import { getDb } from "../../db.js";
import { ObjectId } from "mongodb";

export const getAulaById = async (req, res) => {
    const { id } = req.params;

    try {
        const db = await getDb();
        const aulas = db.collection('aulas');
        const arquivosCol = db.collection('arquivosAulas');

        let aula;
        try {
            aula = await aulas.findOne({ _id: new ObjectId(id) });
        } catch (e) {
            return res.status(400).json({ message: "ID inválido." });
        }

        if (!aula) {
            return res.status(404).json({ message: "Aula não encontrada." });
        }

        // Busca os metadados dos arquivos usando arquivosIds
        let arquivos = [];
        if (aula.arquivosIds && aula.arquivosIds.length > 0) {
            const arquivosDocs = await arquivosCol.find({
                _id: { $in: aula.arquivosIds.map(id => new ObjectId(id)) }
            }).toArray();

            arquivos = arquivosDocs.map(arq => ({
                arquivosIds: [arq._id],
                nome: arq.nome,
                mimetype: arq.mimetype
            }));
        }

        return res.status(200).json({
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
            arquivos,
            arquivosIds: aula.arquivosIds || [],
            professor: aula.professor,
            createdAt: aula.createdAt
                ? new Date(aula.createdAt).toISOString().split('T').join(' ').split('.')[0] // Formata para "YYYY-MM-DD HH:mm:ss"
                : null,
        });
    } catch (err) {
        console.error('Erro ao buscar aula:', err);
        res.status(500).json({ error: 'Erro ao buscar aula' });
    }
};
