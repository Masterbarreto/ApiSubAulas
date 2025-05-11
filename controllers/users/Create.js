import yup from 'yup';
import chalk from 'chalk'; 
import bcrypt from 'bcrypt'; 
import { sessions } from "../../db.js"; 

// Criar o Usuario no MongoDB
export const createUser = async (req, res) => {
    const schema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required(),
        name: yup.string().required(),
        cargo: yup.string().required(),
    });

    try {
        // Valida os dados recebidos
        await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
        return res.status(400).json({ error: error.errors });
    }

    const { email, password, name, cargo } = req.body;

    try {
        // Acessa o banco de dados e a coleção de professores
        const db = sessions[process.env.DB_NAME];
        const professoresCollection = db.collection("professores");

        // Verifica se já existe um usuário com o mesmo e-mail
        const existingUser = await professoresCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "E-mail já cadastrado." });
        }

        // Criptografa a senha antes de salvar
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insere o novo professor no banco de dados
        const result = await professoresCollection.insertOne({ 
            email, 
            password: hashedPassword, 
            name, 
            cargo 
        });
        console.log(chalk.green(`Sistema 💻 : Professor Cadastrado com Sucesso: ${result.insertedId} ✅`));
        
        // Retorna uma resposta de sucesso
        return res.status(201).json({
            message: "Usuário criado com sucesso!",
            userId: result.insertedId,
        });
        
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
};