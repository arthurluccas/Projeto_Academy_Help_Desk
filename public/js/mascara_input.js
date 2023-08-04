var input_celular = document.getElementById("floatingInput1");
var input_residencial = document.getElementById("floatingInput2");
var input_matricula = document.getElementById("matricula");

input_celular.addEventListener("keypress", (e) => {
  let input_length = input_celular.value.length;

  if (e.key === " ") {
    e.preventDefault();
  } else if (
    e.key !== "0" &&
    e.key !== "1" &&
    e.key !== "2" &&
    e.key !== "3" &&
    e.key !== "4" &&
    e.key !== "5" &&
    e.key !== "6" &&
    e.key !== "7" &&
    e.key !== "8" &&
    e.key !== "9" &&
    e.key !== "Enter"
  ) {
    e.preventDefault();
  } else if (input_length === 0 && e.key === "Enter") {
    input_celular.value = null;
  } else if (input_length === 0) {
    input_celular.value = "(";
  } else if (input_length === 3) {
    input_celular.value += ") ";
  } else if (input_length === 10) {
    input_celular.value += "-";
  }
});

input_residencial.addEventListener("keypress", (e) => {
  let input_length = input_residencial.value.length;

  if (e.key === " ") {
    e.preventDefault();
  } else if (
    e.key !== "0" &&
    e.key !== "1" &&
    e.key !== "2" &&
    e.key !== "3" &&
    e.key !== "4" &&
    e.key !== "5" &&
    e.key !== "6" &&
    e.key !== "7" &&
    e.key !== "8" &&
    e.key !== "9" &&
    e.key !== "Enter"
  ) {
    e.preventDefault();
  } else if (input_length === 0 && e.key === "Enter") {
    input_celular.value = null;
  } else if (input_length === 0) {
    input_residencial.value = "(";
  } else if (input_length === 3) {
    input_residencial.value += ") ";
  } else if (input_length === 9) {
    input_residencial.value += "-";
  }
});

input_matricula.addEventListener("keypress", (e) => {
  if (e.key === " ") {
    e.preventDefault();
  } else if (
    e.key !== "0" &&
    e.key !== "1" &&
    e.key !== "2" &&
    e.key !== "3" &&
    e.key !== "4" &&
    e.key !== "5" &&
    e.key !== "6" &&
    e.key !== "7" &&
    e.key !== "8" &&
    e.key !== "9" &&
    e.key !== "Enter"
  ) {
    e.preventDefault();
  }
});
