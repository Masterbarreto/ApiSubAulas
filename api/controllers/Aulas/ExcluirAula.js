import { getDb } from "../../db.js";
import { ObjectId } from "mongodb";

export const ExcluirAula = async (req, res) => {
  const { id } = req.params;

  try {
    const db = await getDb();
    const aulas = db.collection("aulas");
    const arquivosCol = db.collection("arquivosAulas");

    // Busca a aula pelo ObjectId
    const aula = await aulas.findOne({ _id: new ObjectId(id) });
    if (!aula) {
      console.error("Aula não encontrada:", id);
      return res.status(404).json({ error: "Aula não encontrada." });
    }

    // Remove os arquivos associados à aula usando `arquivosIds`
    if (aula.arquivosIds && Array.isArray(aula.arquivosIds)) {
      await arquivosCol.deleteMany({
        _id: { $in: aula.arquivosIds.map((fileId) => new ObjectId(fileId)) },
      });
    }

    // Remove a aula
    await aulas.deleteOne({ _id: new ObjectId(id) });

    return res.status(200).json({ message: "Aula excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir aula:", error);
    return res.status(500).json({ error: "Erro ao excluir aula." });
  }
};