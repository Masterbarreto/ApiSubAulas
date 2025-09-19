import { getDb } from "../../db.js";
import yup from "yup";
import multer from "multer";
import analytics from "../../../utils/segment.js";

// Configuração do multer para receber arquivos em memória
const upload = multer();
export const uploadMiddleware = upload.any();

export const createAula = async (req, res) => {
  try {
    // Verifica se o corpo da requisição está definido
    if (!req.body) {
      return res
        .status(400)
        .json({ error: "Dados do corpo da requisição não fornecidos." });
    }

    // Converte `LinkAula` para array de objetos, se for enviado como string
    if (req.body.LinkAula && typeof req.body.LinkAula === "string") {
      try {
        req.body.LinkAula = JSON.parse(req.body.LinkAula);
      } catch {
        return res.status(400).json({ error: "Formato inválido para LinkAula" });
      }
    }

    // Converte strings de arrays para arrays, se necessário
    if (req.body.Turma && typeof req.body.Turma === "string") {
      try {
        req.body.Turma = JSON.parse(req.body.Turma);
      } catch {
        // Se não conseguir fazer parse, mantém como string e converte para array
        req.body.Turma = [req.body.Turma];
      }
    }

    if (req.body.curso && typeof req.body.curso === "string") {
      try {
        req.body.curso = JSON.parse(req.body.curso);
      } catch {
        // Se não conseguir fazer parse, mantém como string e converte para array
        req.body.curso = [req.body.curso];
      }
    }

    // Definição do esquema de validação
    const schema = yup.object().shape({
      anoEscolar: yup.string().required(),
      curso: yup.mixed().test('curso-validation', 'Curso deve ser uma string ou array de strings', function(value) {
        return typeof value === 'string' || (Array.isArray(value) && value.every(item => typeof item === 'string'));
      }).required(),
      titulo: yup.string().required(),
      Turma: yup.mixed().test('turma-validation', 'Turma deve ser uma string ou array de strings', function(value) {
        return typeof value === 'string' || (Array.isArray(value) && value.every(item => typeof item === 'string'));
      }).required(),
      Materia: yup.string().required(),
      DayAula: yup.string().required(),
      Horario: yup.string().nullable(),
      DesAula: yup.string().nullable(),
      LinkAula: yup
        .array()
        .of(
          yup.object().shape({
            url: yup.string().url().required(),
            name: yup.string().required(),
          })
        )
        .optional(),
      professor: yup.string().required(),
    });

    // Valida os dados recebidos
    await schema.validate(req.body, { abortEarly: false });

    const {
      anoEscolar,
      curso,
      titulo,
      Turma,
      Materia,
      DayAula,
      Horario,
      DesAula,
      LinkAula,
      professor,
    } = req.body;

    const files = req.files || [];

    // Garante que curso e Turma sejam arrays
    const cursosArray = Array.isArray(curso) ? curso : [curso];
    const turmasArray = Array.isArray(Turma) ? Turma : [Turma];

    const aulaData = {
      anoEscolar,
      cursos: cursosArray, // Mudou de 'curso' para 'cursos' (array)
      turmas: turmasArray, // Mudou de 'Turma' para 'turmas' (array)
      titulo,
      Materia,
      DayAula,
      Horario,
      DesAula,
      LinkAula: Array.isArray(LinkAula) ? LinkAula : [],
      concluida: false,
      arquivos: [],
      arquivosIds: [],
      professor,
      createdAt: new Date().toISOString(),
    };

    const db = await getDb();
    const aulasCol = db.collection("aulas");
    const arquivosCol = db.collection("arquivosAulas");

    const { insertedId: aulaId } = await aulasCol.insertOne(aulaData);

    const arquivosIds = [];
    const arquivosComIds = [];
    for (let i = 0; i < files.length; i++) {
      const arquivoResult = await arquivosCol.insertOne({
        aulaId,
        nome: files[i].originalname,
        mimetype: files[i].mimetype,
        data: files[i].buffer,
      });

      const arquivoId = arquivoResult.insertedId;

      arquivosIds.push(arquivoId.toHexString());
      arquivosComIds.push({
        nome: files[i].originalname,
        mimetype: files[i].mimetype,
        id: arquivoId.toHexString(),
      });
    }

    await aulasCol.updateOne(
      { _id: aulaId },
      { $set: { arquivosIds, arquivos: arquivosComIds } }
    );

    // Adiciona rastreamento do evento
    analytics.track({
      userId: req.user?.id || "unknown",
      event: "Aula Criada",
      properties: {
        aulaId: aulaId.toHexString(),
        titulo,
        cursos: cursosArray,
        turmas: turmasArray,
        arquivosIds,
        professor,
        timestamp: new Date().toISOString(),
      },
    });

    return res.status(201).json({
      message: "Aula criada com sucesso!",
      aulaId: aulaId.toHexString(),
      cursos: cursosArray,
      turmas: turmasArray,
      arquivosIds,
      arquivos: arquivosComIds,
      createdAt: aulaData.createdAt,
    });
  } catch (err) {
    console.error("Erro ao criar aula:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};