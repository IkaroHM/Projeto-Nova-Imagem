async function listarClientesFaturamento () {
  const response = await fetch("/faturamento")
  const clientes = await response.json()

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

  console.log(meses)
}

function apagarCliente(id) {
  fetch(`/faturamento/${id}`, {
    method: "DELETE",
  }).then(() => {
    listarClientesFaturamento();
  });
}
