const express = require("express");
const router = express.Router();
const bd = require("../models/bd_aluno");
const bd1 = require("../models/bd_professor");
const bd2 = require("../models/bd_chamado");
const bd3 = require("../models/bd_funcionario");
const fs = require("fs");
const upload = require("../config/multer");
const multer = require("multer");
const { eFuncionario } = require("../helpers/eFuncionario");
const alteracaoAlunoImagem = upload
  .alteracao_aluno_imagem()
  .array("imagem_alteracao_chamado", 3);
const alteracaoProfessorImagem = upload
  .alteracao_professor_imagem()
  .array("imagem_alteracao_chamado", 3);
const funcionario_perfil = upload
  .upload_funcionario()
  .single("funcionario_foto");
var aluno1;
var professor1;
var chamado1;
var relatorio1;
var usuario;
var foto_funcionario;

/*pagina inicial do funcionario*/
router.get("/", eFuncionario, (req, res) => {
  try {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }
  } catch (error) {
    var funcionario_matricula = null;
  }

  bd3.select_funcionario_usuario(funcionario_matricula).then((funcionario) => {
    if (funcionario === "vazio") {
      res.render("funcionario/index", {
        usuario: "[Você não devia estar aqui!!!]",
        foto: funcionario[0].foto_perfil,
      });
    } else if (funcionario === "error") {
      res.render("funcionario/index", {
        usuario: "[Error com o nome do usuário]",
        foto: funcionario[0].foto_perfil,
      });
    } else {
      foto_funcionario = funcionario[0].foto_perfil;
      res.render("funcionario/index", {
        usuario: funcionario[0].usuario,
        foto: funcionario[0].foto_perfil,
        matricula: funcionario_matricula,
      });
    }
  });
});

router.post("/", eFuncionario, (req, res) => {
  funcionario_perfil(req, res, () => {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_funcionario !== "undefined") {
      fs.unlink("./public/upload/funcionario/" + foto_funcionario, () => {});
    }

    bd3
      .update_foto_funcionario({
        foto_perfil: req.file.filename,
        matricula: funcionario_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do funcionario");
        } else {
          res.redirect("/funcionario");
        }
      });
  });
});

/*inclusão de dados do aluno*/
router.get("/cadastrar-aluno", eFuncionario, (req, res) => {
  try {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }
  } catch (error) {
    var funcionario_matricula = null;
  }

  bd3.select_funcionario_usuario(funcionario_matricula).then((funcionario) => {
    if (funcionario === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      res.render("funcionario/cadastro_aluno", {
        usuario: "[Você não devia estar aqui!!!]",
        foto: funcionario[0].foto_perfil,
      });
    } else if (funcionario === "error") {
      usuario = "[Error com o nome do usuário]";
      res.render("funcionario/cadastro_aluno", {
        usuario: "[Error com o nome do usuário]",
        foto: funcionario[0].foto_perfil,
      });
    } else {
      usuario = funcionario[0].usuario;
      foto_funcionario = funcionario[0].foto_perfil;
      res.render("funcionario/cadastro_aluno", {
        usuario: funcionario[0].usuario,
        foto: funcionario[0].foto_perfil,
        matricula: funcionario_matricula,
      });
    }
  });
});

router.post("/cadastrar-aluno/foto", eFuncionario, (req, res) => {
  funcionario_perfil(req, res, () => {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_funcionario !== "undefined") {
      fs.unlink("./public/upload/funcionario/" + foto_funcionario, () => {});
    }

    bd3
      .update_foto_funcionario({
        foto_perfil: req.file.filename,
        matricula: funcionario_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do funcionario");
        } else {
          res.redirect("/funcionario/cadastrar-aluno");
        }
      });
  });
});

router.post("/cadastrar-aluno/nova", eFuncionario, (req, res) => {
  try {
    if (req.user[0].eAdmin != 0) {
      usuario = "[Você não devia estar aqui!!!]";
    } else if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    }
  } catch (error) {
    usuario = "[Você não devia estar aqui!!!]";
  }
  var dados = {
    matricula: req.body.matricula,
    usuario: req.body.usuario,
    email: req.body.email,
    celular: req.body.celular,
    residencial: req.body.residencial,
    senha: req.body.senha,
    senha2: req.body.senha2,
  };
  var error;
  if (
    !req.body.matricula ||
    typeof req.body.matricula === undefined ||
    req.body.matricula === null
  ) {
    error = "Matricula invalida";
    res.render("funcionario/cadastro_aluno", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else if (
    !req.body.usuario ||
    typeof req.body.usuario === undefined ||
    req.body.usuario === null
  ) {
    error = "Usuario invalido";
    res.render("funcionario/cadastro_aluno", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else if (
    !req.body.email ||
    typeof req.body.email === undefined ||
    req.body.email === null
  ) {
    error = "Email invalido";
    res.render("funcionario/cadastro_aluno", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else if (
    !req.body.celular ||
    typeof req.body.celular === undefined ||
    req.body.celular === null
  ) {
    error = "Telefone celular invalido";
    res.render("funcionario/cadastro_aluno", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else if (req.body.celular.length < 15) {
    error = "Número de celular invalido";
    res.render("funcionario/cadastro_aluno", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else if (req.body.residencial && req.body.residencial.length < 14) {
    error = "Número residencial invalido";
    res.render("funcionario/cadastro_aluno", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else if (
    !req.body.senha ||
    typeof req.body.senha === undefined ||
    req.body.senha === null
  ) {
    error = "Senha invalida";
    res.render("funcionario/cadastro_aluno", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else if (
    !req.body.senha2 ||
    typeof req.body.senha2 === undefined ||
    req.body.senha2 === null
  ) {
    error = "Repetição de senha invalida";
    res.render("funcionario/cadastro_aluno", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else if (req.body.senha !== req.body.senha2) {
    error = "Senhas diferentes";
    res.render("funcionario/cadastro_aluno", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else if (req.body.senha.length <= 7 || req.body.senha2.length <= 7) {
    error = "A senha deve ter no mínimo 8 caracteres";
    res.render("funcionario/cadastro_aluno", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/cadastro_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          dados,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/cadastro_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              dados,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/cadastro_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  dados,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/cadastro_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      dados,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/cadastro_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          dados,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/cadastro_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              dados,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("funcionario/cadastro_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_funcionario,
                                  matricula: funcionario_matricula,
                                  dados,
                                });
                              } else {
                                bd1
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render("funcionario/cadastro_aluno", {
                                        usuario,
                                        error,
                                        foto: foto_funcionario,
                                        matricula: funcionario_matricula,
                                        dados,
                                      });
                                    } else {
                                      bd3
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render(
                                              "funcionario/cadastro_aluno",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_funcionario,
                                                matricula:
                                                  funcionario_matricula,
                                                dados,
                                              }
                                            );
                                          } else {
                                            bd.select_residencial(
                                              req.body.residencial
                                            ).then((msg) => {
                                              if (msg) {
                                                error = msg;
                                                res.render(
                                                  "funcionario/cadastro_aluno",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_funcionario,
                                                    matricula:
                                                      funcionario_matricula,
                                                    dados,
                                                  }
                                                );
                                              } else {
                                                bd1
                                                  .select_residencial(
                                                    req.body.residencial
                                                  )
                                                  .then((msg) => {
                                                    if (msg) {
                                                      error = msg;
                                                      res.render(
                                                        "funcionario/cadastro_aluno",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_funcionario,
                                                          matricula:
                                                            funcionario_matricula,
                                                          dados,
                                                        }
                                                      );
                                                    } else {
                                                      bd3
                                                        .select_residencial(
                                                          req.body.residencial
                                                        )
                                                        .then((msg) => {
                                                          if (msg) {
                                                            error = msg;
                                                            res.render(
                                                              "funcionario/cadastro_aluno",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_funcionario,
                                                                matricula:
                                                                  funcionario_matricula,
                                                                dados,
                                                              }
                                                            );
                                                          } else {
                                                            bd.select_senha(
                                                              req.body.senha
                                                            ).then((msg) => {
                                                              if (msg) {
                                                                error = msg;
                                                                res.render(
                                                                  "funcionario/cadastro_aluno",
                                                                  {
                                                                    usuario,
                                                                    error,
                                                                    foto: foto_funcionario,
                                                                    matricula:
                                                                      funcionario_matricula,
                                                                    dados,
                                                                  }
                                                                );
                                                              } else {
                                                                bd1
                                                                  .select_senha(
                                                                    req.body
                                                                      .senha
                                                                  )
                                                                  .then(
                                                                    (msg) => {
                                                                      if (msg) {
                                                                        error =
                                                                          msg;
                                                                        res.render(
                                                                          "funcionario/cadastro_aluno",
                                                                          {
                                                                            usuario,
                                                                            error,
                                                                            foto: foto_funcionario,
                                                                            matricula:
                                                                              funcionario_matricula,
                                                                            dados,
                                                                          }
                                                                        );
                                                                      } else {
                                                                        bd3
                                                                          .select_senha(
                                                                            req
                                                                              .body
                                                                              .senha
                                                                          )
                                                                          .then(
                                                                            (
                                                                              msg
                                                                            ) => {
                                                                              if (
                                                                                msg
                                                                              ) {
                                                                                error =
                                                                                  msg;
                                                                                res.render(
                                                                                  "funcionario/cadastro_aluno",
                                                                                  {
                                                                                    usuario,
                                                                                    error,
                                                                                    foto: foto_funcionario,
                                                                                    matricula:
                                                                                      funcionario_matricula,
                                                                                    dados,
                                                                                  }
                                                                                );
                                                                              } else {
                                                                                bd.insert_aluno(
                                                                                  {
                                                                                    matricula:
                                                                                      req
                                                                                        .body
                                                                                        .matricula,
                                                                                    usuario:
                                                                                      req
                                                                                        .body
                                                                                        .usuario,
                                                                                    email:
                                                                                      req
                                                                                        .body
                                                                                        .email,
                                                                                    celular:
                                                                                      req
                                                                                        .body
                                                                                        .celular,
                                                                                    residencial:
                                                                                      req
                                                                                        .body
                                                                                        .residencial,
                                                                                    senha:
                                                                                      req
                                                                                        .body
                                                                                        .senha,
                                                                                  }
                                                                                ).then(
                                                                                  (
                                                                                    msg
                                                                                  ) => {
                                                                                    if (
                                                                                      msg
                                                                                    ) {
                                                                                      error =
                                                                                        msg;
                                                                                      res.render(
                                                                                        "funcionario/cadastro_aluno",
                                                                                        {
                                                                                          usuario,
                                                                                          error,
                                                                                          foto: foto_funcionario,
                                                                                          matricula:
                                                                                            funcionario_matricula,
                                                                                          dados,
                                                                                        }
                                                                                      );
                                                                                    } else {
                                                                                      var sucesso =
                                                                                        "aluno cadastrado com sucesso";
                                                                                      res.render(
                                                                                        "funcionario/cadastro_aluno",
                                                                                        {
                                                                                          usuario,
                                                                                          foto: foto_funcionario,
                                                                                          matricula:
                                                                                            funcionario_matricula,
                                                                                          sucesso,
                                                                                        }
                                                                                      );
                                                                                    }
                                                                                  }
                                                                                );
                                                                              }
                                                                            }
                                                                          );
                                                                      }
                                                                    }
                                                                  );
                                                              }
                                                            });
                                                          }
                                                        });
                                                    }
                                                  });
                                              }
                                            });
                                          }
                                        });
                                    }
                                  });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
});

/*inclusão de dados do professor*/
router.get("/cadastrar-professor", eFuncionario, (req, res) => {
  try {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }
  } catch (error) {
    var funcionario_matricula = null;
  }

  bd3.select_funcionario_usuario(funcionario_matricula).then((funcionario) => {
    if (funcionario === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      res.render("funcionario/cadastro_professor", {
        usuario: "[Você não devia estar aqui!!!]",
        foto: funcionario[0].foto_perfil,
      });
    } else if (funcionario === "error") {
      usuario = "[Error com o nome do usuário]";
      res.render("funcionario/cadastro_professor", {
        usuario: "[Error com o nome do usuário]",
        foto: funcionario[0].foto_perfil,
      });
    } else {
      usuario = funcionario[0].usuario;
      foto_funcionario = funcionario[0].foto_perfil;
      res.render("funcionario/cadastro_professor", {
        usuario: funcionario[0].usuario,
        foto: funcionario[0].foto_perfil,
        matricula: funcionario_matricula,
      });
    }
  });
});

router.post("/cadastrar-professor/foto", eFuncionario, (req, res) => {
  funcionario_perfil(req, res, () => {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_funcionario !== "undefined") {
      fs.unlink("./public/upload/funcionario/" + foto_funcionario, () => {});
    }

    bd3
      .update_foto_funcionario({
        foto_perfil: req.file.filename,
        matricula: funcionario_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do funcionario");
        } else {
          res.redirect("/funcionario/cadastrar-professor");
        }
      });
  });
});

router.post("/cadastrar-professor/nova", eFuncionario, (req, res) => {
  try {
    if (req.user[0].eAdmin != 0) {
      usuario = "[Você não devia estar aqui!!!]";
    } else if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    }
  } catch (error) {
    usuario = "[Você não devia estar aqui!!!]";
  }
  var dados = {
    matricula: req.body.matricula,
    usuario: req.body.usuario,
    email: req.body.email,
    celular: req.body.celular,
    residencial: req.body.residencial,
    senha: req.body.senha,
    senha2: req.body.senha2,
  };
  var error;
  if (
    !req.body.matricula ||
    typeof req.body.matricula === undefined ||
    req.body.matricula === null
  ) {
    error = "Matricula invalida";
    res.render("funcionario/cadastro_professor", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else if (
    !req.body.usuario ||
    typeof req.body.usuario === undefined ||
    req.body.usuario === null
  ) {
    error = "Usuário invalido";
    res.render("funcionario/cadastro_professor", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else if (
    !req.body.email ||
    typeof req.body.email === undefined ||
    req.body.email === null
  ) {
    error = "Email invalido";
    res.render("funcionario/cadastro_professor", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else if (
    !req.body.celular ||
    typeof req.body.celular === undefined ||
    req.body.celular === null
  ) {
    error = "Telefone celular invalido";
    res.render("funcionario/cadastro_professor", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else if (req.body.celular.length < 15) {
    error = "Número de celular invalido";
    res.render("funcionario/cadastro_professor", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else if (req.body.residencial && req.body.residencial.length < 14) {
    error = "Número residencial invalido";
    res.render("funcionario/cadastro_professor", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else if (
    !req.body.senha ||
    typeof req.body.senha === undefined ||
    req.body.senha === null
  ) {
    error = "Senha invalida";
    res.render("funcionario/cadastro_professor", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else if (
    !req.body.senha2 ||
    typeof req.body.senha2 === undefined ||
    req.body.senha2 === null
  ) {
    error = "Repetição de senha invalida";
    res.render("funcionario/cadastro_professor", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else if (req.body.senha !== req.body.senha2) {
    error = "Senhas diferentes";
    res.render("funcionario/cadastro_professor", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else if (req.body.senha.length <= 7 || req.body.senha2.length <= 7) {
    error = "A senha deve ter no mínimo 8 caracteres";
    res.render("funcionario/cadastro_professor", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/cadastro_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          dados,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/cadastro_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              dados,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/cadastro_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  dados,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/cadastro_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      dados,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/cadastro_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          dados,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/cadastro_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              dados,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("funcionario/cadastro_professor", {
                                  usuario,
                                  error,
                                  foto: foto_funcionario,
                                  matricula: funcionario_matricula,
                                  dados,
                                });
                              } else {
                                bd1
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render(
                                        "funcionario/cadastro_professor",
                                        {
                                          usuario,
                                          error,
                                          foto: foto_funcionario,
                                          matricula: funcionario_matricula,
                                          dados,
                                        }
                                      );
                                    } else {
                                      bd3
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render(
                                              "funcionario/cadastro_professor",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_funcionario,
                                                matricula:
                                                  funcionario_matricula,
                                                dados,
                                              }
                                            );
                                          } else {
                                            bd.select_residencial(
                                              req.body.residencial
                                            ).then((msg) => {
                                              if (msg) {
                                                error = msg;
                                                res.render(
                                                  "funcionario/cadastro_professor",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_funcionario,
                                                    matricula:
                                                      funcionario_matricula,
                                                    dados,
                                                  }
                                                );
                                              } else {
                                                bd1
                                                  .select_residencial(
                                                    req.body.residencial
                                                  )
                                                  .then((msg) => {
                                                    if (msg) {
                                                      error = msg;
                                                      res.render(
                                                        "funcionario/cadastro_professor",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_funcionario,
                                                          matricula:
                                                            funcionario_matricula,
                                                          dados,
                                                        }
                                                      );
                                                    } else {
                                                      bd3
                                                        .select_residencial(
                                                          req.body.residencial
                                                        )
                                                        .then((msg) => {
                                                          if (msg) {
                                                            error = msg;
                                                            res.render(
                                                              "funcionario/cadastro_professor",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_funcionario,
                                                                matricula:
                                                                  funcionario_matricula,
                                                                dados,
                                                              }
                                                            );
                                                          } else {
                                                            bd.select_senha(
                                                              req.body.senha
                                                            ).then((msg) => {
                                                              if (msg) {
                                                                error = msg;
                                                                res.render(
                                                                  "funcionario/cadastro_professor",
                                                                  {
                                                                    usuario,
                                                                    error,
                                                                    foto: foto_funcionario,
                                                                    matricula:
                                                                      funcionario_matricula,
                                                                    dados,
                                                                  }
                                                                );
                                                              } else {
                                                                bd1
                                                                  .select_senha(
                                                                    req.body
                                                                      .senha
                                                                  )
                                                                  .then(
                                                                    (msg) => {
                                                                      if (msg) {
                                                                        error =
                                                                          msg;
                                                                        res.render(
                                                                          "funcionario/cadastro_professor",
                                                                          {
                                                                            usuario,
                                                                            error,
                                                                            foto: foto_funcionario,
                                                                            matricula:
                                                                              funcionario_matricula,
                                                                            dados,
                                                                          }
                                                                        );
                                                                      } else {
                                                                        bd3
                                                                          .select_senha(
                                                                            req
                                                                              .body
                                                                              .senha
                                                                          )
                                                                          .then(
                                                                            (
                                                                              msg
                                                                            ) => {
                                                                              if (
                                                                                msg
                                                                              ) {
                                                                                error =
                                                                                  msg;
                                                                                res.render(
                                                                                  "funcionario/cadastro_professor",
                                                                                  {
                                                                                    usuario,
                                                                                    error,
                                                                                    foto: foto_funcionario,
                                                                                    matricula:
                                                                                      funcionario_matricula,
                                                                                    dados,
                                                                                  }
                                                                                );
                                                                              } else {
                                                                                bd1
                                                                                  .insert_professor(
                                                                                    {
                                                                                      matricula:
                                                                                        req
                                                                                          .body
                                                                                          .matricula,
                                                                                      usuario:
                                                                                        req
                                                                                          .body
                                                                                          .usuario,
                                                                                      email:
                                                                                        req
                                                                                          .body
                                                                                          .email,
                                                                                      celular:
                                                                                        req
                                                                                          .body
                                                                                          .celular,
                                                                                      residencial:
                                                                                        req
                                                                                          .body
                                                                                          .residencial,
                                                                                      senha:
                                                                                        req
                                                                                          .body
                                                                                          .senha,
                                                                                    }
                                                                                  )
                                                                                  .then(
                                                                                    (
                                                                                      msg
                                                                                    ) => {
                                                                                      if (
                                                                                        msg
                                                                                      ) {
                                                                                        error =
                                                                                          msg;
                                                                                        res.render(
                                                                                          "funcionario/cadastro_professor",
                                                                                          {
                                                                                            usuario,
                                                                                            error,
                                                                                            foto: foto_funcionario,
                                                                                            matricula:
                                                                                              funcionario_matricula,
                                                                                            dados,
                                                                                          }
                                                                                        );
                                                                                      } else {
                                                                                        var sucesso =
                                                                                          "Professor cadastrado com sucesso";
                                                                                        res.render(
                                                                                          "funcionario/cadastro_professor",
                                                                                          {
                                                                                            usuario,
                                                                                            foto: foto_funcionario,
                                                                                            matricula:
                                                                                              funcionario_matricula,
                                                                                            sucesso,
                                                                                          }
                                                                                        );
                                                                                      }
                                                                                    }
                                                                                  );
                                                                              }
                                                                            }
                                                                          );
                                                                      }
                                                                    }
                                                                  );
                                                              }
                                                            });
                                                          }
                                                        });
                                                    }
                                                  });
                                              }
                                            });
                                          }
                                        });
                                    }
                                  });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
});

/*inclusão de relatorio*/
router.get("/cadastrar-relatorio", eFuncionario, (req, res) => {
  try {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }
  } catch (error) {
    var funcionario_matricula = null;
  }

  bd3.select_funcionario_usuario(funcionario_matricula).then((funcionario) => {
    if (funcionario === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      res.render("funcionario/cadastro_relatorio", {
        usuario: "[Você não devia estar aqui!!!]",
        foto: funcionario[0].foto_perfil,
      });
    } else if (funcionario === "error") {
      usuario = "[Error com o nome do usuário]";
      res.render("funcionario/cadastro_relatorio", {
        usuario: "[Error com o nome do usuário]",
        foto: funcionario[0].foto_perfil,
      });
    } else {
      usuario = funcionario[0].usuario;
      foto_funcionario = funcionario[0].foto_perfil;
      res.render("funcionario/cadastro_relatorio", {
        usuario: funcionario[0].usuario,
        foto: funcionario[0].foto_perfil,
        matricula: funcionario_matricula,
      });
    }
  });
});

router.post("/cadastrar-relatorio/foto", eFuncionario, (req, res) => {
  funcionario_perfil(req, res, () => {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_funcionario !== "undefined") {
      fs.unlink("./public/upload/funcionario/" + foto_funcionario, () => {});
    }

    bd3
      .update_foto_funcionario({
        foto_perfil: req.file.filename,
        matricula: funcionario_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do funcionario");
        } else {
          res.redirect("/funcionario/cadastrar-relatorio");
        }
      });
  });
});

router.post("/cadastrar-relatorio/nova", eFuncionario, (req, res) => {
  try {
    if (req.user[0].eAdmin != 0) {
      usuario = "[Você não devia estar aqui!!!]";
    } else if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    }
  } catch (error) {
    usuario = "[Você não devia estar aqui!!!]";
  }

  var dados = {
    titulo: req.body.titulo,
    relatorio: req.body.relatorio,
  };
  var error;
  if (req.user[0].eAdmin == 0) {
    var funcionario_matricula = req.user[0].matricula;
  } else {
    var funcionario_matricula = null;
  }
  if (
    !req.body.titulo ||
    typeof req.body.titulo === undefined ||
    req.body.titulo === null
  ) {
    error = "título invalido";
    res.render("funcionario/cadastro_relatorio", { usuario, error, dados });
  } else if (
    !req.body.conteudo ||
    typeof req.body.conteudo === undefined ||
    req.body.conteudo === null
  ) {
    error = "relatório invalido";
    res.render("funcionario/cadastro_relatorio", { usuario, error, dados });
  } else {
    bd3
      .insert_relatorio({
        titulo: req.body.titulo,
        conteudo: req.body.conteudo,
        fk_funcionario: funcionario_matricula,
      })
      .then((msg) => {
        if (msg === "error") {
          error = "Error no sistema, tente novamente mais tarde";
          res.render("funcionario/cadastro_relatorio", {
            usuario,
            error,
            dados,
          });
        } else {
          sucesso = "Relatório cadastrado com sucesso";
          res.render("funcionario/cadastro_relatorio", {
            usuario,
            sucesso,
            dados,
          });
        }
      });
  }
});

/*seleção de dados do professor*/
router.get("/professor", eFuncionario, (req, res) => {
  try {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }
  } catch (error) {
    var funcionario_matricula = null;
  }

  bd3.select_funcionario_usuario(funcionario_matricula).then((funcionario) => {
    if (funcionario === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_funcionario = funcionario[0].foto_perfil;
    } else if (funcionario === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_funcionario = funcionario[0].foto_perfil;
    } else {
      usuario = funcionario[0].usuario;
      foto_funcionario = funcionario[0].foto_perfil;
    }
  });
  bd1.select_professorAll().then((professor) => {
    if (professor === "Error") {
      var error_mensagem = "Error no sistema tente novamente mais tarde";
      res.render("funcionario/professores", {
        usuario,
        foto: foto_funcionario,
        matricula: funcionario_matricula,
        error_mensagem,
      });
    } else if (professor === "vazio") {
      var aviso_mensagem = "!!! Nenhum professor cadastrado no sistema !!!";
      res.render("funcionario/professores", {
        usuario,
        foto: foto_funcionario,
        matricula: funcionario_matricula,
        aviso_mensagem,
      });
    } else {
      res.render("funcionario/professores", {
        usuario,
        foto: foto_funcionario,
        matricula: funcionario_matricula,
        professor,
      });
    }
  });
});

router.post("/professor/foto", eFuncionario, (req, res) => {
  funcionario_perfil(req, res, () => {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_funcionario !== "undefined") {
      fs.unlink("./public/upload/funcionario/" + foto_funcionario, () => {});
    }

    bd3
      .update_foto_funcionario({
        foto_perfil: req.file.filename,
        matricula: funcionario_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do funcionario");
        } else {
          res.redirect("/funcionario/professor");
        }
      });
  });
});

/*seleção de dados do aluno*/
router.get("/aluno", eFuncionario, (req, res) => {
  try {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }
  } catch (error) {
    var funcionario_matricula = null;
  }

  bd3.select_funcionario_usuario(funcionario_matricula).then((funcionario) => {
    if (funcionario === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_funcionario = funcionario[0].foto_perfil;
    } else if (funcionario === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_funcionario = funcionario[0].foto_perfil;
    } else {
      usuario = funcionario[0].usuario;
      foto_funcionario = funcionario[0].foto_perfil;
    }
  });
  bd.select_alunoAll().then((aluno) => {
    if (aluno === "Error") {
      var error_mensagem = "Error no sistema tente novamente mais tarde";
      res.render("funcionario/alunos", {
        usuario,
        foto: foto_funcionario,
        matricula: funcionario_matricula,
        error_mensagem,
      });
    } else if (aluno === "vazio") {
      var aviso_mensagem = "!!! Nenhum aluno cadastrado no sistema !!!";
      res.render("funcionario/alunos", {
        usuario,
        foto: foto_funcionario,
        matricula: funcionario_matricula,
        aviso_mensagem,
      });
    } else {
      res.render("funcionario/alunos", {
        usuario,
        foto: foto_funcionario,
        matricula: funcionario_matricula,
        aluno,
      });
    }
  });
});

router.post("/aluno/foto", eFuncionario, (req, res) => {
  funcionario_perfil(req, res, () => {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_funcionario !== "undefined") {
      fs.unlink("./public/upload/funcionario/" + foto_funcionario, () => {});
    }

    bd3
      .update_foto_funcionario({
        foto_perfil: req.file.filename,
        matricula: funcionario_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do funcionario");
        } else {
          res.redirect("/funcionario/aluno");
        }
      });
  });
});

/*seleção de dados do relatorio*/
router.get("/relatorio", eFuncionario, (req, res) => {
  try {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }
  } catch (error) {
    var funcionario_matricula = null;
  }

  bd3.select_funcionario_usuario(funcionario_matricula).then((funcionario) => {
    if (funcionario === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_funcionario = funcionario[0].foto_perfil;
    } else if (funcionario === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_funcionario = funcionario[0].foto_perfil;
    } else {
      usuario = funcionario[0].usuario;
      foto_funcionario = funcionario[0].foto_perfil;
    }
  });
  bd3.select_relatorio_funcionario(req.user).then((relatorio) => {
    if (relatorio === "Error") {
      var error_mensagem = "Error no sistema tente novamente mais tarde";
      res.render("funcionario/relatorios", {
        usuario,
        foto: foto_funcionario,
        matricula: funcionario_matricula,
        error_mensagem,
      });
    } else if (relatorio === "matricula") {
      error_mensagem = "Você não é funcionário, o que você tá fazendo aqui?";
      res.render("funcionario/relatorios", { usuario, error_mensagem });
    } else if (relatorio === "vazio") {
      var aviso_mensagem = "!!! Nenhum relatório cadastrado no sistema !!!";
      res.render("funcionario/relatorios", {
        usuario,
        foto: foto_funcionario,
        matricula: funcionario_matricula,
        aviso_mensagem,
      });
    } else {
      res.render("funcionario/relatorios", {
        usuario,
        foto: foto_funcionario,
        matricula: funcionario_matricula,
        relatorio,
      });
    }
  });
});

router.post("/relatorio/foto", eFuncionario, (req, res) => {
  funcionario_perfil(req, res, () => {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_funcionario !== "undefined") {
      fs.unlink("./public/upload/funcionario/" + foto_funcionario, () => {});
    }

    bd3
      .update_foto_funcionario({
        foto_perfil: req.file.filename,
        matricula: funcionario_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do funcionario");
        } else {
          res.redirect("/funcionario/relatorio");
        }
      });
  });
});

/*seleção de dados do chamado*/
router.get("/chamado", eFuncionario, (req, res) => {
  try {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }
  } catch (error) {
    var funcionario_matricula = null;
  }

  bd3.select_funcionario_usuario(funcionario_matricula).then((funcionario) => {
    if (funcionario === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_funcionario = funcionario[0].foto_perfil;
    } else if (funcionario === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_funcionario = funcionario[0].foto_perfil;
    } else {
      usuario = funcionario[0].usuario;
      foto_funcionario = funcionario[0].foto_perfil;
    }
  });
  bd2.select_chamadoAll().then((chamado) => {
    if (chamado === "Error") {
      var error_mensagem = "Error no sistema tente novamente mais tarde";
      res.render("funcionario/chamado", {
        usuario,
        foto: foto_funcionario,
        matricula: funcionario_matricula,
        error_mensagem,
      });
    } else if (chamado === "vazio") {
      var aviso_mensagem = "!!! Nenhum chamado cadastrado no sistema !!!";
      res.render("funcionario/chamado", {
        usuario,
        foto: foto_funcionario,
        matricula: funcionario_matricula,
        aviso_mensagem,
      });
    } else {
      chamado.forEach((valor, i) => {
        if (chamado[i].statusd == "Aberto") {
          chamado[i].i1 = "algo";
        } else if (chamado[i].statusd == "Em Atendimento") {
          chamado[i].i2 = "algo";
        } else if (chamado[i].statusd == "Fechado") {
          chamado[i].i3 = "algo";
        }
      });
      res.render("funcionario/chamado", {
        usuario,
        foto: foto_funcionario,
        matricula: funcionario_matricula,
        chamado,
      });
    }
  });
});

