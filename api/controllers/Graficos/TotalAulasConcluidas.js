import { getDb } from "../../db.js";

export const getTotalAulasConcluidas = async (req, res) => {
    try {
        const db = await getDb();
        const aulasCollection = db.collection("aulas");

        const totalConcluidas = await aulasCollection.countDocuments({ concluida: true });

        return res.status(200).json({ totalConcluidas });
    } catch (err) {
        console.error("Erro ao buscar total de aulas concluídas", err);
        return res.status(500).json({ error: "Erro ao buscar total de aulas concluídas" });
    }
};