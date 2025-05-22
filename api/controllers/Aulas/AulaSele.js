import { getDb } from "../../db.js";
import { ObjectId } from "mongodb";

export const getAulaById = async (req, res) => {
    const { id } = req.params;

    try {
        const db = await getDb();
        const aulas = db.collection('aulas');

        let aula;
        try {
            aula = await aulas.findOne({ _id: new ObjectId(id) });
        } catch (e) {
            return res.status(400).json({ message: "ID inválido." });
        }

        if (!aula) {
            return res.status(404).json({ message: "Aula não encontrada." });
        }

        const { arquivos, ...outrosCampos } = aula;

        // Retorna o mesmo padrão da criação
        return res.status(200).json({
            aulaId: aula._id,
            arquivosIds: aula.arquivosIds || [],
            createdAt: new Date(),
            ...outrosCampos // inclui todos os outros campos da aula
        });
    } catch (err) {
        console.error('Erro ao buscar aula:', err);
        res.status(500).json({ error: 'Erro ao buscar aula' });
    }
};
