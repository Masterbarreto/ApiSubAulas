import { sessions } from "../../db.js";
import yup from "yup";
import chalk from "chalk";
import bcrypt from "bcrypt"; // Importa o bcrypt

// Validação do schema de login
const loginSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
});

// Rota de login
export async function loginUser(req, res) {
    const { email, password } = req.body;
    const db = sessions[process.env.DB_NAME];
    const professoresCollection = db.collection("professores");
    try {
        // Valida os dados recebidos
        await loginSchema.validate({ email, password });

        // Busca o usuário pelo email
        const user = await professoresCollection.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        // Compara a senha fornecida com a senha armazenada
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        console.log(chalk.green(`Sistema 💻 : Login bem-sucedido: ${user._id}`));
        return res.status(200).json({ message: "Login bem-sucedido ✅", userId: user._id });
    }
    catch (error) {
        console.log(chalk.red(` Sistema 💻 : Erro ao fazer login: ${error.message} ❌`));
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
}