router.post("/chamado/foto", eFuncionario, (req, res) => {
  funcionario_perfil(req, res, () => {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_funcionario !== "undefined") {
      fs.unlink("./public/upload/funcionario/" + foto_funcionario, () => {});
    }

    bd3
      .update_foto_funcionario({
        foto_perfil: req.file.filename,
        matricula: funcionario_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do funcionario");
        } else {
          res.redirect("/funcionario/chamado");
        }
      });
  });
});

/*alteração de dados do relatorio*/
router.get("/relatorio/alteracao/:id", eFuncionario, (req, res) => {
  try {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }
  } catch (error) {
    var funcionario_matricula = null;
  }

  bd3.select_funcionario_usuario(funcionario_matricula).then((funcionario) => {
    if (funcionario === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_funcionario = funcionario[0].foto_perfil;
    } else if (funcionario === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_funcionario = funcionario[0].foto_perfil;
    } else {
      usuario = funcionario[0].usuario;
      foto_funcionario = funcionario[0].foto_perfil;
    }
  });
  bd3.select_relatorio1(req.params.id).then((relatorio) => {
    if (relatorio === "vazio") {
      req.flash("error_msg", "relatorio não encontrado");
      res.redirect("/funcionario/relatorio");
    } else if (relatorio === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("funcionario/relatorio");
    } else {
      relatorio = relatorio[0];
      relatorio1 = relatorio;
      res.render("funcionario/edicao_relatorio", {
        usuario,
        foto: foto_funcionario,
        matricula: funcionario_matricula,
        relatorio,
      });
    }
  });
});

router.post("/relatorio/alteracao/foto", eFuncionario, (req, res) => {
  funcionario_perfil(req, res, () => {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_funcionario !== "undefined") {
      fs.unlink("./public/upload/funcionario/" + foto_funcionario, () => {});
    }

    bd3
      .update_foto_funcionario({
        foto_perfil: req.file.filename,
        matricula: funcionario_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do funcionario");
        } else {
          res.redirect("/funcionario/relatorio/alteracao/" + relatorio1.id);
        }
      });
  });
});

router.post("/relatorio/alteracao/", eFuncionario, (req, res) => {
  try {
    if (req.user[0].eAdmin != 0) {
      usuario = "[Você não devia estar aqui!!!]";
    } else if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    }
  } catch (error) {
    usuario = "[Você não devia estar aqui!!!]";
  }
  var error;
  if (
    !req.body.titulo ||
    typeof req.body.titulo === undefined ||
    req.body.titulo === null
  ) {
    error = "Título invalido";
    res.render("funcionario/edicao_relatorio", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      relatorio: relatorio1,
    });
  } else if (
    !req.body.conteudo ||
    typeof req.body.conteudo === undefined ||
    req.body.conteudo === null
  ) {
    error = "Relatório invalido";
    res.render("funcionario/edicao_relatorio", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      relatorio: relatorio1,
    });
  } else {
    bd3
      .update_relatorio({
        titulo: req.body.titulo,
        conteudo: req.body.conteudo,
        id: relatorio1.id,
      })
      .then((relatorio) => {
        if (relatorio === "error") {
          req.flash("error_msg", "Error no sistema tente novamente mais tarde");
          res.redirect("/funcionario/relatorio");
        } else {
          req.flash("sucess_msg", "Alteração do relatório feita com sucesso");
          res.redirect("/funcionario/relatorio");
        }
      });
  }
});

/*alteração de dados do professor*/
router.get("/professor/alteracao/:matricula", eFuncionario, (req, res) => {
  try {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }
  } catch (error) {
    var funcionario_matricula = null;
  }

  bd3.select_funcionario_usuario(funcionario_matricula).then((funcionario) => {
    if (funcionario === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_funcionario = funcionario[0].foto_perfil;
    } else if (funcionario === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_funcionario = funcionario[0].foto_perfil;
    } else {
      usuario = funcionario[0].usuario;
      foto_funcionario = funcionario[0].foto_perfil;
    }
  });
  bd1.select_professor1(req.params.matricula).then((professor) => {
    if (professor === "vazio") {
      req.flash("error_msg", "Professor não encontrado");
      res.redirect("/funcionario/professor");
    } else if (professor === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("funcionario/professor");
    } else {
      professor = professor[0];
      professor1 = professor;
      res.render("funcionario/edicao_professor", {
        usuario,
        foto: foto_funcionario,
        matricula: funcionario_matricula,
        professor,
      });
    }
  });
});

router.post("/professor/alteracao/foto", eFuncionario, (req, res) => {
  funcionario_perfil(req, res, () => {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_funcionario !== "undefined") {
      fs.unlink("./public/upload/funcionario/" + foto_funcionario, () => {});
    }

    bd3
      .update_foto_funcionario({
        foto_perfil: req.file.filename,
        matricula: funcionario_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do funcionario");
        } else {
          res.redirect(
            "/funcionario/professor/alteracao/" + professor1.matricula
          );
        }
      });
  });
});

