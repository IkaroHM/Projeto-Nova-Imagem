const express = require("express")
require('dotenv').config()
const {Pool} = require('pg')
const pool = new Pool({ connectionString: process.env.DATABASE_URL})

const app = express()

app.use(express.json())
app.use(express.static("public"))

app.get("/clientes", async (req, res) => {
   const clientes = await pool.query("SELECT * FROM clientes")
   res.json(clientes.rows)
})

app.post("/clientes", async (req, res) => {
    const {nome, telefone, horario, idServico} = req.body

    if (!nome || !horario || !telefone || !idServico) {
      return res.status(400).json({erro: "Todos os campos sao obrigatoriós!"})
    }

    await pool.query("INSERT INTO clientes (nome, telefone, horario, idServico) VALUES ($1, $2, $3, $4)", [ nome, telefone, horario, idServico])

    res.json()
})

app.delete("/clientes/:id", async (req, res) => {

    const idurl = Number(req.params.id)
    await pool.query("DELETE FROM clientes WHERE id = $1", [idurl])
    res.json({mensagem: "Cliente apagado com sucesso!"})
    
})

//servicos:

app.get("/servicos", async (req, res) => {
    const servicos = await pool.query("SELECT * FROM servicos")
    res.json(servicos.rows)
})

app.post("/servicos", async (req, res) => {
    const {nome, preco} = req.body

    if (!nome || !preco) {
      return res.status(400).json({erro: "Nome e preco sao obrigatoriós!"})
    }
    const id = Date.now()

    await pool.query("INSERT INTO servicos (nome, preco) VALUES ($1, $2)", [nome, preco])
    res.json()
})

app.delete("/servicos/:id", async (req, res) => {
    const idurl = Number(req.params.id)
    const clientes = await pool.query("SELECT * FROM clientes WHERE idServico = $1 ", [idurl])

    if (clientes.rows.length > 0) {
        return res.status(400).json({erro: "Um cliente esta usando esse servico!"})
    }

    await pool.query("DELETE FROM servicos WHERE id = $1 ", [idurl])
    res.json({mensagem: "Cliente apagado com sucesso!"})
})

app.put("/servicos/:id", async (req, res) => {
    const idUrl = Number(req.params.id)
    const nome = req.body.nome
    const preco = req.body.preco

    await pool.query("UPDATE servicos SET nome = $1, preco = $2  WHERE id = $3 ", [nome, preco, idUrl])
    res.json()
})

// Faturamento:

app.get("/faturamento", async (req, res) => {
    const clientesFaturamento = await pool.query("SELECT * FROM faturamento")
    res.json(clientesFaturamento.rows)
})

app.delete("/faturamento", async (req, res) => {
    const dataAtual = new Date().getMonth() + 1
    await pool.query("DELETE FROM faturamento WHERE data != $1", [dataAtual])
    res.json()
})

app.post("/faturamento",async (req, res) => {
    const {nome, valor} = req.body
    const data = new Date().getMonth() + 1
    await pool.query("INSERT INTO faturamento (nome, valor, data) VALUES ($1, $2, $3)", [nome, valor, data])
    res.json()
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor rodando!")
})
