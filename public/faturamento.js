async function listarClientesFaturamento () {
  const response = await fetch("/faturamento")
  const clientes = await response.json()
  const containerMeses = document.getElementById("meses");

  const meses ={ 
    "janeiro": {totalClientes: 0, faturamento: 0,  clientes: [] },
    "fevereiro": {totalClientes: 0, faturamento: 0,  clientes: [] },
    "março": {totalClientes: 0, faturamento: 0,  clientes: [] },
    "abril": {totalClientes: 0, faturamento: 0,  clientes: [] },
    "maio": {totalClientes: 0, faturamento: 0,  clientes: [] },
    "junho": {totalClientes: 0, faturamento: 0,  clientes: [] },
    "julho": {totalClientes: 0, faturamento: 0,  clientes: [] },
    "agosto": {totalClientes: 0, faturamento: 0,  clientes: [] },
    "setembro": {totalClientes: 0, faturamento: 0,  clientes: [] },
    "outubro": {totalClientes: 0, faturamento: 0,  clientes: [] },
    "novembro": {totalClientes: 0, faturamento: 0,  clientes: [] },
    "dezembro": {totalClientes: 0, faturamento: 0,  clientes: [] }
  }

  clientes.forEach(cliente => {
    const nomeMes = new Date(cliente.data_completa).toLocaleString('pt-BR', { month: 'long' })

    meses[nomeMes].totalClientes++
    meses[nomeMes].faturamento += Number(cliente.valor)
    meses[nomeMes].clientes.push(cliente)
    
  })

  let totalAno = 0
  let clientesAno = 0
  let maiorQntClientes = 0
  let maiorTotal = 0
  let mesGanhadorClientes = ""
  let mesGanhadorFaturamento = ""

  Object.entries(meses).forEach(([nome, dados]) => {

    totalAno += dados.faturamento
    clientesAno += dados.totalClientes

    if (dados.totalClientes > maiorQntClientes) {
      maiorQntClientes = dados.totalClientes
      mesGanhadorClientes = nome
    }
    if (dados.faturamento > maiorTotal) {
      maiorTotal = dados.faturamento
      mesGanhadorFaturamento = nome
    }
  })
  
  document.getElementById("faturamento").textContent = totalAno
  document.getElementById("qntClientesAno").textContent = clientesAno
  document.getElementById("mesDestaque").innerHTML = `
    <p>Mês com mais clientes: <span>${mesGanhadorClientes}</span> (${maiorQntClientes} clientes)</p>
    <p>Mês com maior faturamento: <span>${mesGanhadorFaturamento}</span> (R$ ${maiorTotal})</p>`

    Object.entries(meses).forEach(([mes, dados]) => {
        if (dados.totalClientes > 0) {
          const clientesHtml = dados.clientes.map(cliente => {
            return `
              <div class="cliente-item">
                <p>${cliente.nome}</p>
                <span class="valor">R$ ${cliente.valor.toFixed(2).replace('.', ',')}</span>
                <button class="btnApagar" onclick="apagarCliente(${cliente.id})">Apagar</button>
              </div>
            `;
          }).join('')
          const cardMesdiv = document.createElement('div')
          cardMesdiv.classList.add('card-mes')
          cardMesdiv.innerHTML = `
            <h3>${mes.charAt(0).toUpperCase() + mes.slice(1)}</h3>
            <p>Faturamento do Mês: <strong>R$ ${dados.faturamento.toFixed(2).replace('.', ',')}</strong></p>
            <p>Clientes atendidos: <strong>${dados.totalClientes}</strong></p>
            <div class="clientesMes">
              ${clientesHtml}
            </div>
          `

          document.getElementById("meses").appendChild(cardMesdiv)
        }
      })
}



function apagarCliente(id) {
  fetch(`/faturamento/${id}`, {
    method: "DELETE",
  }).then(() => {
    listarClientesFaturamento();
  });
}
listarClientesFaturamento()
