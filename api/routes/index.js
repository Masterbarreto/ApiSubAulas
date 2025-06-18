import express from "express";
import userRoutes from "./users.js";
import emailRoutes from "./EmailRoutes.js";
import aulasRoutes from "./Aulas.js";
import relatoriosRoutes from "./graficos.js";
import { resetPassword, requestPasswordReset } from "../controllers/users/PasswordReset.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/email", emailRoutes);
router.use("/aulas", aulasRoutes);
router.use("/relatorios",relatoriosRoutes);

// Rotas diretas para redefinição de senha
router.post("/reset-password", resetPassword);
router.post("/request-password-reset", requestPasswordReset);

export default router;