import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();


export async function connectDB() {
    const client = new MongoClient(process.env.DATABASE_URL);
  
    try {
      await client.connect();
      console.log("Conexão com o banco de dados estabelecida com sucesso!");
      return client.db();
    } catch (error) {
      console.error("Erro ao conectar ao banco de dados:", error);
      throw error;
    }
  }

  
  export default connectDB;
