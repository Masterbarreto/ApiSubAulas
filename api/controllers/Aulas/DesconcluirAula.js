import { getDb } from "../../db.js";
import { ObjectId } from "mongodb";

export const NaoAula = async (req, res) => {
    try {
        const db = await getDb();
        const result = await db.collection("aulas").updateOne( // Corrigido o nome da coleção para "aulas"
            { _id: new ObjectId(req.params.id) },
            { $set: { concluida: false } } // Corrigido "fall" para "false"
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Aula não encontrada." });
        }
        return res.status(200).json({ message: "Aula desfeita com sucesso!" });
    } catch (err) {
        console.error("Erro ao desfazer aula:", err);
        return res.status(500).json({ error: "Erro ao desfazer aula." });
    }
};