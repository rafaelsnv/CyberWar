/* Banco de dados do cadastro */

function cadastroUsuario() {
  var lgn = document.getElementById("c_login");
  var nom = document.getElementById("c_nome");
  var idad = document.getElementById("c_idade");
  var ema = document.getElementById("c_email");
  var sen = document.getElementById("c_senha");
  var senOk = document.getElementById("c_senhaOk");

  var dadosUsuario = {
    login: lgn.value,
    nome: nom.value,
    idade: idad.value,
    email: ema.value,
    senha: sen.value
  };

  localStorage.setItem(lgn.value, JSON.stringify(dadosUsuario));
  alert("Cadastro feito com sucesso!");

  lgn.value = "";
  nom.value = "";
  idad.value = "";
  ema.value = "";
  sen.value = "";
  senOk.value = "";

  window.location.href = "login.html";
}

/** Logar no site */

function logar() {
  var email = document.getElementById("l_email");
  var senha = document.getElementById("l_senha");

  if (
    email.value === JSON.parse(localStorage.getItem(l_email.value)).login &&
    senha.value === JSON.parse(localStorage.getItem(l_email.value)).senha
  ) {
    localStorage.setItem("acesso", true);

    window.location.href = "jogar.html";
  } else {
    alert("Usuário ou senha inválidos");
  }
}

/** Mostrar senha **/

function mostrarOcultarSenha() {
  var senha = document.getElementById("l_senha");

  if (senha.type === "password") {
    senha.type = "text";
    document.getElementById("senhaVenda").style.display("float");
    document.getElementById("senhaOlho").style.display("none");
  } else {
    senha.type = "password";
    document.getElementById("senhaVenda").style.display("none");
    document.getElementById("senhaOlho").style.display("float");
  }
}
