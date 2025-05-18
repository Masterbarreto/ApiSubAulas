import { getDb } from "../../db.js";
import yup from "yup";

export const createAula = async (req, res) => {
    console.log('DEBUG: req.body:', req.body);
    console.log('DEBUG: req.files:', req.files); // Veja o que chega aqui!

    const schema = yup.object().shape({
        anoEscolar: yup.string().required(),
        titulo:     yup.string().required(),
        curso:      yup.string().required(),
        Turma:      yup.string().required(),
        Materia:    yup.string().required(),
        DayAula:    yup.string().required(),
        Horario:    yup.string().required(),
        DesAula:    yup.string().nullable(),
        LinkAula:   yup.string().url().nullable(),
    });

    try {
        await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
        return res.status(400).json({ error: error.errors });
    }

    const { anoEscolar, curso, Turma, Materia, DayAula, Horario, DesAula, LinkAula, titulo } = req.body;
    const files = req.files || [];

    // Salva apenas metadados dos arquivos
    const arquivos = files.map(file => ({
        nome: file.originalname,
        mimetype: file.mimetype,
        // NÃO salva o buffer aqui!
        // data: file.buffer,
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
        LinkAula: LinkAula || null,
        concluida: false,
        arquivos, // array só com metadados
    };

    try {
        const db = await getDb();
        const aulas = db.collection('aulas');
        const arquivosCol = db.collection('arquivosAulas');

        // Salva a aula sem os buffers
        const result = await aulas.insertOne(aulaData);

        // Salva cada arquivo em uma coleção separada, referenciando a aula
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

        return res.status(201).json({
            message: 'Aula criada com sucesso!',
            aulaId: result.insertedId,
            arquivosIds, // retorna os IDs dos arquivos
        });
    } catch (err) {
        console.error('Erro ao criar aula:', err);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
};