router.post("/professor/alteracao/", eFuncionario, (req, res) => {
  try {
    if (req.user[0].eAdmin != 0) {
      usuario = "[Você não devia estar aqui!!!]";
    } else if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    }
  } catch (error) {
    usuario = "[Você não devia estar aqui!!!]";
  }
  var error;
  if (
    !req.body.matricula ||
    typeof req.body.matricula === undefined ||
    req.body.matricula === null
  ) {
    error = "Matricula invalida";
    res.render("funcionario/edicao_professor", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      professor: professor1,
    });
  } else if (
    !req.body.usuario ||
    typeof req.body.usuario === undefined ||
    req.body.usuario === null
  ) {
    error = "Usuário invalido";
    res.render("funcionario/edicao_professor", {
      usuario,
      error,
      professor: professor1,
    });
  } else if (
    !req.body.email ||
    typeof req.body.email === undefined ||
    req.body.email === null
  ) {
    error = "Email invalido";
    res.render("funcionario/edicao_professor", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      professor: professor1,
    });
  } else if (
    !req.body.celular ||
    typeof req.body.celular === undefined ||
    req.body.celular === null
  ) {
    error = "Telefone celular invalido";
    res.render("funcionario/edicao_professor", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      professor: professor1,
    });
  } else if (req.body.celular.length < 15) {
    error = "Número de celular invalido";
    res.render("funcionario/edicao_professor", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else if (req.body.residencial && req.body.residencial.length < 14) {
    error = "Número residencial invalido";
    res.render("funcionario/edicao_professor", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      dados,
    });
  } else if (req.body.senha !== req.body.senha2) {
    error = "Senhas diferentes";
    res.render("funcionario/edicao_professor", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      professor: professor1,
    });
  } else if (
    req.body.matricula != professor1.matricula &&
    req.body.email != professor1.email &&
    req.body.celular != professor1.telefone_celular &&
    req.body.residencial != professor1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("funcionario/edicao_professor", {
                                  usuario,
                                  error,
                                  foto: foto_funcionario,
                                  matricula: funcionario_matricula,
                                  professor: professor1,
                                });
                              } else {
                                bd1
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render(
                                        "funcionario/edicao_professor",
                                        {
                                          usuario,
                                          error,
                                          foto: foto_funcionario,
                                          matricula: funcionario_matricula,
                                          professor: professor1,
                                        }
                                      );
                                    } else {
                                      bd3
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render(
                                              "funcionario/edicao_professor",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_funcionario,
                                                matricula:
                                                  funcionario_matricula,
                                                professor: professor1,
                                              }
                                            );
                                          } else {
                                            bd.select_residencial(
                                              req.body.residencial
                                            ).then((msg) => {
                                              if (msg) {
                                                error = msg;
                                                res.render(
                                                  "funcionario/edicao_professor",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_funcionario,
                                                    matricula:
                                                      funcionario_matricula,
                                                    professor: professor1,
                                                  }
                                                );
                                              } else {
                                                bd1
                                                  .select_residencial(
                                                    req.body.residencial
                                                  )
                                                  .then((msg) => {
                                                    if (msg) {
                                                      error = msg;
                                                      res.render(
                                                        "funcionario/edicao_professor",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_funcionario,
                                                          matricula:
                                                            funcionario_matricula,
                                                          professor: professor1,
                                                        }
                                                      );
                                                    } else {
                                                      bd3
                                                        .select_residencial(
                                                          req.body.residencial
                                                        )
                                                        .then((msg) => {
                                                          if (msg) {
                                                            error = msg;
                                                            res.render(
                                                              "funcionario/edicao_professor",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_funcionario,
                                                                matricula:
                                                                  funcionario_matricula,
                                                                professor:
                                                                  professor1,
                                                              }
                                                            );
                                                          } else if (
                                                            req.body.senha
                                                              .length <= 7 ||
                                                            req.body.senha2
                                                              .length <= 7
                                                          ) {
                                                            error =
                                                              "A senha deve ter no mínimo 8 caracteres";
                                                            res.render(
                                                              "funcionario/edicao_professor",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_funcionario,
                                                                matricula:
                                                                  funcionario_matricula,
                                                                professor:
                                                                  professor1,
                                                              }
                                                            );
                                                          } else {
                                                            bd.select_senha(
                                                              req.body.senha
                                                            ).then((msg) => {
                                                              if (msg) {
                                                                error = msg;
                                                                res.render(
                                                                  "funcionario/edicao_professor",
                                                                  {
                                                                    usuario,
                                                                    error,
                                                                    foto: foto_funcionario,
                                                                    matricula:
                                                                      funcionario_matricula,
                                                                    professor:
                                                                      professor1,
                                                                  }
                                                                );
                                                              } else {
                                                                bd1
                                                                  .select_senha(
                                                                    req.body
                                                                      .senha
                                                                  )
                                                                  .then(
                                                                    (msg) => {
                                                                      if (msg) {
                                                                        error =
                                                                          msg;
                                                                        res.render(
                                                                          "funcionario/edicao_professor",
                                                                          {
                                                                            usuario,
                                                                            error,
                                                                            foto: foto_funcionario,
                                                                            matricula:
                                                                              funcionario_matricula,
                                                                            professor:
                                                                              professor1,
                                                                          }
                                                                        );
                                                                      } else {
                                                                        bd3
                                                                          .select_senha(
                                                                            req
                                                                              .body
                                                                              .senha
                                                                          )
                                                                          .then(
                                                                            (
                                                                              msg
                                                                            ) => {
                                                                              if (
                                                                                msg
                                                                              ) {
                                                                                error =
                                                                                  msg;
                                                                                res.render(
                                                                                  "funcionario/edicao_professor",
                                                                                  {
                                                                                    usuario,
                                                                                    error,
                                                                                    foto: foto_funcionario,
                                                                                    matricula:
                                                                                      funcionario_matricula,
                                                                                    professor:
                                                                                      professor1,
                                                                                  }
                                                                                );
                                                                              } else {
                                                                                bd1
                                                                                  .delete_update_professor(
                                                                                    {
                                                                                      matricula:
                                                                                        req
                                                                                          .body
                                                                                          .matricula,
                                                                                      usuario:
                                                                                        req
                                                                                          .body
                                                                                          .usuario,
                                                                                      email:
                                                                                        req
                                                                                          .body
                                                                                          .email,
                                                                                      celular:
                                                                                        req
                                                                                          .body
                                                                                          .celular,
                                                                                      residencial:
                                                                                        req
                                                                                          .body
                                                                                          .residencial,
                                                                                      senha:
                                                                                        req
                                                                                          .body
                                                                                          .senha,
                                                                                      matricula1:
                                                                                        professor1.matricula,
                                                                                    }
                                                                                  )
                                                                                  .then(
                                                                                    (
                                                                                      professor
                                                                                    ) => {
                                                                                      if (
                                                                                        professor ===
                                                                                        "error"
                                                                                      ) {
                                                                                        req.flash(
                                                                                          "error_msg",
                                                                                          "Error no sistema tente novamente mais tarde"
                                                                                        );
                                                                                        res.redirect(
                                                                                          "/funcionario/professor"
                                                                                        );
                                                                                      } else {
                                                                                        req.flash(
                                                                                          "sucess_msg",
                                                                                          "Alteração do professor feita com sucesso"
                                                                                        );
                                                                                        res.redirect(
                                                                                          "/funcionario/professor"
                                                                                        );
                                                                                      }
                                                                                    }
                                                                                  );
                                                                              }
                                                                            }
                                                                          );
                                                                      }
                                                                    }
                                                                  );
                                                              }
                                                            });
                                                          }
                                                        });
                                                    }
                                                  });
                                              }
                                            });
                                          }
                                        });
                                    }
                                  });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != professor1.matricula &&
    req.body.celular != professor1.telefone_celular &&
    req.body.residencial != professor1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("funcionario/edicao_professor", {
                                    usuario,
                                    error,
                                    foto: foto_funcionario,
                                    matricula: funcionario_matricula,
                                    professor: professor1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render(
                                          "funcionario/edicao_professor",
                                          {
                                            usuario,
                                            error,
                                            foto: foto_funcionario,
                                            matricula: funcionario_matricula,
                                            professor: professor1,
                                          }
                                        );
                                      } else {
                                        bd3
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "funcionario/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  professor: professor1,
                                                }
                                              );
                                            } else if (
                                              req.body.senha.length <= 7 ||
                                              req.body.senha2.length <= 7
                                            ) {
                                              error =
                                                "A senha deve ter no mínimo 8 caracteres";
                                              res.render(
                                                "funcionario/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  professor: professor1,
                                                }
                                              );
                                            } else {
                                              bd.select_senha(
                                                req.body.senha
                                              ).then((msg) => {
                                                if (msg) {
                                                  error = msg;
                                                  res.render(
                                                    "funcionario/edicao_professor",
                                                    {
                                                      usuario,
                                                      error,
                                                      foto: foto_funcionario,
                                                      matricula:
                                                        funcionario_matricula,
                                                      professor: professor1,
                                                    }
                                                  );
                                                } else {
                                                  bd1
                                                    .select_senha(
                                                      req.body.senha
                                                    )
                                                    .then((msg) => {
                                                      if (msg) {
                                                        error = msg;
                                                        res.render(
                                                          "funcionario/edicao_professor",
                                                          {
                                                            usuario,
                                                            error,
                                                            foto: foto_funcionario,
                                                            matricula:
                                                              funcionario_matricula,
                                                            professor:
                                                              professor1,
                                                          }
                                                        );
                                                      } else {
                                                        bd3
                                                          .select_senha(
                                                            req.body.senha
                                                          )
                                                          .then((msg) => {
                                                            if (msg) {
                                                              error = msg;
                                                              res.render(
                                                                "funcionario/edicao_professor",
                                                                {
                                                                  usuario,
                                                                  error,
                                                                  foto: foto_funcionario,
                                                                  matricula:
                                                                    funcionario_matricula,
                                                                  professor:
                                                                    professor1,
                                                                }
                                                              );
                                                            } else {
                                                              bd1
                                                                .delete_update_professor(
                                                                  {
                                                                    matricula:
                                                                      req.body
                                                                        .matricula,
                                                                    usuario:
                                                                      req.body
                                                                        .usuario,
                                                                    email:
                                                                      req.body
                                                                        .email,
                                                                    celular:
                                                                      req.body
                                                                        .celular,
                                                                    residencial:
                                                                      req.body
                                                                        .residencial,
                                                                    senha:
                                                                      req.body
                                                                        .senha,
                                                                    matricula1:
                                                                      professor1.matricula,
                                                                  }
                                                                )
                                                                .then(
                                                                  (
                                                                    professor
                                                                  ) => {
                                                                    if (
                                                                      professor ===
                                                                      "error"
                                                                    ) {
                                                                      req.flash(
                                                                        "error_msg",
                                                                        "Error no sistema tente novamente mais tarde"
                                                                      );
                                                                      res.redirect(
                                                                        "/funcionario/professor"
                                                                      );
                                                                    } else {
                                                                      req.flash(
                                                                        "sucess_msg",
                                                                        "Alteração do professor feita com sucesso"
                                                                      );
                                                                      res.redirect(
                                                                        "/funcionario/professor"
                                                                      );
                                                                    }
                                                                  }
                                                                );
                                                            }
                                                          });
                                                      }
                                                    });
                                                }
                                              });
                                            }
                                          });
                                      }
                                    });
                                }
                              }
                            );
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != professor1.matricula &&
    req.body.email != professor1.email &&
    req.body.celular != professor1.telefone_celular &&
    req.body.residencial != professor1.telefone_residencial
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("funcionario/edicao_professor", {
                                  usuario,
                                  error,
                                  foto: foto_funcionario,
                                  matricula: funcionario_matricula,
                                  professor: professor1,
                                });
                              } else {
                                bd1
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render(
                                        "funcionario/edicao_professor",
                                        {
                                          usuario,
                                          error,
                                          foto: foto_funcionario,
                                          matricula: funcionario_matricula,
                                          professor: professor1,
                                        }
                                      );
                                    } else {
                                      bd3
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render(
                                              "funcionario/edicao_professor",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_funcionario,
                                                matricula:
                                                  funcionario_matricula,
                                                professor: professor1,
                                              }
                                            );
                                          } else {
                                            bd.select_residencial(
                                              req.body.residencial
                                            ).then((msg) => {
                                              if (msg) {
                                                error = msg;
                                                res.render(
                                                  "funcionario/edicao_professor",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_funcionario,
                                                    matricula:
                                                      funcionario_matricula,
                                                    professor: professor1,
                                                  }
                                                );
                                              } else {
                                                bd1
                                                  .select_residencial(
                                                    req.body.residencial
                                                  )
                                                  .then((msg) => {
                                                    if (msg) {
                                                      error = msg;
                                                      res.render(
                                                        "funcionario/edicao_professor",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_funcionario,
                                                          matricula:
                                                            funcionario_matricula,
                                                          professor: professor1,
                                                        }
                                                      );
                                                    } else {
                                                      bd3
                                                        .select_residencial(
                                                          req.body.residencial
                                                        )
                                                        .then((msg) => {
                                                          if (msg) {
                                                            error = msg;
                                                            res.render(
                                                              "funcionario/edicao_professor",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_funcionario,
                                                                matricula:
                                                                  funcionario_matricula,
                                                                professor:
                                                                  professor1,
                                                              }
                                                            );
                                                          } else {
                                                            bd1
                                                              .delete_update_professor(
                                                                {
                                                                  matricula:
                                                                    req.body
                                                                      .matricula,
                                                                  usuario:
                                                                    req.body
                                                                      .usuario,
                                                                  email:
                                                                    req.body
                                                                      .email,
                                                                  celular:
                                                                    req.body
                                                                      .celular,
                                                                  residencial:
                                                                    req.body
                                                                      .residencial,
                                                                  senha:
                                                                    professor1.senha,
                                                                  matricula1:
                                                                    professor1.matricula,
                                                                }
                                                              )
                                                              .then(
                                                                (professor) => {
                                                                  if (
                                                                    professor ===
                                                                    "error"
                                                                  ) {
                                                                    req.flash(
                                                                      "error_msg",
                                                                      "Error no sistema tente novamente mais tarde"
                                                                    );
                                                                    res.redirect(
                                                                      "/funcionario/professor"
                                                                    );
                                                                  } else {
                                                                    req.flash(
                                                                      "sucess_msg",
                                                                      "Alteração do professor feita com sucesso"
                                                                    );
                                                                    res.redirect(
                                                                      "/funcionario/professor"
                                                                    );
                                                                  }
                                                                }
                                                              );
                                                          }
                                                        });
                                                    }
                                                  });
                                              }
                                            });
                                          }
                                        });
                                    }
                                  });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != professor1.matricula &&
    req.body.email != professor1.email &&
    req.body.celular != professor1.telefone_celular &&
    req.body.senha != ""
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("funcionario/edicao_professor", {
                                  usuario,
                                  error,
                                  foto: foto_funcionario,
                                  matricula: funcionario_matricula,
                                  professor: professor1,
                                });
                              } else {
                                bd1
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render(
                                        "funcionario/edicao_professor",
                                        {
                                          usuario,
                                          error,
                                          foto: foto_funcionario,
                                          matricula: funcionario_matricula,
                                          professor: professor1,
                                        }
                                      );
                                    } else {
                                      bd3
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render(
                                              "funcionario/edicao_professor",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_funcionario,
                                                matricula:
                                                  funcionario_matricula,
                                                professor: professor1,
                                              }
                                            );
                                          } else if (
                                            req.body.senha.length <= 7 ||
                                            req.body.senha2.length <= 7
                                          ) {
                                            error =
                                              "A senha deve ter no mínimo 8 caracteres";
                                            res.render(
                                              "funcionario/edicao_professor",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_funcionario,
                                                matricula:
                                                  funcionario_matricula,
                                                professor: professor1,
                                              }
                                            );
                                          } else {
                                            bd.select_senha(
                                              req.body.senha
                                            ).then((msg) => {
                                              if (msg) {
                                                error = msg;
                                                res.render(
                                                  "funcionario/edicao_professor",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_funcionario,
                                                    matricula:
                                                      funcionario_matricula,
                                                    professor: professor1,
                                                  }
                                                );
                                              } else {
                                                bd1
                                                  .select_senha(req.body.senha)
                                                  .then((msg) => {
                                                    if (msg) {
                                                      error = msg;
                                                      res.render(
                                                        "funcionario/edicao_professor",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_funcionario,
                                                          matricula:
                                                            funcionario_matricula,
                                                          professor: professor1,
                                                        }
                                                      );
                                                    } else {
                                                      bd3
                                                        .select_senha(
                                                          req.body.senha
                                                        )
                                                        .then((msg) => {
                                                          if (msg) {
                                                            error = msg;
                                                            res.render(
                                                              "funcionario/edicao_professor",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_funcionario,
                                                                matricula:
                                                                  funcionario_matricula,
                                                                professor:
                                                                  professor1,
                                                              }
                                                            );
                                                          } else {
                                                            bd1
                                                              .delete_update_professor(
                                                                {
                                                                  matricula:
                                                                    req.body
                                                                      .matricula,
                                                                  usuario:
                                                                    req.body
                                                                      .usuario,
                                                                  email:
                                                                    req.body
                                                                      .email,
                                                                  celular:
                                                                    req.body
                                                                      .celular,
                                                                  residencial:
                                                                    req.body
                                                                      .residencial,
                                                                  senha:
                                                                    req.body
                                                                      .senha,
                                                                  matricula1:
                                                                    professor1.matricula,
                                                                }
                                                              )
                                                              .then(
                                                                (professor) => {
                                                                  if (
                                                                    professor ===
                                                                    "error"
                                                                  ) {
                                                                    req.flash(
                                                                      "error_msg",
                                                                      "Error no sistema tente novamente mais tarde"
                                                                    );
                                                                    res.redirect(
                                                                      "/funcionario/professor"
                                                                    );
                                                                  } else {
                                                                    req.flash(
                                                                      "sucess_msg",
                                                                      "Alteração do professor feita com sucesso"
                                                                    );
                                                                    res.redirect(
                                                                      "/funcionario/professor"
                                                                    );
                                                                  }
                                                                }
                                                              );
                                                          }
                                                        });
                                                    }
                                                  });
                                              }
                                            });
                                          }
                                        });
                                    }
                                  });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != professor1.matricula &&
    req.body.email != professor1.email &&
    req.body.residencial != professor1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("funcionario/edicao_professor", {
                                    usuario,
                                    error,
                                    foto: foto_funcionario,
                                    matricula: funcionario_matricula,
                                    professor: professor1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render(
                                          "funcionario/edicao_professor",
                                          {
                                            usuario,
                                            error,
                                            foto: foto_funcionario,
                                            matricula: funcionario_matricula,
                                            professor: professor1,
                                          }
                                        );
                                      } else {
                                        bd3
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "funcionario/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  professor: professor1,
                                                }
                                              );
                                            } else if (
                                              req.body.senha.length <= 7 ||
                                              req.body.senha2.length <= 7
                                            ) {
                                              error =
                                                "A senha deve ter no mínimo 8 caracteres";
                                              res.render(
                                                "funcionario/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  professor: professor1,
                                                }
                                              );
                                            } else {
                                              bd.select_senha(
                                                req.body.senha
                                              ).then((msg) => {
                                                if (msg) {
                                                  error = msg;
                                                  res.render(
                                                    "funcionario/edicao_professor",
                                                    {
                                                      usuario,
                                                      error,
                                                      foto: foto_funcionario,
                                                      matricula:
                                                        funcionario_matricula,
                                                      professor: professor1,
                                                    }
                                                  );
                                                } else {
                                                  bd1
                                                    .select_senha(
                                                      req.body.senha
                                                    )
                                                    .then((msg) => {
                                                      if (msg) {
                                                        error = msg;
                                                        res.render(
                                                          "funcionario/edicao_professor",
                                                          {
                                                            usuario,
                                                            error,
                                                            foto: foto_funcionario,
                                                            matricula:
                                                              funcionario_matricula,
                                                            professor:
                                                              professor1,
                                                          }
                                                        );
                                                      } else {
                                                        bd3
                                                          .select_senha(
                                                            req.body.senha
                                                          )
                                                          .then((msg) => {
                                                            if (msg) {
                                                              error = msg;
                                                              res.render(
                                                                "funcionario/edicao_professor",
                                                                {
                                                                  usuario,
                                                                  error,
                                                                  foto: foto_funcionario,
                                                                  matricula:
                                                                    funcionario_matricula,
                                                                  professor:
                                                                    professor1,
                                                                }
                                                              );
                                                            } else {
                                                              bd1
                                                                .delete_update_professor(
                                                                  {
                                                                    matricula:
                                                                      req.body
                                                                        .matricula,
                                                                    usuario:
                                                                      req.body
                                                                        .usuario,
                                                                    email:
                                                                      req.body
                                                                        .email,
                                                                    celular:
                                                                      req.body
                                                                        .celular,
                                                                    residencial:
                                                                      req.body
                                                                        .residencial,
                                                                    senha:
                                                                      req.body
                                                                        .senha,
                                                                    matricula1:
                                                                      professor1.matricula,
                                                                  }
                                                                )
                                                                .then(
                                                                  (
                                                                    professor
                                                                  ) => {
                                                                    if (
                                                                      professor ===
                                                                      "error"
                                                                    ) {
                                                                      req.flash(
                                                                        "error_msg",
                                                                        "Error no sistema tente novamente mais tarde"
                                                                      );
                                                                      res.redirect(
                                                                        "/funcionario/professor"
                                                                      );
                                                                    } else {
                                                                      req.flash(
                                                                        "sucess_msg",
                                                                        "Alteração do professor feita com sucesso"
                                                                      );
                                                                      res.redirect(
                                                                        "/funcionario/professor"
                                                                      );
                                                                    }
                                                                  }
                                                                );
                                                            }
                                                          });
                                                      }
                                                    });
                                                }
                                              });
                                            }
                                          });
                                      }
                                    });
                                }
                              }
                            );
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != professor1.matricula &&
    req.body.celular != professor1.telefone_celular &&
    req.body.residencial != professor1.telefone_residencial
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("funcionario/edicao_professor", {
                                    usuario,
                                    error,
                                    foto: foto_funcionario,
                                    matricula: funcionario_matricula,
                                    professor: professor1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render(
                                          "funcionario/edicao_professor",
                                          {
                                            usuario,
                                            error,
                                            foto: foto_funcionario,
                                            matricula: funcionario_matricula,
                                            professor: professor1,
                                          }
                                        );
                                      } else {
                                        bd3
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "funcionario/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  professor: professor1,
                                                }
                                              );
                                            } else {
                                              bd1
                                                .delete_update_professor({
                                                  matricula: req.body.matricula,
                                                  usuario: req.body.usuario,
                                                  email: req.body.email,
                                                  celular: req.body.celular,
                                                  residencial:
                                                    req.body.residencial,
                                                  senha: professor1.senha,
                                                  matricula1:
                                                    professor1.matricula,
                                                })
                                                .then((professor) => {
                                                  if (professor === "error") {
                                                    req.flash(
                                                      "error_msg",
                                                      "Error no sistema tente novamente mais tarde"
                                                    );
                                                    res.redirect(
                                                      "/funcionario/professor"
                                                    );
                                                  } else {
                                                    req.flash(
                                                      "sucess_msg",
                                                      "Alteração do professor feita com sucesso"
                                                    );
                                                    res.redirect(
                                                      "/funcionario/professor"
                                                    );
                                                  }
                                                });
                                            }
                                          });
                                      }
                                    });
                                }
                              }
                            );
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != professor1.matricula &&
    req.body.email != professor1.email &&
    req.body.residencial != professor1.telefone_residencial
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("funcionario/edicao_professor", {
                                    usuario,
                                    error,
                                    foto: foto_funcionario,
                                    matricula: funcionario_matricula,
                                    professor: professor1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render(
                                          "funcionario/edicao_professor",
                                          {
                                            usuario,
                                            error,
                                            foto: foto_funcionario,
                                            matricula: funcionario_matricula,
                                            professor: professor1,
                                          }
                                        );
                                      } else {
                                        bd3
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "funcionario/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  professor: professor1,
                                                }
                                              );
                                            } else {
                                              bd1
                                                .delete_update_professor({
                                                  matricula: req.body.matricula,
                                                  usuario: req.body.usuario,
                                                  email: req.body.email,
                                                  celular: req.body.celular,
                                                  residencial:
                                                    req.body.residencial,
                                                  senha: professor1.senha,
                                                  matricula1:
                                                    professor1.matricula,
                                                })
                                                .then((professor) => {
                                                  if (professor === "error") {
                                                    req.flash(
                                                      "error_msg",
                                                      "Error no sistema tente novamente mais tarde"
                                                    );
                                                    res.redirect(
                                                      "/funcionario/professor"
                                                    );
                                                  } else {
                                                    req.flash(
                                                      "sucess_msg",
                                                      "Alteração do professor feita com sucesso"
                                                    );
                                                    res.redirect(
                                                      "/funcionario/professor"
                                                    );
                                                  }
                                                });
                                            }
                                          });
                                      }
                                    });
                                }
                              }
                            );
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != professor1.matricula &&
    req.body.celular != professor1.telefone_celular &&
    req.body.email != professor1.telefone_email
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_email(req.body.email).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("funcionario/edicao_professor", {
                                  usuario,
                                  error,
                                  foto: foto_funcionario,
                                  matricula: funcionario_matricula,
                                  professor: professor1,
                                });
                              } else {
                                bd1.select_email(req.body.email).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("funcionario/edicao_professor", {
                                      usuario,
                                      error,
                                      foto: foto_funcionario,
                                      matricula: funcionario_matricula,
                                      professor: professor1,
                                    });
                                  } else {
                                    bd3
                                      .select_email(req.body.email)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render(
                                            "funcionario/edicao_professor",
                                            {
                                              usuario,
                                              error,
                                              foto: foto_funcionario,
                                              matricula: funcionario_matricula,
                                              professor: professor1,
                                            }
                                          );
                                        } else {
                                          bd1
                                            .delete_update_professor({
                                              matricula: req.body.matricula,
                                              usuario: req.body.usuario,
                                              email: req.body.email,
                                              celular: req.body.celular,
                                              residencial: req.body.residencial,
                                              senha: professor1.senha,
                                              matricula1: professor1.matricula,
                                            })
                                            .then((professor) => {
                                              if (professor === "error") {
                                                req.flash(
                                                  "error_msg",
                                                  "Error no sistema tente novamente mais tarde"
                                                );
                                                res.redirect(
                                                  "/funcionario/professor"
                                                );
                                              } else {
                                                req.flash(
                                                  "sucess_msg",
                                                  "Alteração do professor feita com sucesso"
                                                );
                                                res.redirect(
                                                  "/funcionario/professor"
                                                );
                                              }
                                            });
                                        }
                                      });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != professor1.matricula &&
    req.body.email != professor1.email &&
    req.body.senha != ""
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else if (
                            req.body.senha.length <= 7 ||
                            req.body.senha2.length <= 7
                          ) {
                            error = "A senha deve ter no mínimo 8 caracteres";
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_senha(req.body.senha).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("funcionario/edicao_professor", {
                                  usuario,
                                  error,
                                  foto: foto_funcionario,
                                  matricula: funcionario_matricula,
                                  professor: professor1,
                                });
                              } else {
                                bd1.select_senha(req.body.senha).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("funcionario/edicao_professor", {
                                      usuario,
                                      error,
                                      foto: foto_funcionario,
                                      matricula: funcionario_matricula,
                                      professor: professor1,
                                    });
                                  } else {
                                    bd3
                                      .select_senha(req.body.senha)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render(
                                            "funcionario/edicao_professor",
                                            {
                                              usuario,
                                              error,
                                              foto: foto_funcionario,
                                              matricula: funcionario_matricula,
                                              professor: professor1,
                                            }
                                          );
                                        } else {
                                          bd1
                                            .delete_update_professor({
                                              matricula: req.body.matricula,
                                              usuario: req.body.usuario,
                                              email: req.body.email,
                                              celular: req.body.celular,
                                              residencial: req.body.residencial,
                                              senha: req.body.senha,
                                              matricula1: professor1.matricula,
                                            })
                                            .then((professor) => {
                                              if (professor === "error") {
                                                req.flash(
                                                  "error_msg",
                                                  "Error no sistema tente novamente mais tarde"
                                                );
                                                res.redirect(
                                                  "/funcionario/professor"
                                                );
                                              } else {
                                                req.flash(
                                                  "sucess_msg",
                                                  "Alteração do professor feita com sucesso"
                                                );
                                                res.redirect(
                                                  "/funcionario/professor"
                                                );
                                              }
                                            });
                                        }
                                      });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != professor1.matricula &&
    req.body.celular != professor1.telefone_celular &&
    req.body.senha != ""
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else if (
                            req.body.senha.length <= 7 ||
                            req.body.senha2.length <= 7
                          ) {
                            error = "A senha deve ter no mínimo 8 caracteres";
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_senha(req.body.senha).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("funcionario/edicao_professor", {
                                  usuario,
                                  error,
                                  foto: foto_funcionario,
                                  matricula: funcionario_matricula,
                                  professor: professor1,
                                });
                              } else {
                                bd1.select_senha(req.body.senha).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("funcionario/edicao_professor", {
                                      usuario,
                                      error,
                                      foto: foto_funcionario,
                                      matricula: funcionario_matricula,
                                      professor: professor1,
                                    });
                                  } else {
                                    bd3
                                      .select_senha(req.body.senha)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render(
                                            "funcionario/edicao_professor",
                                            {
                                              usuario,
                                              error,
                                              foto: foto_funcionario,
                                              matricula: funcionario_matricula,
                                              professor: professor1,
                                            }
                                          );
                                        } else {
                                          bd1
                                            .delete_update_professor({
                                              matricula: req.body.matricula,
                                              usuario: req.body.usuario,
                                              email: req.body.email,
                                              celular: req.body.celular,
                                              residencial: req.body.residencial,
                                              senha: req.body.senha,
                                              matricula1: professor1.matricula,
                                            })
                                            .then((professor) => {
                                              if (professor === "error") {
                                                req.flash(
                                                  "error_msg",
                                                  "Error no sistema tente novamente mais tarde"
                                                );
                                                res.redirect(
                                                  "/funcionario/professor"
                                                );
                                              } else {
                                                req.flash(
                                                  "sucess_msg",
                                                  "Alteração do professor feita com sucesso"
                                                );
                                                res.redirect(
                                                  "/funcionario/professor"
                                                );
                                              }
                                            });
                                        }
                                      });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != professor1.matricula &&
    req.body.residencial != professor1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("funcionario/edicao_professor", {
                                usuario,
                                error,
                                foto: foto_funcionario,
                                matricula: funcionario_matricula,
                                professor: professor1,
                              });
                            } else if (
                              req.body.senha.length <= 7 ||
                              req.body.senha2.length <= 7
                            ) {
                              error = "A senha deve ter no mínimo 8 caracteres";
                              res.render("funcionario/edicao_professor", {
                                usuario,
                                error,
                                foto: foto_funcionario,
                                matricula: funcionario_matricula,
                                professor: professor1,
                              });
                            } else {
                              bd.select_senha(req.body.senha).then((msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("funcionario/edicao_professor", {
                                    usuario,
                                    error,
                                    foto: foto_funcionario,
                                    matricula: funcionario_matricula,
                                    professor: professor1,
                                  });
                                } else {
                                  bd1
                                    .select_senha(req.body.senha)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render(
                                          "funcionario/edicao_professor",
                                          {
                                            usuario,
                                            error,
                                            foto: foto_funcionario,
                                            matricula: funcionario_matricula,
                                            professor: professor1,
                                          }
                                        );
                                      } else {
                                        bd3
                                          .select_senha(req.body.senha)
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "funcionario/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  professor: professor1,
                                                }
                                              );
                                            } else {
                                              bd1
                                                .delete_update_professor({
                                                  matricula: req.body.matricula,
                                                  usuario: req.body.usuario,
                                                  email: req.body.email,
                                                  celular: req.body.celular,
                                                  residencial:
                                                    req.body.residencial,
                                                  senha: req.body.senha,
                                                  matricula1:
                                                    professor1.matricula,
                                                })
                                                .then((professor) => {
                                                  if (professor === "error") {
                                                    req.flash(
                                                      "error_msg",
                                                      "Error no sistema tente novamente mais tarde"
                                                    );
                                                    res.redirect(
                                                      "/funcionario/professor"
                                                    );
                                                  } else {
                                                    req.flash(
                                                      "sucess_msg",
                                                      "Alteração do professor feita com sucesso"
                                                    );
                                                    res.redirect(
                                                      "/funcionario/professor"
                                                    );
                                                  }
                                                });
                                            }
                                          });
                                      }
                                    });
                                }
                              });
                            }
                          });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != professor1.matricula &&
    req.body.email != professor1.email
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd1
                              .delete_update_professor({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: professor1.senha,
                                matricula1: professor1.matricula,
                              })
                              .then((professor) => {
                                if (professor === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/funcionario/professor");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do professor feita com sucesso"
                                  );
                                  res.redirect("/funcionario/professor");
                                }
                              });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != professor1.matricula &&
    req.body.celular != professor1.telefone_celular
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd1
                              .delete_update_professor({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: professor1.senha,
                                matricula1: professor1.matricula,
                              })
                              .then((professor) => {
                                if (professor === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/funcionario/professor");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do professor feita com sucesso"
                                  );
                                  res.redirect("/funcionario/professor");
                                }
                              });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != professor1.matricula &&
    req.body.residencial != professor1.telefone_residencial
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("funcionario/edicao_professor", {
                                usuario,
                                error,
                                foto: foto_funcionario,
                                matricula: funcionario_matricula,
                                professor: professor1,
                              });
                            } else {
                              bd1
                                .delete_update_professor({
                                  matricula: req.body.matricula,
                                  usuario: req.body.usuario,
                                  email: req.body.email,
                                  celular: req.body.celular,
                                  residencial: req.body.residencial,
                                  senha: professor1.senha,
                                  matricula1: professor1.matricula,
                                })
                                .then((professor) => {
                                  if (professor === "error") {
                                    req.flash(
                                      "error_msg",
                                      "Error no sistema tente novamente mais tarde"
                                    );
                                    res.redirect("/funcionario/professor");
                                  } else {
                                    req.flash(
                                      "sucess_msg",
                                      "Alteração do professor feita com sucesso"
                                    );
                                    res.redirect("/funcionario/professor");
                                  }
                                });
                            }
                          });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != professor1.matricula &&
    req.body.senha != ""
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd1
                              .delete_update_professor({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: req.body.senha,
                                matricula1: professor1.matricula,
                              })
                              .then((professor) => {
                                if (professor === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/funcionario/professor");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do professor feita com sucesso"
                                  );
                                  res.redirect("/funcionario/professor");
                                }
                              });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (req.body.matricula != professor1.matricula) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd1
                  .delete_update_professor({
                    matricula: req.body.matricula,
                    usuario: req.body.usuario,
                    email: req.body.email,
                    celular: req.body.celular,
                    residencial: req.body.residencial,
                    senha: professor1.senha,
                    matricula1: professor1.matricula,
                  })
                  .then((professor) => {
                    if (professor === "error") {
                      req.flash(
                        "error_msg",
                        "Error no sistema tente novamente mais tarde"
                      );
                      res.redirect("/funcionario/professor");
                    } else {
                      req.flash(
                        "sucess_msg",
                        "Alteração do professor feita com sucesso"
                      );
                      res.redirect("/funcionario/professor");
                    }
                  });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.email != professor1.email &&
    req.body.celular != professor1.telefone_celular &&
    req.body.residencial != professor1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_email(req.body.email).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("funcionario/edicao_professor", {
                                    usuario,
                                    error,
                                    foto: foto_funcionario,
                                    matricula: funcionario_matricula,
                                    professor: professor1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render(
                                          "funcionario/edicao_professor",
                                          {
                                            usuario,
                                            error,
                                            foto: foto_funcionario,
                                            matricula: funcionario_matricula,
                                            professor: professor1,
                                          }
                                        );
                                      } else {
                                        bd3
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "funcionario/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  professor: professor1,
                                                }
                                              );
                                            } else if (
                                              req.body.senha.length <= 7 ||
                                              req.body.senha2.length <= 7
                                            ) {
                                              error =
                                                "A senha deve ter no mínimo 8 caracteres";
                                              res.render(
                                                "funcionario/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  professor: professor1,
                                                }
                                              );
                                            } else {
                                              bd.select_senha(
                                                req.body.senha
                                              ).then((msg) => {
                                                if (msg) {
                                                  error = msg;
                                                  res.render(
                                                    "funcionario/edicao_professor",
                                                    {
                                                      usuario,
                                                      error,
                                                      foto: foto_funcionario,
                                                      matricula:
                                                        funcionario_matricula,
                                                      professor: professor1,
                                                    }
                                                  );
                                                } else {
                                                  bd1
                                                    .select_senha(
                                                      req.body.senha
                                                    )
                                                    .then((msg) => {
                                                      if (msg) {
                                                        error = msg;
                                                        res.render(
                                                          "funcionario/edicao_professor",
                                                          {
                                                            usuario,
                                                            error,
                                                            foto: foto_funcionario,
                                                            matricula:
                                                              funcionario_matricula,
                                                            professor:
                                                              professor1,
                                                          }
                                                        );
                                                      } else {
                                                        bd3
                                                          .select_senha(
                                                            req.body.senha
                                                          )
                                                          .then((msg) => {
                                                            if (msg) {
                                                              error = msg;
                                                              res.render(
                                                                "funcionario/edicao_professor",
                                                                {
                                                                  usuario,
                                                                  error,
                                                                  foto: foto_funcionario,
                                                                  matricula:
                                                                    funcionario_matricula,
                                                                  professor:
                                                                    professor1,
                                                                }
                                                              );
                                                            } else {
                                                              bd1
                                                                .update_professor(
                                                                  {
                                                                    matricula:
                                                                      req.body
                                                                        .matricula,
                                                                    usuario:
                                                                      req.body
                                                                        .usuario,
                                                                    email:
                                                                      req.body
                                                                        .email,
                                                                    celular:
                                                                      req.body
                                                                        .celular,
                                                                    residencial:
                                                                      req.body
                                                                        .residencial,
                                                                    senha:
                                                                      req.body
                                                                        .senha,
                                                                    matricula1:
                                                                      professor1.matricula,
                                                                  }
                                                                )
                                                                .then(
                                                                  (
                                                                    professor
                                                                  ) => {
                                                                    if (
                                                                      professor ===
                                                                      "error"
                                                                    ) {
                                                                      req.flash(
                                                                        "error_msg",
                                                                        "Error no sistema tente novamente mais tarde"
                                                                      );
                                                                      res.redirect(
                                                                        "/funcionario/professor"
                                                                      );
                                                                    } else {
                                                                      req.flash(
                                                                        "sucess_msg",
                                                                        "Alteração do professor feita com sucesso"
                                                                      );
                                                                      res.redirect(
                                                                        "/funcionario/professor"
                                                                      );
                                                                    }
                                                                  }
                                                                );
                                                            }
                                                          });
                                                      }
                                                    });
                                                }
                                              });
                                            }
                                          });
                                      }
                                    });
                                }
                              }
                            );
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.celular != professor1.telefone_celular &&
    req.body.email != professor1.email &&
    req.body.senha != ""
  ) {
    bd.select_celular(req.body.celular).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else if (
                            req.body.senha.length <= 7 ||
                            req.body.senha2.length <= 7
                          ) {
                            error = "A senha deve ter no mínimo 8 caracteres";
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_senha(req.body.senha).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("funcionario/edicao_professor", {
                                  usuario,
                                  error,
                                  foto: foto_funcionario,
                                  matricula: funcionario_matricula,
                                  professor: professor1,
                                });
                              } else {
                                bd1.select_senha(req.body.senha).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("funcionario/edicao_professor", {
                                      usuario,
                                      error,
                                      foto: foto_funcionario,
                                      matricula: funcionario_matricula,
                                      professor: professor1,
                                    });
                                  } else {
                                    bd3
                                      .select_senha(req.body.senha)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render(
                                            "funcionario/edicao_professor",
                                            {
                                              usuario,
                                              error,
                                              foto: foto_funcionario,
                                              matricula: funcionario_matricula,
                                              professor: professor1,
                                            }
                                          );
                                        } else {
                                          bd1
                                            .update_professor({
                                              matricula: req.body.matricula,
                                              usuario: req.body.usuario,
                                              email: req.body.email,
                                              celular: req.body.celular,
                                              residencial: req.body.residencial,
                                              senha: req.body.senha,
                                              matricula1: professor1.matricula,
                                            })
                                            .then((professor) => {
                                              if (professor === "error") {
                                                req.flash(
                                                  "error_msg",
                                                  "Error no sistema tente novamente mais tarde"
                                                );
                                                res.redirect(
                                                  "/funcionario/professor"
                                                );
                                              } else {
                                                req.flash(
                                                  "sucess_msg",
                                                  "Alteração do professor feita com sucesso"
                                                );
                                                res.redirect(
                                                  "/funcionario/professor"
                                                );
                                              }
                                            });
                                        }
                                      });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.email != professor1.email &&
    req.body.residencial != professor1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_email(req.body.email).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("funcionario/edicao_professor", {
                                usuario,
                                error,
                                foto: foto_funcionario,
                                matricula: funcionario_matricula,
                                professor: professor1,
                              });
                            } else if (
                              req.body.senha.length <= 7 ||
                              req.body.senha2.length <= 7
                            ) {
                              error = "A senha deve ter no mínimo 8 caracteres";
                              res.render("funcionario/edicao_professor", {
                                usuario,
                                error,
                                foto: foto_funcionario,
                                matricula: funcionario_matricula,
                                professor: professor1,
                              });
                            } else {
                              bd.select_senha(req.body.senha).then((msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("funcionario/edicao_professor", {
                                    usuario,
                                    error,
                                    foto: foto_funcionario,
                                    matricula: funcionario_matricula,
                                    professor: professor1,
                                  });
                                } else {
                                  bd1
                                    .select_senha(req.body.senha)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render(
                                          "funcionario/edicao_professor",
                                          {
                                            usuario,
                                            error,
                                            foto: foto_funcionario,
                                            matricula: funcionario_matricula,
                                            professor: professor1,
                                          }
                                        );
                                      } else {
                                        bd3
                                          .select_senha(req.body.senha)
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "funcionario/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  professor: professor1,
                                                }
                                              );
                                            } else {
                                              bd1
                                                .update_professor({
                                                  matricula: req.body.matricula,
                                                  usuario: req.body.usuario,
                                                  email: req.body.email,
                                                  celular: req.body.celular,
                                                  residencial:
                                                    req.body.residencial,
                                                  senha: req.body.senha,
                                                  matricula1:
                                                    professor1.matricula,
                                                })
                                                .then((professor) => {
                                                  if (professor === "error") {
                                                    req.flash(
                                                      "error_msg",
                                                      "Error no sistema tente novamente mais tarde"
                                                    );
                                                    res.redirect(
                                                      "/funcionario/professor"
                                                    );
                                                  } else {
                                                    req.flash(
                                                      "sucess_msg",
                                                      "Alteração do professor feita com sucesso"
                                                    );
                                                    res.redirect(
                                                      "/funcionario/professor"
                                                    );
                                                  }
                                                });
                                            }
                                          });
                                      }
                                    });
                                }
                              });
                            }
                          });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.celular != professor1.telefone_celular &&
    req.body.residencial != professor1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_celular(req.body.celular).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("funcionario/edicao_professor", {
                                usuario,
                                error,
                                foto: foto_funcionario,
                                matricula: funcionario_matricula,
                                professor: professor1,
                              });
                            } else if (
                              req.body.senha.length <= 7 ||
                              req.body.senha2.length <= 7
                            ) {
                              error = "A senha deve ter no mínimo 8 caracteres";
                              res.render("funcionario/edicao_professor", {
                                usuario,
                                error,
                                foto: foto_funcionario,
                                matricula: funcionario_matricula,
                                professor: professor1,
                              });
                            } else {
                              bd.select_senha(req.body.senha).then((msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("funcionario/edicao_professor", {
                                    usuario,
                                    error,
                                    foto: foto_funcionario,
                                    matricula: funcionario_matricula,
                                    professor: professor1,
                                  });
                                } else {
                                  bd1
                                    .select_senha(req.body.senha)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render(
                                          "funcionario/edicao_professor",
                                          {
                                            usuario,
                                            error,
                                            foto: foto_funcionario,
                                            matricula: funcionario_matricula,
                                            professor: professor1,
                                          }
                                        );
                                      } else {
                                        bd3
                                          .select_senha(req.body.senha)
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "funcionario/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  professor: professor1,
                                                }
                                              );
                                            } else {
                                              bd1
                                                .update_professor({
                                                  matricula: req.body.matricula,
                                                  usuario: req.body.usuario,
                                                  email: req.body.email,
                                                  celular: req.body.celular,
                                                  residencial:
                                                    req.body.residencial,
                                                  senha: req.body.senha,
                                                  matricula1:
                                                    professor1.matricula,
                                                })
                                                .then((professor) => {
                                                  if (professor === "error") {
                                                    req.flash(
                                                      "error_msg",
                                                      "Error no sistema tente novamente mais tarde"
                                                    );
                                                    res.redirect(
                                                      "/funcionario/professor"
                                                    );
                                                  } else {
                                                    req.flash(
                                                      "sucess_msg",
                                                      "Alteração do professor feita com sucesso"
                                                    );
                                                    res.redirect(
                                                      "/funcionario/professor"
                                                    );
                                                  }
                                                });
                                            }
                                          });
                                      }
                                    });
                                }
                              });
                            }
                          });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.email != professor1.email &&
    req.body.celular != professor1.telefone_celular &&
    req.body.residencial != professor1.telefone_residencial
  ) {
    bd.select_email(req.body.email).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("funcionario/edicao_professor", {
                                    usuario,
                                    error,
                                    foto: foto_funcionario,
                                    matricula: funcionario_matricula,
                                    professor: professor1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render(
                                          "funcionario/edicao_professor",
                                          {
                                            usuario,
                                            error,
                                            foto: foto_funcionario,
                                            matricula: funcionario_matricula,
                                            professor: professor1,
                                          }
                                        );
                                      } else {
                                        bd3
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "funcionario/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  professor: professor1,
                                                }
                                              );
                                            } else {
                                              bd1
                                                .update_professor({
                                                  matricula: req.body.matricula,
                                                  usuario: req.body.usuario,
                                                  email: req.body.email,
                                                  celular: req.body.celular,
                                                  residencial:
                                                    req.body.residencial,
                                                  senha: professor1.senha,
                                                  matricula1:
                                                    professor1.matricula,
                                                })
                                                .then((professor) => {
                                                  if (professor === "error") {
                                                    req.flash(
                                                      "error_msg",
                                                      "Error no sistema tente novamente mais tarde"
                                                    );
                                                    res.redirect(
                                                      "/funcionario/professor"
                                                    );
                                                  } else {
                                                    req.flash(
                                                      "sucess_msg",
                                                      "Alteração do professor feita com sucesso"
                                                    );
                                                    res.redirect(
                                                      "/funcionario/professor"
                                                    );
                                                  }
                                                });
                                            }
                                          });
                                      }
                                    });
                                }
                              }
                            );
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.email != professor1.email &&
    req.body.residencial != professor1.telefone_residencial
  ) {
    bd.select_email(req.body.email).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("funcionario/edicao_professor", {
                                usuario,
                                error,
                                foto: foto_funcionario,
                                matricula: funcionario_matricula,
                                professor: professor1,
                              });
                            } else {
                              bd1
                                .update_professor({
                                  matricula: req.body.matricula,
                                  usuario: req.body.usuario,
                                  email: req.body.email,
                                  celular: req.body.celular,
                                  residencial: req.body.residencial,
                                  senha: professor1.senha,
                                  matricula1: professor1.matricula,
                                })
                                .then((professor) => {
                                  if (professor === "error") {
                                    req.flash(
                                      "error_msg",
                                      "Error no sistema tente novamente mais tarde"
                                    );
                                    res.redirect("/funcionario/professor");
                                  } else {
                                    req.flash(
                                      "sucess_msg",
                                      "Alteração do professor feita com sucesso"
                                    );
                                    res.redirect("/funcionario/professor");
                                  }
                                });
                            }
                          });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.celular != professor1.telefone_celular &&
    req.body.email != professor1.email
  ) {
    bd.select_celular(req.body.celular).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd1
                              .update_professor({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: professor1.senha,
                                matricula1: professor1.matricula,
                              })
                              .then((professor) => {
                                if (professor === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/funcionario/professor");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do professor feita com sucesso"
                                  );
                                  res.redirect("/funcionario/professor");
                                }
                              });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.celular != professor1.telefone_celular &&
    req.body.residencial != professor1.telefone_residencial
  ) {
    bd.select_celular(req.body.celular).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("funcionario/edicao_professor", {
                                usuario,
                                error,
                                foto: foto_funcionario,
                                matricula: funcionario_matricula,
                                professor: professor1,
                              });
                            } else {
                              bd1
                                .update_professor({
                                  matricula: req.body.matricula,
                                  usuario: req.body.usuario,
                                  email: req.body.email,
                                  celular: req.body.celular,
                                  residencial: req.body.residencial,
                                  senha: professor1.senha,
                                  matricula1: professor1.matricula,
                                })
                                .then((professor) => {
                                  if (professor === "error") {
                                    req.flash(
                                      "error_msg",
                                      "Error no sistema tente novamente mais tarde"
                                    );
                                    res.redirect("/funcionario/professor");
                                  } else {
                                    req.flash(
                                      "sucess_msg",
                                      "Alteração do professor feita com sucesso"
                                    );
                                    res.redirect("/funcionario/professor");
                                  }
                                });
                            }
                          });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (req.body.email != professor1.email && req.body.senha != "") {
    bd.select_email(req.body.email).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd1
                              .update_professor({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: req.body.senha,
                                matricula1: professor1.matricula,
                              })
                              .then((professor) => {
                                if (professor === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/funcionario/professor");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do professor feita com sucesso"
                                  );
                                  res.redirect("/funcionario/professor");
                                }
                              });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (req.body.email != professor1.email) {
    bd.select_email(req.body.email).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd1
                  .update_professor({
                    matricula: req.body.matricula,
                    usuario: req.body.usuario,
                    email: req.body.email,
                    celular: req.body.celular,
                    residencial: req.body.residencial,
                    senha: professor1.senha,
                    matricula1: professor1.matricula,
                  })
                  .then((professor) => {
                    if (professor === "error") {
                      req.flash(
                        "error_msg",
                        "Error no sistema tente novamente mais tarde"
                      );
                      res.redirect("/funcionario/professor");
                    } else {
                      req.flash(
                        "sucess_msg",
                        "Alteração do professor feita com sucesso"
                      );
                      res.redirect("/funcionario/professor");
                    }
                  });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.celular != professor1.telefone_celular &&
    req.body.senha != ""
  ) {
    bd.select_celular(req.body.celular).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd1
                              .update_professor({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: req.body.senha,
                                matricula1: professor1.matricula,
                              })
                              .then((professor) => {
                                if (professor === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/funcionario/professor");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do professor feita com sucesso"
                                  );
                                  res.redirect("/funcionario/professor");
                                }
                              });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (req.body.celular != professor1.telefone_celular) {
    bd.select_celular(req.body.celular).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd1
                  .update_professor({
                    matricula: req.body.matricula,
                    usuario: req.body.usuario,
                    email: req.body.email,
                    celular: req.body.celular,
                    residencial: req.body.residencial,
                    senha: professor1.senha,
                    matricula1: professor1.matricula,
                  })
                  .then((professor) => {
                    if (professor === "error") {
                      req.flash(
                        "error_msg",
                        "Error no sistema tente novamente mais tarde"
                      );
                      res.redirect("/funcionario/professor");
                    } else {
                      req.flash(
                        "sucess_msg",
                        "Alteração do professor feita com sucesso"
                      );
                      res.redirect("/funcionario/professor");
                    }
                  });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.residencial != professor1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_residencial(req.body.residencial).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_residencial(req.body.residencial).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_residencial(req.body.residencial).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd3.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd1
                              .update_professor({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: req.body.senha,
                                matricula1: professor1.matricula,
                              })
                              .then((professor) => {
                                if (professor === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/funcionario/professor");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do professor feita com sucesso"
                                  );
                                  res.redirect("/funcionario/professor");
                                }
                              });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (req.body.residencial != professor1.telefone_residencial) {
    bd.select_residencial(req.body.residencial).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_residencial(req.body.residencial).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_residencial(req.body.residencial).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd1
                  .update_professor({
                    matricula: req.body.matricula,
                    usuario: req.body.usuario,
                    email: req.body.email,
                    celular: req.body.celular,
                    residencial: req.body.residencial,
                    senha: professor1.senha,
                    matricula1: professor1.matricula,
                  })
                  .then((professor) => {
                    if (professor === "error") {
                      req.flash(
                        "error_msg",
                        "Error no sistema tente novamente mais tarde"
                      );
                      res.redirect("/funcionario/professor");
                    } else {
                      req.flash(
                        "sucess_msg",
                        "Alteração do professor feita com sucesso"
                      );
                      res.redirect("/funcionario/professor");
                    }
                  });
              }
            });
          }
        });
      }
    });
  } else if (req.body.senha != "") {
    bd.select_senha(req.body.senha).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_professor", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_senha(req.body.senha).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_professor", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              professor: professor1,
            });
          } else {
            bd3.select_senha(req.body.senha).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("funcionario/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  professor: professor1,
                });
              } else {
                bd1
                  .update_professor({
                    matricula: req.body.matricula,
                    usuario: req.body.usuario,
                    email: req.body.email,
                    celular: req.body.celular,
                    residencial: req.body.residencial,
                    senha: req.body.senha,
                    matricula1: professor1.matricula,
                  })
                  .then((professor) => {
                    if (professor === "error") {
                      req.flash(
                        "error_msg",
                        "Error no sistema tente novamente mais tarde"
                      );
                      res.redirect("/funcionario/professor");
                    } else {
                      req.flash(
                        "sucess_msg",
                        "Alteração do professor feita com sucesso"
                      );
                      res.redirect("/funcionario/professor");
                    }
                  });
              }
            });
          }
        });
      }
    });
  } else {
    bd1
      .update_professor({
        matricula: req.body.matricula,
        usuario: req.body.usuario,
        email: req.body.email,
        celular: req.body.celular,
        residencial: req.body.residencial,
        senha: professor1.senha,
        matricula1: professor1.matricula,
      })
      .then((professor) => {
        if (professor === "error") {
          req.flash("error_msg", "Error no sistema tente novamente mais tarde");
          res.redirect("/funcionario/professor");
        } else {
          req.flash("sucess_msg", "Alteração do professor feita com sucesso");
          res.redirect("/funcionario/professor");
        }
      });
  }
});

