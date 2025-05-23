import { getDb } from "../../db.js";
import { ObjectId } from "mongodb";
import yup from "yup";

export const EditarAula = async (req, res) => {
    const schema = yup.object().shape({
        anoEscolar: yup.string().optional(),
        titulo:     yup.string().optional(),
        curso:      yup.string().optional(),
        Turma:      yup.string().optional(),
        Materia:    yup.string().optional(),
        DayAula:    yup.string().optional(),
        Horario:    yup.string().optional(),
        DesAula:    yup.string().nullable().optional(),
        LinkAula:   yup.string().url().nullable().optional(),
    });

    try {
        await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
        return res.status(400).json({ error: error.errors });
    }

    const { id } = req.params;
    const db = await getDb();
    const aulas = db.collection('aulas');
    const arquivosCol = db.collection('arquivosAulas');

    // Busca a aula pelo ObjectId
    const aula = await aulas.findOne({ _id: new ObjectId(id) });
    if (!aula) {
        return res.status(404).json({ error: "Aula não encontrada." });
    }

    // Só atualiza os campos enviados
    const updateFields = { ...req.body };

    // Se houver arquivos, atualize os metadados e salve os arquivos
    const files = req.files || [];
    if (files.length > 0) {
        const arquivos = files.map(file => ({
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

    try {
        await aulas.updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
        return res.status(200).json({ message: "Aula editada com sucesso!" });
    } catch (err) {
        console.error("Erro ao editar aula:", err);
        return res.status(500).json({ error: "Erro ao editar aula." });
    }
};