const express = require("express");
const router = express.Router();
const bd = require("../models/bd_aluno");
const bd1 = require("../models/bd_chamado");
const bd2 = require("../models/bd_funcionario");
const bd3 = require("../models/bd_professor");
const upload = require("../config/multer");
const multer = require("multer");
const fs = require("fs");
const { eProfessor } = require("../helpers/eProfessor");
const uploadChamadoProfessor = upload
  .upload_chamado_professor()
  .array("imagem_chamado1", 3);
const alteracaoProfessorImagem = upload
  .alteracao_professor_imagem()
  .array("imagem_alteracao_chamado", 3);
const professor_perfil = upload.upload_professor().single("professor_foto");
var chamado1;
var aluno1;
var usuario;
var foto_professor;

/*pagina inicial do professor*/
router.get("/", eProfessor, (req, res) => {
  try {
    if (req.user[0].eAdmin == 2) {
      var professor_matricula = req.user[0].matricula;
    } else {
      var professor_matricula = null;
    }
  } catch (error) {
    var professor_matricula = null;
  }

  bd3.select_professor_usuario(professor_matricula).then((professor) => {
    if (professor === "vazio") {
      res.render("professor/index", {
        usuario: "[Você não devia estar aqui!!!]",
        foto: professor[0].foto_perfil,
      });
    } else if (professor === "error") {
      res.render("professor/index", {
        usuario: "[Error com o nome do usuário]",
        foto: professor[0].foto_perfil,
      });
    } else {
      foto_professor = professor[0].foto_perfil;
      res.render("professor/index", {
        usuario: professor[0].usuario,
        foto: professor[0].foto_perfil,
        matricula: professor_matricula,
      });
    }
  });
});

router.post("/", eProfessor, (req, res) => {
  professor_perfil(req, res, () => {
    if (req.user[0].eAdmin == 2) {
      var professor_matricula = req.user[0].matricula;
    } else {
      var professor_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_professor !== "undefined") {
      fs.unlink("./public/upload/professor/" + foto_professor, () => {});
    }

    bd3
      .update_foto_professor({
        foto_perfil: req.file.filename,
        matricula: professor_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do professor");
        } else {
          res.redirect("/professor");
        }
      });
  });
});

/*inclusão de dados do aluno*/
router.get("/cadastrar-aluno", eProfessor, (req, res) => {
  try {
    if (req.user[0].eAdmin == 2) {
      var professor_matricula = req.user[0].matricula;
    } else {
      var professor_matricula = null;
    }
  } catch (error) {
    var professor_matricula = null;
  }

  bd3.select_professor_usuario(professor_matricula).then((professor) => {
    if (professor === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      res.render("professor/cadastro_aluno", {
        usuario: "[Você não devia estar aqui!!!]",
        foto: professor[0].foto_perfil,
      });
    } else if (professor === "error") {
      usuario = "[Error com o nome do usuário]";
      res.render("professor/cadastro_aluno", {
        usuario: "[Error com o nome do usuário]",
        foto: professor[0].foto_perfil,
      });
    } else {
      usuario = professor[0].usuario;
      foto_professor = professor[0].foto_perfil;
      res.render("professor/cadastro_aluno", {
        usuario: professor[0].usuario,
        foto: professor[0].foto_perfil,
        matricula: professor_matricula,
      });
    }
  });
});

router.post("/cadastrar-aluno/foto", eProfessor, (req, res) => {
  professor_perfil(req, res, () => {
    if (req.user[0].eAdmin == 2) {
      var professor_matricula = req.user[0].matricula;
    } else {
      var professor_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_professor !== "undefined") {
      fs.unlink("./public/upload/professor/" + foto_professor, () => {});
    }

    bd3
      .update_foto_professor({
        foto_perfil: req.file.filename,
        matricula: professor_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do professor");
        } else {
          res.redirect("/professor/cadastrar-aluno");
        }
      });
  });
});

