import { getDb } from "../../db.js";

export const getRelatorioSemanal = async (req, res) => {
    try {
        const db = await getDb();
        const aulasCollection = db.collection("aulas");

        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Domingo
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado
        endOfWeek.setHours(23, 59, 59, 999);

        const aulas = await aulasCollection
            .find({ DayAula: { $gte: startOfWeek.toISOString(), $lte: endOfWeek.toISOString() } })
            .toArray();

        const relatorio = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dia, index) => {
            const diaAtual = new Date(startOfWeek);
            diaAtual.setDate(startOfWeek.getDate() + index);
            const aulasDoDia = aulas.filter(aula => new Date(aula.DayAula).toDateString() === diaAtual.toDateString());

            return { dia, aulas: aulasDoDia.length };
        });

        return res.status(200).json(relatorio);
    } catch (err) {
        console.error("Erro ao buscar o relatório semanal", err);
        return res.status(500).json({ error: "Erro ao buscar o relatório semanal" });
    }
};