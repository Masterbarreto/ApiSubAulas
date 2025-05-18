import { getDb } from "../../db.js";
import { ObjectId } from "mongodb";

export const concluirAula = async (req, res) => {
    try {
        const db = await getDb();
        const result = await db.collection("aulas").updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { concluida: true } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Aula não encontrada." });
        }
        return res.status(200).json({ message: "Aula concluída com sucesso!" });
    } catch (err) {
        console.error("Erro ao concluir aula:", err);
        return res.status(500).json({ error: "Erro ao concluir aula." });
    }
};