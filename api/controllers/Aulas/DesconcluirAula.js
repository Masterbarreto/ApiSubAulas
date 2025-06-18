import { getDb } from "../../db.js";
import { ObjectId } from "mongodb";
import analytics from "../../../utils/segment.js";

export const NaoAula = async (req, res) => {
    try {
        const db = await getDb();
        const result = await db.collection("aulas").updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { concluida: false } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Aula não encontrada." });
        }

        // Adiciona rastreamento do evento
        analytics.track({
            userId: req.user?.id || "unknown",
            event: "Aula Desconcluída",
            properties: {
                aulaId: req.params.id,
                timestamp: new Date().toISOString(),
            },
        });

        return res.status(200).json({ message: "Aula desfeita com sucesso!" });
    } catch (err) {
        console.error("Erro ao desfazer aula:", err);
        return res.status(500).json({ error: "Erro ao desfazer aula." });
    }
};