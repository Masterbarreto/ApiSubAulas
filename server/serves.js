import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "node:path";
import { MongoClient } from "mongodb";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import apiRedirect from "../routes/index.js";
import { StatusCodes } from "http-status-codes";
import chalk from "chalk";

const server = express();

server.use(morgan("dev"));
server.use(cors({
    origin: ["*"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// MongoDB connection
const sessions = {};
MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        const db = client.db(process.env.DB_NAME);
        sessions[process.env.DB_NAME] = db;
        console.log(chalk.blue.bold("Sistema 💻 : Conectado ao MongoDB com sucesso!"));
    })
    .catch(err => console.error(chalk.red("Sistema 💻 : Erro ao conectar ao MongoDB", err)));

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/api/v1", apiRedirect);
server.use("/pages", express.static(path.resolve("./public/pages")));

// Swagger Documentation
const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Guarda meu lanche Api",
            version: "0.1.0",
            description: "Uma simples documentação da nossa api.",
            contact: {
                name: "Master Barreto",
                url: "https://github.com/MasterBarreto",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./controllers/*/*.js", "./routes/*.js"],
};

const specs = swaggerJsdoc(options);
server.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

// 404 Error Handler
server.use((req, res, next) => {
    console.log(chalk.yellow("Sistema 💻 : Rota não encontrada"));
    return res.status(StatusCodes.NOT_FOUND).json({
        error: {
            message: "Not Found",
            status: StatusCodes.NOT_FOUND,
        },
    });
});

// Export the server as the default export
export default function handler(req, res) {
    return server(req, res);
}