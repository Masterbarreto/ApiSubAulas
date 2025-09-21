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

        // Converter para strings no formato YYYY-MM-DD para comparação
        const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
        const endOfWeekStr = endOfWeek.toISOString().split('T')[0];

        console.log('Buscando aulas entre:', startOfWeekStr, 'e', endOfWeekStr);

        // Buscar aulas onde DayAula está entre as datas da semana (como string)
        const aulas = await aulasCollection
            .find({ 
                DayAula: { 
                    $gte: startOfWeekStr, 
                    $lte: endOfWeekStr 
                } 
            })
            .toArray();

        console.log('Aulas encontradas:', aulas.length);
        console.log('Aulas:', aulas.map(a => ({ titulo: a.titulo, DayAula: a.DayAula })));

        const relatorio = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dia, index) => {
            const diaAtual = new Date(startOfWeek);
            diaAtual.setDate(startOfWeek.getDate() + index);
            const diaAtualStr = diaAtual.toISOString().split('T')[0];
            
            const aulasDoDia = aulas.filter(aula => aula.DayAula === diaAtualStr);

            console.log(`${dia} (${diaAtualStr}): ${aulasDoDia.length} aulas`);

            return { dia, aulas: aulasDoDia.length };
        });

        return res.status(200).json(relatorio);
    } catch (err) {
        console.error("Erro ao buscar o relatório semanal", err);
        return res.status(500).json({ error: "Erro ao buscar o relatório semanal" });
    }
};