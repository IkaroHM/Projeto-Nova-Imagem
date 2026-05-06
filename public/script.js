function salvarClienteFaturamento(nome, idservico, id) {
    fetch("/servicos")
      .then((res) => res.json())
      .then((servicos) => {
      
        const servico = servicos.find(s => s.id === Number(idservico))
        const valor = servico.preco
        
        fetch("/faturamento", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({nome, valor}),
        }).then(() => {
          apagarCliente(id)
        })
      })
  }

function precoDia() {
  fetch("/servicos")
    .then((res) => res.json())
    .then((servicos) => {
       fetch("/clientes")
        .then((res) => res.json())
        .then((clientes) => {
          let totalDia = 0
          for (const cliente of clientes) {
            const servico = servicos.find(s => s.id === cliente.idservico)
            if (servico) {
              totalDia = totalDia + Number(servico.preco)
            }
          }
          const html = `faturamento: ${totalDia}`
          document.getElementById("previsaoDia").innerHTML = html
        })
    })
}

function pegarServicos() {
  fetch("/servicos")
    .then((res) => res.json())
    .then((servicos) => {
      const html = servicos.map(
        (servico) => `
        <option value="${servico.id}">${servico.nome}</option>
        `,
        )
        .join("");
      document.getElementById("servicoCliente").innerHTML = html;
    })
}

function listarClientes() {
  fetch("/servicos")
    .then((res) => res.json())
    .then((servicos) => {
      fetch("/clientes")
        .then((res) => res.json())
        .then((clientes) => {
          const html = clientes.map(
              (cliente) => {
                const servicoCliente = servicos.find(s => s.id === cliente.idservico)
                return `
                  <div class="cliente">
                    <div class="clienteInfo">
                      <span> ${cliente.nome}.  </span>
                      <span> ${cliente.telefone}. </span>
                      <span> ${cliente.horario}. </span>
                      <span> ${servicoCliente.nome}. </span>
                    </div>
                    <div class="clienteBotoes">
                      <button class="servicoFeito" onclick="salvarClienteFaturamento('${cliente.nome}', '${cliente.idservico}', ${cliente.id})">Feito</button>
                      <button class="btnApagar" onclick="apagarCliente(${cliente.id})">Apagar</button>
                    </div>
                  </div>
            `},
            )
            .join("");
            if (clientes.length > 0) {
              document.getElementById("listaClientes").style.display = "block"
            } else {
              document.getElementById("listaClientes").style.display = "none"
            }
          document.getElementById("listaClientes").innerHTML = html;
          document.getElementById("qntClientes").innerHTML = `Clientes: ${clientes.length}`
        })
    })
}


const data = new Date().toLocaleDateString("pt-BR")
document.getElementById("dataHoje").innerHTML = data

function apagarCliente(id) {
  fetch(`/clientes/${id}`, {
    method: "DELETE",
  }).then(() => {
    listarClientes();
    precoDia()
  });
}

listarClientes();
pegarServicos();
precoDia();


const btnAdicionarCliente = document.getElementById("btnAdicionarCliente");

btnAdicionarCliente.addEventListener("click", () => {
  const horario = document.getElementById("horarioCliente").value
  const nome = document.getElementById("nomeCliente").value
  const telefone = document.getElementById("numeroCliente").value
  const idservico = Number(document.getElementById("servicoCliente").value)

  fetch("/clientes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, telefone, horario, idservico }),
  }).then((res) => {

    if (!res.ok) {
      document.getElementById("erroCampos").style.display = "block"
      return
    } 
    document.getElementById("erroCampos").style.display = "none"

    listarClientes();
    precoDia()
  });
  

});