/*alteração de dados do aluno*/
router.get("/aluno/alteracao/:matricula", eFuncionario, (req, res) => {
  try {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }
  } catch (error) {
    var funcionario_matricula = null;
  }

  bd3.select_funcionario_usuario(funcionario_matricula).then((funcionario) => {
    if (funcionario === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_funcionario = funcionario[0].foto_perfil;
    } else if (funcionario === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_funcionario = funcionario[0].foto_perfil;
    } else {
      usuario = funcionario[0].usuario;
      foto_funcionario = funcionario[0].foto_perfil;
    }
  });
  bd.select_aluno1(req.params.matricula).then((aluno) => {
    if (aluno === "vazio") {
      req.flash("error_msg", "Aluno não encontrado");
      res.redirect("/funcionario/aluno");
    } else if (aluno === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/funcionario/aluno");
    } else {
      aluno = aluno[0];
      aluno1 = aluno;
      res.render("funcionario/edicao_aluno", {
        usuario,
        foto: foto_funcionario,
        matricula: funcionario_matricula,
        aluno,
      });
    }
  });
});

router.post("/aluno/alteracao/foto", eFuncionario, (req, res) => {
  funcionario_perfil(req, res, () => {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_funcionario !== "undefined") {
      fs.unlink("./public/upload/funcionario/" + foto_funcionario, () => {});
    }

    bd3
      .update_foto_funcionario({
        foto_perfil: req.file.filename,
        matricula: funcionario_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do funcionario");
        } else {
          res.redirect("/funcionario/aluno/alteracao/" + aluno1.matricula);
        }
      });
  });
});

