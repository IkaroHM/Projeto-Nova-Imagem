let idServicoEditcao = null

function listarServicos() {
  fetch("/servicos")
    .then((res) => res.json())
    .then((servicos) => {
      const html = servicos
        .map(
          (servico) => `
                <div class="servico">
                    <div class="servicoInfo">
                        <span> ${servico.nome}  </span>
                        <span> R$:${servico.preco} </span>
                    </div>
                    <div class="servicoBotoes">
                        <button class="btnApagar" onclick="apagarServico(${servico.id})">Apagar</button>
                        <span id='erroServico-${servico.id}' class="erroServico">Erro: Um cliente esta usando esse servico</span>
                        <button class="btnEditar" onclick="modalServico(${servico.id}, '${servico.nome}', ${servico.preco})">Editar</button>
                    </div>
                </div>
        `,
        )
        .join("");
        if (servicos.length > 0) {
          document.getElementById("listaServicos").style.display = "flex"
        } else {
          document.getElementById("listaServicos").style.display = "none"
        }
      document.getElementById("listaServicos").innerHTML = html;
    });
}

function apagarServico(id) {
  fetch(`/servicos/${id}`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) {
      document.getElementById(`erroServico-${id}`).style.display = "block"
      return
    }
    document.getElementById(`erroServico-${id}`).style.display = "none"
    listarServicos();
  });
}

listarServicos();

const btnAdicionarServico = document.getElementById("adicionarServico");

btnAdicionarServico.addEventListener("click", () => {
  const nome = document.getElementById("nomeServico").value;
  const preco = document.getElementById("precoServico").value;

  fetch("/servicos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, preco }),
  }).then((res) => {
    if (!res.ok) {
      document.getElementById("erroNomePreco").style.display = "block"
      return
    }
    document.getElementById("erroNomePreco").style.display = "none"
    listarServicos();
  });
});

function modalServico(id, nome, preco) {

  document.getElementById("modalServico").style.display = "flex"

  document.getElementById("nomeModal").value = nome
  document.getElementById("precoModal").value = preco

  idServicoEdicao = id

}

function salvarModal() {

const nome = document.getElementById("nomeModal").value
const preco = document.getElementById("precoModal").value

  fetch(`/servicos/${idServicoEdicao}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, preco }),
  }).then(() => {
    listarServicos()
    document.getElementById("modalServico").style.display = "none"
  })

}

function cancelarModal() {
  document.getElementById("modalServico").style.display = "none"
}