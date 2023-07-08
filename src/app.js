import express from "express"
import { MongoClient } from "mongodb";
import dotenv from "dotenv"
import cors from 'cors';
import Joi from "joi";
import { signUp } from "./controllers/signUp.controlle.js";
import bcrypt from "bcrypt"


const app = express();
app.use(cors());
app.use(express.json())
dotenv.config()

// const signUpSchema = Joi.object({
//     nome: Joi.string().required(),
//     email: Joi.string().email().required(),
//     senha: Joi.string().required(),
// });


////schemas
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    senha: Joi.string().required(),
});


//conectar no banco
const mongoClient = new MongoClient (process.env.DATABASE_URL)
let db
mongoClient.connect().then(() => db = mongoClient.db()).catch((err) => console.log(err.message))

app.post("/cadastro", signUp)

app.post("/login", async (req,res) => {
    const {email, senha} = req.body

    console.log("entrou")

    const validation = loginSchema.validate({email, senha}, {abortEarly: "False"})
    if (validation.error) {
        console.log("erro 1")
        const errors = validation.error.details.map((detail) => detail.message)
        return res.status(422).send(errors);
    }

    const users = await db.collection("users").findOne({ email: email});
    if (!users) {
            return res.status(404).send("Usuário não cadastrado!");
        }

    const unHash = bcrypt.compareSync(senha, users.passCrypt)

    if (unHash === false ) {
        return res.status(401).send("Senha Incorreta!")
    }
      
    

    
      

      console.log("passou tudo no login")
    



    ///Caso o e-mail de login não esteja cadastrado, a requisição deve retornar status code 404 (Not Found) e o front-end deve mostrar uma mensagem explicando o erro. (Use alert)
    ///Caso a senha enviada não seja correspondente com a que está cadastrada, a requisição deve retornar status code 401 (Unauthorized) e o front-end deve mostrar uma mensagem explicando o erro. (Use alert)


    res.sendStatus(200) ///aqui deve retornar um token e o usuário tem de ser redirecionado para a rota /home

    ///utilize localstorage para manter o usuário logado
})

app.post("/nova-transacao/:tipo", (req,res) => {
    const {tipo} = req.params

// - [ ]  Essa rota deve receber o *token* de autorização do usuário. Caso não receba, deve enviar o status `401 (Unauthorized)`.
// - [ ]  O tipo de dado do valor deve ser flutuante (ex: 40.5) e positivo.
// - [ ]  Todos os campos são obrigatórios. Faça validações de acordo com a necessidade no front-end e no back-end que garantam que todos os dados estejam presentes.
// - [ ]  Caso algum dado seja enviado à API em formato inválido, a resposta à requisição deve possuir o status `422 (Unprocessable Entity)` e o front-end deve exibir uma mensagem explicativa ao usuário. (Use `alert`)
// - [ ]  Em caso de sucesso, o usuário deve ser redirecionado para a página home.



})


app.get("/home", (req,res) => {



// - [ ]  Essa rota deve receber o `token` de autorização do usuário. Caso não receba, deve enviar o status code `401 (Unauthorized)`.
// - [ ]  Caso o limite de espaço da tela não seja suficiente para visualizar tudo, deve haver um *scroll* apenas nas transações, o saldo deve ser mantido fixo onde está.
// - [ ]  O nome do usuário deve ser exibido no topo da tela.
// - [ ]  As entradas e saídas devem aparecer de acordo com a data, sendo a mais recente a primeira da lista.
// - [ ]  Os valores de entradas devem ser exibidos em verde e os valores de saída, em vermelho.
// - [ ]  O saldo final do usuário deve ser exibido, levando em consideração a soma de todas as entradas e saídas.
// - [ ]  Se o saldo for positivo, deve estar em verde. Se for negativo, deve estar em vermelho.

})
app.listen(5000, () => console.log("Servidor ligado!"))