router.post("/cadastrar-aluno/nova", eProfessor, (req, res) => {
  try {
    if (req.user[0].eAdmin != 2) {
      usuario = "[Você não devia estar aqui!!!]";
    } else if (req.user[0].eAdmin == 2) {
      var professor_matricula = req.user[0].matricula;
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
    res.render("professor/cadastro_aluno", {
      usuario,
      error,
      foto: foto_professor,
      matricula: professor_matricula,
      dados,
    });
  } else if (
    !req.body.usuario ||
    typeof req.body.usuario === undefined ||
    req.body.usuario === null
  ) {
    error = "Usuário invalido";
    res.render("professor/cadastro_aluno", {
      usuario,
      error,
      foto: foto_professor,
      matricula: professor_matricula,
      dados,
    });
  } else if (
    !req.body.email ||
    typeof req.body.email === undefined ||
    req.body.email === null
  ) {
    error = "Email invalido";
    res.render("professor/cadastro_aluno", {
      usuario,
      error,
      foto: foto_professor,
      matricula: professor_matricula,
      dados,
    });
  } else if (
    !req.body.celular ||
    typeof req.body.celular === undefined ||
    req.body.celular === null
  ) {
    error = "Telefone celular invalido";
    res.render("professor/cadastro_aluno", {
      usuario,
      error,
      foto: foto_professor,
      matricula: professor_matricula,
      dados,
    });
  } else if (req.body.celular.length < 15) {
    error = "Número de celular invalido";
    res.render("professor/cadastro_aluno", {
      usuario,
      error,
      foto: foto_professor,
      matricula: professor_matricula,
      dados,
    });
  } else if (req.body.residencial && req.body.residencial.length < 14) {
    error = "Número residencial invalido";
    res.render("professor/cadastro_aluno", {
      usuario,
      error,
      foto: foto_professor,
      matricula: professor_matricula,
      dados,
    });
  } else if (
    !req.body.senha ||
    typeof req.body.senha === undefined ||
    req.body.senha === null
  ) {
    error = "Senha invalida";
    res.render("professor/cadastro_aluno", {
      usuario,
      error,
      foto: foto_professor,
      matricula: professor_matricula,
      dados,
    });
  } else if (
    !req.body.senha2 ||
    typeof req.body.senha2 === undefined ||
    req.body.senha2 === null
  ) {
    error = "Repetição de senha invalida";
    res.render("professor/cadastro_aluno", {
      usuario,
      error,
      foto: foto_professor,
      matricula: professor_matricula,
      dados,
    });
  } else if (req.body.senha !== req.body.senha2) {
    error = "Senhas diferentes";
    res.render("professor/cadastro_aluno", {
      usuario,
      error,
      foto: foto_professor,
      matricula: professor_matricula,
      dados,
    });
  } else if (req.body.senha.length <= 7 || req.body.senha2.length <= 7) {
    error = "A senha deve ter no mínimo 8 caracteres";
    res.render("professor/cadastro_aluno", {
      usuario,
      error,
      foto: foto_professor,
      matricula: professor_matricula,
      dados,
    });
  } else {
    bd3.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("professor/cadastro_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          dados,
        });
      } else {
        bd2.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/cadastro_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              dados,
            });
          } else {
            bd.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/cadastro_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  dados,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/cadastro_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      dados,
                    });
                  } else {
                    bd2.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/cadastro_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          dados,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/cadastro_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
                              dados,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("professor/cadastro_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_professor,
                                  matricula: professor_matricula,
                                  dados,
                                });
                              } else {
                                bd2
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render("professor/cadastro_aluno", {
                                        usuario,
                                        error,
                                        foto: foto_professor,
                                        matricula: professor_matricula,
                                        dados,
                                      });
                                    } else {
                                      bd3
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render(
                                              "professor/cadastro_aluno",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_professor,
                                                matricula: professor_matricula,
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
                                                  "professor/cadastro_aluno",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_professor,
                                                    matricula:
                                                      professor_matricula,
                                                    dados,
                                                  }
                                                );
                                              } else {
                                                bd2
                                                  .select_residencial(
                                                    req.body.residencial
                                                  )
                                                  .then((msg) => {
                                                    if (msg) {
                                                      error = msg;
                                                      res.render(
                                                        "professor/cadastro_aluno",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_professor,
                                                          matricula:
                                                            professor_matricula,
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
                                                              "professor/cadastro_aluno",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_professor,
                                                                matricula:
                                                                  professor_matricula,
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
                                                                  "professor/cadastro_aluno",
                                                                  {
                                                                    usuario,
                                                                    error,
                                                                    foto: foto_professor,
                                                                    matricula:
                                                                      professor_matricula,
                                                                    dados,
                                                                  }
                                                                );
                                                              } else {
                                                                bd2
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
                                                                          "professor/cadastro_aluno",
                                                                          {
                                                                            usuario,
                                                                            error,
                                                                            foto: foto_professor,
                                                                            matricula:
                                                                              professor_matricula,
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
                                                                                  "professor/cadastro_aluno",
                                                                                  {
                                                                                    usuario,
                                                                                    error,
                                                                                    foto: foto_professor,
                                                                                    matricula:
                                                                                      professor_matricula,
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
                                                                                        "professor/cadastro_aluno",
                                                                                        {
                                                                                          usuario,
                                                                                          error,
                                                                                          foto: foto_professor,
                                                                                          matricula:
                                                                                            professor_matricula,
                                                                                          dados,
                                                                                        }
                                                                                      );
                                                                                    } else {
                                                                                      var sucesso =
                                                                                        "Aluno cadastrado com sucesso";
                                                                                      res.render(
                                                                                        "professor/cadastro_aluno",
                                                                                        {
                                                                                          usuario,
                                                                                          foto: foto_professor,
                                                                                          matricula:
                                                                                            professor_matricula,
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

/*inclusão de chamados*/
router.get("/criar-chamado", eProfessor, (req, res) => {
  try {
    if (req.user[0].eAdmin == 2) {
      var professor_matricula = req.user[0].matricula;
    } else {
      var professor_matricula = null;
    }
  } catch (error) {
    var professor_matricula = null;
  }

  bd3.select_professor_usuario(professor_matricula).then((professor) => {
    if (professor === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      res.render("professor/criar_chamado", {
        usuario: "[Você não devia estar aqui!!!]",
        foto: professor[0].foto_perfil,
      });
    } else if (professor === "error") {
      usuario = "[Error com o nome do usuário]";
      res.render("professor/criar_chamado", {
        usuario: "[Error com o nome do usuário]",
        foto: professor[0].foto_perfil,
      });
    } else {
      usuario = professor[0].usuario;
      foto_professor = professor[0].foto_perfil;
      res.render("professor/criar_chamado", {
        usuario: professor[0].usuario,
        foto: professor[0].foto_perfil,
        matricula: professor_matricula,
      });
    }
  });
});

router.post("/criar-chamado/foto", eProfessor, (req, res) => {
  professor_perfil(req, res, () => {
    if (req.user[0].eAdmin == 2) {
      var professor_matricula = req.user[0].matricula;
    } else {
      var professor_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_professor !== "undefined") {
      fs.unlink("./public/upload/professor/" + foto_professor, () => {});
    }

    bd3
      .update_foto_professor({
        foto_perfil: req.file.filename,
        matricula: professor_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do professor");
        } else {
          res.redirect("/professor/criar-chamado");
        }
      });
  });
});

router.post("/criar-chamado/nova", eProfessor, (req, res) => {
  try {
    if (req.user[0].eAdmin != 2) {
      usuario = "[Você não devia estar aqui!!!]";
    }
  } catch (error) {
    usuario = "[Você não devia estar aqui!!!]";
  }
  uploadChamadoProfessor(req, res, (err) => {
    var dados = {
      titulo: req.body.titulo,
      assunto: req.body.assunto,
      nivel: req.body.nivel,
      prioridade: req.body.prioridade,
      descricao: req.body.descricao,
    };
    var error;
    if (req.user[0].eAdmin == 2) {
      var professor_matricula = req.user[0].matricula;
    } else {
      var professor_matricula = null;
    }

    if (typeof req.files[0] === "undefined") {
      req.files[0] = { filename: null };
      req.files[1] = { filename: null };
      req.files[2] = { filename: null };
    } else if (typeof req.files[1] === "undefined") {
      req.files[1] = { filename: null };
      req.files[2] = { filename: null };
    } else if (typeof req.files[2] === "undefined") {
      req.files[2] = { filename: null };
    }

    if (
      !req.body.titulo ||
      typeof req.body.titulo === undefined ||
      req.body.titulo === null
    ) {
      error = "Titulo invalido";
      res.render("professor/criar_chamado", {
        usuario,
        error,
        foto: foto_professor,
        matricula: professor_matricula,
        dados,
      });
    } else if (
      !req.body.assunto ||
      typeof req.body.assunto === undefined ||
      req.body.assunto === null
    ) {
      error = "Assunto invalido";
      res.render("professor/criar_chamado", {
        usuario,
        error,
        foto: foto_professor,
        matricula: professor_matricula,
        dados,
      });
    } else if (
      !req.body.nivel ||
      typeof req.body.nivel === undefined ||
      req.body.nivel === null ||
      req.body.nivel === "Selecione"
    ) {
      error = "Nível invalido";
      res.render("professor/criar_chamado", {
        usuario,
        error,
        foto: foto_professor,
        matricula: professor_matricula,
        dados,
      });
    } else if (
      !req.body.prioridade ||
      typeof req.body.prioridade === undefined ||
      req.body.prioridade === null ||
      req.body.prioridade === "Selecione"
    ) {
      error = "Prioridade invalida";
      res.render("professor/criar_chamado", {
        usuario,
        error,
        foto: foto_professor,
        matricula: professor_matricula,
        dados,
      });
    } else if (
      !req.body.descricao ||
      typeof req.body.descricao === undefined ||
      req.body.descricao === null
    ) {
      error = "Descrição invalida";
      res.render("professor/criar_chamado", {
        usuario,
        error,
        foto: foto_professor,
        matricula: professor_matricula,
        dados,
      });
    } else if (err instanceof multer.MulterError) {
      err = "Envio de arquivos invalida";
      res.render("professor/criar_chamado", {
        usuario,
        error: err,
        foto: foto_professor,
        matricula: professor_matricula,
        dados,
      });
    } else if (err) {
      res.render("professor/criar_chamado", {
        usuario,
        error: err,
        foto: foto_professor,
        matricula: professor_matricula,
        dados,
      });
    } else {
      bd1
        .insert_chamado({
          titulo: req.body.titulo,
          assunto: req.body.assunto,
          nome: req.body.nome,
          nivel: req.body.nivel,
          prioridade: req.body.prioridade,
          descricao: req.body.descricao,
          img1: req.files[0].filename,
          img2: req.files[1].filename,
          img3: req.files[2].filename,
          fk_professor: professor_matricula,
          fk_aluno: null,
        })
        .then((msg) => {
          if (msg) {
            error = msg;
            res.render("/professor/criar_chamado", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              dados,
            });
          } else {
            var sucesso = "Chamado cadastrado com sucesso";
            res.render("professor/criar_chamado", {
              usuario,
              foto: foto_professor,
              matricula: professor_matricula,
              sucesso,
            });
          }
        });
    }
  });
});

/*seleção de alunos*/
router.get("/aluno", eProfessor, (req, res) => {
  try {
    if (req.user[0].eAdmin == 2) {
      var professor_matricula = req.user[0].matricula;
    } else {
      var professor_matricula = null;
    }
  } catch (error) {
    var professor_matricula = null;
  }

  bd3.select_professor_usuario(professor_matricula).then((professor) => {
    if (professor === "vazio") {
      foto_professor = professor[0].foto_perfil;
      usuario = "[Você não devia estar aqui!!!]";
    } else if (professor === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_professor = professor[0].foto_perfil;
    } else {
      usuario = professor[0].usuario;
      foto_professor = professor[0].foto_perfil;
    }
  });
  bd.select_alunoAll().then((aluno) => {
    if (aluno === "Error") {
      var error_mensagem = "Error no sistema tente novamente mais tarde";
      res.render("professor/alunos", {
        usuario,
        error_mensagem,
        foto: foto_professor,
        matricula: professor_matricula,
      });
    } else if (aluno === "vazio") {
      var aviso_mensagem = "!!! Nenhum aluno cadastrado no sistema !!!";
      res.render("professor/alunos", {
        usuario,
        aviso_mensagem,
        foto: foto_professor,
        matricula: professor_matricula,
      });
    } else {
      res.render("professor/alunos", {
        usuario,
        aluno,
        foto: foto_professor,
        matricula: professor_matricula,
      });
    }
  });
});

router.post("/aluno/foto", eProfessor, (req, res) => {
  professor_perfil(req, res, () => {
    if (req.user[0].eAdmin == 2) {
      var professor_matricula = req.user[0].matricula;
    } else {
      var professor_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_professor !== "undefined") {
      fs.unlink("./public/upload/professor/" + foto_professor, () => {});
    }

    bd3
      .update_foto_professor({
        foto_perfil: req.file.filename,
        matricula: professor_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do professor");
        } else {
          res.redirect("/professor/aluno");
        }
      });
  });
});

/*seleção de chamados*/
router.get("/chamado", eProfessor, (req, res) => {
  try {
    if (req.user[0].eAdmin == 2) {
      var professor_matricula = req.user[0].matricula;
    } else {
      var professor_matricula = null;
    }
  } catch (error) {
    var professor_matricula = null;
  }

  bd3.select_professor_usuario(professor_matricula).then((professor) => {
    if (professor === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_professor = professor[0].foto_perfil;
    } else if (professor === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_professor = professor[0].foto_perfil;
    } else {
      usuario = professor[0].usuario;
      foto_professor = professor[0].foto_perfil;
    }
  });
  bd1.select_chamadoProfessor(req.user).then((chamado_professor) => {
    if (chamado_professor === "Error") {
      var error_mensagem = "Error no sistema tente novamente mais tarde";
      res.render("professor/chamado_professor", {
        usuario,
        foto: foto_professor,
        matricula: professor_matricula,
        error_mensagem,
      });
    } else if (chamado_professor === "matricula") {
      res.render("professor/chamado_professor");
      error_mensagem = "Você não é professor, o que você tá fazendo aqui?";
      res.render("professor/chamado_professor", { usuario, error_mensagem });
    } else if (chamado_professor === "vazio") {
      var aviso_mensagem = "!!! Você não cadastrou nenhum chamado !!!";
      res.render("professor/chamado_professor", {
        usuario,
        foto: foto_professor,
        matricula: professor_matricula,
        aviso_mensagem,
      });
    } else {
      chamado_professor.forEach((valor, i) => {
        if (chamado_professor[i].statusd == "Aberto") {
          chamado_professor[i].i1 = "algo";
        } else if (chamado_professor[i].statusd == "Em Atendimento") {
          chamado_professor[i].i2 = "algo";
        } else if (chamado_professor[i].statusd == "Fechado") {
          chamado_professor[i].i3 = "algo";
        }
      });
      res.render("professor/chamado_professor", {
        usuario,
        foto: foto_professor,
        matricula: professor_matricula,
        chamado_professor,
      });
    }
  });
});

router.post("/chamado/foto", eProfessor, (req, res) => {
  professor_perfil(req, res, () => {
    if (req.user[0].eAdmin == 2) {
      var professor_matricula = req.user[0].matricula;
    } else {
      var professor_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_professor !== "undefined") {
      fs.unlink("./public/upload/professor/" + foto_professor, () => {});
    }

    bd3
      .update_foto_professor({
        foto_perfil: req.file.filename,
        matricula: professor_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do professor");
        } else {
          res.redirect("/professor/chamado");
        }
      });
  });
});

/*alteração de dados do aluno*/
router.get("/aluno/alteracao/:matricula", eProfessor, (req, res) => {
  try {
    if (req.user[0].eAdmin == 2) {
      var professor_matricula = req.user[0].matricula;
    } else {
      var professor_matricula = null;
    }
  } catch (error) {
    var professor_matricula = null;
  }

  bd3.select_professor_usuario(professor_matricula).then((professor) => {
    if (professor === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_professor = professor[0].foto_perfil;
    } else if (professor === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_professor = professor[0].foto_perfil;
    } else {
      usuario = professor[0].usuario;
      foto_professor = professor[0].foto_perfil;
    }
  });
  bd.select_aluno1(req.params.matricula).then((aluno) => {
    if (aluno === "vazio") {
      req.flash("error_msg", "Aluno não encontrado");
      res.redirect("/professor/aluno");
    } else if (aluno === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("professor/aluno");
    } else {
      aluno = aluno[0];
      aluno1 = aluno;
      res.render("professor/edicao_aluno", {
        usuario,
        foto: foto_professor,
        matricula: professor_matricula,
        aluno,
      });
    }
  });
});

router.post("/aluno/alteracao/foto", eProfessor, (req, res) => {
  professor_perfil(req, res, () => {
    if (req.user[0].eAdmin == 2) {
      var professor_matricula = req.user[0].matricula;
    } else {
      var professor_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_professor !== "undefined") {
      fs.unlink("./public/upload/professor/" + foto_professor, () => {});
    }

    bd3
      .update_foto_professor({
        foto_perfil: req.file.filename,
        matricula: professor_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do professor");
        } else {
          res.redirect("/professor/aluno/alteracao/" + aluno1.matricula);
        }
      });
  });
});

router.post("/aluno/alteracao/", eProfessor, (req, res) => {
  try {
    if (req.user[0].eAdmin != 2) {
      usuario = "[Você não devia estar aqui!!!]";
    } else if (req.user[0].eAdmin == 2) {
      var professor_matricula = req.user[0].matricula;
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
    res.render("professor/edicao_aluno", {
      usuario,
      error,
      foto: foto_professor,
      matricula: professor_matricula,
      aluno: aluno1,
    });
  } else if (
    !req.body.usuario ||
    typeof req.body.usuario === undefined ||
    req.body.usuario === null
  ) {
    error = "Usuário invalido";
    res.render("professor/edicao_aluno", {
      usuario,
      error,
      foto: foto_professor,
      matricula: professor_matricula,
      aluno: aluno1,
    });
  } else if (
    !req.body.email ||
    typeof req.body.email === undefined ||
    req.body.email === null
  ) {
    error = "Email invalido";
    res.render("professor/edicao_aluno", {
      usuario,
      error,
      foto: foto_professor,
      matricula: professor_matricula,
      aluno: aluno1,
    });
  } else if (
    !req.body.celular ||
    typeof req.body.celular === undefined ||
    req.body.celular === null
  ) {
    error = "Telefone celular invalido";
    res.render("professor/edicao_aluno", {
      usuario,
      error,
      foto: foto_professor,
      matricula: professor_matricula,
      aluno: aluno1,
    });
  } else if (req.body.celular.length < 15) {
    error = "Número de celular invalido";
    res.render("professor/edicao_aluno", {
      usuario,
      error,
      foto: foto_professor,
      matricula: professor_matricula,
      aluno: aluno1,
    });
  } else if (req.body.residencial && req.body.residencial.length < 14) {
    error = "Número residencial invalido";
    res.render("professor/edicao_aluno", {
      usuario,
      error,
      foto: foto_professor,
      matricula: professor_matricula,
      aluno: aluno1,
    });
  } else if (req.body.senha !== req.body.senha2) {
    error = "Senhas diferentes";
    res.render("professor/edicao_aluno", {
      usuario,
      error,
      foto: foto_professor,
      matricula: professor_matricula,
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_professor(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("professor/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_professor,
                                  matricula: professor_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd2
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render("professor/edicao_aluno", {
                                        usuario,
                                        error,
                                        foto: foto_professor,
                                        matricula: professor_matricula,
                                        aluno: aluno1,
                                      });
                                    } else {
                                      bd3
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render(
                                              "professor/edicao_aluno",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_professor,
                                                matricula: professor_matricula,
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
                                                  "professor/edicao_aluno",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_professor,
                                                    matricula:
                                                      professor_matricula,
                                                    aluno: aluno1,
                                                  }
                                                );
                                              } else {
                                                bd2
                                                  .select_residencial(
                                                    req.body.residencial
                                                  )
                                                  .then((msg) => {
                                                    if (msg) {
                                                      error = msg;
                                                      res.render(
                                                        "professor/edicao_aluno",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_professor,
                                                          matricula:
                                                            professor_matricula,
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
                                                              "professor/edicao_aluno",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_professor,
                                                                matricula:
                                                                  professor_matricula,
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
                                                              "professor/edicao_aluno",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_professor,
                                                                matricula:
                                                                  professor_matricula,
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
                                                                  "professor/edicao_aluno",
                                                                  {
                                                                    usuario,
                                                                    error,
                                                                    foto: foto_professor,
                                                                    matricula:
                                                                      professor_matricula,
                                                                    aluno:
                                                                      aluno1,
                                                                  }
                                                                );
                                                              } else {
                                                                bd2
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
                                                                          "professor/edicao_aluno",
                                                                          {
                                                                            usuario,
                                                                            error,
                                                                            foto: foto_professor,
                                                                            matricula:
                                                                              professor_matricula,
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
                                                                                  "professor/edicao_aluno",
                                                                                  {
                                                                                    usuario,
                                                                                    error,
                                                                                    foto: foto_professor,
                                                                                    matricula:
                                                                                      professor_matricula,
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
                                                                                        "/professor/aluno"
                                                                                      );
                                                                                    } else {
                                                                                      req.flash(
                                                                                        "sucess_msg",
                                                                                        "Alteração do aluno feita com sucesso"
                                                                                      );
                                                                                      res.redirect(
                                                                                        "/professor/aluno"
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_professor(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("professor/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_professor,
                                    matricula: professor_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd2
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("professor/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_professor,
                                          matricula: professor_matricula,
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
                                                "professor/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_professor,
                                                  matricula:
                                                    professor_matricula,
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
                                                "professor/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_professor,
                                                  matricula:
                                                    professor_matricula,
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
                                                    "professor/edicao_aluno",
                                                    {
                                                      usuario,
                                                      error,
                                                      foto: foto_professor,
                                                      matricula:
                                                        professor_matricula,
                                                      aluno: aluno1,
                                                    }
                                                  );
                                                } else {
                                                  bd2
                                                    .select_senha(
                                                      req.body.senha
                                                    )
                                                    .then((msg) => {
                                                      if (msg) {
                                                        error = msg;
                                                        res.render(
                                                          "professor/edicao_aluno",
                                                          {
                                                            usuario,
                                                            error,
                                                            foto: foto_professor,
                                                            matricula:
                                                              professor_matricula,
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
                                                                "professor/edicao_aluno",
                                                                {
                                                                  usuario,
                                                                  error,
                                                                  foto: foto_professor,
                                                                  matricula:
                                                                    professor_matricula,
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
                                                                      "/professor/aluno"
                                                                    );
                                                                  } else {
                                                                    req.flash(
                                                                      "sucess_msg",
                                                                      "Alteração do aluno feita com sucesso"
                                                                    );
                                                                    res.redirect(
                                                                      "/professor/aluno"
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_professor(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("professor/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_professor,
                                  matricula: professor_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd2
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render("professor/edicao_aluno", {
                                        usuario,
                                        error,
                                        foto: foto_professor,
                                        matricula: professor_matricula,
                                        aluno: aluno1,
                                      });
                                    } else {
                                      bd3
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render(
                                              "professor/edicao_aluno",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_professor,
                                                matricula: professor_matricula,
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
                                                  "professor/edicao_aluno",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_professor,
                                                    matricula:
                                                      professor_matricula,
                                                    aluno: aluno1,
                                                  }
                                                );
                                              } else {
                                                bd2
                                                  .select_residencial(
                                                    req.body.residencial
                                                  )
                                                  .then((msg) => {
                                                    if (msg) {
                                                      error = msg;
                                                      res.render(
                                                        "professor/edicao_aluno",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_professor,
                                                          matricula:
                                                            professor_matricula,
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
                                                              "professor/edicao_aluno",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_professor,
                                                                matricula:
                                                                  professor_matricula,
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
                                                                  "/professor/aluno"
                                                                );
                                                              } else {
                                                                req.flash(
                                                                  "sucess_msg",
                                                                  "Alteração do aluno feita com sucesso"
                                                                );
                                                                res.redirect(
                                                                  "/professor/aluno"
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_professor(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("professor/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_professor,
                                  matricula: professor_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd2
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render("professor/edicao_aluno", {
                                        usuario,
                                        error,
                                        foto: foto_professor,
                                        matricula: professor_matricula,
                                        aluno: aluno1,
                                      });
                                    } else {
                                      bd3
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render(
                                              "professor/edicao_aluno",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_professor,
                                                matricula: professor_matricula,
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
                                              "professor/edicao_aluno",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_professor,
                                                matricula: professor_matricula,
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
                                                  "professor/edicao_aluno",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_professor,
                                                    matricula:
                                                      professor_matricula,
                                                    aluno: aluno1,
                                                  }
                                                );
                                              } else {
                                                bd2
                                                  .select_senha(req.body.senha)
                                                  .then((msg) => {
                                                    if (msg) {
                                                      error = msg;
                                                      res.render(
                                                        "professor/edicao_aluno",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_professor,
                                                          matricula:
                                                            professor_matricula,
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
                                                              "professor/edicao_aluno",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_professor,
                                                                matricula:
                                                                  professor_matricula,
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
                                                                  "/professor/aluno"
                                                                );
                                                              } else {
                                                                req.flash(
                                                                  "sucess_msg",
                                                                  "Alteração do aluno feita com sucesso"
                                                                );
                                                                res.redirect(
                                                                  "/professor/aluno"
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_professor(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("professor/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_professor,
                                    matricula: professor_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd2
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("professor/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_professor,
                                          matricula: professor_matricula,
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
                                                "professor/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_professor,
                                                  matricula:
                                                    professor_matricula,
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
                                                "professor/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_professor,
                                                  matricula:
                                                    professor_matricula,
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
                                                    "professor/edicao_aluno",
                                                    {
                                                      usuario,
                                                      error,
                                                      foto: foto_professor,
                                                      matricula:
                                                        professor_matricula,
                                                      aluno: aluno1,
                                                    }
                                                  );
                                                } else {
                                                  bd2
                                                    .select_senha(
                                                      req.body.senha
                                                    )
                                                    .then((msg) => {
                                                      if (msg) {
                                                        error = msg;
                                                        res.render(
                                                          "professor/edicao_aluno",
                                                          {
                                                            usuario,
                                                            error,
                                                            foto: foto_professor,
                                                            matricula:
                                                              professor_matricula,
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
                                                                "professor/edicao_aluno",
                                                                {
                                                                  usuario,
                                                                  error,
                                                                  foto: foto_professor,
                                                                  matricula:
                                                                    professor_matricula,
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
                                                                      "/professor/aluno"
                                                                    );
                                                                  } else {
                                                                    req.flash(
                                                                      "sucess_msg",
                                                                      "Alteração do aluno feita com sucesso"
                                                                    );
                                                                    res.redirect(
                                                                      "/professor/aluno"
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_professor(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("professor/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_professor,
                                    matricula: professor_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd2
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("professor/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_professor,
                                          matricula: professor_matricula,
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
                                                "professor/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_professor,
                                                  matricula:
                                                    professor_matricula,
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
                                                    "/professor/aluno"
                                                  );
                                                } else {
                                                  req.flash(
                                                    "sucess_msg",
                                                    "Alteração do aluno feita com sucesso"
                                                  );
                                                  res.redirect(
                                                    "/professor/aluno"
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_professor(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("professor/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_professor,
                                    matricula: professor_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd2
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("professor/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_professor,
                                          matricula: professor_matricula,
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
                                                "professor/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_professor,
                                                  matricula:
                                                    professor_matricula,
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
                                                    "/professor/aluno"
                                                  );
                                                } else {
                                                  req.flash(
                                                    "sucess_msg",
                                                    "Alteração do aluno feita com sucesso"
                                                  );
                                                  res.redirect(
                                                    "/professor/aluno"
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_professor(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_email(req.body.email).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("professor/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_professor,
                                  matricula: professor_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd2.select_email(req.body.email).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("professor/edicao_aluno", {
                                      usuario,
                                      error,
                                      foto: foto_professor,
                                      matricula: professor_matricula,
                                      aluno: aluno1,
                                    });
                                  } else {
                                    bd3
                                      .select_email(req.body.email)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render("professor/edicao_aluno", {
                                            usuario,
                                            error,
                                            foto: foto_professor,
                                            matricula: professor_matricula,
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
                                              res.redirect("/professor/aluno");
                                            } else {
                                              req.flash(
                                                "sucess_msg",
                                                "Alteração do aluno feita com sucesso"
                                              );
                                              res.redirect("/professor/aluno");
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_professor(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
                              aluno: aluno1,
                            });
                          } else if (
                            req.body.senha.length <= 7 ||
                            req.body.senha2.length <= 7
                          ) {
                            error = "A senha deve ter no mínimo 8 caracteres";
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_senha(req.body.senha).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("professor/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_professor,
                                  matricula: professor_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd2.select_senha(req.body.senha).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("professor/edicao_aluno", {
                                      usuario,
                                      error,
                                      foto: foto_professor,
                                      matricula: professor_matricula,
                                      aluno: aluno1,
                                    });
                                  } else {
                                    bd3
                                      .select_senha(req.body.senha)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render("professor/edicao_aluno", {
                                            usuario,
                                            error,
                                            foto: foto_professor,
                                            matricula: professor_matricula,
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
                                              res.redirect("/professor/aluno");
                                            } else {
                                              req.flash(
                                                "sucess_msg",
                                                "Alteração do aluno feita com sucesso"
                                              );
                                              res.redirect("/professor/aluno");
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_professor(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
                              aluno: aluno1,
                            });
                          } else if (
                            req.body.senha.length <= 7 ||
                            req.body.senha2.length <= 7
                          ) {
                            error = "A senha deve ter no mínimo 8 caracteres";
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_senha(req.body.senha).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("professor/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_professor,
                                  matricula: professor_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd2.select_senha(req.body.senha).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("professor/edicao_aluno", {
                                      usuario,
                                      error,
                                      foto: foto_professor,
                                      matricula: professor_matricula,
                                      aluno: aluno1,
                                    });
                                  } else {
                                    bd3
                                      .select_senha(req.body.senha)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render("professor/edicao_aluno", {
                                            usuario,
                                            error,
                                            foto: foto_professor,
                                            matricula: professor_matricula,
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
                                              res.redirect("/professor/aluno");
                                            } else {
                                              req.flash(
                                                "sucess_msg",
                                                "Alteração do aluno feita com sucesso"
                                              );
                                              res.redirect("/professor/aluno");
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_professor(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("professor/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_professor,
                                matricula: professor_matricula,
                                aluno: aluno1,
                              });
                            } else if (
                              req.body.senha.length <= 7 ||
                              req.body.senha2.length <= 7
                            ) {
                              error = "A senha deve ter no mínimo 8 caracteres";
                              res.render("professor/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_professor,
                                matricula: professor_matricula,
                                aluno: aluno1,
                              });
                            } else {
                              bd.select_senha(req.body.senha).then((msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("professor/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_professor,
                                    matricula: professor_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd2
                                    .select_senha(req.body.senha)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("professor/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_professor,
                                          matricula: professor_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd3
                                          .select_senha(req.body.senha)
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "professor/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_professor,
                                                  matricula:
                                                    professor_matricula,
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
                                                    "/professor/aluno"
                                                  );
                                                } else {
                                                  req.flash(
                                                    "sucess_msg",
                                                    "Alteração do aluno feita com sucesso"
                                                  );
                                                  res.redirect(
                                                    "/professor/aluno"
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_professor(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
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
                                res.redirect("/professor/aluno");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do aluno feita com sucesso"
                                );
                                res.redirect("/professor/aluno");
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_professor(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
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
                                res.redirect("/professor/aluno");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do aluno feita com sucesso"
                                );
                                res.redirect("/professor/aluno");
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_professor(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("professor/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_professor,
                                matricula: professor_matricula,
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
                                  res.redirect("/professor/aluno");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do aluno feita com sucesso"
                                  );
                                  res.redirect("/professor/aluno");
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_professor(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
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
                                res.redirect("/professor/aluno");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do aluno feita com sucesso"
                                );
                                res.redirect("/professor/aluno");
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_professor(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
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
                    res.redirect("/professor/aluno");
                  } else {
                    req.flash(
                      "sucess_msg",
                      "Alteração do aluno feita com sucesso"
                    );
                    res.redirect("/professor/aluno");
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("professor/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_professor,
                                    matricula: professor_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd2
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("professor/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_professor,
                                          matricula: professor_matricula,
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
                                                "professor/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_professor,
                                                  matricula:
                                                    professor_matricula,
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
                                                "professor/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_professor,
                                                  matricula:
                                                    professor_matricula,
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
                                                    "professor/edicao_aluno",
                                                    {
                                                      usuario,
                                                      error,
                                                      foto: foto_professor,
                                                      matricula:
                                                        professor_matricula,
                                                      aluno: aluno1,
                                                    }
                                                  );
                                                } else {
                                                  bd2
                                                    .select_senha(
                                                      req.body.senha
                                                    )
                                                    .then((msg) => {
                                                      if (msg) {
                                                        error = msg;
                                                        res.render(
                                                          "professor/edicao_aluno",
                                                          {
                                                            usuario,
                                                            error,
                                                            foto: foto_professor,
                                                            matricula:
                                                              professor_matricula,
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
                                                                "professor/edicao_aluno",
                                                                {
                                                                  usuario,
                                                                  error,
                                                                  foto: foto_professor,
                                                                  matricula:
                                                                    professor_matricula,
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
                                                                      "/professor/aluno"
                                                                    );
                                                                  } else {
                                                                    req.flash(
                                                                      "sucess_msg",
                                                                      "Alteração do aluno feita com sucesso"
                                                                    );
                                                                    res.redirect(
                                                                      "/professor/aluno"
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
                              aluno: aluno1,
                            });
                          } else if (
                            req.body.senha.length <= 7 ||
                            req.body.senha2.length <= 7
                          ) {
                            error = "A senha deve ter no mínimo 8 caracteres";
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_senha(req.body.senha).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("professor/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_professor,
                                  matricula: professor_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd2.select_senha(req.body.senha).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("professor/edicao_aluno", {
                                      usuario,
                                      error,
                                      foto: foto_professor,
                                      matricula: professor_matricula,
                                      aluno: aluno1,
                                    });
                                  } else {
                                    bd3
                                      .select_senha(req.body.senha)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render("professor/edicao_aluno", {
                                            usuario,
                                            error,
                                            foto: foto_professor,
                                            matricula: professor_matricula,
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
                                              res.redirect("/professor/aluno");
                                            } else {
                                              req.flash(
                                                "sucess_msg",
                                                "Alteração do aluno feita com sucesso"
                                              );
                                              res.redirect("/professor/aluno");
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("professor/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_professor,
                                matricula: professor_matricula,
                                aluno: aluno1,
                              });
                            } else if (
                              req.body.senha.length <= 7 ||
                              req.body.senha2.length <= 7
                            ) {
                              error = "A senha deve ter no mínimo 8 caracteres";
                              res.render("professor/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_professor,
                                matricula: professor_matricula,
                                aluno: aluno1,
                              });
                            } else {
                              bd.select_senha(req.body.senha).then((msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("professor/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_professor,
                                    matricula: professor_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd2
                                    .select_senha(req.body.senha)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("professor/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_professor,
                                          matricula: professor_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd3
                                          .select_senha(req.body.senha)
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "professor/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_professor,
                                                  matricula:
                                                    professor_matricula,
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
                                                    "/professor/aluno"
                                                  );
                                                } else {
                                                  req.flash(
                                                    "sucess_msg",
                                                    "Alteração do aluno feita com sucesso"
                                                  );
                                                  res.redirect(
                                                    "/professor/aluno"
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("professor/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_professor,
                                matricula: professor_matricula,
                                aluno: aluno1,
                              });
                            } else if (
                              req.body.senha.length <= 7 ||
                              req.body.senha2.length <= 7
                            ) {
                              error = "A senha deve ter no mínimo 8 caracteres";
                              res.render("professor/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_professor,
                                matricula: professor_matricula,
                                aluno: aluno1,
                              });
                            } else {
                              bd.select_senha(req.body.senha).then((msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("professor/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_professor,
                                    matricula: professor_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd2
                                    .select_senha(req.body.senha)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("professor/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_professor,
                                          matricula: professor_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd3
                                          .select_senha(req.body.senha)
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "professor/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_professor,
                                                  matricula:
                                                    professor_matricula,
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
                                                    "/professor/aluno"
                                                  );
                                                } else {
                                                  req.flash(
                                                    "sucess_msg",
                                                    "Alteração do aluno feita com sucesso"
                                                  );
                                                  res.redirect(
                                                    "/professor/aluno"
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("professor/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_professor,
                                    matricula: professor_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd2
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("professor/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_professor,
                                          matricula: professor_matricula,
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
                                                "professor/edicao_aluno",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_professor,
                                                  matricula:
                                                    professor_matricula,
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
                                                    "/professor/aluno"
                                                  );
                                                } else {
                                                  req.flash(
                                                    "sucess_msg",
                                                    "Alteração do aluno feita com sucesso"
                                                  );
                                                  res.redirect(
                                                    "/professor/aluno"
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("professor/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_professor,
                                matricula: professor_matricula,
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
                                  res.redirect("/professor/aluno");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do aluno feita com sucesso"
                                  );
                                  res.redirect("/professor/aluno");
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
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
                                res.redirect("/professor/aluno");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do aluno feita com sucesso"
                                );
                                res.redirect("/professor/aluno");
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("professor/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_professor,
                                matricula: professor_matricula,
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
                                  res.redirect("/professor/aluno");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do aluno feita com sucesso"
                                  );
                                  res.redirect("/professor/aluno");
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
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
                                res.redirect("/professor/aluno");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do aluno feita com sucesso"
                                );
                                res.redirect("/professor/aluno");
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
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
                    res.redirect("/professor/aluno");
                  } else {
                    req.flash(
                      "sucess_msg",
                      "Alteração do aluno feita com sucesso"
                    );
                    res.redirect("/professor/aluno");
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
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
                                res.redirect("/professor/aluno");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do aluno feita com sucesso"
                                );
                                res.redirect("/professor/aluno");
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
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
                    res.redirect("/professor/aluno");
                  } else {
                    req.flash(
                      "sucess_msg",
                      "Alteração do aluno feita com sucesso"
                    );
                    res.redirect("/professor/aluno");
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_residencial(req.body.residencial).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_residencial(req.body.residencial).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("professor/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_professor,
                      matricula: professor_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd2.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("professor/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_professor,
                          matricula: professor_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd3.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("professor/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_professor,
                              matricula: professor_matricula,
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
                                res.redirect("/professor/aluno");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do aluno feita com sucesso"
                                );
                                res.redirect("/professor/aluno");
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_residencial(req.body.residencial).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_residencial(req.body.residencial).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
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
                    res.redirect("/professor/aluno");
                  } else {
                    req.flash(
                      "sucess_msg",
                      "Alteração do aluno feita com sucesso"
                    );
                    res.redirect("/professor/aluno");
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
        res.render("professor/edicao_aluno", {
          usuario,
          error,
          foto: foto_professor,
          matricula: professor_matricula,
          aluno: aluno1,
        });
      } else {
        bd2.select_senha(req.body.senha).then((msg) => {
          if (msg) {
            error = msg;
            res.render("professor/edicao_aluno", {
              usuario,
              error,
              foto: foto_professor,
              matricula: professor_matricula,
              aluno: aluno1,
            });
          } else {
            bd3.select_senha(req.body.senha).then((msg) => {
              if (msg) {
                error = msg;
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
                  aluno: aluno1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("professor/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_professor,
                  matricula: professor_matricula,
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
                    res.redirect("/professor/aluno");
                  } else {
                    req.flash(
                      "sucess_msg",
                      "Alteração do aluno feita com sucesso"
                    );
                    res.redirect("/professor/aluno");
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
        res.redirect("/professor/aluno");
      } else {
        req.flash("sucess_msg", "Alteração do aluno feita com sucesso");
        res.redirect("/professor/aluno");
      }
    });
  }
});

/*alteracao do chamado*/
router.get("/chamado/alteracao/:id", eProfessor, (req, res) => {
  try {
    if (req.user[0].eAdmin == 2) {
      var professor_matricula = req.user[0].matricula;
    } else {
      var professor_matricula = null;
    }
  } catch (error) {
    var professor_matricula = null;
  }

  bd3.select_professor_usuario(professor_matricula).then((professor) => {
    if (professor === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_professor = professor[0].foto_perfil;
    } else if (professor === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_professor = professor[0].foto_perfil;
    } else {
      usuario = professor[0].usuario;
      foto_professor = professor[0].foto_perfil;
    }
  });
  bd1.select_chamado1(req.params.id).then((chamado) => {
    if (chamado === "vazio") {
      req.flash("error_msg", "Chamado não encontrado");
      res.redirect("/professor/chamado");
    } else if (chamado === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/professor/chamado");
    } else {
      chamado = chamado[0];
      chamado1 = chamado;
      res.render("professor/edicao_chamado", {
        usuario,
        foto: foto_professor,
        matricula: professor_matricula,
        chamado,
      });
    }
  });
});

router.post("/chamado/alteracao/foto", eProfessor, (req, res) => {
  professor_perfil(req, res, () => {
    if (req.user[0].eAdmin == 2) {
      var professor_matricula = req.user[0].matricula;
    } else {
      var professor_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_professor !== "undefined") {
      fs.unlink("./public/upload/professor/" + foto_professor, () => {});
    }

    bd3
      .update_foto_professor({
        foto_perfil: req.file.filename,
        matricula: professor_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do professor");
        } else {
          res.redirect("/professor/chamado/alteracao/" + chamado1.id);
        }
      });
  });
});

router.post("/chamado/alteracao", eProfessor, (req, res) => {
  try {
    if (req.user[0].eAdmin != 2) {
      usuario = "[Você não devia estar aqui!!!]";
    } else if (req.user[0].eAdmin == 2) {
      var professor_matricula = req.user[0].matricula;
    }
  } catch (error) {
    usuario = "[Você não devia estar aqui!!!]";
  }
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
      } else if (
        typeof req.files[2] !== "undefined" &&
        chamado1.img3 !== null
      ) {
        fs.unlink(
          "./public/upload/chamado_professor/" + chamado1.img1,
          (err) => {
            if (err) {
              console.log("olá", err);
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
        res.render("professor/edicao_chamado", {
          usuario,
          foto: foto_professor,
          matricula: professor_matricula,
          error: err,
        });
      } else if (err) {
        res.setTimeout(480000);
        res.render("professor/edicao_chamado", {
          usuario,
          foto: foto_professor,
          matricula: professor_matricula,
          error: err,
        });
      } else {
        bd1
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
              res.redirect("/professor/chamado");
            } else {
              req.flash("sucess_msg", "Alteração do chamado feita com sucesso");
              res.redirect("/professor/chamado");
            }
          });
      }
    } else if (req.body.deletar === "Deletar imagens") {
      fs.unlink("./public/upload/chamado_professor/" + chamado1.img1, (err) => {
        if (err) {
          console.log(err);
        }
      });
      fs.unlink("./public/upload/chamado_professor/" + chamado1.img2, (err) => {
        if (err) {
          console.log(err);
        }
      });
      fs.unlink("./public/upload/chamado_professor/" + chamado1.img3, (err) => {
        if (err) {
          console.log(err);
        }
      });
      bd1
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
            res.redirect("/professor/chamado");
          } else {
            req.flash("sucess_msg", "Exclusão das imagens feita com sucesso");
            res.redirect("/professor/chamado/alteracao/" + chamado1.id);
          }
        });
    }
  });
});

/*exclusão da foto de perfil do professor na pagina inicial*/
router.get("/exclusao/:matricula", eProfessor, (req, res) => {
  bd3
    .update_foto_professor({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do professor");
      } else {
        fs.unlink("./public/upload/professor/" + foto_professor, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/professor");
      }
    });
});

/*exclusão da foto de perfil do professor na pagina de cadastro de aluno*/
router.get("/cadastrar-aluno/exclusao/:matricula", eProfessor, (req, res) => {
  bd3
    .update_foto_professor({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do professor");
      } else {
        fs.unlink("./public/upload/professor/" + foto_professor, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/professor/cadastrar-aluno");
      }
    });
});

/*exclusão da foto de perfil do professor na pagina de criação de chamados*/
router.get("/criar-chamado/exclusao/:matricula", eProfessor, (req, res) => {
  bd3
    .update_foto_professor({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do professor");
      } else {
        fs.unlink("./public/upload/professor/" + foto_professor, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/professor/criar-chamado");
      }
    });
});

/*exclusão da foto de perfil do professor na pagina de alunos*/
router.get("/aluno/foto/exclusao/:matricula", eProfessor, (req, res) => {
  bd3
    .update_foto_professor({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do professor");
      } else {
        fs.unlink("./public/upload/professor/" + foto_professor, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/professor/aluno");
      }
    });
});

/*exclusão da foto de perfil do professor na pagina de chamados*/
router.get("/chamado/foto/exclusao/:matricula", eProfessor, (req, res) => {
  bd3
    .update_foto_professor({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do professor");
      } else {
        fs.unlink("./public/upload/professor/" + foto_professor, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/professor/chamado");
      }
    });
});

/*exclusão da foto de do professor na pagina de chat*/
router.get("/chat/exclusao/:matricula", eProfessor, (req, res) => {
  bd3
    .update_foto_professor({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do professor");
      } else {
        fs.unlink("./public/upload/professor/" + foto_professor, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/professor/chat");
      }
    });
});

/*exclusão da foto de perfil do professor na pagina de alteração de aluno*/
router.get("/aluno/alteracao/exclusao/:matricula", eProfessor, (req, res) => {
  bd3
    .update_foto_professor({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do professor");
      } else {
        fs.unlink("./public/upload/professor/" + foto_professor, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/professor/aluno/alteracao/" + aluno1.matricula);
      }
    });
});

/*exclusão da foto de perfil do professor na pagina de alteração de chamado*/
router.get("/chamado/alteracao/exclusao/:matricula", eProfessor, (req, res) => {
  bd3
    .update_foto_professor({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do professor");
      } else {
        fs.unlink("./public/upload/professor/" + foto_professor, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/professor/chamado/alteracao/" + chamado1.id);
      }
    });
});

/*exclusao do aluno*/
router.get("/aluno/exclusao/:matricula", eProfessor, (req, res) => {
  bd.delete_aluno(req.params.matricula).then((error) => {
    if (error === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/professor/aluno");
    } else {
      req.flash("sucess_msg", "Exclusão do aluno feita com sucesso");
      res.redirect("/professor/aluno");
    }
  });
});

/*exclusão do chamado*/
router.get("/chamado/exclusao/:id", eProfessor, (req, res) => {
  bd1.select_usuario_imagem(req.params.id).then((usuario) => {
    if (usuario === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/professor/chamado");
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
  bd1.delete_chamado(req.params.id).then((error) => {
    if (error === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/professor/chamado");
    } else if (chamado1.img1 != null) {
      fs.unlink("./public/upload/chamado_professor/" + chamado1.img1, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
    if (chamado1.img2 != null) {
      fs.unlink("./public/upload/chamado_professor/" + chamado1.img2, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
    if (chamado1.img3 != null) {
      fs.unlink("./public/upload/chamado_professor/" + chamado1.img3, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
    req.flash("sucess_msg", "Exclusão do chamado feita com sucesso");
    res.redirect("/professor/chamado");
  });
});

/*chat*/
router.get("/chat", eProfessor, (req, res) => {
  try {
    if (req.user[0].eAdmin == 2) {
      var professor_matricula = req.user[0].matricula;
      var professor_eAdmin = req.user[0].eAdmin;
    } else {
      var professor_matricula = null;
    }
  } catch (error) {
    var professor_matricula = null;
  }

  bd3.select_professor_usuario(professor_matricula).then((professor) => {
    if (professor === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_professor = professor[0].foto_perfil;
    } else if (professor === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_professor = professor[0].foto_perfil;
    } else {
      usuario = professor[0].usuario;
      foto_professor = professor[0].foto_perfil;
    }
  });
  bd1.select_chamadoProfessor(req.user).then((chamado) => {
    if (chamado === "Error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/professor");
    } else {
      res.render("professor/chat", {
        usuario,
        foto: foto_professor,
        eAdmin: professor_eAdmin,
        matricula: professor_matricula,
        chamado,
      });
    }
  });
});

router.post("/chat/foto", eProfessor, (req, res) => {
  professor_perfil(req, res, () => {
    if (req.user[0].eAdmin == 2) {
      var professor_matricula = req.user[0].matricula;
    } else {
      var professor_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_professor !== "undefined") {
      fs.unlink("./public/upload/professor/" + foto_professor, () => {});
    }

    bd3
      .update_foto_professor({
        foto_perfil: req.file.filename,
        matricula: professor_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do professor");
        } else {
          res.redirect("/professor/chat");
        }
      });
  });
});

/*logout do professor*/
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash("error_msg", "Error ao deslogar como professor!!!");
      res.redirect("/");
    } else {
      req.flash("sucess_msg", "Deslogado como professor feito com sucesso!!!");
      res.redirect("/");
    }
  });
});
module.exports = router;
