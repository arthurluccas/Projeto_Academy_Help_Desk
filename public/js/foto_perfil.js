var foto = document.getElementById("foto_perfil");
var form_foto = document.getElementById("form_perfil");
var input_foto = document.getElementById("input_perfil");
foto.addEventListener("click", () => {
  input_foto.click();
});

input_foto.addEventListener("change", () => {
  if (input_foto.value != "") {
    form_foto.submit();
  }
});
