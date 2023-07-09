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
        console.log("erro 2")
            return res.status(404).send("Usuário não cadastrado!");
        }

    const unHash = bcrypt.compareSync(senha, users.passCrypt)

    if (unHash === false ) {
        console.log("erro 3")
        return res.status(401).send("Senha Incorreta!")
    }
      
    

    
      

      console.log("passou tudo no login")

    res.status(200).send(users.nome) ///aqui deve retornar um token e o usuário tem de ser redirecionado para a rota /home

    ///utilize localstorage para manter o usuário logado
})

app.post("/nova-transacao/:tipo", (req,res) => {
    const {tipo} = req.params
    let {valor, descricao, token, diaMesFormatado} = req.body

    console.log("entrou")

    if(!valor || !descricao) {
        console.log("Erro 1")
        return res.status(422).send("O valor ou a descrição não foram preenchidos corretamente.")
    }

    if (!token) {
        console.log("Erro 2")
        return res.status(401).send("UNAUTHORIZED! TOKEN INVÁLIDO!")
    }

    if (tipo === 'entrada') {
        if (valor < 0) {
            console.log("Erro 3")
            return res.status(422).send("O valor de entrada deve ser positivo.")
        }
        valor = Number(valor)
        valor = parseFloat(valor.toFixed(2))
        console.log(typeof(valor) + valor)
        if (isNaN(valor) === true) {
            console.log("Erro 4");
            console.log(typeof valor + valor)
            return res.status(422).send("O valor deve ser um número válido. Ex: 40.00");
          }
          

          const novaTransacao = {valor, descricao, metodo: "entrada", diaMesFormatado, token}

          const promise = db.collection("transacoes").insertOne(novaTransacao).then(() => {
            return res.sendStatus(201)
          }).catch(err => {
            return res.status(500).send(err.message)
          })

    } else {
        if (valor < 0) {
            console.log("Erro 5")
            return res.status(422).send("O valor de saida deve ser positivo.")
        }

        if (isNaN(parseFloat(valor))) {
            console.log("Erro 6")
            return res.status(422).send("O valor deve ser um número válido. Ex: 40.0");
          }

          const novaTransacao = {valor, descricao, metodo: "saida",diaMesFormatado, token}

          const promise = db.collection("transacoes").insertOne(novaTransacao).then(() => {
            return res.sendStatus(201)
          }).catch(err => {
            return res.status(500).send(err.message)
          })


    }
})


app.get("/home", (req,res) => {

    console.log("entrou no /home.")

    const transacoes = db.collection("transacoes").find().toArray().then(transacoes => {
        return res.send(transacoes)
    }).catch(err => {
        return res.status(500).send(err.message)
    })




// - [ ]  Caso o limite de espaço da tela não seja suficiente para visualizar tudo, deve haver um *scroll* apenas nas transações, o saldo deve ser mantido fixo onde está.
// - [ ]  As entradas e saídas devem aparecer de acordo com a data, sendo a mais recente a primeira da lista.
// - [ ]  Os valores de entradas devem ser exibidos em verde e os valores de saída, em vermelho.
// - [ ]  O saldo final do usuário deve ser exibido, levando em consideração a soma de todas as entradas e saídas.
// - [ ]  Se o saldo for positivo, deve estar em verde. Se for negativo, deve estar em vermelho.

})
app.listen(5000, () => console.log("Servidor ligado!"))