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

        const { arquivos: _, ...outrosCampos } = aula;

        return res.status(200).json({
            aulaId: aula._id,
            arquivosIds: aula.arquivosIds || [],
            arquivos, // agora vem no formato desejado
            createdAt: aula.createdAt,
            ...outrosCampos
        });
    } catch (err) {
        console.error('Erro ao buscar aula:', err);
        res.status(500).json({ error: 'Erro ao buscar aula' });
    }
};
