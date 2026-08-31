require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");
const path = require("path");

const app = express();
const PORT = 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());
app.use(express.static("."));

// Rota principal: abre o index.html direto
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Rota para a página do Aluno (Colega)
app.get("/aluno", (req, res) => {
  res.sendFile(path.join(__dirname, "aprenda+colega.html"));
});

// Rota corrigida para a página aprenda+b.html
app.get("/aprenda+b.html", (req, res) => {
  res.sendFile(path.join(__dirname, "aprenda+b.html"));
});

// Rota para a página do Professor
app.get("/professor", (req, res) => {
  res.sendFile(path.join(__dirname, "aprenda+professor.html"));
});

// Rota da API para o Colega
app.post("/api/perguntar-colega", async (req, res) => {
  try {
    const { pergunta } = req.body;

    if (!pergunta) {
      return res.status(400).json({
        erro: "Digite uma pergunta.",
      });
    }

    const respostaIA = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            Você é um assistente educacional, o A+.

            Responda apenas perguntas relacionadas a:
            - Matemática
            - Ciências
            - História
            - Geografia
            - Português
            - Inglês
            - Estudos escolares em geral

            Se a pergunta não for sobre educação ou aprendizado, responda apenas:

            "Desculpe, fui criado apenas para auxiliar em assuntos educacionais."

            Porem se o aluno perguntar "Qual é seu nome?" responda qual é seu nome.
          `
        },
        {
          role: "user",
          content: pergunta
        }
      ],
    });

    res.json({
      resposta: respostaIA.choices[0].message.content,
    });
  } catch (erro) {
    console.error("Erro detalhado no servidor:", erro);

    res.status(500).json({
      erro: "Não foi possível obter uma resposta da IA.",
    });
  }
});

// Rota da API para o Professor
app.post("/api/perguntar-professor", async (req, res) => {
  try {
    const { pergunta } = req.body;

    if (!pergunta) {
      return res.status(400).json({
        erro: "Digite uma pergunta.",
      });
    }

    const respostaIA = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            Você é um professor experiente e acolhedor. Ajude o aluno com explicações pedagógicas detalhadas, claras e estruturadas sobre matérias escolares.
          `
        },
        {
          role: "user",
          content: pergunta
        }
      ],
    });

    res.json({
      resposta: respostaIA.choices[0].message.content,
    });
  } catch (erro) {
    console.error("Erro detalhado no servidor:", erro);

    res.status(500).json({
      erro: "Não foi possível obter uma resposta da IA.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Acesse a Home em: http://localhost:${PORT}/`);
  console.log(`Acesse o Colega em: http://localhost:${PORT}/aluno`);
  console.log(`Acesse o B em: http://localhost:${PORT}/aprenda+b.html`);
  console.log(`Acesse o Professor em: http://localhost:${PORT}/professor`);
});
