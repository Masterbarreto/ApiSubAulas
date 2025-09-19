import { getDb } from "../../db.js";
import { ObjectId } from "mongodb";

export const getAula = async (req, res) => {
    try {
        const db = await getDb();
        const aula = await db.collection("aulas").findOne({ _id: new ObjectId(req.params.id) });

        if (!aula) {
            return res.status(404).json({ error: "Aula não encontrada." });
        }

        // Combine `arquivos` e `arquivosIds` para garantir que cada arquivo tenha um identificador
        const arquivosDetalhados = (aula.arquivosIds || []).map((objId, idx) => ({
            id: objId.toHexString(), // Converte ObjectId para string
            nome: aula.arquivos[idx]?.nome,
            mimetype: aula.arquivos[idx]?.mimetype,
        }));

        // Substitua o campo `arquivos` no JSON de resposta
        const resposta = {
            ...aula,
            arquivos: arquivosDetalhados,
            // Adiciona compatibilidade com o novo formato
            cursos: aula.cursos || (aula.curso ? [aula.curso] : []),
            turmas: aula.turmas || (aula.Turma ? [aula.Turma] : []),
        };

        return res.status(200).json(resposta);
    } catch (err) {
        console.error("Erro ao buscar aula:", err);
        return res.status(500).json({ error: "Erro ao buscar a aula." });
    }
};