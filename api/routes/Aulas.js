// routes/aulas.js
import express from 'express';
import upload from '../Middleware/upload.js'; 
import { createAula } from '../controllers/Aulas/CreateAulas.js'; 
import { getPdf } from '../controllers/Aulas/getPdf.js';
import { getAulas } from '../controllers/Aulas/getAulas.js'; 
import { concluirAula } from '../controllers/Aulas/concluirAula.js';
import { getAulasConcluidas } from '../controllers/Aulas/getAulasConcluidas.js';
import { uploadMiddleware, EditarAula } from "../controllers/Aulas/EditarAulas.js";
import { ExcluirAula } from '../controllers/Aulas/ExcluirAula.js'; 
// import { deleteArquivoAula } from "../controllers/Aulas/ExcluirARquivos.js"; // Corrigido o caminho
import { getAulaById } from "../controllers/Aulas/AulaSele.js";
import {NaoAula} from "../controllers/Aulas/DesconcluirAula.js";

import { deleteArquivo } from "../controllers/Aulas/Aruivodelets.js";

const router = express.Router();

// POST /api/v1/aulas
router.post('/', upload.any(), createAula);

// GET /api/v1/aulas/:id/pdf
router.get('/:id/pdf', getPdf);

// GET /api/v1/aulas/MostarAula
router.get("/aula-id/:id", getAulaById);

// PATCH para concluir aula
router.patch('/:id/concluir', concluirAula);

// PATCH para desfazer conclusão da aula
router.patch('/:id/desconcluir', NaoAula);

// PATCH para editar aula
router.patch("/:id", uploadMiddleware, EditarAula);

// GET aulas não concluídas
router.get('/MostarAulas', getAulas);

// GET aulas concluídas
router.get('/AulasConcluidas', getAulasConcluidas);

// DELETE /api/v1/aulas/:id
router.delete('/:id', ExcluirAula);

// DELETE para excluir arquivo de uma aula
router.delete('/arquivos/:id', deleteArquivo);

export default router;
