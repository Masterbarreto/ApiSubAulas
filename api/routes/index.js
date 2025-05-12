import express from "express";
import userRoutes from "./users.js";
import emailRoutes from "./EmailRoutes.js"; // Importando as rotas de email

const router = express.Router();

router.use("/users", userRoutes);
router.use("/email", emailRoutes); // Usando as rotas de email

export default router;