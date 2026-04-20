const express = require("express")
const { json } = require("stream/consumers")
const Bd = require("better-sqlite3")
const oBd = new Bd("novaImagem.db")

oBd.exec(`
    CREATE TABLE IF NOT EXISTS servicos (
        id INTEGER,
        nome TEXT,
        preco REAL
    )
    `)

oBd.exec(`
        CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER,
    nome TEXT,
    telefone TEXT,
    horario TEXT,
    idServico INTEGER
    )
`)

oBd.exec(`
        CREATE TABLE IF NOT EXISTS faturamento (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    valor REAL,
    data INTEGER
    )
`)

const app = express()

app.use(express.json())
app.use(express.static("public"))

app.get("/clientes", (req, res) => {
   const clientes = oBd.prepare("SELECT * FROM clientes").all()
   res.json(clientes)
})

app.post("/clientes", (req, res) => {
    const {nome, telefone, horario, idServico} = req.body

    if (!nome || !horario || !telefone || !idServico) {
      return res.status(400).json({erro: "Todos os campos sao obrigatoriós!"})
    }
    const id = Date.now()

    oBd.prepare("INSERT INTO clientes (id, nome, telefone, horario, idServico) VALUES (?, ?, ?, ?, ?)").run(id, nome, telefone, horario, idServico)

    res.json()
})

app.delete("/clientes/:id", (req, res) => {

    const idurl = Number(req.params.id)
    oBd.prepare("DELETE FROM clientes WHERE id = ?").run(idurl)
    res.json({mensagem: "Cliente apagado com sucesso!"})
    
})

//servicos:

app.get("/servicos", (req, res) => {
    const servicos = oBd.prepare("SELECT * FROM servicos").all()
    res.json(servicos)
})

app.post("/servicos", (req, res) => {
    const {nome, preco} = req.body

    if (!nome || !preco) {
      return res.status(400).json({erro: "Nome e preco sao obrigatoriós!"})
    }
    const id = Date.now()

    oBd.prepare("INSERT INTO servicos (nome, preco, id) VALUES (?, ?, ?)").run(nome, preco, id)
    res.json()
})

app.delete("/servicos/:id", (req, res) => {
    const idurl = Number(req.params.id)
    if (oBd.prepare("SELECT * FROM clientes WHERE idServico = ? ").get(idurl)) {
        return res.status(400).json({erro: "Um cliente esta usando esse servico!"})
    }
    oBd.prepare("DELETE FROM servicos WHERE id = ? ").run(idurl)
    res.json({mensagem: "Cliente apagado com sucesso!"})
})


app.put("/servicos/:id", (req, res) => {
    const idUrl = Number(req.params.id)
    const nome = req.body.nome
    const preco = req.body.preco
    oBd.prepare("UPDATE servicos SET nome = ?, preco = ?  WHERE id = ? ").run(nome, preco, idUrl)
    res.json()
})

// Faturamento:

app.get("/faturamento", (req, res) => {
    const clientesFaturamento = oBd.prepare("SELECT * FROM faturamento").all()
    res.json(clientesFaturamento)
})

app.delete("/faturamento", (req, res) => {
    const dataAtual = new Date().getMonth() + 1
    oBd.prepare("DELETE FROM faturamento WHERE data != ?").run(dataAtual)
    res.json()
})

app.post("/faturamento", (req, res) => {
    const {nome, valor} = req.body
    const data = new Date().getMonth() + 1
    oBd.prepare("INSERT INTO faturamento (nome, valor, data) VALUES (?, ?, ?)").run(nome, valor, data)
    res.json()
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor rodando!")
})
