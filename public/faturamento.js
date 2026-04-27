function listarClientesFaturamento() {
  fetch("/faturamento")
    .then((res) => res.json())
    .then((clientesFaturamento) => {
        const html = clientesFaturamento.map(
          (cliente) => `
            <div class="cliente">
              <div class="clienteInfo">
                <span> ${cliente.nome}.  </span>
                <span> R$:${cliente.valor}. </span>
                <span> Dia: ${cliente.data}. </span>
                <button class="btnApagar" onclick="apagarCliente(${cliente.id})">Apagar</button>
              </div>
            </div>
        `,
        )
        .join("");
        if (clientesFaturamento.length > 0) {
          document.getElementById("listaClientesFaturamento").style.display = "block"
        } else {
          document.getElementById("listaClientesFaturamento").style.display = "none"
        }
      document.getElementById("listaClientesFaturamento").innerHTML = html;
      document.getElementById("qntClientesMes").innerHTML = `Clientes do mes: ${clientesFaturamento.length}`
    })
}

const data = new Date().toLocaleDateString("pt-BR")
document.getElementById("mes").innerHTML = data

function precoMes() {
  fetch("/faturamento")
    .then((res) => res.json())
    .then((clientesFaturamento) => {
        let totalMes = 0
        for (const cliente of clientesFaturamento) {
            if (cliente) {
                totalMes = totalMes + Number(cliente.valor)
            }
        }
        const html = `faturamento do mes: R$:${totalMes}`
        document.getElementById("faturamento").innerHTML = html
    })
}

function atualizarClientes() {
  fetch("/faturamento", {
    method: "DELETE"
  }).then(() => {
    listarClientesFaturamento()
    precoMes()
  })
}

function apagarCliente(id) {
  fetch(`/faturamento/${id}`, {
    method: "DELETE",
  }).then(() => {
    listarClientesFaturamento();
    precoMes()
  });
}

atualizarClientes()