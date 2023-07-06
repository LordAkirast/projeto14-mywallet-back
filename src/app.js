import express from "express"
import { MongoClient } from "mongodb";
import dotenv from "dotenv"
import cors from 'cors';
import Joi from "joi";
import { signUp } from "./controllers/signUp.controlle.js";


const app = express();
app.use(cors());
app.use(express.json())
dotenv.config()

// const signUpSchema = Joi.object({
//     nome: Joi.string().required(),
//     email: Joi.string().email().required(),
//     senha: Joi.string().required(),
// });




//conectar no banco
const mongoClient = new MongoClient (process.env.DATABASE_URL)
let db
mongoClient.connect().then(() => db = mongoClient.db()).catch((err) => console.log(err.message))

app.post("/cadastro", signUp)

app.listen(5000, () => console.log("Servidor ligado!"))