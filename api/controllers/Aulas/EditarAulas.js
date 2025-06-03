import { getDb } from "../../db.js";
import { ObjectId } from "mongodb";
import yup from "yup";

export const EditarAula = async (req, res) => {
    const schema = yup.object().shape({
        anoEscolar: yup.string().optional(),
        titulo: yup.string().optional(),
        curso: yup.string().optional(),
        Turma: yup.string().optional(),
        Materia: yup.string().optional(),
        DayAula: yup.string().optional(),
        Horario: yup.string().optional(),
        DesAula: yup.string().nullable().optional(),
        LinkAula: yup.array().of(
            yup.object().shape({
                url: yup.string().url().required(),
                name: yup.string().required(),
            })
        ).nullable().optional(), // Permite um array de links estruturados ou null
    });

    try {
        await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
        console.error("Erro de validação:", error.errors);
        return res.status(400).json({ error: error.errors });
    }

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

        // Só atualiza os campos enviados, exceto o campo _id
        const { _id, ...updateFields } = req.body;

        // Preserva o campo createdAt ou define um novo se não existir
        updateFields.createdAt = aula.createdAt || new Date().toISOString();

        // Se houver arquivos, atualize os metadados e salve os arquivos
        const files = req.files || [];
        if (files.length > 0) {
            const arquivos = files.map((file) => ({
                nome: file.originalname,
                mimetype: file.mimetype,
            }));
            updateFields.arquivos = [...(aula.arquivos || []), ...arquivos];

            // Salva os arquivos na coleção arquivosAulas
            for (let i = 0; i < files.length; i++) {
                await arquivosCol.insertOne({
                    aulaId: new ObjectId(id),
                    nome: files[i].originalname,
                    mimetype: files[i].mimetype,
                    data: files[i].buffer,
                });
            }
        }

        // Atualiza a aula no banco de dados
        const result = await aulas.updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
        if (result.matchedCount === 0) {
            console.error("Erro ao atualizar aula:", id);
            return res.status(500).json({ error: "Erro ao atualizar aula." });
        }

        return res.status(200).json({ message: "Aula editada com sucesso!" });
    } catch (err) {
        console.error("Erro ao editar aula:", err);
        return res.status(500).json({ error: "Erro ao editar aula." });
    }
};