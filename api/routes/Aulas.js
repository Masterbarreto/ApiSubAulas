// routes/aulas.js
import express from 'express';
import upload from '../Middleware/upload.js'; // Corrigido o path e o nome do diretório
import { createAula } from '../controllers/Aulas/CreateAulas.js'; // Corrigido o nome do arquivo
import { getPdf } from '../controllers/Aulas/getPdf.js';// Corrigido o nome do arquivo
import { getAulas } from '../controllers/Aulas/getAulas.js'; // Corrigido o nome do arquivo
import { concluirAula } from '../controllers/Aulas/concluirAula.js';
import { getAulasConcluidas } from '../controllers/Aulas/getAulasConcluidas.js';
import { EditarAula } from '../controllers/Aulas/EditarAulas.js';
import { getAulaById } from "../controllers/Aulas/AulaSele.js";

const router = express.Router();

// POST /api/v1/aulas
router.post('/', upload.any(), createAula);

// GET /api/v1/aulas/:id/pdf
router.get('/:id/pdf', getPdf);

// GET /api/v1/aulas/MostarAula
router.get("/aula-id/:id", getAulaById);

// PATCH para concluir aula
router.patch('/:id/concluir', concluirAula);

// PATCH para editar aula
router.patch('/:id', upload.array('arquivos'), EditarAula);

// GET aulas não concluídas
router.get('/MostarAulas', getAulas);

// GET aulas concluídas
router.get('/AulasConcluidas', getAulasConcluidas);

export default router;
