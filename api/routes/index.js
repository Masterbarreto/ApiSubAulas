import express from "express";
import userRoutes from "./users.js";
import emailRoutes from "./EmailRoutes.js"; // Importando as rotas de email
import { resetPassword, requestPasswordReset } from "../controllers/users/PasswordReset.js"; // Importando as funções

const router = express.Router();

router.use("/users", userRoutes);
router.use("/email", emailRoutes); // Usando as rotas de email

// Rotas diretas para redefinição de senha
router.post("/reset-password", resetPassword);
router.post("/request-password-reset", requestPasswordReset);


export default router;