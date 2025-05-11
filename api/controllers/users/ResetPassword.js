// filepath: api-mongo/api/controllers/users/ResetPassword.js
import { ObjectId } from "mongodb";
import { getDb } from "../../db.js";
import bcrypt from "bcrypt"; 
import chalk from "chalk";

async function ResetPassWord(req, res) {
    const { userId, newPassword } = req.body;
    const db = await getDb();
    const usersCollection = db.collection("professores");

    try {
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { password: hashedPassword } }
        );

        console.log(chalk.green(`Sistema 💻 : Senha atualizada com sucesso para o usuário: ${userId} `));
        return res.status(200).json({ message: "Senha atualizada com sucesso" });
    } catch (error) {
        console.error("Sistema 💻 : Erro ao atualizar a senha do usuário:", error);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
}

export { ResetPassWord };