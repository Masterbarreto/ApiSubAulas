import { getDb } from "../../db.js";

export const getMateriasMaisSubstituicoes = async (req, res) => {
    try {
        const db = await getDb();
        const aulasCollection = db.collection("aulas");

        // Busca todas as aulas na coleção
        const aulas = await aulasCollection.find({}).toArray();

        if (aulas.length === 0) {
            return res.status(404).json({ message: "Nenhuma aula encontrada." });
        }

        // Agrupa as matérias e conta o total de aulas por matéria
        const materias = aulas.reduce((acc, aula) => {
            acc[aula.Materia] = (acc[aula.Materia] || 0) + 1;
            return acc;
        }, {});

        const resultado = Object.entries(materias).map(([materia, total]) => ({ materia, total }));

        return res.status(200).json(resultado);
    } catch (err) {
        console.error("Erro ao buscar matérias com mais aulas", err);
        return res.status(500).json({ error: "Erro ao buscar matérias com mais aulas" });
    }
};