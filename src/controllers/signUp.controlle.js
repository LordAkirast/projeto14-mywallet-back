import connectDB from "../database/db.js";
import bcrypt from "bcrypt";
import Joi from "joi";

const signUpSchema = Joi.object({
  nome: Joi.string().required(),
  email: Joi.string().email().required(),
  senha: Joi.string().required(),
  confirmarSenha: Joi.string().required(),
});

export async function signUp(req, res) {
  console.log("entrou na rota");
  const { nome, email, senha, confirmarSenha } = req.body;

  try {
    const db = await connectDB();
    console.log("passou1");

    const validation = signUpSchema.validate(
      { nome, email, senha, confirmarSenha },
      { abortEarly: false }
    );
    
    console.log("passou2");
    if (validation.error) {
      console.log("erro1");
      const errors = validation.error.details.map((detail) => detail.message);
      return res.status(422).send(errors);
    }

    if (senha.length < 3) {
      console.log("erro2");
      return res.status(422).send("A senha precisa ter mais de três caracteres.");
    }

    if (senha !== confirmarSenha) {
      console.log("erro 3");
      return res.status(422).send("A senha deve ser igual à confirmação de senha.");
    }

    const users = await db.collection("users").find({ email: email }).toArray();
    if (users.length > 0) {
      return res.status(409).send("Usuário já cadastrado!");
    }

    const passCrypt = bcrypt.hashSync(senha, 10);
    const newUser = { nome, email, passCrypt };

    const promise = await db.collection("users").insertOne(newUser).then(() => {
        return res.status(201).send("Usuário criado!")
    }).catch(err => {
        return res.status(500).send(err.message)
    })
    
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    return res.status(500).send("Erro ao conectar ao banco de dados.");
  }
}
