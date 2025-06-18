import { getDb } from "../../db.js";
import { ObjectId } from "mongodb";
import analytics from "../../../utils/segment.js";

export const deleteArquivo = async (req, res) => {
  const { aulaId, arquivoId } = req.params;

  // Verifica se os IDs são válidos
  if (!ObjectId.isValid(aulaId) || !ObjectId.isValid(arquivoId)) {
    return res.status(400).json({ error: "IDs inválidos." });
  }

  const db = await getDb();
  const aulasCol = db.collection("aulas");
  const arquivosCol = db.collection("arquivosAulas");
  const aulaObjId = new ObjectId(aulaId);
  const fileObjId = new ObjectId(arquivoId);

  try {
    // Exclui o arquivo da coleção de arquivos
    const { deletedCount } = await arquivosCol.deleteOne({
      _id: fileObjId,
      aulaId: aulaObjId,
    });
    if (!deletedCount) {
      return res.status(404).json({ error: "Arquivo não encontrado." });
    }

    // Remove o ID do arquivo do array `arquivosIds` na aula
    await aulasCol.updateOne(
      { _id: aulaObjId },
      { $pull: { arquivosIds: fileObjId } }
    );

    // Remove o metadado do arquivo do array `arquivos` na aula
    await aulasCol.updateOne(
      { _id: aulaObjId },
      { $pull: { arquivos: { id: arquivoId } } } // Aqui, arquivoId deve ser uma string
    );

    // Adiciona rastreamento do evento
    analytics.track({
      userId: req.user?.id || "unknown",
      event: "Arquivo Excluído",
      properties: {
        aulaId: aulaId,
        arquivoId: arquivoId,
        timestamp: new Date().toISOString(),
      },
    });

    return res.status(200).json({ message: "Arquivo removido com sucesso!" });
  } catch (err) {
    console.error("Erro ao deletar arquivo:", err);
    return res.status(500).json({ error: "Falha interna ao apagar arquivo." });
  }
};