router.post("/aluno/alteracao/", eFuncionario, (req, res) => {
  try {
    if (req.user[0].eAdmin != 0) {
      usuario = "[Você não devia estar aqui!!!]";
    } else if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    }
  } catch (error) {
    usuario = "[Você não devia estar aqui!!!]";
  }
  var error;
  if (
    !req.body.matricula ||
    typeof req.body.matricula === undefined ||
    req.body.matricula === null
  ) {
    error = "Matricula invalida";
    res.render("funcionario/edicao_aluno", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      aluno: aluno1,
    });
  } else if (
    !req.body.usuario ||
    typeof req.body.usuario === undefined ||
    req.body.usuario === null
  ) {
    error = "Usuário invalido";
    res.render("funcionario/edicao_aluno", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      aluno: aluno1,
    });
  } else if (
    !req.body.email ||
    typeof req.body.email === undefined ||
    req.body.email === null
  ) {
    error = "Email invalido";
    res.render("funcionario/edicao_aluno", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      aluno: aluno1,
    });
  } else if (
    !req.body.celular ||
    typeof req.body.celular === undefined ||
    req.body.celular === null
  ) {
    error = "Telefone celular invalido";
    res.render("funcionario/edicao_aluno", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      aluno: aluno1,
    });
  } else if (req.body.celular.length < 15) {
    error = "Número de celular invalido";
    res.render("funcionario/edicao_aluno", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      aluno: aluno1,
    });
  } else if (req.body.residencial && req.body.residencial.length < 14) {
    error = "Número residencial invalido";
    res.render("funcionario/edicao_aluno", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      aluno: aluno1,
    });
  } else if (req.body.senha !== req.body.senha2) {
    error = "Senhas diferentes";
    res.render("funcionario/edicao_aluno", {
      usuario,
      error,
      foto: foto_funcionario,
      matricula: funcionario_matricula,
      aluno: aluno1,
    });
  } else if (
    req.body.matricula != aluno1.matricula &&
    req.body.email != aluno1.email &&
    req.body.celular != aluno1.telefone_celular &&
    req.body.residencial != aluno1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("funcionario/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_funcionario,
                                  matricula: funcionario_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd1
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render("funcionario/edicao_aluno", {
                                        usuario,
                                        error,
                                        foto: foto_funcionario,
                                        matricula: funcionario_matricula,
                                        aluno: aluno1,
                                      });
                                    } else {
                                      bd3
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render(
                                              "funcionario/edicao_aluno",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_funcionario,
                                                matricula:
                                                  funcionario_matricula,
                                                aluno: aluno1,
                                              }
                                            );
                                          } else {
                                            bd.select_residencial(
                                              req.body.residencial
                                            ).then((msg) => {
                                              if (msg) {
                                                error = msg;
                                                res.render(
                                                  "funcionario/edicao_aluno",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_funcionario,
                                                    matricula:
                                                      funcionario_matricula,
                                                    aluno: aluno1,
                                                  }
                                                );
                                              } else {
                                                bd1
                                                  .select_residencial(
                                                    req.body.residencial
                                                  )
                                                  .then((msg) => {
                                                    if (msg) {
                                                      error = msg;
                                                      res.render(
                                                        "funcionario/edicao_aluno",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_funcionario,
                                                          matricula:
                                                            funcionario_matricula,
                                                          aluno: aluno1,
                                                        }
                                                      );
                                                    } else {
                                                      bd3
                                                        .select_residencial(
                                                          req.body.residencial
                                                        )
                                                        .then((msg) => {
                                                          if (msg) {
                                                            error = msg;
                                                            res.render(
                                                              "funcionario/edicao_aluno",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_funcionario,
                                                                matricula:
                                                                  funcionario_matricula,
                                                                aluno: aluno1,
                                                              }
                                                            );
                                                          } else if (
                                                            req.body.senha
                                                              .length <= 7 ||
                                                            req.body.senha2
                                                              .length <= 7
                                                          ) {
                                                            error =
                                                              "A senha deve ter no mínimo 8 caracteres";
                                                            res.render(
                                                              "funcionario/edicao_aluno",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_funcionario,
                                                                matricula:
                                                                  funcionario_matricula,
                                                                aluno: aluno1,
                                                              }
                                                            );
                                                          } else {
                                                            bd.select_senha(
                                                              req.body.senha
                                                            ).then((msg) => {
                                                              if (msg) {
                                                                error = msg;
                                                                res.render(
                                                                  "funcionario/edicao_aluno",
                                                                  {
                                                                    usuario,
                                                                    error,
                                                                    foto: foto_funcionario,
                                                                    matricula:
                                                                      funcionario_matricula,
                                                                    aluno:
                                                                      aluno1,
                                                                  }
                                                                );
                                                              } else {
                                                                bd1
                                                                  .select_senha(
                                                                    req.body
                                                                      .senha
                                                                  )
                                                                  .then(
                                                                    (msg) => {
                                                                      if (msg) {
                                                                        error =
                                                                          msg;
                                                                        res.render(
                                                                          "funcionario/edicao_aluno",
                                                                          {
                                                                            usuario,
                                                                            error,
                                                                            foto: foto_funcionario,
                                                                            matricula:
                                                                              funcionario_matricula,
                                                                            aluno:
                                                                              aluno1,
                                                                          }
                                                                        );
                                                                      } else {
                                                                        bd3
                                                                          .select_senha(
                                                                            req
                                                                              .body
                                                                              .senha
                                                                          )
                                                                          .then(
                                                                            (
                                                                              msg
                                                                            ) => {
                                                                              if (
                                                                                msg
                                                                              ) {
                                                                                error =
                                                                                  msg;
                                                                                res.render(
                                                                                  "funcionario/edicao_aluno",
                                                                                  {
                                                                                    usuario,
                                                                                    error,
                                                                                    foto: foto_funcionario,
                                                                                    matricula:
                                                                                      funcionario_matricula,
                                                                                    aluno:
                                                                                      aluno1,
                                                                                  }
                                                                                );
                                                                              } else {
                                                                                bd.delete_update_aluno(
                                                                                  {
                                                                                    matricula:
                                                                                      req
                                                                                        .body
                                                                                        .matricula,
                                                                                    usuario:
                                                                                      req
                                                                                        .body
                                                                                        .usuario,
                                                                                    email:
                                                                                      req
                                                                                        .body
                                                                                        .email,
                                                                                    celular:
                                                                                      req
                                                                                        .body
                                                                                        .celular,
                                                                                    residencial:
                                                                                      req
                                                                                        .body
                                                                                        .residencial,
                                                                                    senha:
                                                                                      req
                                                                                        .body
                                                                                        .senha,
                                                                                    matricula1:
                                                                                      aluno1.matricula,
                                                                                  }
                                                                                ).then(
                                                                                  (
                                                                                    aluno
                                                                                  ) => {
                                                                                    if (
                                                                                      aluno ===
                                                                                      "error"
                                                                                    ) {
                                                                                      req.flash(
                                                                                        "error_msg",
                                                                                        "Error no sistema tente novamente mais tarde"
                                                                                      );
                                                                                      res.redirect(
                                                                                        "/funcionario/aluno"
                                                                                      );
                                                                                    } else {
                                                                                      req.flash(
                                                                                        "sucess_msg",
                                                                                        "Alteração do aluno feita com sucesso"
                                                                                      );
                                                                                      res.redirect(
                                                                                        "/funcionario/aluno"
                                                                                      );
                                                                                    }
                                                                                  }
                                                                                );
                                                                              }
                                                                            }
                                                                          );
                                                                      }
                                                                    }
                                                                  );
                                                              }
                                                            });
                                                          }
                                                        });
                                                    }
                                                  });
                                              }
                                            });
                                          }
                                        });
                                    }
                                  });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != aluno1.matricula &&
    req.body.celular != aluno1.telefone_celular &&
    req.body.residencial != aluno1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("funcionario/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_funcionario,
                                    matricula: funcionario_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("funcionario/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_funcionario,
                                          matricula: funcionario_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd3
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "funcionario/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  aluno: aluno1,
                                                }
                                              );
                                            } else if (
                                              req.body.senha.length <= 7 ||
                                              req.body.senha2.length <= 7
                                            ) {
                                              error =
                                                "A senha deve ter no mínimo 8 caracteres";
                                              res.render(
                                                "funcionario/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  aluno: aluno1,
                                                }
                                              );
                                            } else {
                                              bd.select_senha(
                                                req.body.senha
                                              ).then((msg) => {
                                                if (msg) {
                                                  error = msg;
                                                  res.render(
                                                    "funcionario/edicao_aluno",
                                                    {
                                                      usuario,
                                                      error,
                                                      foto: foto_funcionario,
                                                      matricula:
                                                        funcionario_matricula,
                                                      aluno: aluno1,
                                                    }
                                                  );
                                                } else {
                                                  bd1
                                                    .select_senha(
                                                      req.body.senha
                                                    )
                                                    .then((msg) => {
                                                      if (msg) {
                                                        error = msg;
                                                        res.render(
                                                          "funcionario/edicao_aluno",
                                                          {
                                                            usuario,
                                                            error,
                                                            foto: foto_funcionario,
                                                            matricula:
                                                              funcionario_matricula,
                                                            aluno: aluno1,
                                                          }
                                                        );
                                                      } else {
                                                        bd3
                                                          .select_senha(
                                                            req.body.senha
                                                          )
                                                          .then((msg) => {
                                                            if (msg) {
                                                              error = msg;
                                                              res.render(
                                                                "funcionario/edicao_aluno",
                                                                {
                                                                  usuario,
                                                                  error,
                                                                  foto: foto_funcionario,
                                                                  matricula:
                                                                    funcionario_matricula,
                                                                  aluno: aluno1,
                                                                }
                                                              );
                                                            } else {
                                                              bd.delete_update_aluno(
                                                                {
                                                                  matricula:
                                                                    req.body
                                                                      .matricula,
                                                                  usuario:
                                                                    req.body
                                                                      .usuario,
                                                                  email:
                                                                    req.body
                                                                      .email,
                                                                  celular:
                                                                    req.body
                                                                      .celular,
                                                                  residencial:
                                                                    req.body
                                                                      .residencial,
                                                                  senha:
                                                                    req.body
                                                                      .senha,
                                                                  matricula1:
                                                                    aluno1.matricula,
                                                                }
                                                              ).then(
                                                                (aluno) => {
                                                                  if (
                                                                    aluno ===
                                                                    "error"
                                                                  ) {
                                                                    req.flash(
                                                                      "error_msg",
                                                                      "Error no sistema tente novamente mais tarde"
                                                                    );
                                                                    res.redirect(
                                                                      "/funcionario/aluno"
                                                                    );
                                                                  } else {
                                                                    req.flash(
                                                                      "sucess_msg",
                                                                      "Alteração do aluno feita com sucesso"
                                                                    );
                                                                    res.redirect(
                                                                      "/funcionario/aluno"
                                                                    );
                                                                  }
                                                                }
                                                              );
                                                            }
                                                          });
                                                      }
                                                    });
                                                }
                                              });
                                            }
                                          });
                                      }
                                    });
                                }
                              }
                            );
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != aluno1.matricula &&
    req.body.email != aluno1.email &&
    req.body.celular != aluno1.telefone_celular &&
    req.body.residencial != aluno1.telefone_residencial
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("funcionario/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_funcionario,
                                  matricula: funcionario_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd1
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render("funcionario/edicao_aluno", {
                                        usuario,
                                        error,
                                        foto: foto_funcionario,
                                        matricula: funcionario_matricula,
                                        aluno: aluno1,
                                      });
                                    } else {
                                      bd3
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render(
                                              "funcionario/edicao_aluno",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_funcionario,
                                                matricula:
                                                  funcionario_matricula,
                                                aluno: aluno1,
                                              }
                                            );
                                          } else {
                                            bd.select_residencial(
                                              req.body.residencial
                                            ).then((msg) => {
                                              if (msg) {
                                                error = msg;
                                                res.render(
                                                  "funcionario/edicao_aluno",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_funcionario,
                                                    matricula:
                                                      funcionario_matricula,
                                                    aluno: aluno1,
                                                  }
                                                );
                                              } else {
                                                bd1
                                                  .select_residencial(
                                                    req.body.residencial
                                                  )
                                                  .then((msg) => {
                                                    if (msg) {
                                                      error = msg;
                                                      res.render(
                                                        "funcionario/edicao_aluno",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_funcionario,
                                                          matricula:
                                                            funcionario_matricula,
                                                          aluno: aluno1,
                                                        }
                                                      );
                                                    } else {
                                                      bd3
                                                        .select_residencial(
                                                          req.body.residencial
                                                        )
                                                        .then((msg) => {
                                                          if (msg) {
                                                            error = msg;
                                                            res.render(
                                                              "funcionario/edicao_aluno",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_funcionario,
                                                                matricula:
                                                                  funcionario_matricula,
                                                                aluno: aluno1,
                                                              }
                                                            );
                                                          } else {
                                                            bd.delete_update_aluno(
                                                              {
                                                                matricula:
                                                                  req.body
                                                                    .matricula,
                                                                usuario:
                                                                  req.body
                                                                    .usuario,
                                                                email:
                                                                  req.body
                                                                    .email,
                                                                celular:
                                                                  req.body
                                                                    .celular,
                                                                residencial:
                                                                  req.body
                                                                    .residencial,
                                                                senha:
                                                                  aluno1.senha,
                                                                matricula1:
                                                                  aluno1.matricula,
                                                              }
                                                            ).then((aluno) => {
                                                              if (
                                                                aluno ===
                                                                "error"
                                                              ) {
                                                                req.flash(
                                                                  "error_msg",
                                                                  "Error no sistema tente novamente mais tarde"
                                                                );
                                                                res.redirect(
                                                                  "/funcionario/aluno"
                                                                );
                                                              } else {
                                                                req.flash(
                                                                  "sucess_msg",
                                                                  "Alteração do aluno feita com sucesso"
                                                                );
                                                                res.redirect(
                                                                  "/funcionario/aluno"
                                                                );
                                                              }
                                                            });
                                                          }
                                                        });
                                                    }
                                                  });
                                              }
                                            });
                                          }
                                        });
                                    }
                                  });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != aluno1.matricula &&
    req.body.email != aluno1.email &&
    req.body.celular != aluno1.telefone_celular &&
    req.body.senha != ""
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("funcionario/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_funcionario,
                                  matricula: funcionario_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd1
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render("funcionario/edicao_aluno", {
                                        usuario,
                                        error,
                                        foto: foto_funcionario,
                                        matricula: funcionario_matricula,
                                        aluno: aluno1,
                                      });
                                    } else {
                                      bd3
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render(
                                              "funcionario/edicao_aluno",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_funcionario,
                                                matricula:
                                                  funcionario_matricula,
                                                aluno: aluno1,
                                              }
                                            );
                                          } else if (
                                            req.body.senha.length <= 7 ||
                                            req.body.senha2.length <= 7
                                          ) {
                                            error =
                                              "A senha deve ter no mínimo 8 caracteres";
                                            res.render(
                                              "funcionario/edicao_aluno",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_funcionario,
                                                matricula:
                                                  funcionario_matricula,
                                                aluno: aluno1,
                                              }
                                            );
                                          } else {
                                            bd.select_senha(
                                              req.body.senha
                                            ).then((msg) => {
                                              if (msg) {
                                                error = msg;
                                                res.render(
                                                  "funcionario/edicao_aluno",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_funcionario,
                                                    matricula:
                                                      funcionario_matricula,
                                                    aluno: aluno1,
                                                  }
                                                );
                                              } else {
                                                bd1
                                                  .select_senha(req.body.senha)
                                                  .then((msg) => {
                                                    if (msg) {
                                                      error = msg;
                                                      res.render(
                                                        "funcionario/edicao_aluno",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_funcionario,
                                                          matricula:
                                                            funcionario_matricula,
                                                          aluno: aluno1,
                                                        }
                                                      );
                                                    } else {
                                                      bd3
                                                        .select_senha(
                                                          req.body.senha
                                                        )
                                                        .then((msg) => {
                                                          if (msg) {
                                                            error = msg;
                                                            res.render(
                                                              "funcionario/edicao_aluno",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_funcionario,
                                                                matricula:
                                                                  funcionario_matricula,
                                                                aluno: aluno1,
                                                              }
                                                            );
                                                          } else {
                                                            bd.delete_update_aluno(
                                                              {
                                                                matricula:
                                                                  req.body
                                                                    .matricula,
                                                                usuario:
                                                                  req.body
                                                                    .usuario,
                                                                email:
                                                                  req.body
                                                                    .email,
                                                                celular:
                                                                  req.body
                                                                    .celular,
                                                                residencial:
                                                                  req.body
                                                                    .residencial,
                                                                senha:
                                                                  req.body
                                                                    .senha,
                                                                matricula1:
                                                                  aluno1.matricula,
                                                              }
                                                            ).then((aluno) => {
                                                              if (
                                                                aluno ===
                                                                "error"
                                                              ) {
                                                                req.flash(
                                                                  "error_msg",
                                                                  "Error no sistema tente novamente mais tarde"
                                                                );
                                                                res.redirect(
                                                                  "/funcionario/aluno"
                                                                );
                                                              } else {
                                                                req.flash(
                                                                  "sucess_msg",
                                                                  "Alteração do aluno feita com sucesso"
                                                                );
                                                                res.redirect(
                                                                  "/funcionario/aluno"
                                                                );
                                                              }
                                                            });
                                                          }
                                                        });
                                                    }
                                                  });
                                              }
                                            });
                                          }
                                        });
                                    }
                                  });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != aluno1.matricula &&
    req.body.email != aluno1.email &&
    req.body.residencial != aluno1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("funcionario/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_funcionario,
                                    matricula: funcionario_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("funcionario/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_funcionario,
                                          matricula: funcionario_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd3
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "funcionario/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  aluno: aluno1,
                                                }
                                              );
                                            } else if (
                                              req.body.senha.length <= 7 ||
                                              req.body.senha2.length <= 7
                                            ) {
                                              error =
                                                "A senha deve ter no mínimo 8 caracteres";
                                              res.render(
                                                "funcionario/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  aluno: aluno1,
                                                }
                                              );
                                            } else {
                                              bd.select_senha(
                                                req.body.senha
                                              ).then((msg) => {
                                                if (msg) {
                                                  error = msg;
                                                  res.render(
                                                    "funcionario/edicao_aluno",
                                                    {
                                                      usuario,
                                                      error,
                                                      foto: foto_funcionario,
                                                      matricula:
                                                        funcionario_matricula,
                                                      aluno: aluno1,
                                                    }
                                                  );
                                                } else {
                                                  bd1
                                                    .select_senha(
                                                      req.body.senha
                                                    )
                                                    .then((msg) => {
                                                      if (msg) {
                                                        error = msg;
                                                        res.render(
                                                          "funcionario/edicao_aluno",
                                                          {
                                                            usuario,
                                                            error,
                                                            foto: foto_funcionario,
                                                            matricula:
                                                              funcionario_matricula,
                                                            aluno: aluno1,
                                                          }
                                                        );
                                                      } else {
                                                        bd3
                                                          .select_senha(
                                                            req.body.senha
                                                          )
                                                          .then((msg) => {
                                                            if (msg) {
                                                              error = msg;
                                                              res.render(
                                                                "funcionario/edicao_aluno",
                                                                {
                                                                  usuario,
                                                                  error,
                                                                  foto: foto_funcionario,
                                                                  matricula:
                                                                    funcionario_matricula,
                                                                  aluno: aluno1,
                                                                }
                                                              );
                                                            } else {
                                                              bd.delete_update_aluno(
                                                                {
                                                                  matricula:
                                                                    req.body
                                                                      .matricula,
                                                                  usuario:
                                                                    req.body
                                                                      .usuario,
                                                                  email:
                                                                    req.body
                                                                      .email,
                                                                  celular:
                                                                    req.body
                                                                      .celular,
                                                                  residencial:
                                                                    req.body
                                                                      .residencial,
                                                                  senha:
                                                                    req.body
                                                                      .senha,
                                                                  matricula1:
                                                                    aluno1.matricula,
                                                                }
                                                              ).then(
                                                                (aluno) => {
                                                                  if (
                                                                    aluno ===
                                                                    "error"
                                                                  ) {
                                                                    req.flash(
                                                                      "error_msg",
                                                                      "Error no sistema tente novamente mais tarde"
                                                                    );
                                                                    res.redirect(
                                                                      "/funcionario/aluno"
                                                                    );
                                                                  } else {
                                                                    req.flash(
                                                                      "sucess_msg",
                                                                      "Alteração do aluno feita com sucesso"
                                                                    );
                                                                    res.redirect(
                                                                      "/funcionario/aluno"
                                                                    );
                                                                  }
                                                                }
                                                              );
                                                            }
                                                          });
                                                      }
                                                    });
                                                }
                                              });
                                            }
                                          });
                                      }
                                    });
                                }
                              }
                            );
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != aluno1.matricula &&
    req.body.celular != aluno1.telefone_celular &&
    req.body.residencial != aluno1.telefone_residencial
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("funcionario/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_funcionario,
                                    matricula: funcionario_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("funcionario/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_funcionario,
                                          matricula: funcionario_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd3
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "funcionario/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  aluno: aluno1,
                                                }
                                              );
                                            } else {
                                              bd.delete_update_aluno({
                                                matricula: req.body.matricula,
                                                usuario: req.body.usuario,
                                                email: req.body.email,
                                                celular: req.body.celular,
                                                residencial:
                                                  req.body.residencial,
                                                senha: aluno1.senha,
                                                matricula1: aluno1.matricula,
                                              }).then((aluno) => {
                                                if (aluno === "error") {
                                                  req.flash(
                                                    "error_msg",
                                                    "Error no sistema tente novamente mais tarde"
                                                  );
                                                  res.redirect(
                                                    "/funcionario/aluno"
                                                  );
                                                } else {
                                                  req.flash(
                                                    "sucess_msg",
                                                    "Alteração do aluno feita com sucesso"
                                                  );
                                                  res.redirect(
                                                    "/funcionario/aluno"
                                                  );
                                                }
                                              });
                                            }
                                          });
                                      }
                                    });
                                }
                              }
                            );
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != aluno1.matricula &&
    req.body.email != aluno1.email &&
    req.body.residencial != aluno1.telefone_residencial
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("funcionario/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_funcionario,
                                    matricula: funcionario_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("funcionario/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_funcionario,
                                          matricula: funcionario_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd3
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "funcionario/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  aluno: aluno1,
                                                }
                                              );
                                            } else {
                                              bd.delete_update_aluno({
                                                matricula: req.body.matricula,
                                                usuario: req.body.usuario,
                                                email: req.body.email,
                                                celular: req.body.celular,
                                                residencial:
                                                  req.body.residencial,
                                                senha: aluno1.senha,
                                                matricula1: aluno1.matricula,
                                              }).then((aluno) => {
                                                if (aluno === "error") {
                                                  req.flash(
                                                    "error_msg",
                                                    "Error no sistema tente novamente mais tarde"
                                                  );
                                                  res.redirect(
                                                    "/funcionario/aluno"
                                                  );
                                                } else {
                                                  req.flash(
                                                    "sucess_msg",
                                                    "Alteração do aluno feita com sucesso"
                                                  );
                                                  res.redirect(
                                                    "/funcionario/aluno"
                                                  );
                                                }
                                              });
                                            }
                                          });
                                      }
                                    });
                                }
                              }
                            );
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != aluno1.matricula &&
    req.body.celular != aluno1.telefone_celular &&
    req.body.email != aluno1.telefone_email
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_email(req.body.email).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("funcionario/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_funcionario,
                                  matricula: funcionario_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd1.select_email(req.body.email).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("funcionario/edicao_aluno", {
                                      usuario,
                                      error,
                                      foto: foto_funcionario,
                                      matricula: funcionario_matricula,
                                      aluno: aluno1,
                                    });
                                  } else {
                                    bd3
                                      .select_email(req.body.email)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render(
                                            "funcionario/edicao_aluno",
                                            {
                                              usuario,
                                              error,
                                              foto: foto_funcionario,
                                              matricula: funcionario_matricula,
                                              aluno: aluno1,
                                            }
                                          );
                                        } else {
                                          bd.delete_update_aluno({
                                            matricula: req.body.matricula,
                                            usuario: req.body.usuario,
                                            email: req.body.email,
                                            celular: req.body.celular,
                                            residencial: req.body.residencial,
                                            senha: aluno1.senha,
                                            matricula1: aluno1.matricula,
                                          }).then((aluno) => {
                                            if (aluno === "error") {
                                              req.flash(
                                                "error_msg",
                                                "Error no sistema tente novamente mais tarde"
                                              );
                                              res.redirect(
                                                "/funcionario/aluno"
                                              );
                                            } else {
                                              req.flash(
                                                "sucess_msg",
                                                "Alteração do aluno feita com sucesso"
                                              );
                                              res.redirect(
                                                "/funcionario/aluno"
                                              );
                                            }
                                          });
                                        }
                                      });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != aluno1.matricula &&
    req.body.email != aluno1.email &&
    req.body.senha != ""
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else if (
                            req.body.senha.length <= 7 ||
                            req.body.senha2.length <= 7
                          ) {
                            error = "A senha deve ter no mínimo 8 caracteres";
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_senha(req.body.senha).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("funcionario/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_funcionario,
                                  matricula: funcionario_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd1.select_senha(req.body.senha).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("funcionario/edicao_aluno", {
                                      usuario,
                                      error,
                                      foto: foto_funcionario,
                                      matricula: funcionario_matricula,
                                      aluno: aluno1,
                                    });
                                  } else {
                                    bd3
                                      .select_senha(req.body.senha)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render(
                                            "funcionario/edicao_aluno",
                                            {
                                              usuario,
                                              error,
                                              foto: foto_funcionario,
                                              matricula: funcionario_matricula,
                                              aluno: aluno1,
                                            }
                                          );
                                        } else {
                                          bd.delete_update_aluno({
                                            matricula: req.body.matricula,
                                            usuario: req.body.usuario,
                                            email: req.body.email,
                                            celular: req.body.celular,
                                            residencial: req.body.residencial,
                                            senha: req.body.senha,
                                            matricula1: aluno1.matricula,
                                          }).then((aluno) => {
                                            if (aluno === "error") {
                                              req.flash(
                                                "error_msg",
                                                "Error no sistema tente novamente mais tarde"
                                              );
                                              res.redirect(
                                                "/funcionario/aluno"
                                              );
                                            } else {
                                              req.flash(
                                                "sucess_msg",
                                                "Alteração do aluno feita com sucesso"
                                              );
                                              res.redirect(
                                                "/funcionario/aluno"
                                              );
                                            }
                                          });
                                        }
                                      });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != aluno1.matricula &&
    req.body.celular != aluno1.telefone_celular &&
    req.body.senha != ""
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else if (
                            req.body.senha.length <= 7 ||
                            req.body.senha2.length <= 7
                          ) {
                            error = "A senha deve ter no mínimo 8 caracteres";
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_senha(req.body.senha).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("funcionario/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_funcionario,
                                  matricula: funcionario_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd1.select_senha(req.body.senha).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("funcionario/edicao_aluno", {
                                      usuario,
                                      error,
                                      foto: foto_funcionario,
                                      matricula: funcionario_matricula,
                                      aluno: aluno1,
                                    });
                                  } else {
                                    bd3
                                      .select_senha(req.body.senha)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render(
                                            "funcionario/edicao_aluno",
                                            {
                                              usuario,
                                              error,
                                              foto: foto_funcionario,
                                              matricula: funcionario_matricula,
                                              aluno: aluno1,
                                            }
                                          );
                                        } else {
                                          bd.delete_update_aluno({
                                            matricula: req.body.matricula,
                                            usuario: req.body.usuario,
                                            email: req.body.email,
                                            celular: req.body.celular,
                                            residencial: req.body.residencial,
                                            senha: req.body.senha,
                                            matricula1: aluno1.matricula,
                                          }).then((aluno) => {
                                            if (aluno === "error") {
                                              req.flash(
                                                "error_msg",
                                                "Error no sistema tente novamente mais tarde"
                                              );
                                              res.redirect(
                                                "/funcionario/aluno"
                                              );
                                            } else {
                                              req.flash(
                                                "sucess_msg",
                                                "Alteração do aluno feita com sucesso"
                                              );
                                              res.redirect(
                                                "/funcionario/aluno"
                                              );
                                            }
                                          });
                                        }
                                      });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != aluno1.matricula &&
    req.body.residencial != aluno1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("funcionario/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_funcionario,
                                matricula: funcionario_matricula,
                                aluno: aluno1,
                              });
                            } else if (
                              req.body.senha.length <= 7 ||
                              req.body.senha2.length <= 7
                            ) {
                              error = "A senha deve ter no mínimo 8 caracteres";
                              res.render("funcionario/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_funcionario,
                                matricula: funcionario_matricula,
                                aluno: aluno1,
                              });
                            } else {
                              bd.select_senha(req.body.senha).then((msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("funcionario/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_funcionario,
                                    matricula: funcionario_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd1
                                    .select_senha(req.body.senha)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("funcionario/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_funcionario,
                                          matricula: funcionario_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd3
                                          .select_senha(req.body.senha)
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "funcionario/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  aluno: aluno1,
                                                }
                                              );
                                            } else {
                                              bd.delete_update_aluno({
                                                matricula: req.body.matricula,
                                                usuario: req.body.usuario,
                                                email: req.body.email,
                                                celular: req.body.celular,
                                                residencial:
                                                  req.body.residencial,
                                                senha: req.body.senha,
                                                matricula1: aluno1.matricula,
                                              }).then((aluno) => {
                                                if (aluno === "error") {
                                                  req.flash(
                                                    "error_msg",
                                                    "Error no sistema tente novamente mais tarde"
                                                  );
                                                  res.redirect(
                                                    "/funcionario/aluno"
                                                  );
                                                } else {
                                                  req.flash(
                                                    "sucess_msg",
                                                    "Alteração do aluno feita com sucesso"
                                                  );
                                                  res.redirect(
                                                    "/funcionario/aluno"
                                                  );
                                                }
                                              });
                                            }
                                          });
                                      }
                                    });
                                }
                              });
                            }
                          });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != aluno1.matricula &&
    req.body.email != aluno1.email
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.delete_update_aluno({
                              matricula: req.body.matricula,
                              usuario: req.body.usuario,
                              email: req.body.email,
                              celular: req.body.celular,
                              residencial: req.body.residencial,
                              senha: aluno1.senha,
                              matricula1: aluno1.matricula,
                            }).then((aluno) => {
                              if (aluno === "error") {
                                req.flash(
                                  "error_msg",
                                  "Error no sistema tente novamente mais tarde"
                                );
                                res.redirect("/funcionario/aluno");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do aluno feita com sucesso"
                                );
                                res.redirect("/funcionario/aluno");
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != aluno1.matricula &&
    req.body.celular != aluno1.telefone_celular
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.delete_update_aluno({
                              matricula: req.body.matricula,
                              usuario: req.body.usuario,
                              email: req.body.email,
                              celular: req.body.celular,
                              residencial: req.body.residencial,
                              senha: aluno1.senha,
                              matricula1: aluno1.matricula,
                            }).then((aluno) => {
                              if (aluno === "error") {
                                req.flash(
                                  "error_msg",
                                  "Error no sistema tente novamente mais tarde"
                                );
                                res.redirect("/funcionario/aluno");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do aluno feita com sucesso"
                                );
                                res.redirect("/funcionario/aluno");
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.matricula != aluno1.matricula &&
    req.body.residencial != aluno1.telefone_residencial
  ) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("funcionario/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_funcionario,
                                matricula: funcionario_matricula,
                                aluno: aluno1,
                              });
                            } else {
                              bd.delete_update_aluno({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: aluno1.senha,
                                matricula1: aluno1.matricula,
                              }).then((aluno) => {
                                if (aluno === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/funcionario/aluno");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do aluno feita com sucesso"
                                  );
                                  res.redirect("/funcionario/aluno");
                                }
                              });
                            }
                          });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (req.body.matricula != aluno1.matricula && req.body.senha != "") {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.delete_update_aluno({
                              matricula: req.body.matricula,
                              usuario: req.body.usuario,
                              email: req.body.email,
                              celular: req.body.celular,
                              residencial: req.body.residencial,
                              senha: req.body.senha,
                              matricula1: aluno1.matricula,
                            }).then((aluno) => {
                              if (aluno === "error") {
                                req.flash(
                                  "error_msg",
                                  "Error no sistema tente novamente mais tarde"
                                );
                                res.redirect("/funcionario/aluno");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do aluno feita com sucesso"
                                );
                                res.redirect("/funcionario/aluno");
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (req.body.matricula != aluno1.matricula) {
    bd.select_aluno(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_professor(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_funcionario(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.delete_update_aluno({
                  matricula: req.body.matricula,
                  usuario: req.body.usuario,
                  email: req.body.email,
                  celular: req.body.celular,
                  residencial: req.body.residencial,
                  senha: aluno1.senha,
                  matricula1: aluno1.matricula,
                }).then((aluno) => {
                  if (aluno === "error") {
                    req.flash(
                      "error_msg",
                      "Error no sistema tente novamente mais tarde"
                    );
                    res.redirect("/funcionario/aluno");
                  } else {
                    req.flash(
                      "sucess_msg",
                      "Alteração do aluno feita com sucesso"
                    );
                    res.redirect("/funcionario/aluno");
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.email != aluno1.email &&
    req.body.celular != aluno1.telefone_celular &&
    req.body.residencial != aluno1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_email(req.body.email).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("funcionario/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_funcionario,
                                    matricula: funcionario_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("funcionario/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_funcionario,
                                          matricula: funcionario_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd3
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "funcionario/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  aluno: aluno1,
                                                }
                                              );
                                            } else if (
                                              req.body.senha.length <= 7 ||
                                              req.body.senha2.length <= 7
                                            ) {
                                              error =
                                                "A senha deve ter no mínimo 8 caracteres";
                                              res.render(
                                                "funcionario/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  aluno: aluno1,
                                                }
                                              );
                                            } else {
                                              bd.select_senha(
                                                req.body.senha
                                              ).then((msg) => {
                                                if (msg) {
                                                  error = msg;
                                                  res.render(
                                                    "funcionario/edicao_aluno",
                                                    {
                                                      usuario,
                                                      error,
                                                      foto: foto_funcionario,
                                                      matricula:
                                                        funcionario_matricula,
                                                      aluno: aluno1,
                                                    }
                                                  );
                                                } else {
                                                  bd1
                                                    .select_senha(
                                                      req.body.senha
                                                    )
                                                    .then((msg) => {
                                                      if (msg) {
                                                        error = msg;
                                                        res.render(
                                                          "funcionario/edicao_aluno",
                                                          {
                                                            usuario,
                                                            error,
                                                            foto: foto_funcionario,
                                                            matricula:
                                                              funcionario_matricula,
                                                            aluno: aluno1,
                                                          }
                                                        );
                                                      } else {
                                                        bd3
                                                          .select_senha(
                                                            req.body.senha
                                                          )
                                                          .then((msg) => {
                                                            if (msg) {
                                                              error = msg;
                                                              res.render(
                                                                "funcionario/edicao_aluno",
                                                                {
                                                                  usuario,
                                                                  error,
                                                                  foto: foto_funcionario,
                                                                  matricula:
                                                                    funcionario_matricula,
                                                                  aluno: aluno1,
                                                                }
                                                              );
                                                            } else {
                                                              bd.update_aluno({
                                                                matricula:
                                                                  req.body
                                                                    .matricula,
                                                                usuario:
                                                                  req.body
                                                                    .usuario,
                                                                email:
                                                                  req.body
                                                                    .email,
                                                                celular:
                                                                  req.body
                                                                    .celular,
                                                                residencial:
                                                                  req.body
                                                                    .residencial,
                                                                senha:
                                                                  req.body
                                                                    .senha,
                                                                matricula1:
                                                                  aluno1.matricula,
                                                              }).then(
                                                                (aluno) => {
                                                                  if (
                                                                    aluno ===
                                                                    "error"
                                                                  ) {
                                                                    req.flash(
                                                                      "error_msg",
                                                                      "Error no sistema tente novamente mais tarde"
                                                                    );
                                                                    res.redirect(
                                                                      "/funcionario/aluno"
                                                                    );
                                                                  } else {
                                                                    req.flash(
                                                                      "sucess_msg",
                                                                      "Alteração do aluno feita com sucesso"
                                                                    );
                                                                    res.redirect(
                                                                      "/funcionario/aluno"
                                                                    );
                                                                  }
                                                                }
                                                              );
                                                            }
                                                          });
                                                      }
                                                    });
                                                }
                                              });
                                            }
                                          });
                                      }
                                    });
                                }
                              }
                            );
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.celular != aluno1.telefone_celular &&
    req.body.email != aluno1.email &&
    req.body.senha != ""
  ) {
    bd.select_celular(req.body.celular).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else if (
                            req.body.senha.length <= 7 ||
                            req.body.senha2.length <= 7
                          ) {
                            error = "A senha deve ter no mínimo 8 caracteres";
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_senha(req.body.senha).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("funcionario/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_funcionario,
                                  matricula: funcionario_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd1.select_senha(req.body.senha).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("funcionario/edicao_aluno", {
                                      usuario,
                                      error,
                                      foto: foto_funcionario,
                                      matricula: funcionario_matricula,
                                      aluno: aluno1,
                                    });
                                  } else {
                                    bd3
                                      .select_senha(req.body.senha)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render(
                                            "funcionario/edicao_aluno",
                                            {
                                              usuario,
                                              error,
                                              foto: foto_funcionario,
                                              matricula: funcionario_matricula,
                                              aluno: aluno1,
                                            }
                                          );
                                        } else {
                                          bd.update_aluno({
                                            matricula: req.body.matricula,
                                            usuario: req.body.usuario,
                                            email: req.body.email,
                                            celular: req.body.celular,
                                            residencial: req.body.residencial,
                                            senha: req.body.senha,
                                            matricula1: aluno1.matricula,
                                          }).then((aluno) => {
                                            if (aluno === "error") {
                                              req.flash(
                                                "error_msg",
                                                "Error no sistema tente novamente mais tarde"
                                              );
                                              res.redirect(
                                                "/funcionario/aluno"
                                              );
                                            } else {
                                              req.flash(
                                                "sucess_msg",
                                                "Alteração do aluno feita com sucesso"
                                              );
                                              res.redirect(
                                                "/funcionario/aluno"
                                              );
                                            }
                                          });
                                        }
                                      });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.email != aluno1.email &&
    req.body.residencial != aluno1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_email(req.body.email).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("funcionario/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_funcionario,
                                matricula: funcionario_matricula,
                                aluno: aluno1,
                              });
                            } else if (
                              req.body.senha.length <= 7 ||
                              req.body.senha2.length <= 7
                            ) {
                              error = "A senha deve ter no mínimo 8 caracteres";
                              res.render("funcionario/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_funcionario,
                                matricula: funcionario_matricula,
                                aluno: aluno1,
                              });
                            } else {
                              bd.select_senha(req.body.senha).then((msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("funcionario/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_funcionario,
                                    matricula: funcionario_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd1
                                    .select_senha(req.body.senha)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("funcionario/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_funcionario,
                                          matricula: funcionario_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd3
                                          .select_senha(req.body.senha)
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "funcionario/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  aluno: aluno1,
                                                }
                                              );
                                            } else {
                                              bd.update_aluno({
                                                matricula: req.body.matricula,
                                                usuario: req.body.usuario,
                                                email: req.body.email,
                                                celular: req.body.celular,
                                                residencial:
                                                  req.body.residencial,
                                                senha: req.body.senha,
                                                matricula1: aluno1.matricula,
                                              }).then((aluno) => {
                                                if (aluno === "error") {
                                                  req.flash(
                                                    "error_msg",
                                                    "Error no sistema tente novamente mais tarde"
                                                  );
                                                  res.redirect(
                                                    "/funcionario/aluno"
                                                  );
                                                } else {
                                                  req.flash(
                                                    "sucess_msg",
                                                    "Alteração do aluno feita com sucesso"
                                                  );
                                                  res.redirect(
                                                    "/funcionario/aluno"
                                                  );
                                                }
                                              });
                                            }
                                          });
                                      }
                                    });
                                }
                              });
                            }
                          });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.celular != aluno1.telefone_celular &&
    req.body.residencial != aluno1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_celular(req.body.celular).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("funcionario/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_funcionario,
                                matricula: funcionario_matricula,
                                aluno: aluno1,
                              });
                            } else if (
                              req.body.senha.length <= 7 ||
                              req.body.senha2.length <= 7
                            ) {
                              error = "A senha deve ter no mínimo 8 caracteres";
                              res.render("funcionario/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_funcionario,
                                matricula: funcionario_matricula,
                                aluno: aluno1,
                              });
                            } else {
                              bd.select_senha(req.body.senha).then((msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("funcionario/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_funcionario,
                                    matricula: funcionario_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd1
                                    .select_senha(req.body.senha)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("funcionario/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_funcionario,
                                          matricula: funcionario_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd3
                                          .select_senha(req.body.senha)
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "funcionario/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  aluno: aluno1,
                                                }
                                              );
                                            } else {
                                              bd.update_aluno({
                                                matricula: req.body.matricula,
                                                usuario: req.body.usuario,
                                                email: req.body.email,
                                                celular: req.body.celular,
                                                residencial:
                                                  req.body.residencial,
                                                senha: req.body.senha,
                                                matricula1: aluno1.matricula,
                                              }).then((aluno) => {
                                                if (aluno === "error") {
                                                  req.flash(
                                                    "error_msg",
                                                    "Error no sistema tente novamente mais tarde"
                                                  );
                                                  res.redirect(
                                                    "/funcionario/aluno"
                                                  );
                                                } else {
                                                  req.flash(
                                                    "sucess_msg",
                                                    "Alteração do aluno feita com sucesso"
                                                  );
                                                  res.redirect(
                                                    "/funcionario/aluno"
                                                  );
                                                }
                                              });
                                            }
                                          });
                                      }
                                    });
                                }
                              });
                            }
                          });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.email != aluno1.email &&
    req.body.celular != aluno1.telefone_celular &&
    req.body.residencial != aluno1.telefone_residencial
  ) {
    bd.select_email(req.body.email).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("funcionario/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_funcionario,
                                    matricula: funcionario_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("funcionario/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_funcionario,
                                          matricula: funcionario_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd3
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "funcionario/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_funcionario,
                                                  matricula:
                                                    funcionario_matricula,
                                                  aluno: aluno1,
                                                }
                                              );
                                            } else {
                                              bd.update_aluno({
                                                matricula: req.body.matricula,
                                                usuario: req.body.usuario,
                                                email: req.body.email,
                                                celular: req.body.celular,
                                                residencial:
                                                  req.body.residencial,
                                                senha: aluno1.senha,
                                                matricula1: aluno1.matricula,
                                              }).then((aluno) => {
                                                if (aluno === "error") {
                                                  req.flash(
                                                    "error_msg",
                                                    "Error no sistema tente novamente mais tarde"
                                                  );
                                                  res.redirect(
                                                    "/funcionario/aluno"
                                                  );
                                                } else {
                                                  req.flash(
                                                    "sucess_msg",
                                                    "Alteração do aluno feita com sucesso"
                                                  );
                                                  res.redirect(
                                                    "/funcionario/aluno"
                                                  );
                                                }
                                              });
                                            }
                                          });
                                      }
                                    });
                                }
                              }
                            );
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.email != aluno1.email &&
    req.body.residencial != aluno1.telefone_residencial
  ) {
    bd.select_email(req.body.email).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("funcionario/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_funcionario,
                                matricula: funcionario_matricula,
                                aluno: aluno1,
                              });
                            } else {
                              bd.update_aluno({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: aluno1.senha,
                                matricula1: aluno1.matricula,
                              }).then((aluno) => {
                                if (aluno === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/funcionario/aluno");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do aluno feita com sucesso"
                                  );
                                  res.redirect("/funcionario/aluno");
                                }
                              });
                            }
                          });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.celular != aluno1.telefone_celular &&
    req.body.email != aluno1.email
  ) {
    bd.select_celular(req.body.celular).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.update_aluno({
                              matricula: req.body.matricula,
                              usuario: req.body.usuario,
                              email: req.body.email,
                              celular: req.body.celular,
                              residencial: req.body.residencial,
                              senha: aluno1.senha,
                              matricula1: aluno1.matricula,
                            }).then((aluno) => {
                              if (aluno === "error") {
                                req.flash(
                                  "error_msg",
                                  "Error no sistema tente novamente mais tarde"
                                );
                                res.redirect("/funcionario/aluno");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do aluno feita com sucesso"
                                );
                                res.redirect("/funcionario/aluno");
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.celular != aluno1.telefone_celular &&
    req.body.residencial != aluno1.telefone_residencial
  ) {
    bd.select_celular(req.body.celular).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("funcionario/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_funcionario,
                                matricula: funcionario_matricula,
                                aluno: aluno1,
                              });
                            } else {
                              bd.update_aluno({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: aluno1.senha,
                                matricula1: aluno1.matricula,
                              }).then((aluno) => {
                                if (aluno === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/funcionario/aluno");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do aluno feita com sucesso"
                                  );
                                  res.redirect("/funcionario/aluno");
                                }
                              });
                            }
                          });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (req.body.email != aluno1.email && req.body.senha != "") {
    bd.select_email(req.body.email).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.update_aluno({
                              matricula: req.body.matricula,
                              usuario: req.body.usuario,
                              email: req.body.email,
                              celular: req.body.celular,
                              residencial: req.body.residencial,
                              senha: req.body.senha,
                              matricula1: aluno1.matricula,
                            }).then((aluno) => {
                              if (aluno === "error") {
                                req.flash(
                                  "error_msg",
                                  "Error no sistema tente novamente mais tarde"
                                );
                                res.redirect("/funcionario/aluno");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do aluno feita com sucesso"
                                );
                                res.redirect("/funcionario/aluno");
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (req.body.email != aluno1.email) {
    bd.select_email(req.body.email).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.update_aluno({
                  matricula: req.body.matricula,
                  usuario: req.body.usuario,
                  email: req.body.email,
                  celular: req.body.celular,
                  residencial: req.body.residencial,
                  senha: aluno1.senha,
                  matricula1: aluno1.matricula,
                }).then((aluno) => {
                  if (aluno === "error") {
                    req.flash(
                      "error_msg",
                      "Error no sistema tente novamente mais tarde"
                    );
                    res.redirect("/funcionario/aluno");
                  } else {
                    req.flash(
                      "sucess_msg",
                      "Alteração do aluno feita com sucesso"
                    );
                    res.redirect("/funcionario/aluno");
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.celular != aluno1.telefone_celular &&
    req.body.senha != ""
  ) {
    bd.select_celular(req.body.celular).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.update_aluno({
                              matricula: req.body.matricula,
                              usuario: req.body.usuario,
                              email: req.body.email,
                              celular: req.body.celular,
                              residencial: req.body.residencial,
                              senha: req.body.senha,
                              matricula1: aluno1.matricula,
                            }).then((aluno) => {
                              if (aluno === "error") {
                                req.flash(
                                  "error_msg",
                                  "Error no sistema tente novamente mais tarde"
                                );
                                res.redirect("/funcionario/aluno");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do aluno feita com sucesso"
                                );
                                res.redirect("/funcionario/aluno");
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (req.body.celular != aluno1.telefone_celular) {
    bd.select_celular(req.body.celular).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.update_aluno({
                  matricula: req.body.matricula,
                  usuario: req.body.usuario,
                  email: req.body.email,
                  celular: req.body.celular,
                  residencial: req.body.residencial,
                  senha: aluno1.senha,
                  matricula1: aluno1.matricula,
                }).then((aluno) => {
                  if (aluno === "error") {
                    req.flash(
                      "error_msg",
                      "Error no sistema tente novamente mais tarde"
                    );
                    res.redirect("/funcionario/aluno");
                  } else {
                    req.flash(
                      "sucess_msg",
                      "Alteração do aluno feita com sucesso"
                    );
                    res.redirect("/funcionario/aluno");
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.residencial != aluno1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_residencial(req.body.residencial).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_residencial(req.body.residencial).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_residencial(req.body.residencial).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("funcionario/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_funcionario,
                      matricula: funcionario_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("funcionario/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_funcionario,
                          matricula: funcionario_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("funcionario/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_funcionario,
                              matricula: funcionario_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.update_aluno({
                              matricula: req.body.matricula,
                              usuario: req.body.usuario,
                              email: req.body.email,
                              celular: req.body.celular,
                              residencial: req.body.residencial,
                              senha: req.body.senha,
                              matricula1: aluno1.matricula,
                            }).then((aluno) => {
                              if (aluno === "error") {
                                req.flash(
                                  "error_msg",
                                  "Error no sistema tente novamente mais tarde"
                                );
                                res.redirect("/funcionario/aluno");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do aluno feita com sucesso"
                                );
                                res.redirect("/funcionario/aluno");
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (req.body.residencial != aluno1.telefone_residencial) {
    bd.select_residencial(req.body.residencial).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_residencial(req.body.residencial).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_residencial(req.body.residencial).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.update_aluno({
                  matricula: req.body.matricula,
                  usuario: req.body.usuario,
                  email: req.body.email,
                  celular: req.body.celular,
                  residencial: req.body.residencial,
                  senha: aluno1.senha,
                  matricula1: aluno1.matricula,
                }).then((aluno) => {
                  if (aluno === "error") {
                    req.flash(
                      "error_msg",
                      "Error no sistema tente novamente mais tarde"
                    );
                    res.redirect("/funcionario/aluno");
                  } else {
                    req.flash(
                      "sucess_msg",
                      "Alteração do aluno feita com sucesso"
                    );
                    res.redirect("/funcionario/aluno");
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (req.body.senha != "") {
    bd.select_senha(req.body.senha).then((msg) => {
      if (msg) {
        error = msg;
        res.render("funcionario/edicao_aluno", {
          usuario,
          error,
          foto: foto_funcionario,
          matricula: funcionario_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_senha(req.body.senha).then((msg) => {
          if (msg) {
            error = msg;
            res.render("funcionario/edicao_aluno", {
              usuario,
              error,
              foto: foto_funcionario,
              matricula: funcionario_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_senha(req.body.senha).then((msg) => {
              if (msg) {
                error = msg;
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("funcionario/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_funcionario,
                  matricula: funcionario_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.update_aluno({
                  matricula: req.body.matricula,
                  usuario: req.body.usuario,
                  email: req.body.email,
                  celular: req.body.celular,
                  residencial: req.body.residencial,
                  senha: req.body.senha,
                  matricula1: aluno1.matricula,
                }).then((aluno) => {
                  if (aluno === "error") {
                    req.flash(
                      "error_msg",
                      "Error no sistema tente novamente mais tarde"
                    );
                    res.redirect("/funcionario/aluno");
                  } else {
                    req.flash(
                      "sucess_msg",
                      "Alteração do aluno feita com sucesso"
                    );
                    res.redirect("/funcionario/aluno");
                  }
                });
              }
            });
          }
        });
      }
    });
  } else {
    bd.update_aluno({
      matricula: req.body.matricula,
      usuario: req.body.usuario,
      email: req.body.email,
      celular: req.body.celular,
      residencial: req.body.residencial,
      senha: aluno1.senha,
      matricula1: aluno1.matricula,
    }).then((aluno) => {
      if (aluno === "error") {
        req.flash("error_msg", "Error no sistema tente novamente mais tarde");
        res.redirect("/funcionario/aluno");
      } else {
        req.flash("sucess_msg", "Alteração do aluno feita com sucesso");
        res.redirect("/funcionario/aluno");
      }
    });
  }
});

/*alteração de dados do chamado*/
router.get("/chamado/alteracao/:id", eFuncionario, (req, res) => {
  try {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }
  } catch (error) {
    var funcionario_matricula = null;
  }

  bd3.select_funcionario_usuario(funcionario_matricula).then((funcionario) => {
    if (funcionario === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_funcionario = funcionario[0].foto_perfil;
    } else if (funcionario === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_funcionario = funcionario[0].foto_perfil;
    } else {
      usuario = funcionario[0].usuario;
      foto_funcionario = funcionario[0].foto_perfil;
    }
  });
  bd2.select_chamado1(req.params.id).then((chamado) => {
    if (chamado === "vazio") {
      req.flash("error_msg", "Chamado não encontrado");
      res.redirect("/funcionario/chamado");
    } else if (chamado === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/funcionario/chamado");
    } else {
      chamado = chamado[0];
      chamado1 = chamado;
      res.render("funcionario/edicao_chamado", {
        usuario,
        foto: foto_funcionario,
        matricula: funcionario_matricula,
        chamado,
      });
    }
  });
});

router.post("/chamado/alteracao/foto", eFuncionario, (req, res) => {
  funcionario_perfil(req, res, () => {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_funcionario !== "undefined") {
      fs.unlink("./public/upload/funcionario/" + foto_funcionario, () => {});
    }

    bd3
      .update_foto_funcionario({
        foto_perfil: req.file.filename,
        matricula: funcionario_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do funcionario");
        } else {
          res.redirect("/funcionario/chamado/alteracao/" + chamado1.id);
        }
      });
  });
});

router.post("/chamado/alteracao", eFuncionario, (req, res) => {
  try {
    if ((req.user[0].eAdmin = !0)) {
      usuario = "[Você não devia estar aqui!!!]";
    } else if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    }
  } catch (error) {
    usuario = "[Você não devia estar aqui!!!]";
  }
  if (chamado1.nome_aluno != null) {
    alteracaoAlunoImagem(req, res, (err) => {
      if (req.body.alterar === "Alterar chamado") {
        if (typeof req.files[0] === "undefined") {
          req.files[0] = { filename: chamado1.img1 };
          req.files[1] = { filename: chamado1.img2 };
          req.files[2] = { filename: chamado1.img3 };
        } else if (typeof req.files[1] === "undefined") {
          req.files[1] = { filename: chamado1.img2 };
          req.files[2] = { filename: chamado1.img3 };
          fs.unlink("./public/upload/chamado_aluno/" + chamado1.img1, (err) => {
            if (err) {
              console.log(err);
            }
          });
        } else if (typeof req.files[2] === "undefined") {
          req.files[2] = { filename: chamado1.img3 };
          fs.unlink("./public/upload/chamado_aluno/" + chamado1.img1, (err) => {
            if (err) {
              console.log(err);
            }
          });
          fs.unlink("./public/upload/chamado_aluno/" + chamado1.img2, (err) => {
            if (err) {
              console.log(err);
            }
          });
        } else if (typeof req.files[2] !== "undefined") {
          fs.unlink("./public/upload/chamado_aluno/" + chamado1.img1, (err) => {
            if (err) {
              console.log(err);
            }
          });
          fs.unlink("./public/upload/chamado_aluno/" + chamado1.img2, (err) => {
            if (err) {
              console.log(err);
            }
          });
          fs.unlink("./public/upload/chamado_aluno/" + chamado1.img3, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }

        if (err instanceof multer.MulterError) {
          err = "Envio de arquivos invalida";
          res.setTimeout(480000);
          res.render("funcionario/edicao_chamado", {
            usuario,
            foto: foto_funcionario,
            matricula: funcionario_matricula,
            error: err,
          });
        } else if (err) {
          res.setTimeout(480000);
          res.render("funcionario/edicao_chamado", {
            usuario,
            foto: foto_funcionario,
            matricula: funcionario_matricula,
            error: err,
          });
        } else {
          bd2
            .update_chamado({
              titulo: req.body.titulo,
              assunto: req.body.assunto,
              statusd: req.body.status,
              nivel: req.body.nivel,
              prioridade: req.body.prioridade,
              img1: req.files[0].filename,
              img2: req.files[1].filename,
              img3: req.files[2].filename,
              descricao: req.body.descricao,
              id: chamado1.id,
            })
            .then((error) => {
              if (error === "error") {
                req.flash(
                  "error_msg",
                  "Error no sistema tente novamente mais tarde"
                );
                res.redirect("/funcionario/chamado");
              } else {
                req.flash(
                  "sucess_msg",
                  "Alteração do chamado feita com sucesso"
                );
                res.redirect("/funcionario/chamado");
              }
            });
        }
      } else if (req.body.deletar === "Deletar imagens") {
        fs.unlink("./public/upload/chamado_aluno/" + chamado1.img1, (err) => {
          if (err) {
            console.log(err);
          }
        });
        fs.unlink("./public/upload/chamado_aluno/" + chamado1.img2, (err) => {
          if (err) {
            console.log(err);
          }
        });
        fs.unlink("./public/upload/chamado_aluno/" + chamado1.img3, (err) => {
          if (err) {
            console.log(err);
          }
        });
        bd2
          .update_imagem({
            img1: null,
            img2: null,
            img3: null,
            id: chamado1.id,
          })
          .then((error) => {
            if (error === "error") {
              req.flash(
                "error_msg",
                "Error no sistema tente novamente mais tarde"
              );
              res.redirect("/funcionario/chamado");
            } else {
              req.flash("sucess_msg", "Exclusão das imagens feita com sucesso");
              res.redirect("/funcionario/chamado/alteracao/" + chamado1.id);
            }
          });
      }
    });
  } else {
    alteracaoProfessorImagem(req, res, (err) => {
      if (req.body.alterar === "Alterar chamado") {
        if (typeof req.files[0] === "undefined") {
          req.files[0] = { filename: chamado1.img1 };
          req.files[1] = { filename: chamado1.img2 };
          req.files[2] = { filename: chamado1.img3 };
        } else if (typeof req.files[1] === "undefined") {
          req.files[1] = { filename: chamado1.img2 };
          req.files[2] = { filename: chamado1.img3 };
          fs.unlink(
            "./public/upload/chamado_professor/" + chamado1.img1,
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        } else if (typeof req.files[2] === "undefined") {
          req.files[2] = { filename: chamado1.img3 };
          fs.unlink(
            "./public/upload/chamado_professor/" + chamado1.img1,
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
          fs.unlink(
            "./public/upload/chamado_professor/" + chamado1.img2,
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        } else if (typeof req.files[2] !== "undefined") {
          fs.unlink(
            "./public/upload/chamado_professor/" + chamado1.img1,
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
          fs.unlink(
            "./public/upload/chamado_professor/" + chamado1.img2,
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
          fs.unlink(
            "./public/upload/chamado_professor/" + chamado1.img3,
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }

        if (err instanceof multer.MulterError) {
          err = "Envio de arquivos invalida";
          res.setTimeout(480000);
          res.render("funcionario/edicao_chamado", {
            usuario,
            foto: foto_funcionario,
            matricula: funcionario_matricula,
            error: err,
          });
        } else if (err) {
          res.setTimeout(480000);
          res.render("funcionario/edicao_chamado", {
            usuario,
            foto: foto_funcionario,
            matricula: funcionario_matricula,
            error: err,
          });
        } else {
          bd2
            .update_chamado({
              titulo: req.body.titulo,
              assunto: req.body.assunto,
              statusd: req.body.status,
              nivel: req.body.nivel,
              prioridade: req.body.prioridade,
              img1: req.files[0].filename,
              img2: req.files[1].filename,
              img3: req.files[2].filename,
              descricao: req.body.descricao,
              id: chamado1.id,
            })
            .then((error) => {
              if (error === "error") {
                req.flash(
                  "error_msg",
                  "Error no sistema tente novamente mais tarde"
                );
                res.redirect("/funcionario/chamado");
              } else {
                req.flash(
                  "sucess_msg",
                  "Alteração do chamado feita com sucesso"
                );
                res.redirect("/funcionario/chamado");
              }
            });
        }
      } else if (req.body.deletar === "Deletar imagens") {
        fs.unlink(
          "./public/upload/chamado_professor/" + chamado1.img1,
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
        fs.unlink(
          "./public/upload/chamado_professor/" + chamado1.img2,
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
        fs.unlink(
          "./public/upload/chamado_professor/" + chamado1.img3,
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
        bd2
          .update_imagem({
            img1: null,
            img2: null,
            img3: null,
            id: chamado1.id,
          })
          .then((error) => {
            if (error === "error") {
              req.flash(
                "error_msg",
                "Error no sistema tente novamente mais tarde"
              );
              res.redirect("/funcionario/chamado");
            } else {
              req.flash("sucess_msg", "Exclusão das imagens feita com sucesso");
              res.redirect("/funcionario/chamado/alteracao/" + chamado1.id);
            }
          });
      }
    });
  }
});

/*exclusão da foto de perfil do funcionario na pagina de inicial*/
router.get("/exclusao/:matricula", eFuncionario, (req, res) => {
  bd3
    .update_foto_funcionario({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do funcionario");
      } else {
        fs.unlink("./public/upload/funcionario/" + foto_funcionario, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/funcionario");
      }
    });
});

/*exclusão da foto de perfil do funcionario na pagina de cadastro de aluno*/
router.get("/cadastrar-aluno/exclusao/:matricula", eFuncionario, (req, res) => {
  bd3
    .update_foto_funcionario({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do funcionario");
      } else {
        fs.unlink("./public/upload/funcionario/" + foto_funcionario, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/funcionario/cadastrar-aluno");
      }
    });
});

/*exclusão da foto de perfil do funcionario na pagina de cadastro do professor*/
router.get(
  "/cadastrar-professor/exclusao/:matricula",
  eFuncionario,
  (req, res) => {
    bd3
      .update_foto_funcionario({
        foto_perfil: "",
        matricula: req.params.matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao excluir a foto de perfil do funcionario");
        } else {
          fs.unlink(
            "./public/upload/funcionario/" + foto_funcionario,
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
          res.redirect("/funcionario/cadastrar-professor");
        }
      });
  }
);

/*exclusão da foto de perfil do funcionario na pagina de cadastro de relatorio*/
router.get(
  "/cadastrar-relatorio/exclusao/:matricula",
  eFuncionario,
  (req, res) => {
    bd3
      .update_foto_funcionario({
        foto_perfil: "",
        matricula: req.params.matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao excluir a foto de perfil do funcionario");
        } else {
          fs.unlink(
            "./public/upload/funcionario/" + foto_funcionario,
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
          res.redirect("/funcionario/cadastrar-relatorio");
        }
      });
  }
);

/*exclusão da foto de perfil do funcionario na pagina de alunos*/
router.get("/aluno/foto/exclusao/:matricula", eFuncionario, (req, res) => {
  bd3
    .update_foto_funcionario({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do funcionario");
      } else {
        fs.unlink("./public/upload/funcionario/" + foto_funcionario, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/funcionario/aluno");
      }
    });
});

/*exclusão da foto de perfil do funcionario na pagina de professores*/
router.get("/professor/foto/exclusao/:matricula", eFuncionario, (req, res) => {
  bd3
    .update_foto_funcionario({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do funcionario");
      } else {
        fs.unlink("./public/upload/funcionario/" + foto_funcionario, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/funcionario/professor");
      }
    });
});

/*exclusão da foto de do funcionario na pagina de chat*/
router.get("/chat/exclusao/:matricula", eFuncionario, (req, res) => {
  bd3
    .update_foto_funcionario({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do funcionario");
      } else {
        fs.unlink("./public/upload/funcionario/" + foto_funcionario, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/funcionario/chat");
      }
    });
});

/*exclusão da foto de perfil do funcionario na pagina de relatorios*/
router.get("/relatorio/foto/exclusao/:matricula", eFuncionario, (req, res) => {
  bd3
    .update_foto_funcionario({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do funcionario");
      } else {
        fs.unlink("./public/upload/funcionario/" + foto_funcionario, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/funcionario/relatorio");
      }
    });
});

/*exclusão da foto de perfil do funcionario na pagina de chamados*/
router.get("/chamado/foto/exclusao/:matricula", eFuncionario, (req, res) => {
  bd3
    .update_foto_funcionario({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do funcionario");
      } else {
        fs.unlink("./public/upload/funcionario/" + foto_funcionario, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/funcionario/chamado");
      }
    });
});

/*exclusão da foto de perfil do funcionario na pagina de alteração do aluno*/
router.get("/aluno/alteracao/exclusao/:matricula", eFuncionario, (req, res) => {
  bd3
    .update_foto_funcionario({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do funcionario");
      } else {
        fs.unlink("./public/upload/funcionario/" + foto_funcionario, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/funcionario/aluno/alteracao/" + aluno1.matricula);
      }
    });
});

/*exclusão da foto de perfil do funcionario na pagina de alteração de chamado*/
router.get(
  "/chamado/alteracao/exclusao/:matricula",
  eFuncionario,
  (req, res) => {
    bd3
      .update_foto_funcionario({
        foto_perfil: "",
        matricula: req.params.matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao excluir a foto de perfil do funcionario");
        } else {
          fs.unlink(
            "./public/upload/funcionario/" + foto_funcionario,
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
          res.redirect("/funcionario/chamado/alteracao/" + chamado1.id);
        }
      });
  }
);

/*exclusão da foto de perfil do funcionario na pagina de alteração do professor*/
router.get(
  "/professor/alteracao/exclusao/:matricula",
  eFuncionario,
  (req, res) => {
    bd3
      .update_foto_funcionario({
        foto_perfil: "",
        matricula: req.params.matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao excluir a foto de perfil do funcionario");
        } else {
          fs.unlink(
            "./public/upload/funcionario/" + foto_funcionario,
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
          res.redirect(
            "/funcionario/professor/alteracao/" + professor1.matricula
          );
        }
      });
  }
);

/*exclusão da foto de perfil do funcionario na pagina de alteração de relatorio*/
router.get(
  "relatorio/alteracao/exclusao/:matricula",
  eFuncionario,
  (req, res) => {
    bd3
      .update_foto_funcionario({
        foto_perfil: "",
        matricula: req.params.matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao excluir a foto de perfil do funcionario");
        } else {
          fs.unlink(
            "./public/upload/funcionario/" + foto_funcionario,
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
          res.redirect("/funcionario/relatorio/alteracao/" + relatorio1.id);
        }
      });
  }
);

/*exclusao do aluno*/
router.get("/aluno/exclusao/:matricula", eFuncionario, (req, res) => {
  bd.delete_aluno(req.params.matricula).then((error) => {
    if (error === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/funcionario/aluno");
    } else {
      req.flash("sucess_msg", "Exclusão do aluno feita com sucesso");
      res.redirect("/funcionario/aluno");
    }
  });
});

/*exclusao do professor*/
router.get("/professor/exclusao/:matricula", eFuncionario, (req, res) => {
  bd1.delete_professor(req.params.matricula).then((error) => {
    if (error === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/funcionario/professor");
    } else {
      req.flash("sucess_msg", "Exclusão do professor feita com sucesso");
      res.redirect("/funcionario/professor");
    }
  });
});

/*exclusão do chamado*/
router.get("/chamado/exclusao/:id", eFuncionario, (req, res) => {
  bd2.select_usuario_imagem(req.params.id).then((usuario) => {
    if (usuario === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/funcionario/chamado");
    } else {
      usuario = usuario[0];
      chamado1 = usuario;
      if (typeof chamado1 === "undefined") {
        chamado1 = {
          img1: null,
          img2: null,
          img3: null,
        };
      }
    }
  });
  bd2.delete_chamado(req.params.id).then((error) => {
    if (error === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/funcionario/chamado");
    } else if (chamado1.nome_aluno !== null) {
      if (chamado1.img1 != null) {
        fs.unlink("./public/upload/chamado_aluno/" + chamado1.img1, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
      if (chamado1.img2 != null) {
        fs.unlink("./public/upload/chamado_aluno/" + chamado1.img2, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
      if (chamado1.img3 != null) {
        fs.unlink("./public/upload/chamado_aluno/" + chamado1.img3, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
      req.flash("sucess_msg", "Exclusão do chamado feita com sucesso");
      res.redirect("/funcionario/chamado");
    } else {
      if (chamado1.img1 != null) {
        fs.unlink(
          "./public/upload/chamado_professor/" + chamado1.img1,
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
      }
      if (chamado1.img2 != null) {
        fs.unlink(
          "./public/upload/chamado_professor/" + chamado1.img2,
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
      }
      if (chamado1.img3 != null) {
        fs.unlink(
          "./public/upload/chamado_professor/" + chamado1.img3,
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
      }
      req.flash("sucess_msg", "Exclusão do chamado feita com sucesso");
      res.redirect("/funcionario/chamado");
    }
  });
});

/*chat*/
router.get("/chat", eFuncionario, (req, res) => {
  try {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
      var funcionario_eAdmin = req.user[0].eAdmin;
    } else {
      var funcionario_matricula = null;
    }
  } catch (error) {
    var funcionario_matricula = null;
  }

  bd3.select_funcionario_usuario(funcionario_matricula).then((funcionario) => {
    if (funcionario === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_funcionario = funcionario[0].foto_perfil;
    } else if (funcionario === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_funcionario = funcionario[0].foto_perfil;
    } else {
      usuario = funcionario[0].usuario;
      foto_funcionario = funcionario[0].foto_perfil;
    }
  });
  bd2.select_chamadofuncionario(req.user).then((chamado) => {
    if (chamado === "Error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/funcionario");
    } else {
      res.render("funcionario/chat", {
        usuario,
        foto: foto_funcionario,
        eAdmin: funcionario_eAdmin,
        matricula: funcionario_matricula,
        chamado,
      });
    }
  });
});

router.post("/chat/foto", eFuncionario, (req, res) => {
  funcionario_perfil(req, res, () => {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_funcionario !== "undefined") {
      fs.unlink("./public/upload/funcionario/" + foto_funcionario, () => {});
    }

    bd3
      .update_foto_funcionario({
        foto_perfil: req.file.filename,
        matricula: funcionario_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do funcionario");
        } else {
          res.redirect("/funcionario/chat");
        }
      });
  });
});

router.get("/chat/:id", eFuncionario, (req, res) => {
  try {
    if (req.user[0].eAdmin == 0) {
      var funcionario_matricula = req.user[0].matricula;
    } else {
      var funcionario_matricula = null;
    }
  } catch (error) {
    var funcionario_matricula = null;
  }
  bd2
    .update_chamado_funcionario({
      fk_funcionario: funcionario_matricula,
      statusd: "Em Atendimento",
      id: req.params.id,
    })
    .then((error) => {
      if (error === "Error") {
        req.flash("error_msg", "Error no sistema tente novamente mais tarde");
        res.redirect("/funcionario/chamado");
      } else {
        res.redirect("/funcionario/chat");
      }
    });
});

/*logout do funcionario*/
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash("error_msg", "Error ao deslogar como funcionário!!!");
      res.redirect("/");
    } else {
      req.flash(
        "sucess_msg",
        "Deslogado como funcionário feito com sucesso!!!"
      );
      res.redirect("/");
    }
  });
});
module.exports = router;
