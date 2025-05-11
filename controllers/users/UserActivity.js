// filepath: d:\Projeto de Aulas\api Mongo\controllers\users\UserActivity.js
import { sessions } from "../../db.js";
import { ObjectId } from "mongodb";
import chalk from "chalk";

// Função para registrar a atividade do usuário
export async function logUserActivity(req, res) {
    const { userId, action } = req.body;
    const db = sessions[process.env.DB_NAME];
    const userActivityCollection = db.collection("userActivities");

    try {
        const activity = {
            userId: new ObjectId(userId),
            action,
            timestamp: new Date(),
        };

        const result = await userActivityCollection.insertOne(activity);
        return res.status(201).json({ message: "Atividade registrada com sucesso", activityId: result.insertedId });
    } catch (error) {
        console.error("Erro ao registrar atividade do usuário:", error);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
}

// Função para recuperar as atividades do usuário
export async function getUserActivities(req, res) {
    const { userId } = req.params;
    const db = sessions[process.env.DB_NAME];
    const userActivityCollection = db.collection("userActivities");

    try {
        const activities = await userActivityCollection.find({ userId: new ObjectId(userId) }).toArray();
        console.log(chalk.green(` Sistema 💻 : Atividades recuperadas com sucesso para o usuário: ${userId} ✔️`));
        return res.status(200).json(activities);
        
    } catch (error) {
        console.error("Sistema 💻 : Erro ao recuperar atividades do usuário:", error);
        console.log(chalk.green(` Sistema 💻 : Erro ao recuperar atividades do usuário: ${error.message}`));
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
}