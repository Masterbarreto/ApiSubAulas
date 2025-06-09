import { getDb } from "../../db.js";
import { ObjectId } from "mongodb";
import yup from "yup";
import multer from "multer";

// 1) Configuração do multer (sem diskStorage—vamos receber o arquivo em memória)
const upload = multer();

// 2) Middleware exportável
export const uploadMiddleware = upload.any();

// 3) Controller de edição
export const EditarAula = async (req, res) => {
  try {
    // 3.1) Se req.body for indefinido, é sinal de que o multer não veio na rota certa
    if (!req.body) {
      return res
        .status(400)
        .json({ error: "Dados do corpo da requisição não fornecidos." });
    }

    // 3.2) Se LinkAula chegar como STRING, converta para ARRAY de objetos
    if (req.body.LinkAula && typeof req.body.LinkAula === "string") {
      try {
        req.body.LinkAula = JSON.parse(req.body.LinkAula);
      } catch {
        return res.status(400).json({ error: "Formato inválido para LinkAula" });
      }
    }

    // 3.3) Se arquivosExistentes chegar como STRING, converta para ARRAY de IDs/nomes
    if (
      req.body.arquivosExistentes &&
      typeof req.body.arquivosExistentes === "string"
    ) {
      try {
        req.body.arquivosExistentes = JSON.parse(req.body.arquivosExistentes);
      } catch {
        return res
          .status(400)
          .json({ error: "Formato inválido para arquivosExistentes" });
      }
    }

    // 3.4) Definição do esquema (agora espera LinkAula já como array de {url,name})
    const schema = yup.object().shape({
      anoEscolar: yup.string().optional(),
      titulo: yup.string().optional(),
      curso: yup.string().optional(),
      Turma: yup.string().optional(),
      Materia: yup.string().optional(),
      DayAula: yup.string().optional(),
      Horario: yup.string().nullable().optional(),
      DesAula: yup.string().nullable().optional(),
      LinkAula: yup
        .array()
        .of(
          yup.object().shape({
            url: yup.string().url().required(),
            name: yup.string().required(),
          })
        )
        .nullable()
        .optional(),
      arquivosExistentes: yup
        .array()
        .of(yup.mixed().required()) // IDs (strings) ou nomes (strings)
        .nullable()
        .optional(),
    });

    // 3.5) Validação
    await schema.validate(req.body, { abortEarly: false });

    const { id } = req.params;
    const db = await getDb();
    const aulas = db.collection("aulas");
    const arquivosCol = db.collection("arquivosAulas");

    // 3.6) Verifica se a aula existe
    const aula = await aulas.findOne({ _id: new ObjectId(id) });
    if (!aula) {
      console.error("Aula não encontrada:", id);
      return res.status(404).json({ error: "Aula não encontrada." });
    }

    // 3.7) Extrai campos que virão do body, excluindo _id e arquivosExistentes
    const { _id, arquivosExistentes, ...updateFields } = req.body;
    // Preserve createdAt se já existia, senão define agora
    updateFields.createdAt = aula.createdAt || new Date().toISOString();

    // Atualiza os links com os enviados pelo front-end
    if (req.body.LinkAula) {
      updateFields.LinkAula = req.body.LinkAula;
    }

    // 3.8) Filtra arquivos “antigos” que devem permanecer
    const idsOuNomes = arquivosExistentes || [];
    updateFields.arquivos = (aula.arquivos || []).filter((arq) =>
      idsOuNomes.includes(arq.nome || arq._id.toString())
    );

    // 3.9) Agora, cheque se vieram novos arquivos em req.files
    const newFiles = req.files || []; // multer armazenou em memória
    const arquivosIds = aula.arquivosIds || []; // IDs existentes

    if (newFiles.length > 0) {
      for (let file of newFiles) {
        // Insere o arquivo na coleção "arquivosAulas" e obtém o ObjectId
        const arquivoInserido = await arquivosCol.insertOne({
          aulaId: new ObjectId(id),
          nome: file.originalname,
          mimetype: file.mimetype,
          data: file.buffer,
        });

        // Adiciona o ObjectId ao array de arquivosIds
        arquivosIds.push(arquivoInserido.insertedId);
      }
    }

    // Atualiza os campos da aula
    updateFields.arquivosIds = arquivosIds; // Atualiza os IDs dos arquivos

    // Inclui os novos arquivos junto com os antigos
    const novosArquivos = newFiles.map((file, index) => ({
      nome: file.originalname,
      mimetype: file.mimetype,
      id: arquivosIds[arquivosIds.length - newFiles.length + index], // Associa o ID correto
    }));

    updateFields.arquivos = [
      ...(aula.arquivos || []), // Arquivos antigos da aula
      ...novosArquivos,         // Novos arquivos adicionados
    ];

    // 3.10) Atualiza a coleção “aulas” sem sobrescrever tudo
    const result = await aulas.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );
    if (result.matchedCount === 0) {
      console.error("Erro ao atualizar aula:", id);
      return res.status(500).json({ error: "Erro ao atualizar aula." });
    }

    // 3.11) Busca de volta a aula já atualizada (com arquivos novos + antigos)
    const aulaAtualizada = await aulas.findOne({ _id: new ObjectId(id) });
    return res
      .status(200)
      .json({ message: "Aula editada com sucesso!", aula: aulaAtualizada });
  } catch (err) {
    console.error("Erro ao editar aula:", err);
    return res.status(500).json({ error: "Erro ao editar aula." });
  }
};
