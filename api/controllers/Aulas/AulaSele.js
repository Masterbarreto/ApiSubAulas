import { getDb } from "../../db.js";
import { ObjectId } from "mongodb";

export const getAulaById = async (req, res) => {
  const { id } = req.params;

  try {
    const db = await getDb();
    const aulas = db.collection("aulas");
    const arquivosCol = db.collection("arquivosAulas");

    const aula = await aulas.findOne({ _id: new ObjectId(id) });
    if (!aula) {
      return res.status(404).json({ message: "Aula não encontrada." });
    }

    const arquivos = aula.arquivosIds
      ? await arquivosCol
          .find({ _id: { $in: aula.arquivosIds.map((id) => new ObjectId(id)) } })
          .toArray()
      : [];

    const arquivosDetalhados = arquivos.map((arq) => ({
      _id: arq._id.toString(), // Retorna o `_id` como string
      nome: arq.nome,
      mimetype: arq.mimetype,
    }));

    return res.status(200).json({
      ...aula,
      arquivos: arquivosDetalhados,
    });
  } catch (err) {
    console.error("Erro ao buscar aula:", err);
    return res.status(500).json({ error: "Erro ao buscar aula." });
  }
};