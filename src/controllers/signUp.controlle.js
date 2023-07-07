
import express from "express"
import { MongoClient } from "mongodb";
import dotenv from "dotenv"
import cors from 'cors';
import Joi from "joi";
import bcrypt from "bcrypt";

const signUpSchema = Joi.object({
    nome: Joi.string().required(),
    email: Joi.string().email().required(),
    senha: Joi.string().required(),
});

export async function signUp(req,res) {
    console.log("entrou na rota")
    const {nome, email, senha} = req.body
    console.log("passou1")

    const password = senha
    const passCrypt = bcrypt.hashSync(password, 10)

    const validation = signUpSchema.validate({nome, email, senha}, {abortEarly: "False"})
    console.log("passou2")
    if (validation.error) {
        console.log("erro1")
        const errors = validation.error.details.map((detail) => detail.message)
        return res.status(422).send(errors);
    }

    if (senha.length < 3) {
        console.log("erro2")
        return res.status(422).send("A senha precisa ter mais de três caracteres.")
    }

    console.log("passoutudo")

    // Caso já exista um usuário com este e-mail cadastrado, a requisição deve retornar status code 409 (Conflict) e o front-end deve mostrar uma mensagem explicando o erro. (Use alert)

    res.sendStatus(201)
}
