import { getDb } from "../../db.js";
import yup from "yup";

export const createAula = async (req, res) => {
    const schema = yup.object().shape({
        anoEscolar: yup.string().required(),
        curso: yup.string().required(),
        titulo: yup.string().required(),
        Turma: yup.string().required(),
        Materia: yup.string().required(),
        DayAula: yup.string().required(),
        Horario: yup.string().nullable(),
        DesAula: yup.string().nullable(),
        LinkAula: yup.array().of(
            yup.object().shape({
                url: yup.string().url().required(),
                name: yup.string().required(),
            })
        ).nullable(), // Aceita um array de links estruturados
        professor: yup.string().required(),
    });

    try {
        await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
        return res.status(400).json({ error: error.errors });
    }

    const {
        anoEscolar, curso, titulo, Turma, Materia,
        DayAula, Horario, DesAula, LinkAula, professor
    } = req.body;
    const files = req.files || [];

    // Metadados dos arquivos
    const arquivos = files.map(file => ({
        nome: file.originalname,
        mimetype: file.mimetype,
    }));

    const aulaData = {
        anoEscolar,
        curso,
        titulo,
        Turma,
        Materia,
        DayAula,
        Horario,
        DesAula,
        LinkAula: LinkAula || [], // Salva os links estruturados no banco
        concluida: false,
        arquivos,
        arquivosIds: [],
        professor: professor,
        createdAt: new Date().toISOString(), // Adiciona a data de criação no formato YYYY-MM-DD
    };

    try {
        const db = await getDb();
        const aulas = db.collection('aulas');
        const arquivosCol = db.collection('arquivosAulas');

        // Insere a aula
        const result = await aulas.insertOne(aulaData);

        // Insere os arquivos e coleta os IDs
        const arquivosIds = [];
        for (let i = 0; i < files.length; i++) {
            const arquivoResult = await arquivosCol.insertOne({
                aulaId: result.insertedId,
                nome: files[i].originalname,
                mimetype: files[i].mimetype,
                data: files[i].buffer,
            });
            arquivosIds.push(arquivoResult.insertedId);
        }

        // Atualiza a aula com os arquivosIds
        if (arquivosIds.length > 0) {
            await aulas.updateOne(
                { _id: result.insertedId },
                { $set: { arquivosIds } }
            );
        }

        return res.status(201).json({
            message: 'Aula criada com sucesso!',
            aulaId: result.insertedId,
            arquivosIds,
            createdAt: aulaData.createdAt, // Retorna a data de criação na resposta
        });
    } catch (err) {
        console.error('Erro ao criar aula:', err);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
};
