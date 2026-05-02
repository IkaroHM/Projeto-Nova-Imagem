async function listarClientesFaturamento () {
  const response = await fetch("/faturamento")
  const clientes = await response.json()

  console.log(clientes)
}

function apagarCliente(id) {
  fetch(`/faturamento/${id}`, {
    method: "DELETE",
  }).then(() => {
    listarClientesFaturamento();
  });
}
