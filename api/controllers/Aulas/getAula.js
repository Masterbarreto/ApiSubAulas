import { getDb } from "../../db.js";
import { ObjectId } from "mongodb";

export const getAula = async (req, res) => {
    try {
        const db = await getDb();
        const aula = await db.collection("aulas").findOne({ _id: new ObjectId(req.params.id) });

        if (!aula) {
            return res.status(404).json({ error: "Aula não encontrada." });
        }

        const arquivos = aula.arquivo ? [{
            nome: aula.arquivo.nome,
            url: `/api/v1/aulas/${aula._id}/pdf`
        }] : [];

        const links = aula.LinkAula ? [{
            titulo: "Link da Aula",
            url: aula.LinkAula
        }] : [];

        const resultado = {
            título: aula.título,
            Descricao: aula.DesAula,
            Horario: aula.Horario,
            arquivos,
            links
        };

        return res.status(200).json(resultado);
    } catch (err) {
        console.error("Erro ao buscar aula:", err);
        return res.status(500).json({ error: "Erro ao buscar a aula." });
    }
};