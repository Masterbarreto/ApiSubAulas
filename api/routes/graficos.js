import express from "express";
import { getRelatorioSemanal } from "../controllers/Graficos/RelatorioSemanal.js";
import { getMateriasMaisSubstituicoes } from "../controllers/Graficos/MateriasMaisSubstituicoes.js";
import { getTotalAulasConcluidas } from "../controllers/Graficos/TotalAulasConcluidas.js";
import { getAulasPorMes } from "../controllers/Graficos/AulasPorMes.js";

const router = express.Router();

// Rota para obter o relatório semanal de aulas
router.get("/relatorio-semanal", getRelatorioSemanal);

// Rota para obter matérias com mais aulas de substituição
router.get("/materias-mais-substituicoes", getMateriasMaisSubstituicoes);

// Rota para obter total de aulas concluídas
router.get("/total-aulas-concluidas", getTotalAulasConcluidas);

// Rota para obter quantidade de aulas cadastradas no mês
router.get("/aulas-por-mes", getAulasPorMes);

export default router;