import { getDb } from "../../db.js";
import { ObjectId } from "mongodb";

export const deleteArquivo = async (req, res) => {
    const { id } = req.params; // ID do arquivo recebido como string

    // Valida o formato do ID antes de prosseguir
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido" });
    }

    try {
        const db = await getDb();
        const arquivosCol = db.collection("arquivosAulas");
        const aulasCol = db.collection("aulas");

        // Busca o arquivo diretamente pelo _id como ObjectId
        const arquivo = await arquivosCol.findOne({ _id: new ObjectId(id) });

        if (!arquivo) {
            return res.status(404).json({ error: "Arquivo não encontrado" });
        }

        // Deleta o arquivo da coleção de arquivos
        await arquivosCol.deleteOne({ _id: new ObjectId(id) });

        // Remove o ID do arquivo da coleção de aulas
        await aulasCol.updateMany(
            {},
            {
                $pull: {
                    arquivosIds: id, // Remove o ID como string
                    arquivos: { id: id }, // Remove o objeto do array arquivos
                },
            }
        );

        return res.status(200).json({ message: "Arquivo deletado com sucesso!" });
    } catch (err) {
        console.error("Erro ao deletar arquivo:", err);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
};
