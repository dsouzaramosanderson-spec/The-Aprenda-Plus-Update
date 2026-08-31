const express = require("express");
const OpenAI = require("openai");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializa a OpenAI puxando a chave da Vercel
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());
app.use(express.static("."));

// Rota principal: abre o index.html direto
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Permite acessar a página do Aluno digitando apenas /aluno
app.get("/aluno", (req, res) => {
  res.sendFile(path.join(__dirname, "aprenda+colega.html"));
});

// Permite acessar a página do Aluno digitando o link completo /aprenda+colega.html
app.get("/aprenda+colega.html", (req, res) => {
  res.sendFile(path.join(__dirname, "aprenda+colega.html"));
});

// Rota para a página aprenda+b.html
app.get("/aprenda+b.html", (req, res) => {
  res.sendFile(path.join(__dirname, "aprenda+b.html"));
});

// Rota para a página aprenda+c.html
app.get("/aprenda+c.html", (req, res) => {
  res.sendFile(path.join(__dirname, "aprenda+c.html"));
});

// Rota para a página do professor bem-vindo
app.get("/aprenda+professorBemvindo.html", (req, res) => {
  res.sendFile(path.join(__dirname, "aprenda+professorBemvindo.html"));
});

// Permite acessar a página do Professor digitando apenas /professor
app.get("/professor", (req, res) => {
  res.sendFile(path.join(__dirname, "aprenda+professor.html"));
});

// Permite acessar a página do Professor digitando o link completo /aprenda+professor.html
app.get("/aprenda+professor.html", (req, res) => {
  res.sendFile(path.join(__dirname, "aprenda+professor.html"));
});

// Rota da API para o Colega
app.post("/api/perguntar-colega", async (req, res) => {
  try {
    const { pergunta } = req.body;

    if (!pergunta) {
      return res.status(400).json({ erro: "Digite uma pergunta." });
    }

    const respostaIA = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um assistente educacional chamado A+. Responda apenas perguntas escolares. Se não for sobre estudos, diga: 'Desculpe, fui criado apenas para auxiliar em assuntos educacionais.' Se o aluno perguntar seu nome, responda."
        },
        { role: "user", content: pergunta }
      ],
    });

    // CORRIGIDO AGORA: adicionado o [0] que estava faltando
    res.json({ resposta: respostaIA.choices[0].message.content });
  } catch (erro) {
    console.error("Erro no servidor:", erro);
    res.status(500).json({ erro: "Não foi possível obter uma resposta da IA." });
  }
});

// Rota da API para o Professor
app.post("/api/perguntar-professor", async (req, res) => {
  try {
    const { pergunta } = req.body;

    if (!pergunta) {
      return res.status(400).json({ erro: "Digite uma pergunta." });
    }

    const respostaIA = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um professor experiente e acolhedor. Ajude o aluno com explicações pedagógicas detalhadas."
        },
        { role: "user", content: pergunta }
      ],
    });

    // CORRIGIDO AGORA: adicionado o [0] que estava faltando
    res.json({ resposta: respostaIA.choices[0].message.content });
  } catch (erro) {
    console.error("Erro no servidor:", erro);
    res.status(500).json({ erro: "Não foi possível obter uma resposta da IA." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ativo na porta ${PORT}`);
});

