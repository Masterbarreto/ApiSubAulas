// filepath: api-mongo/api/controllers/users/Create.js
import yup from 'yup';
import chalk from 'chalk'; 
import bcrypt from 'bcrypt'; 
import { getDb } from "../../db.js"; 

export const createUser = async (req, res) => {
    const schema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required(),
        name: yup.string().required(),
        cargo: yup.string().required(),
    });

    try {
        await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
        return res.status(400).json({ error: error.errors });
    }

    const { email, password, name, cargo } = req.body;

    try {
        const db = await getDb();
        const professoresCollection = db.collection("professores");

        const existingUser = await professoresCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "E-mail já cadastrado." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await professoresCollection.insertOne({ 
            email, 
            password: hashedPassword, 
            name, 
            cargo 
        });
        console.log(chalk.green(`Sistema 💻 : Professor Cadastrado com Sucesso: ${result.insertedId} ✅`));
        
        return res.status(201).json({
            message: "Usuário criado com sucesso!",
            userId: result.insertedId,
        });
        
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
};