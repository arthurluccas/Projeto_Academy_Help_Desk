var layout_chatbot = document.getElementById("header-chatbot");
var lista = document.getElementById("img-hover");
var botao = document.getElementById("fechar-botao")

lista.addEventListener("click", () => {
    layout_chatbot.style.zIndex = "21";
})

botao.addEventListener("click", () => {
    layout_chatbot.style.zIndex = "1"
})