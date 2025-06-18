import { getDb } from "../../db.js";

export const getAulasPorMes = async (req, res) => {
    try {
        const db = await getDb();
        const aulasCollection = db.collection("aulas");

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Primeiro dia do mês
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Último dia do mês

        const totalAulas = await aulasCollection.countDocuments({
            DayAula: { $gte: startOfMonth.toISOString(), $lte: endOfMonth.toISOString() }
        });

        return res.status(200).json({ totalAulas });
    } catch (err) {
        console.error("Erro ao buscar quantidade de aulas cadastradas no mês", err);
        return res.status(500).json({ error: "Erro ao buscar quantidade de aulas cadastradas no mês" });
    }
};