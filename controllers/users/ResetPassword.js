import { ObjectId } from "mongodb";
import { sessions } from "../../db.js"; 
import chalk from "chalk";

async function ResetPassWord(req, res) { // Adicionado req e res como parâmetros
    const { userId, newPassword } = req.body;
    const db = sessions[process.env.DB_NAME];
    const usersCollection = db.collection("users");

    try {
        // Verifica se o usuário existe
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        // Criptografa a nova senha antes de salvar no banco
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Atualiza a senha do usuário
        await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { password: hashedPassword } } // Salva a senha criptografada
        );

        console.log(chalk.green(`Sistema 💻 : Senha atualizada com sucesso para o usuário: ${userId} `));
        return res.status(200).json({ message: "Senha atualizada com sucesso" });
    } catch (error) {
        console.error("Sistema 💻 : Erro ao atualizar a senha do usuário:", error);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
}

export { ResetPassWord };