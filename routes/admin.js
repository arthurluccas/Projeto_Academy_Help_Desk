const express = require("express");
const router = express.Router();
const bd = require("../models/bd_professor");
const bd1 = require("../models/bd_funcionario");
const bd2 = require("../models/bd_aluno");
const bd3 = require("../models/bd_chamado");
const fs = require("fs");
const upload = require("../config/multer");
const multer = require("multer");
const { eAdmin } = require("../helpers/eAdmin");
const alteracaoAlunoImagem = upload
  .alteracao_aluno_imagem()
  .array("imagem_alteracao_chamado", 3);
const alteracaoProfessorImagem = upload
  .alteracao_professor_imagem()
  .array("imagem_alteracao_chamado", 3);
const admin_perfil = upload.upload_admin().single("admin_foto");
var aluno1;
var professor1;
var funcionario1;
var chamado1;
var relatorio1;
var usuario;
var foto_admin;

/*pagina incial do admin*/
router.get("/", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }
  } catch (error) {
    var admin_matricula = null;
  }

  bd1.select_admin(admin_matricula).then((admin) => {
    if (admin === "vazio") {
      res.render("admin/index", {
        usuario: "[Você não devia estar aqui!!!]",
        foto: admin[0].foto_perfil,
      });
    } else if (admin === "error") {
      res.render("admin/index", {
        usuario: "[Error com o nome do usuário]",
        foto: admin[0].foto_perfil,
      });
    } else {
      foto_admin = admin[0].foto_perfil;
      res.render("admin/index", {
        usuario: admin[0].usuario,
        foto: admin[0].foto_perfil,
        matricula: admin_matricula,
      });
    }
  });
});

router.post("/", eAdmin, (req, res) => {
  admin_perfil(req, res, () => {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_admin !== "undefined") {
      fs.unlink("./public/upload/admin/" + foto_admin, () => {});
    }

    bd1
      .update_foto_admin({
        foto_perfil: req.file.filename,
        matricula: admin_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do admin");
        } else {
          res.redirect("/admin");
        }
      });
  });
});

/*inclusão de dados do professor*/
router.get("/cadastrar-professor", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }
  } catch (error) {
    var admin_matricula = null;
  }

  bd1.select_admin(admin_matricula).then((admin) => {
    if (admin === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      res.render("admin/cadastro_professor", {
        usuario: "[Você não devia estar aqui!!!]",
        foto: admin[0].foto_perfil,
      });
    } else if (admin === "error") {
      usuario = "[Error com o nome do usuário]";
      res.render("admin/cadastro_professor", {
        usuario: "[Error com o nome do usuário]",
        foto: admin[0].foto_perfil,
      });
    } else {
      usuario = admin[0].usuario;
      foto_admin = admin[0].foto_perfil;
      res.render("admin/cadastro_professor", {
        usuario: admin[0].usuario,
        foto: admin[0].foto_perfil,
        matricula: admin_matricula,
      });
    }
  });
});

router.post("/cadastrar-professor/foto", eAdmin, (req, res) => {
  admin_perfil(req, res, () => {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_admin !== "undefined") {
      fs.unlink("./public/upload/admin/" + foto_admin, () => {});
    }

    bd1
      .update_foto_admin({
        foto_perfil: req.file.filename,
        matricula: admin_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do admin");
        } else {
          res.redirect("/admin/cadastrar-professor");
        }
      });
  });
});

router.post("/cadastrar-professor/nova", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin != 1) {
      usuario = "[Você não devia estar aqui!!!]";
    } else if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    }
  } catch (error) {
    usuario = "[Você não devia estar aqui!!!]";
  }
  var dados = {
    matricula: req.body.matricula,
    email: req.body.email,
    usuario: req.body.usuario,
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
    res.render("admin/cadastro_professor", {
      usuario,
      foto: foto_admin,
      admin_matricula,
      error,
      dados,
    });
  } else if (
    !req.body.usuario ||
    typeof req.body.usuario === undefined ||
    req.body.usuario === null
  ) {
    error = "Usuário invalido";
    res.render("admin/cadastro_professor", {
      usuario,
      foto: foto_admin,
      admin_matricula,
      error,
      dados,
    });
  } else if (
    !req.body.email ||
    typeof req.body.email === undefined ||
    req.body.email === null
  ) {
    error = "Email invalido";
    res.render("admin/cadastro_professor", {
      usuario,
      foto: foto_admin,
      admin_matricula,
      error,
      dados,
    });
  } else if (
    !req.body.celular ||
    typeof req.body.celular === undefined ||
    req.body.celular === null
  ) {
    error = "Telefone celular invalido";
    res.render("admin/cadastro_professor", {
      usuario,
      foto: foto_admin,
      admin_matricula,
      error,
      dados,
    });
  } else if (req.body.celular.length < 15) {
    error = "Número de celular invalido";
    res.render("admin/cadastro_professor", {
      usuario,
      foto: foto_admin,
      admin_matricula,
      error,
      dados,
    });
  } else if (req.body.residencial && req.body.residencial.length < 14) {
    error = "Número residencial invalido";
    res.render("admin/cadastro_professor", {
      usuario,
      foto: foto_admin,
      admin_matricula,
      error,
      dados,
    });
  } else if (
    !req.body.senha ||
    typeof req.body.senha === undefined ||
    req.body.senha === null
  ) {
    error = "Senha invalida";
    res.render("admin/cadastro_professor", {
      usuario,
      foto: foto_admin,
      admin_matricula,
      error,
      dados,
    });
  } else if (
    !req.body.senha2 ||
    typeof req.body.senha2 === undefined ||
    req.body.senha2 === null
  ) {
    error = "Repetição de senha invalida";
    res.render("admin/cadastro_professor", {
      usuario,
      foto: foto_admin,
      admin_matricula,
      error,
      dados,
    });
  } else if (req.body.senha !== req.body.senha2) {
    error = "Senhas diferentes";

    res.render("admin/cadastro_professor", {
      usuario,
      foto: foto_admin,
      admin_matricula,
      error,
      dados,
    });
  } else if (req.body.senha.length <= 7 || req.body.senha2.length <= 7) {
    error = "A senha deve ter no mínimo 8 caracteres";
    res.render("admin/cadastro_professor", {
      usuario,
      foto: foto_admin,
      admin_matricula,
      error,
      dados,
    });
  } else {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/cadastro_professor", {
          usuario,
          foto: foto_admin,
          admin_matricula,
          error,
          dados,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/cadastro_professor", {
              usuario,
              foto: foto_admin,
              admin_matricula,
              error,
              dados,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/cadastro_professor", {
                  usuario,
                  foto: foto_admin,
                  admin_matricula,
                  error,
                  dados,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/cadastro_professor", {
                      usuario,
                      foto: foto_admin,
                      admin_matricula,
                      error,
                      dados,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/cadastro_professor", {
                          usuario,
                          foto: foto_admin,
                          admin_matricula,
                          error,
                          dados,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/cadastro_professor", {
                              usuario,
                              foto: foto_admin,
                              admin_matricula,
                              error,
                              dados,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/cadastro_professor", {
                                  usuario,
                                  foto: foto_admin,
                                  admin_matricula,
                                  error,
                                  dados,
                                });
                              } else {
                                bd1
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render("admin/cadastro_professor", {
                                        usuario,
                                        foto: foto_admin,
                                        admin_matricula,
                                        error,
                                        dados,
                                      });
                                    } else {
                                      bd2
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render(
                                              "admin/cadastro_professor",
                                              {
                                                usuario,
                                                foto: foto_admin,
                                                admin_matricula,
                                                error,
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
                                                  "admin/cadastro_professor",
                                                  {
                                                    usuario,
                                                    foto: foto_admin,
                                                    admin_matricula,
                                                    error,
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
                                                        "admin/cadastro_professor",
                                                        {
                                                          usuario,
                                                          foto: foto_admin,
                                                          admin_matricula,
                                                          error,
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
                                                              "admin/cadastro_professor",
                                                              {
                                                                usuario,
                                                                foto: foto_admin,
                                                                admin_matricula,
                                                                error,
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
                                                                  "admin/cadastro_professor",
                                                                  {
                                                                    usuario,
                                                                    foto: foto_admin,
                                                                    admin_matricula,
                                                                    error,
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
                                                                          "admin/cadastro_professor",
                                                                          {
                                                                            usuario,
                                                                            foto: foto_admin,
                                                                            admin_matricula,
                                                                            error,
                                                                            dados,
                                                                          }
                                                                        );
                                                                      } else {
                                                                        bd2
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
                                                                                  "admin/cadastro_professor",
                                                                                  {
                                                                                    usuario,
                                                                                    foto: foto_admin,
                                                                                    admin_matricula,
                                                                                    error,
                                                                                    dados,
                                                                                  }
                                                                                );
                                                                              } else {
                                                                                bd.insert_professor(
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
                                                                                        "admin/cadastro_professor",
                                                                                        {
                                                                                          usuario,
                                                                                          foto: foto_admin,
                                                                                          admin_matricula,
                                                                                          error,
                                                                                          dados,
                                                                                        }
                                                                                      );
                                                                                    } else {
                                                                                      var sucesso =
                                                                                        "Professor cadastrado com sucesso";
                                                                                      res.render(
                                                                                        "admin/cadastro_professor",
                                                                                        {
                                                                                          usuario,
                                                                                          foto: foto_admin,
                                                                                          admin_matricula,
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

/*inclusão de dados do funcionario*/
router.get("/cadastrar-funcionario", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }
  } catch (error) {
    var admin_matricula = null;
  }

  bd1.select_admin(admin_matricula).then((admin) => {
    if (admin === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      res.render("admin/cadastro_funcionario", {
        usuario: "[Você não devia estar aqui!!!]",
        foto: admin[0].foto_perfil,
      });
    } else if (admin === "error") {
      usuario = "[Error com o nome do usuário]";
      res.render("admin/cadastro_funcionario", {
        usuario: "[Error com o nome do usuário]",
        foto: admin[0].foto_perfil,
      });
    } else {
      usuario = admin[0].usuario;
      foto_admin = admin[0].foto_perfil;
      res.render("admin/cadastro_funcionario", {
        usuario: admin[0].usuario,
        foto: admin[0].foto_perfil,
        matricula: admin_matricula,
      });
    }
  });
});

router.post("/cadastrar-funcionario/foto", eAdmin, (req, res) => {
  admin_perfil(req, res, () => {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_admin !== "undefined") {
      fs.unlink("./public/upload/admin/" + foto_admin, () => {});
    }

    bd1
      .update_foto_admin({
        foto_perfil: req.file.filename,
        matricula: admin_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do admin");
        } else {
          res.redirect("/admin/cadastrar-funcionario");
        }
      });
  });
});

router.post("/cadastrar-funcionario/nova", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin != 1) {
      usuario = "[Você não devia estar aqui!!!]";
    } else if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
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
    res.render("admin/cadastro_funcionario", {
      usuario,
      error,
      foto: foto_admin,
      admin_matricula,
      dados,
    });
  } else if (
    !req.body.usuario ||
    typeof req.body.usuario === undefined ||
    req.body.usuario === null
  ) {
    error = "Usuário invalido";
    res.render("admin/cadastro_funcionario", {
      usuario,
      error,
      foto: foto_admin,
      admin_matricula,
      dados,
    });
  } else if (
    !req.body.email ||
    typeof req.body.email === undefined ||
    req.body.email === null
  ) {
    error = "Email invalido";
    res.render("admin/cadastro_funcionario", {
      usuario,
      error,
      foto: foto_admin,
      admin_matricula,
      dados,
    });
  } else if (
    !req.body.celular ||
    typeof req.body.celular === undefined ||
    req.body.celular === null
  ) {
    error = "Telefone celular invalido";
    res.render("admin/cadastro_funcionario", {
      usuario,
      error,
      foto: foto_admin,
      admin_matricula,
      dados,
    });
  } else if (req.body.celular.length < 15) {
    error = "Número de celular invalido";
    res.render("admin/cadastro_funcionario", {
      usuario,
      error,
      foto: foto_admin,
      admin_matricula,
      dados,
    });
  } else if (req.body.residencial && req.body.residencial.length < 14) {
    error = "Número residencial invalido";
    res.render("admin/cadastro_funcionario", {
      usuario,
      error,
      foto: foto_admin,
      admin_matricula,
      dados,
    });
  } else if (
    !req.body.senha ||
    typeof req.body.senha === undefined ||
    req.body.senha === null
  ) {
    error = "Senha invalida";
    res.render("admin/cadastro_funcionario", {
      usuario,
      error,
      foto: foto_admin,
      admin_matricula,
      dados,
    });
  } else if (
    !req.body.senha2 ||
    typeof req.body.senha2 === undefined ||
    req.body.senha2 === null
  ) {
    error = "Repetição de senha invalida";
    res.render("admin/cadastro_funcionario", {
      usuario,
      error,
      foto: foto_admin,
      admin_matricula,
      dados,
    });
  } else if (req.body.senha !== req.body.senha2) {
    error = "Senhas diferentes";
    res.render("admin/cadastro_funcionario", {
      usuario,
      error,
      foto: foto_admin,
      admin_matricula,
      dados,
    });
  } else if (req.body.senha.length <= 7 || req.body.senha2.length <= 7) {
    error = "A senha deve ter no mínimo 8 caracteres";
    res.render("admin/cadastro_funcionario", {
      usuario,
      error,
      foto: foto_admin,
      admin_matricula,
      dados,
    });
  } else {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/cadastro_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          admin_matricula,
          dados,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/cadastro_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              admin_matricula,
              dados,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/cadastro_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  admin_matricula,
                  dados,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/cadastro_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      admin_matricula,
                      dados,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/cadastro_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          admin_matricula,
                          dados,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/cadastro_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              admin_matricula,
                              dados,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/cadastro_funcionario", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  admin_matricula,
                                  dados,
                                });
                              } else {
                                bd1
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render("admin/cadastro_funcionario", {
                                        usuario,
                                        error,
                                        foto: foto_admin,
                                        admin_matricula,
                                        dados,
                                      });
                                    } else {
                                      bd2
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render(
                                              "admin/cadastro_funcionario",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                admin_matricula,
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
                                                  "admin/cadastro_funcionario",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_admin,
                                                    admin_matricula,
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
                                                        "admin/cadastro_funcionario",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_admin,
                                                          admin_matricula,
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
                                                              "admin/cadastro_funcionario",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_admin,
                                                                admin_matricula,
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
                                                                  "admin/cadastro_funcionario",
                                                                  {
                                                                    usuario,
                                                                    error,
                                                                    foto: foto_admin,
                                                                    admin_matricula,
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
                                                                          "admin/cadastro_funcionario",
                                                                          {
                                                                            usuario,
                                                                            error,
                                                                            foto: foto_admin,
                                                                            admin_matricula,
                                                                            dados,
                                                                          }
                                                                        );
                                                                      } else {
                                                                        bd2
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
                                                                                  "admin/cadastro_funcionario",
                                                                                  {
                                                                                    usuario,
                                                                                    error,
                                                                                    foto: foto_admin,
                                                                                    admin_matricula,
                                                                                    dados,
                                                                                  }
                                                                                );
                                                                              } else {
                                                                                bd1
                                                                                  .insert_funcionario(
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
                                                                                          "admin/cadastro_funcionario",
                                                                                          {
                                                                                            usuario,
                                                                                            error,
                                                                                            foto: foto_admin,
                                                                                            admin_matricula,
                                                                                            dados,
                                                                                          }
                                                                                        );
                                                                                      } else {
                                                                                        var sucesso =
                                                                                          "Funcionário cadastrado com sucesso";
                                                                                        res.render(
                                                                                          "admin/cadastro_funcionario",
                                                                                          {
                                                                                            usuario,
                                                                                            foto: foto_admin,
                                                                                            admin_matricula,
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

/*inclusão de dados do aluno*/
router.get("/cadastrar-aluno", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }
  } catch (error) {
    var admin_matricula = null;
  }

  bd1.select_admin(admin_matricula).then((admin) => {
    if (admin === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      res.render("admin/cadastro_aluno", {
        usuario: "[Você não devia estar aqui!!!]",
        foto: admin[0].foto_perfil,
      });
    } else if (admin === "error") {
      usuario = "[Error com o nome do usuário]";
      res.render("admin/cadastro_aluno", {
        usuario: "[Error com o nome do usuário]",
        foto: admin[0].foto_perfil,
      });
    } else {
      usuario = admin[0].usuario;
      foto_admin = admin[0].foto_perfil;
      res.render("admin/cadastro_aluno", {
        usuario: admin[0].usuario,
        foto: admin[0].foto_perfil,
        matricula: admin_matricula,
      });
    }
  });
});

router.post("/cadastrar-aluno/foto", eAdmin, (req, res) => {
  admin_perfil(req, res, () => {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_admin !== "undefined") {
      fs.unlink("./public/upload/admin/" + foto_admin, () => {});
    }

    bd1
      .update_foto_admin({
        foto_perfil: req.file.filename,
        matricula: admin_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do admin");
        } else {
          res.redirect("/admin/cadastrar-aluno");
        }
      });
  });
});

router.post("/cadastrar-aluno/nova", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin != 1) {
      usuario = "[Você não devia estar aqui!!!]";
    } else if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
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
    res.render("admin/cadastro_aluno", {
      usuario,
      error,
      foto: foto_admin,
      admin_matricula,
      dados,
    });
  } else if (
    !req.body.usuario ||
    typeof req.body.usuario === undefined ||
    req.body.usuario === null
  ) {
    error = "Usuário invalido";
    res.render("admin/cadastro_aluno", {
      usuario,
      error,
      foto: foto_admin,
      admin_matricula,
      dados,
    });
  } else if (
    !req.body.email ||
    typeof req.body.email === undefined ||
    req.body.email === null
  ) {
    error = "Email invalido";
    res.render("admin/cadastro_aluno", {
      usuario,
      error,
      foto: foto_admin,
      admin_matricula,
      dados,
    });
  } else if (
    !req.body.celular ||
    typeof req.body.celular === undefined ||
    req.body.celular === null
  ) {
    error = "Telefone celular invalido";
    res.render("admin/cadastro_aluno", {
      usuario,
      error,
      foto: foto_admin,
      admin_matricula,
      dados,
    });
  } else if (req.body.celular.length < 15) {
    error = "Número de celular invalido";
    res.render("admin/cadastro_aluno", {
      usuario,
      error,
      foto: foto_admin,
      admin_matricula,
      dados,
    });
  } else if (req.body.residencial && req.body.residencial.length < 14) {
    error = "Número residencial invalido";
    res.render("admin/cadastro_aluno", {
      usuario,
      error,
      foto: foto_admin,
      admin_matricula,
      dados,
    });
  } else if (
    !req.body.senha ||
    typeof req.body.senha === undefined ||
    req.body.senha === null
  ) {
    error = "Senha invalida";
    res.render("admin/cadastro_aluno", {
      usuario,
      error,
      foto: foto_admin,
      admin_matricula,
      dados,
    });
  } else if (
    !req.body.senha2 ||
    typeof req.body.senha2 === undefined ||
    req.body.senha2 === null
  ) {
    error = "Repetição de senha invalida";
    res.render("admin/cadastro_aluno", {
      usuario,
      error,
      foto: foto_admin,
      admin_matricula,
      dados,
    });
  } else if (req.body.senha !== req.body.senha2) {
    error = "Senhas diferentes";
    res.render("admin/cadastro_aluno", {
      usuario,
      error,
      foto: foto_admin,
      admin_matricula,
      dados,
    });
  } else if (req.body.senha.length <= 7 || req.body.senha2.length <= 7) {
    error = "A senha deve ter no mínimo 8 caracteres";
    res.render("admin/cadastro_aluno", {
      error,
      foto: foto_admin,
      admin_matricula,
      dados,
    });
  } else {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/cadastro_aluno", {
          usuario,
          error,
          foto: foto_admin,
          admin_matricula,
          dados,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/cadastro_aluno", {
              usuario,
              error,
              foto: foto_admin,
              admin_matricula,
              dados,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/cadastro_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  admin_matricula,
                  dados,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/cadastro_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      admin_matricula,
                      dados,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/cadastro_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          admin_matricula,
                          dados,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/cadastro_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              admin_matricula,
                              dados,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/cadastro_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  admin_matricula,
                                  dados,
                                });
                              } else {
                                bd1
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render("admin/cadastro_aluno", {
                                        usuario,
                                        error,
                                        foto: foto_admin,
                                        admin_matricula,
                                        dados,
                                      });
                                    } else {
                                      bd2
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render("admin/cadastro_aluno", {
                                              usuario,
                                              error,
                                              foto: foto_admin,
                                              admin_matricula,
                                              dados,
                                            });
                                          } else {
                                            bd.select_residencial(
                                              req.body.residencial
                                            ).then((msg) => {
                                              if (msg) {
                                                error = msg;
                                                res.render(
                                                  "admin/cadastro_aluno",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_admin,
                                                    admin_matricula,
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
                                                        "admin/cadastro_aluno",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_admin,
                                                          admin_matricula,
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
                                                              "admin/cadastro_aluno",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_admin,
                                                                admin_matricula,
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
                                                                  "admin/cadastro_aluno",
                                                                  {
                                                                    usuario,
                                                                    error,
                                                                    foto: foto_admin,
                                                                    admin_matricula,
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
                                                                          "admin/cadastro_aluno",
                                                                          {
                                                                            usuario,
                                                                            error,
                                                                            foto: foto_admin,
                                                                            admin_matricula,
                                                                            dados,
                                                                          }
                                                                        );
                                                                      } else {
                                                                        bd2
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
                                                                                  "admin/cadastro_aluno",
                                                                                  {
                                                                                    usuario,
                                                                                    error,
                                                                                    foto: foto_admin,
                                                                                    admin_matricula,
                                                                                    dados,
                                                                                  }
                                                                                );
                                                                              } else {
                                                                                bd2
                                                                                  .insert_aluno(
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
                                                                                          "admin/cadastro_aluno",
                                                                                          {
                                                                                            usuario,
                                                                                            error,
                                                                                            foto: foto_admin,
                                                                                            admin_matricula,
                                                                                            dados,
                                                                                          }
                                                                                        );
                                                                                      } else {
                                                                                        var sucesso =
                                                                                          "Aluno cadastrado com sucesso";
                                                                                        res.render(
                                                                                          "admin/cadastro_aluno",
                                                                                          {
                                                                                            usuario,
                                                                                            foto: foto_admin,
                                                                                            admin_matricula,
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

/*seleção de dados do chamado*/
router.get("/chamado", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }
  } catch (error) {
    var admin_matricula = null;
  }

  bd1.select_admin(admin_matricula).then((admin) => {
    if (admin === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_admin = admin[0].foto_perfil;
    } else if (admin === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_admin = admin[0].foto_perfil;
    } else {
      usuario = admin[0].usuario;
      foto_admin = admin[0].foto_perfil;
    }
  });
  bd3.select_chamadoAll().then((chamado) => {
    if (chamado === "Error") {
      var error_mensagem = "Error no sistema tente novamente mais tarde";
      res.render("admin/chamado", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
        error_mensagem,
      });
    } else if (chamado === "vazio") {
      var aviso_mensagem = "!!! Nenhum chamado cadastrado no sistema !!!";
      res.render("admin/chamado", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
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
      res.render("admin/chamado", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
        chamado,
      });
    }
  });
});

router.post("/chamado/foto", eAdmin, (req, res) => {
  admin_perfil(req, res, () => {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }
    console.log(typeof req.file.filename);
    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_admin !== "undefined") {
      fs.unlink("./public/upload/admin/" + foto_admin, () => {});
    }

    bd1
      .update_foto_admin({
        foto_perfil: req.file.filename,
        matricula: admin_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do admin");
        } else {
          res.redirect("/admin/chamado");
        }
      });
  });
});

/*seleção de dados do relatorio do funcionario*/
router.get("/relatorio", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }
  } catch (error) {
    var admin_matricula = null;
  }

  bd1.select_admin(admin_matricula).then((admin) => {
    if (admin === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_admin = admin[0].foto_perfil;
    } else if (admin === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_admin = admin[0].foto_perfil;
    } else {
      usuario = admin[0].usuario;
      foto_admin = admin[0].foto_perfil;
    }
  });
  bd1.select_relatorioAll().then((relatorio) => {
    if (relatorio === "Error") {
      var error_mensagem = "Error no sistema tente novamente mais tarde";
      res.render("admin/relatorios", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
        error_mensagem,
      });
    } else if (relatorio === "vazio") {
      var aviso_mensagem = "!!! Nenhum relatório cadastrado no sistema !!!";
      res.render("admin/relatorios", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
        aviso_mensagem,
      });
    } else {
      res.render("admin/relatorios", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
        relatorio,
      });
    }
  });
});

router.post("/relatorio/foto", eAdmin, (req, res) => {
  admin_perfil(req, res, () => {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_admin !== "undefined") {
      fs.unlink("./public/upload/admin/" + foto_admin, () => {});
    }

    bd1
      .update_foto_admin({
        foto_perfil: req.file.filename,
        matricula: admin_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do admin");
        } else {
          res.redirect("/admin/relatorio");
        }
      });
  });
});

/*seleção de dados do funcionario*/
router.get("/funcionario", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }
  } catch (error) {
    var admin_matricula = null;
  }

  bd1.select_admin(admin_matricula).then((admin) => {
    if (admin === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_admin = admin[0].foto_perfil;
    } else if (admin === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_admin = admin[0].foto_perfil;
    } else {
      usuario = admin[0].usuario;
      foto_admin = admin[0].foto_perfil;
    }
  });
  bd1.select_funcionarioAll().then((funcionario) => {
    if (funcionario === "Error") {
      var error_mensagem = "Error no sistema tente novamente mais tarde";
      res.render("admin/funcionarios", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
        error_mensagem,
      });
    } else if (funcionario === "vazio") {
      var aviso_mensagem = "!!! Nenhum funcionário cadastrado no sistema !!!";
      res.render("admin/funcionarios", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
        aviso_mensagem,
      });
    } else {
      res.render("admin/funcionarios", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
        funcionario,
      });
    }
  });
});

router.post("/funcionario/foto", eAdmin, (req, res) => {
  admin_perfil(req, res, () => {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_admin !== "undefined") {
      fs.unlink("./public/upload/admin/" + foto_admin, () => {});
    }

    bd1
      .update_foto_admin({
        foto_perfil: req.file.filename,
        matricula: admin_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do admin");
        } else {
          res.redirect("/admin/funcionario");
        }
      });
  });
});

/*seleção de dados do aluno*/
router.get("/aluno", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }
  } catch (error) {
    var admin_matricula = null;
  }

  bd1.select_admin(admin_matricula).then((admin) => {
    if (admin === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_admin = admin[0].foto_perfil;
    } else if (admin === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_admin = admin[0].foto_perfil;
    } else {
      usuario = admin[0].usuario;
      foto_admin = admin[0].foto_perfil;
    }
  });
  bd2.select_alunoAll().then((aluno) => {
    if (aluno === "Error") {
      var error_mensagem = "Error no sistema tente novamente mais tarde";
      res.render("admin/alunos", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
        error_mensagem,
      });
    } else if (aluno === "vazio") {
      var aviso_mensagem = "!!! Nenhum aluno cadastrado no sistema !!!";
      res.render("admin/alunos", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
        aviso_mensagem,
      });
    } else {
      res.render("admin/alunos", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
        aluno,
      });
    }
  });
});

router.post("/aluno/foto", eAdmin, (req, res) => {
  admin_perfil(req, res, () => {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_admin !== "undefined") {
      fs.unlink("./public/upload/admin/" + foto_admin, () => {});
    }

    bd1
      .update_foto_admin({
        foto_perfil: req.file.filename,
        matricula: admin_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do admin");
        } else {
          res.redirect("/admin/aluno");
        }
      });
  });
});

/*seleção de dados do professor*/
router.get("/professor", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }
  } catch (error) {
    var admin_matricula = null;
  }

  bd1.select_admin(admin_matricula).then((admin) => {
    if (admin === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_admin = admin[0].foto_perfil;
    } else if (admin === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_admin = admin[0].foto_perfil;
    } else {
      usuario = admin[0].usuario;
      foto_admin = admin[0].foto_perfil;
    }
  });
  bd.select_professorAll().then((professor) => {
    if (professor === "Error") {
      var error_mensagem = "Error no sistema tente novamente mais tarde";
      res.render("admin/professores", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
        error_mensagem,
      });
    } else if (professor === "vazio") {
      var aviso_mensagem = "!!! Nenhum professor cadastrado no sistema !!!";
      res.render("admin/professores", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
        aviso_mensagem,
      });
    } else {
      res.render("admin/professores", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
        professor,
      });
    }
  });
});

router.post("/professor/foto", eAdmin, (req, res) => {
  admin_perfil(req, res, () => {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_admin !== "undefined") {
      fs.unlink("./public/upload/admin/" + foto_admin, () => {});
    }

    bd1
      .update_foto_admin({
        foto_perfil: req.file.filename,
        matricula: admin_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do admin");
        } else {
          res.redirect("/admin/professor");
        }
      });
  });
});

/*alteração de dados do relatorio*/
router.get("/relatorio/alteracao/:id", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }
  } catch (error) {
    var admin_matricula = null;
  }

  bd1.select_admin(admin_matricula).then((admin) => {
    if (admin === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_admin = admin[0].foto_perfil;
    } else if (admin === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_admin = admin[0].foto_perfil;
    } else {
      usuario = admin[0].usuario;
      foto_admin = admin[0].foto_perfil;
    }
  });
  bd1.select_relatorio1(req.params.id).then((relatorio) => {
    if (relatorio === "vazio") {
      req.flash("error_msg", "relatorio não encontrado");
      res.redirect("/admin/relatorio");
    } else if (relatorio === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("admin/relatorio");
    } else {
      relatorio = relatorio[0];
      relatorio1 = relatorio;
      res.render("admin/edicao_relatorio", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
        relatorio,
      });
    }
  });
});

router.post("/relatorio/alteracao/foto", eAdmin, (req, res) => {
  admin_perfil(req, res, () => {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_admin !== "undefined") {
      fs.unlink("./public/upload/admin/" + foto_admin, () => {});
    }

    bd1
      .update_foto_admin({
        foto_perfil: req.file.filename,
        matricula: admin_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do admin");
        } else {
          res.redirect("/admin/relatorio/alteracao/" + relatorio1.id);
        }
      });
  });
});

router.post("/relatorio/alteracao/", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin != 1) {
      usuario = "[Você não devia estar aqui!!!]";
    } else if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
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
    res.render("admin/edicao_relatorio", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      relatorio: relatorio1,
    });
  } else if (
    !req.body.conteudo ||
    typeof req.body.conteudo === undefined ||
    req.body.conteudo === null
  ) {
    error = "Relatório invalido";
    res.render("admin/edicao_relatorio", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      relatorio: relatorio1,
    });
  } else {
    bd1
      .update_relatorio({
        titulo: req.body.titulo,
        conteudo: req.body.conteudo,
        id: relatorio1.id,
      })
      .then((relatorio) => {
        if (relatorio === "error") {
          req.flash("error_msg", "Error no sistema tente novamente mais tarde");
          res.redirect("/admin/relatorio");
        } else {
          req.flash("sucess_msg", "Alteração do relatório feita com sucesso");
          res.redirect("/admin/relatorio");
        }
      });
  }
});

/*alteração de dados do aluno*/
router.get("/aluno/alteracao/:matricula", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }
  } catch (error) {
    var admin_matricula = null;
  }

  bd1.select_admin(admin_matricula).then((admin) => {
    if (admin === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_admin = admin[0].foto_perfil;
    } else if (admin === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_admin = admin[0].foto_perfil;
    } else {
      usuario = admin[0].usuario;
      foto_admin = admin[0].foto_perfil;
    }
  });
  bd2.select_aluno1(req.params.matricula).then((aluno) => {
    if (aluno === "vazio") {
      req.flash("error_msg", "Aluno não encontrado");
      res.redirect("/admin/aluno");
    } else if (aluno === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("admin/aluno");
    } else {
      aluno = aluno[0];
      aluno1 = aluno;
      res.render("admin/edicao_aluno", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
        aluno,
      });
    }
  });
});

router.post("/aluno/alteracao/foto", eAdmin, (req, res) => {
  admin_perfil(req, res, () => {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_admin !== "undefined") {
      fs.unlink("./public/upload/admin/" + foto_admin, () => {});
    }

    bd1
      .update_foto_admin({
        foto_perfil: req.file.filename,
        matricula: admin_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do admin");
        } else {
          res.redirect("/admin/aluno/alteracao/" + aluno1.matricula);
        }
      });
  });
});

router.post("/aluno/alteracao/", (req, res) => {
  try {
    if (req.user[0].eAdmin != 1) {
      usuario = "[Você não devia estar aqui!!!]";
    } else if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
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
    res.render("admin/edicao_aluno", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      aluno: aluno1,
    });
  } else if (
    !req.body.usuario ||
    typeof req.body.usuario === undefined ||
    req.body.usuario === null
  ) {
    error = "Usuário invalido";
    res.render("admin/edicao_aluno", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      aluno: aluno1,
    });
  } else if (
    !req.body.email ||
    typeof req.body.email === undefined ||
    req.body.email === null
  ) {
    error = "Email invalido";
    res.render("admin/edicao_aluno", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      aluno: aluno1,
    });
  } else if (
    !req.body.celular ||
    typeof req.body.celular === undefined ||
    req.body.celular === null
  ) {
    error = "Telefone celular invalido";
    res.render("admin/edicao_aluno", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      aluno: aluno1,
    });
  } else if (req.body.celular.length < 15) {
    error = "Número de celular invalido";
    res.render("admin/edicao_aluno", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      aluno: aluno1,
    });
  } else if (req.body.residencial && req.body.residencial.length < 14) {
    error = "Número residencial invalido";
    res.render("admin/edicao_aluno", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      aluno: aluno1,
    });
  } else if (req.body.senha !== req.body.senha2) {
    error = "Senhas diferentes";
    res.render("admin/edicao_aluno", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      aluno: aluno1,
    });
  } else if (
    req.body.matricula != aluno1.matricula &&
    req.body.email != aluno1.email &&
    req.body.celular != aluno1.telefone_celular &&
    req.body.residencial != aluno1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd1
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render("admin/edicao_aluno", {
                                        usuario,
                                        error,
                                        foto: foto_admin,
                                        matricula: admin_matricula,
                                        aluno: aluno1,
                                      });
                                    } else {
                                      bd2
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render("admin/edicao_aluno", {
                                              usuario,
                                              error,
                                              foto: foto_admin,
                                              matricula: admin_matricula,
                                              aluno: aluno1,
                                            });
                                          } else {
                                            bd.select_residencial(
                                              req.body.residencial
                                            ).then((msg) => {
                                              if (msg) {
                                                error = msg;
                                                res.render(
                                                  "admin/edicao_aluno",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_admin,
                                                    matricula: admin_matricula,
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
                                                        "admin/edicao_aluno",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_admin,
                                                          matricula:
                                                            admin_matricula,
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
                                                              "admin/edicao_aluno",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_admin,
                                                                matricula:
                                                                  admin_matricula,
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
                                                              "admin/edicao_aluno",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_admin,
                                                                matricula:
                                                                  admin_matricula,
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
                                                                  "admin/edicao_aluno",
                                                                  {
                                                                    usuario,
                                                                    error,
                                                                    foto: foto_admin,
                                                                    matricula:
                                                                      admin_matricula,
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
                                                                          "admin/edicao_aluno",
                                                                          {
                                                                            usuario,
                                                                            error,
                                                                            foto: foto_admin,
                                                                            matricula:
                                                                              admin_matricula,
                                                                            aluno:
                                                                              aluno1,
                                                                          }
                                                                        );
                                                                      } else {
                                                                        bd2
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
                                                                                  "admin/edicao_aluno",
                                                                                  {
                                                                                    usuario,
                                                                                    error,
                                                                                    foto: foto_admin,
                                                                                    matricula:
                                                                                      admin_matricula,
                                                                                    aluno:
                                                                                      aluno1,
                                                                                  }
                                                                                );
                                                                              } else {
                                                                                bd2
                                                                                  .delete_update_aluno(
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
                                                                                  )
                                                                                  .then(
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
                                                                                          "/admin/aluno"
                                                                                        );
                                                                                      } else {
                                                                                        req.flash(
                                                                                          "sucess_msg",
                                                                                          "Alteração do aluno feita com sucesso"
                                                                                        );
                                                                                        res.redirect(
                                                                                          "/admin/aluno"
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd2
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render("admin/edicao_aluno", {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                matricula: admin_matricula,
                                                aluno: aluno1,
                                              });
                                            } else if (
                                              req.body.senha.length <= 7 ||
                                              req.body.senha2.length <= 7
                                            ) {
                                              error =
                                                "A senha deve ter no mínimo 8 caracteres";
                                              res.render("admin/edicao_aluno", {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                matricula: admin_matricula,
                                                aluno: aluno1,
                                              });
                                            } else {
                                              bd.select_senha(
                                                req.body.senha
                                              ).then((msg) => {
                                                if (msg) {
                                                  error = msg;
                                                  res.render(
                                                    "admin/edicao_aluno",
                                                    {
                                                      usuario,
                                                      error,
                                                      foto: foto_admin,
                                                      matricula:
                                                        admin_matricula,
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
                                                          "admin/edicao_aluno",
                                                          {
                                                            usuario,
                                                            error,
                                                            foto: foto_admin,
                                                            matricula:
                                                              admin_matricula,
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
                                                                "admin/edicao_aluno",
                                                                {
                                                                  usuario,
                                                                  error,
                                                                  foto: foto_admin,
                                                                  matricula:
                                                                    admin_matricula,
                                                                  aluno: aluno1,
                                                                }
                                                              );
                                                            } else {
                                                              bd2
                                                                .delete_update_aluno(
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
                                                                )
                                                                .then(
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
                                                                        "/admin/aluno"
                                                                      );
                                                                    } else {
                                                                      req.flash(
                                                                        "sucess_msg",
                                                                        "Alteração do aluno feita com sucesso"
                                                                      );
                                                                      res.redirect(
                                                                        "/admin/aluno"
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd1
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render("admin/edicao_aluno", {
                                        usuario,
                                        error,
                                        foto: foto_admin,
                                        matricula: admin_matricula,
                                        aluno: aluno1,
                                      });
                                    } else {
                                      bd2
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render("admin/edicao_aluno", {
                                              usuario,
                                              error,
                                              foto: foto_admin,
                                              matricula: admin_matricula,
                                              aluno: aluno1,
                                            });
                                          } else {
                                            bd.select_residencial(
                                              req.body.residencial
                                            ).then((msg) => {
                                              if (msg) {
                                                error = msg;
                                                res.render(
                                                  "admin/edicao_aluno",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_admin,
                                                    matricula: admin_matricula,
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
                                                        "admin/edicao_aluno",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_admin,
                                                          matricula:
                                                            admin_matricula,
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
                                                              "admin/edicao_aluno",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_admin,
                                                                matricula:
                                                                  admin_matricula,
                                                                aluno: aluno1,
                                                              }
                                                            );
                                                          } else {
                                                            bd2
                                                              .delete_update_aluno(
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
                                                              )
                                                              .then((aluno) => {
                                                                if (
                                                                  aluno ===
                                                                  "error"
                                                                ) {
                                                                  req.flash(
                                                                    "error_msg",
                                                                    "Error no sistema tente novamente mais tarde"
                                                                  );
                                                                  res.redirect(
                                                                    "/admin/aluno"
                                                                  );
                                                                } else {
                                                                  req.flash(
                                                                    "sucess_msg",
                                                                    "Alteração do aluno feita com sucesso"
                                                                  );
                                                                  res.redirect(
                                                                    "/admin/aluno"
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd1
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render("admin/edicao_aluno", {
                                        usuario,
                                        error,
                                        foto: foto_admin,
                                        matricula: admin_matricula,
                                        aluno: aluno1,
                                      });
                                    } else {
                                      bd2
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render("admin/edicao_aluno", {
                                              usuario,
                                              error,
                                              foto: foto_admin,
                                              matricula: admin_matricula,
                                              aluno: aluno1,
                                            });
                                          } else if (
                                            req.body.senha.length <= 7 ||
                                            req.body.senha2.length <= 7
                                          ) {
                                            error =
                                              "A senha deve ter no mínimo 8 caracteres";
                                            res.render("admin/edicao_aluno", {
                                              usuario,
                                              error,
                                              foto: foto_admin,
                                              matricula: admin_matricula,
                                              aluno: aluno1,
                                            });
                                          } else {
                                            bd.select_senha(
                                              req.body.senha
                                            ).then((msg) => {
                                              if (msg) {
                                                error = msg;
                                                res.render(
                                                  "admin/edicao_aluno",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_admin,
                                                    matricula: admin_matricula,
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
                                                        "admin/edicao_aluno",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_admin,
                                                          matricula:
                                                            admin_matricula,
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
                                                              "admin/edicao_aluno",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_admin,
                                                                matricula:
                                                                  admin_matricula,
                                                                aluno: aluno1,
                                                              }
                                                            );
                                                          } else {
                                                            bd2
                                                              .delete_update_aluno(
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
                                                              )
                                                              .then((aluno) => {
                                                                if (
                                                                  aluno ===
                                                                  "error"
                                                                ) {
                                                                  req.flash(
                                                                    "error_msg",
                                                                    "Error no sistema tente novamente mais tarde"
                                                                  );
                                                                  res.redirect(
                                                                    "/admin/aluno"
                                                                  );
                                                                } else {
                                                                  req.flash(
                                                                    "sucess_msg",
                                                                    "Alteração do aluno feita com sucesso"
                                                                  );
                                                                  res.redirect(
                                                                    "/admin/aluno"
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd2
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render("admin/edicao_aluno", {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                matricula: admin_matricula,
                                                aluno: aluno1,
                                              });
                                            } else if (
                                              req.body.senha.length <= 7 ||
                                              req.body.senha2.length <= 7
                                            ) {
                                              error =
                                                "A senha deve ter no mínimo 8 caracteres";
                                              res.render("admin/edicao_aluno", {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                matricula: admin_matricula,
                                                aluno: aluno1,
                                              });
                                            } else {
                                              bd.select_senha(
                                                req.body.senha
                                              ).then((msg) => {
                                                if (msg) {
                                                  error = msg;
                                                  res.render(
                                                    "admin/edicao_aluno",
                                                    {
                                                      usuario,
                                                      error,
                                                      foto: foto_admin,
                                                      matricula:
                                                        admin_matricula,
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
                                                          "admin/edicao_aluno",
                                                          {
                                                            usuario,
                                                            error,
                                                            foto: foto_admin,
                                                            matricula:
                                                              admin_matricula,
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
                                                                "admin/edicao_aluno",
                                                                {
                                                                  usuario,
                                                                  error,
                                                                  foto: foto_admin,
                                                                  matricula:
                                                                    admin_matricula,
                                                                  aluno: aluno1,
                                                                }
                                                              );
                                                            } else {
                                                              bd2
                                                                .delete_update_aluno(
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
                                                                )
                                                                .then(
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
                                                                        "/admin/aluno"
                                                                      );
                                                                    } else {
                                                                      req.flash(
                                                                        "sucess_msg",
                                                                        "Alteração do aluno feita com sucesso"
                                                                      );
                                                                      res.redirect(
                                                                        "/admin/aluno"
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd2
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render("admin/edicao_aluno", {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                matricula: admin_matricula,
                                                aluno: aluno1,
                                              });
                                            } else {
                                              bd2
                                                .delete_update_aluno({
                                                  matricula: req.body.matricula,
                                                  usuario: req.body.usuario,
                                                  email: req.body.email,
                                                  celular: req.body.celular,
                                                  residencial:
                                                    req.body.residencial,
                                                  senha: aluno1.senha,
                                                  matricula1: aluno1.matricula,
                                                })
                                                .then((aluno) => {
                                                  if (aluno === "error") {
                                                    req.flash(
                                                      "error_msg",
                                                      "Error no sistema tente novamente mais tarde"
                                                    );
                                                    res.redirect(
                                                      "/admin/aluno"
                                                    );
                                                  } else {
                                                    req.flash(
                                                      "sucess_msg",
                                                      "Alteração do aluno feita com sucesso"
                                                    );
                                                    res.redirect(
                                                      "/admin/aluno"
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd2
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render("admin/edicao_aluno", {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                matricula: admin_matricula,
                                                aluno: aluno1,
                                              });
                                            } else {
                                              bd2
                                                .delete_update_aluno({
                                                  matricula: req.body.matricula,
                                                  usuario: req.body.usuario,
                                                  email: req.body.email,
                                                  celular: req.body.celular,
                                                  residencial:
                                                    req.body.residencial,
                                                  senha: aluno1.senha,
                                                  matricula1: aluno1.matricula,
                                                })
                                                .then((aluno) => {
                                                  if (aluno === "error") {
                                                    req.flash(
                                                      "error_msg",
                                                      "Error no sistema tente novamente mais tarde"
                                                    );
                                                    res.redirect(
                                                      "/admin/aluno"
                                                    );
                                                  } else {
                                                    req.flash(
                                                      "sucess_msg",
                                                      "Alteração do aluno feita com sucesso"
                                                    );
                                                    res.redirect(
                                                      "/admin/aluno"
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_email(req.body.email).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd1.select_email(req.body.email).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("admin/edicao_aluno", {
                                      usuario,
                                      error,
                                      foto: foto_admin,
                                      matricula: admin_matricula,
                                      aluno: aluno1,
                                    });
                                  } else {
                                    bd2
                                      .select_email(req.body.email)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render("admin/edicao_aluno", {
                                            usuario,
                                            error,
                                            foto: foto_admin,
                                            matricula: admin_matricula,
                                            aluno: aluno1,
                                          });
                                        } else {
                                          bd2
                                            .delete_update_aluno({
                                              matricula: req.body.matricula,
                                              usuario: req.body.usuario,
                                              email: req.body.email,
                                              celular: req.body.celular,
                                              residencial: req.body.residencial,
                                              senha: aluno1.senha,
                                              matricula1: aluno1.matricula,
                                            })
                                            .then((aluno) => {
                                              if (aluno === "error") {
                                                req.flash(
                                                  "error_msg",
                                                  "Error no sistema tente novamente mais tarde"
                                                );
                                                res.redirect("/admin/aluno");
                                              } else {
                                                req.flash(
                                                  "sucess_msg",
                                                  "Alteração do aluno feita com sucesso"
                                                );
                                                res.redirect("/admin/aluno");
                                              }
                                            });
                                        }
                                      });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else if (
                            req.body.senha.length <= 7 ||
                            req.body.senha2.length <= 7
                          ) {
                            error = "A senha deve ter no mínimo 8 caracteres";
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_senha(req.body.senha).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd1.select_senha(req.body.senha).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("admin/edicao_aluno", {
                                      usuario,
                                      error,
                                      foto: foto_admin,
                                      matricula: admin_matricula,
                                      aluno: aluno1,
                                    });
                                  } else {
                                    bd2
                                      .select_senha(req.body.senha)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render("admin/edicao_aluno", {
                                            usuario,
                                            error,
                                            foto: foto_admin,
                                            matricula: admin_matricula,
                                            aluno: aluno1,
                                          });
                                        } else {
                                          bd2
                                            .delete_update_aluno({
                                              matricula: req.body.matricula,
                                              usuario: req.body.usuario,
                                              email: req.body.email,
                                              celular: req.body.celular,
                                              residencial: req.body.residencial,
                                              senha: req.body.senha,
                                              matricula1: aluno1.matricula,
                                            })
                                            .then((aluno) => {
                                              if (aluno === "error") {
                                                req.flash(
                                                  "error_msg",
                                                  "Error no sistema tente novamente mais tarde"
                                                );
                                                res.redirect("/admin/aluno");
                                              } else {
                                                req.flash(
                                                  "sucess_msg",
                                                  "Alteração do aluno feita com sucesso"
                                                );
                                                res.redirect("/admin/aluno");
                                              }
                                            });
                                        }
                                      });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else if (
                            req.body.senha.length <= 7 ||
                            req.body.senha2.length <= 7
                          ) {
                            error = "A senha deve ter no mínimo 8 caracteres";
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_senha(req.body.senha).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd1.select_senha(req.body.senha).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("admin/edicao_aluno", {
                                      usuario,
                                      error,
                                      foto: foto_admin,
                                      matricula: admin_matricula,
                                      aluno: aluno1,
                                    });
                                  } else {
                                    bd2
                                      .select_senha(req.body.senha)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render("admin/edicao_aluno", {
                                            usuario,
                                            error,
                                            foto: foto_admin,
                                            matricula: admin_matricula,
                                            aluno: aluno1,
                                          });
                                        } else {
                                          bd2
                                            .delete_update_aluno({
                                              matricula: req.body.matricula,
                                              usuario: req.body.usuario,
                                              email: req.body.email,
                                              celular: req.body.celular,
                                              residencial: req.body.residencial,
                                              senha: req.body.senha,
                                              matricula1: aluno1.matricula,
                                            })
                                            .then((aluno) => {
                                              if (aluno === "error") {
                                                req.flash(
                                                  "error_msg",
                                                  "Error no sistema tente novamente mais tarde"
                                                );
                                                res.redirect("/admin/aluno");
                                              } else {
                                                req.flash(
                                                  "sucess_msg",
                                                  "Alteração do aluno feita com sucesso"
                                                );
                                                res.redirect("/admin/aluno");
                                              }
                                            });
                                        }
                                      });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("admin/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                aluno: aluno1,
                              });
                            } else if (
                              req.body.senha.length <= 7 ||
                              req.body.senha2.length <= 7
                            ) {
                              error = "A senha deve ter no mínimo 8 caracteres";
                              res.render("admin/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                aluno: aluno1,
                              });
                            } else {
                              bd.select_senha(req.body.senha).then((msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd1
                                    .select_senha(req.body.senha)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd2
                                          .select_senha(req.body.senha)
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render("admin/edicao_aluno", {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                matricula: admin_matricula,
                                                aluno: aluno1,
                                              });
                                            } else {
                                              bd2
                                                .delete_update_aluno({
                                                  matricula: req.body.matricula,
                                                  usuario: req.body.usuario,
                                                  email: req.body.email,
                                                  celular: req.body.celular,
                                                  residencial:
                                                    req.body.residencial,
                                                  senha: req.body.senha,
                                                  matricula1: aluno1.matricula,
                                                })
                                                .then((aluno) => {
                                                  if (aluno === "error") {
                                                    req.flash(
                                                      "error_msg",
                                                      "Error no sistema tente novamente mais tarde"
                                                    );
                                                    res.redirect(
                                                      "/admin/aluno"
                                                    );
                                                  } else {
                                                    req.flash(
                                                      "sucess_msg",
                                                      "Alteração do aluno feita com sucesso"
                                                    );
                                                    res.redirect(
                                                      "/admin/aluno"
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd2
                              .delete_update_aluno({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: aluno1.senha,
                                matricula1: aluno1.matricula,
                              })
                              .then((aluno) => {
                                if (aluno === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/admin/aluno");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do aluno feita com sucesso"
                                  );
                                  res.redirect("/admin/aluno");
                                }
                              });
                          }
                        });
                      }
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_aluno", {
                              uusario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd2
                              .delete_update_aluno({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: aluno1.senha,
                                matricula1: aluno1.matricula,
                              })
                              .then((aluno) => {
                                if (aluno === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/admin/aluno");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do aluno feita com sucesso"
                                  );
                                  res.redirect("/admin/aluno");
                                }
                              });
                          }
                        });
                      }
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("admin/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                aluno: aluno1,
                              });
                            } else {
                              bd2
                                .delete_update_aluno({
                                  matricula: req.body.matricula,
                                  usuario: req.body.usuario,
                                  email: req.body.email,
                                  celular: req.body.celular,
                                  residencial: req.body.residencial,
                                  senha: aluno1.senha,
                                  matricula1: aluno1.matricula,
                                })
                                .then((aluno) => {
                                  if (aluno === "error") {
                                    req.flash(
                                      "error_msg",
                                      "Error no sistema tente novamente mais tarde"
                                    );
                                    res.redirect("/admin/aluno");
                                  } else {
                                    req.flash(
                                      "sucess_msg",
                                      "Alteração do aluno feita com sucesso"
                                    );
                                    res.redirect("/admin/aluno");
                                  }
                                });
                            }
                          });
                      }
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd2
                              .delete_update_aluno({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: req.body.senha,
                                matricula1: aluno1.matricula,
                              })
                              .then((aluno) => {
                                if (aluno === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/admin/aluno");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do aluno feita com sucesso"
                                  );
                                  res.redirect("/admin/aluno");
                                }
                              });
                          }
                        });
                      }
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd2
                  .delete_update_aluno({
                    matricula: req.body.matricula,
                    usuario: req.body.usuario,
                    email: req.body.email,
                    celular: req.body.celular,
                    residencial: req.body.residencial,
                    senha: aluno1.senha,
                    matricula1: aluno1.matricula,
                  })
                  .then((aluno) => {
                    if (aluno === "error") {
                      req.flash(
                        "error_msg",
                        "Error no sistema tente novamente mais tarde"
                      );
                      res.redirect("/admin/aluno");
                    } else {
                      req.flash(
                        "sucess_msg",
                        "Alteração do aluno feita com sucesso"
                      );
                      res.redirect("/admin/aluno");
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
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd2
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render("admin/edicao_aluno", {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                matricula: admin_matricula,
                                                aluno: aluno1,
                                              });
                                            } else if (
                                              req.body.senha.length <= 7 ||
                                              req.body.senha2.length <= 7
                                            ) {
                                              error =
                                                "A senha deve ter no mínimo 8 caracteres";
                                              res.render("admin/edicao_aluno", {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                matricula: admin_matricula,
                                                aluno: aluno1,
                                              });
                                            } else {
                                              bd.select_senha(
                                                req.body.senha
                                              ).then((msg) => {
                                                if (msg) {
                                                  error = msg;
                                                  res.render(
                                                    "admin/edicao_aluno",
                                                    {
                                                      usuario,
                                                      error,
                                                      foto: foto_admin,
                                                      matricula:
                                                        admin_matricula,
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
                                                          "admin/edicao_aluno",
                                                          {
                                                            usuario,
                                                            error,
                                                            foto: foto_admin,
                                                            matricula:
                                                              admin_matricula,
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
                                                                "admin/edicao_aluno",
                                                                {
                                                                  usuario,
                                                                  error,
                                                                  foto: foto_admin,
                                                                  matricula:
                                                                    admin_matricula,
                                                                  aluno: aluno1,
                                                                }
                                                              );
                                                            } else {
                                                              bd2
                                                                .update_aluno({
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
                                                                })
                                                                .then(
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
                                                                        "/admin/aluno"
                                                                      );
                                                                    } else {
                                                                      req.flash(
                                                                        "sucess_msg",
                                                                        "Alteração do aluno feita com sucesso"
                                                                      );
                                                                      res.redirect(
                                                                        "/admin/aluno"
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
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else if (
                            req.body.senha.length <= 7 ||
                            req.body.senha2.length <= 7
                          ) {
                            error = "A senha deve ter no mínimo 8 caracteres";
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_senha(req.body.senha).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_aluno", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  aluno: aluno1,
                                });
                              } else {
                                bd1.select_senha(req.body.senha).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("admin/edicao_aluno", {
                                      usuario,
                                      error,
                                      foto: foto_admin,
                                      matricula: admin_matricula,
                                      aluno: aluno1,
                                    });
                                  } else {
                                    bd2
                                      .select_senha(req.body.senha)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render("admin/edicao_aluno", {
                                            usuario,
                                            error,
                                            foto: foto_admin,
                                            matricula: admin_matricula,
                                            aluno: aluno1,
                                          });
                                        } else {
                                          bd2
                                            .update_aluno({
                                              matricula: req.body.matricula,
                                              usuario: req.body.usuario,
                                              email: req.body.email,
                                              celular: req.body.celular,
                                              residencial: req.body.residencial,
                                              senha: req.body.senha,
                                              matricula1: aluno1.matricula,
                                            })
                                            .then((aluno) => {
                                              if (aluno === "error") {
                                                req.flash(
                                                  "error_msg",
                                                  "Error no sistema tente novamente mais tarde"
                                                );
                                                res.redirect("/admin/aluno");
                                              } else {
                                                req.flash(
                                                  "sucess_msg",
                                                  "Alteração do aluno feita com sucesso"
                                                );
                                                res.redirect("/admin/aluno");
                                              }
                                            });
                                        }
                                      });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
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
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("admin/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                aluno: aluno1,
                              });
                            } else if (
                              req.body.senha.length <= 7 ||
                              req.body.senha2.length <= 7
                            ) {
                              error = "A senha deve ter no mínimo 8 caracteres";
                              res.render("admin/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                aluno: aluno1,
                              });
                            } else {
                              bd.select_senha(req.body.senha).then((msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd1
                                    .select_senha(req.body.senha)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd2
                                          .select_senha(req.body.senha)
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render("admin/edicao_aluno", {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                matricula: admin_matricula,
                                                aluno: aluno1,
                                              });
                                            } else {
                                              bd2
                                                .update_aluno({
                                                  matricula: req.body.matricula,
                                                  usuario: req.body.usuario,
                                                  email: req.body.email,
                                                  celular: req.body.celular,
                                                  residencial:
                                                    req.body.residencial,
                                                  senha: req.body.senha,
                                                  matricula1: aluno1.matricula,
                                                })
                                                .then((aluno) => {
                                                  if (aluno === "error") {
                                                    req.flash(
                                                      "error_msg",
                                                      "Error no sistema tente novamente mais tarde"
                                                    );
                                                    res.redirect(
                                                      "/admin/aluno"
                                                    );
                                                  } else {
                                                    req.flash(
                                                      "sucess_msg",
                                                      "Alteração do aluno feita com sucesso"
                                                    );
                                                    res.redirect(
                                                      "/admin/aluno"
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
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("admin/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                aluno: aluno1,
                              });
                            } else if (
                              req.body.senha.length <= 7 ||
                              req.body.senha2.length <= 7
                            ) {
                              error = "A senha deve ter no mínimo 8 caracteres";
                              res.render("admin/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                aluno: aluno1,
                              });
                            } else {
                              bd.select_senha(req.body.senha).then((msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd1
                                    .select_senha(req.body.senha)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd2
                                          .select_senha(req.body.senha)
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render("admin/edicao_aluno", {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                matricula: admin_matricula,
                                                aluno: aluno1,
                                              });
                                            } else {
                                              bd2
                                                .update_aluno({
                                                  matricula: req.body.matricula,
                                                  usuario: req.body.usuario,
                                                  email: req.body.email,
                                                  celular: req.body.celular,
                                                  residencial:
                                                    req.body.residencial,
                                                  senha: req.body.senha,
                                                  matricula1: aluno1.matricula,
                                                })
                                                .then((aluno) => {
                                                  if (aluno === "error") {
                                                    req.flash(
                                                      "error_msg",
                                                      "Error no sistema tente novamente mais tarde"
                                                    );
                                                    res.redirect(
                                                      "/admin/aluno"
                                                    );
                                                  } else {
                                                    req.flash(
                                                      "sucess_msg",
                                                      "Alteração do aluno feita com sucesso"
                                                    );
                                                    res.redirect(
                                                      "/admin/aluno"
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
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_aluno", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    aluno: aluno1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_aluno", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          aluno: aluno1,
                                        });
                                      } else {
                                        bd2
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render("admin/edicao_aluno", {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                matricula: admin_matricula,
                                                aluno: aluno1,
                                              });
                                            } else {
                                              bd2
                                                .update_aluno({
                                                  matricula: req.body.matricula,
                                                  usuario: req.body.usuario,
                                                  email: req.body.email,
                                                  celular: req.body.celular,
                                                  residencial:
                                                    req.body.residencial,
                                                  senha: aluno1.senha,
                                                  matricula1: aluno1.matricula,
                                                })
                                                .then((aluno) => {
                                                  if (aluno === "error") {
                                                    req.flash(
                                                      "error_msg",
                                                      "Error no sistema tente novamente mais tarde"
                                                    );
                                                    res.redirect(
                                                      "/admin/aluno"
                                                    );
                                                  } else {
                                                    req.flash(
                                                      "sucess_msg",
                                                      "Alteração do aluno feita com sucesso"
                                                    );
                                                    res.redirect(
                                                      "/admin/aluno"
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
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("admin/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                aluno: aluno1,
                              });
                            } else {
                              bd2
                                .update_aluno({
                                  matricula: req.body.matricula,
                                  usuario: req.body.usuario,
                                  email: req.body.email,
                                  celular: req.body.celular,
                                  residencial: req.body.residencial,
                                  senha: aluno1.senha,
                                  matricula1: aluno1.matricula,
                                })
                                .then((aluno) => {
                                  if (aluno === "error") {
                                    req.flash(
                                      "error_msg",
                                      "Error no sistema tente novamente mais tarde"
                                    );
                                    res.redirect("/admin/aluno");
                                  } else {
                                    req.flash(
                                      "sucess_msg",
                                      "Alteração do aluno feita com sucesso"
                                    );
                                    res.redirect("/admin/aluno");
                                  }
                                });
                            }
                          });
                      }
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
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd2
                              .update_aluno({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: aluno1.senha,
                                matricula1: aluno1.matricula,
                              })
                              .then((aluno) => {
                                if (aluno === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/admin/aluno");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do aluno feita com sucesso"
                                  );
                                  res.redirect("/admin/aluno");
                                }
                              });
                          }
                        });
                      }
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
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("admin/edicao_aluno", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                aluno: aluno1,
                              });
                            } else {
                              bd2
                                .update_aluno({
                                  matricula: req.body.matricula,
                                  usuario: req.body.usuario,
                                  email: req.body.email,
                                  celular: req.body.celular,
                                  residencial: req.body.residencial,
                                  senha: aluno1.senha,
                                  matricula1: aluno1.matricula,
                                })
                                .then((aluno) => {
                                  if (aluno === "error") {
                                    req.flash(
                                      "error_msg",
                                      "Error no sistema tente novamente mais tarde"
                                    );
                                    res.redirect("/admin/aluno");
                                  } else {
                                    req.flash(
                                      "sucess_msg",
                                      "Alteração do aluno feita com sucesso"
                                    );
                                    res.redirect("/admin/aluno");
                                  }
                                });
                            }
                          });
                      }
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
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd2
                              .update_aluno({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: req.body.senha,
                                matricula1: aluno1.matricula,
                              })
                              .then((aluno) => {
                                if (aluno === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/admin/aluno");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do aluno feita com sucesso"
                                  );
                                  res.redirect("/admin/aluno");
                                }
                              });
                          }
                        });
                      }
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
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd2
                  .update_aluno({
                    matricula: req.body.matricula,
                    usuario: req.body.usuario,
                    email: req.body.email,
                    celular: req.body.celular,
                    residencial: req.body.residencial,
                    senha: aluno1.senha,
                    matricula1: aluno1.matricula,
                  })
                  .then((aluno) => {
                    if (aluno === "error") {
                      req.flash(
                        "error_msg",
                        "Error no sistema tente novamente mais tarde"
                      );
                      res.redirect("/admin/aluno");
                    } else {
                      req.flash(
                        "sucess_msg",
                        "Alteração do aluno feita com sucesso"
                      );
                      res.redirect("/admin/aluno");
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
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd2
                              .update_aluno({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: req.body.senha,
                                matricula1: aluno1.matricula,
                              })
                              .then((aluno) => {
                                if (aluno === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/admin/aluno");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do aluno feita com sucesso"
                                  );
                                  res.redirect("/admin/aluno");
                                }
                              });
                          }
                        });
                      }
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
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd2
                  .update_aluno({
                    matricula: req.body.matricula,
                    usuario: req.body.usuario,
                    email: req.body.email,
                    celular: req.body.celular,
                    residencial: req.body.residencial,
                    senha: aluno1.senha,
                    matricula1: aluno1.matricula,
                  })
                  .then((aluno) => {
                    if (aluno === "error") {
                      req.flash(
                        "error_msg",
                        "Error no sistema tente novamente mais tarde"
                      );
                      res.redirect("/admin/aluno");
                    } else {
                      req.flash(
                        "sucess_msg",
                        "Alteração do aluno feita com sucesso"
                      );
                      res.redirect("/admin/aluno");
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
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_residencial(req.body.residencial).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_residencial(req.body.residencial).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_aluno", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      aluno: aluno1,
                    });
                  } else {
                    bd1.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_aluno", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          aluno: aluno1,
                        });
                      } else {
                        bd2.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_aluno", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              aluno: aluno1,
                            });
                          } else {
                            bd2
                              .update_aluno({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: req.body.senha,
                                matricula1: aluno1.matricula,
                              })
                              .then((aluno) => {
                                if (aluno === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/admin/aluno");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do aluno feita com sucesso"
                                  );
                                  res.redirect("/admin/aluno");
                                }
                              });
                          }
                        });
                      }
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
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_residencial(req.body.residencial).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_residencial(req.body.residencial).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd2
                  .update_aluno({
                    matricula: req.body.matricula,
                    usuario: req.body.usuario,
                    email: req.body.email,
                    celular: req.body.celular,
                    residencial: req.body.residencial,
                    senha: aluno1.senha,
                    matricula1: aluno1.matricula,
                  })
                  .then((aluno) => {
                    if (aluno === "error") {
                      req.flash(
                        "error_msg",
                        "Error no sistema tente novamente mais tarde"
                      );
                      res.redirect("/admin/aluno");
                    } else {
                      req.flash(
                        "sucess_msg",
                        "Alteração do aluno feita com sucesso"
                      );
                      res.redirect("/admin/aluno");
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
        res.render("admin/edicao_aluno", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          aluno: aluno1,
        });
      } else {
        bd1.select_senha(req.body.senha).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_aluno", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              aluno: aluno1,
            });
          } else {
            bd2.select_senha(req.body.senha).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("admin/edicao_aluno", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  aluno: aluno1,
                });
              } else {
                bd2
                  .update_aluno({
                    matricula: req.body.matricula,
                    usuario: req.body.usuario,
                    email: req.body.email,
                    celular: req.body.celular,
                    residencial: req.body.residencial,
                    senha: req.body.senha,
                    matricula1: aluno1.matricula,
                  })
                  .then((aluno) => {
                    if (aluno === "error") {
                      req.flash(
                        "error_msg",
                        "Error no sistema tente novamente mais tarde"
                      );
                      res.redirect("/admin/aluno");
                    } else {
                      req.flash(
                        "sucess_msg",
                        "Alteração do aluno feita com sucesso"
                      );
                      res.redirect("/admin/aluno");
                    }
                  });
              }
            });
          }
        });
      }
    });
  } else {
    bd2
      .update_aluno({
        matricula: req.body.matricula,
        usuario: req.body.usuario,
        email: req.body.email,
        celular: req.body.celular,
        residencial: req.body.residencial,
        senha: aluno1.senha,
        matricula1: aluno1.matricula,
      })
      .then((aluno) => {
        if (aluno === "error") {
          req.flash("error_msg", "Error no sistema tente novamente mais tarde");
          res.redirect("/admin/aluno");
        } else {
          req.flash("sucess_msg", "Alteração do aluno feita com sucesso");
          res.redirect("/admin/aluno");
        }
      });
  }
});

/*alteração de dados do professor*/
router.get("/professor/alteracao/:matricula", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }
  } catch (error) {
    var admin_matricula = null;
  }

  bd1.select_admin(admin_matricula).then((admin) => {
    if (admin === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_admin = admin[0].foto_perfil;
    } else if (admin === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_admin = admin[0].foto_perfil;
    } else {
      usuario = admin[0].usuario;
      foto_admin = admin[0].foto_perfil;
    }
  });
  bd.select_professor1(req.params.matricula).then((professor) => {
    if (professor === "vazio") {
      req.flash("error_msg", "Professor não encontrado");
      res.redirect("/admin/professor");
    } else if (professor === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("admin/professor");
    } else {
      professor = professor[0];
      professor1 = professor;
      res.render("admin/edicao_professor", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
        professor,
      });
    }
  });
});

router.post("/professor/alteracao/foto", eAdmin, (req, res) => {
  admin_perfil(req, res, () => {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_admin !== "undefined") {
      fs.unlink("./public/upload/admin/" + foto_admin, () => {});
    }

    bd1
      .update_foto_admin({
        foto_perfil: req.file.filename,
        matricula: admin_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do admin");
        } else {
          res.redirect("/admin/professor/alteracao/" + professor1.matricula);
        }
      });
  });
});

router.post("/professor/alteracao/", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin != 1) {
      usuario = "[Você não devia estar aqui!!!]";
    } else if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
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
    res.render("admin/edicao_professor", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      professor: professor1,
    });
  } else if (
    !req.body.usuario ||
    typeof req.body.usuario === undefined ||
    req.body.usuario === null
  ) {
    error = "Usuário invalido";
    res.render("admin/edicao_professor", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      professor: professor1,
    });
  } else if (
    !req.body.email ||
    typeof req.body.email === undefined ||
    req.body.email === null
  ) {
    error = "Email invalido";
    res.render("admin/edicao_professor", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      professor: professor1,
    });
  } else if (
    !req.body.celular ||
    typeof req.body.celular === undefined ||
    req.body.celular === null
  ) {
    error = "Telefone celular invalido";
    res.render("admin/edicao_professor", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      professor: professor1,
    });
  } else if (req.body.celular.length < 15) {
    error = "Número de celular invalido";
    res.render("admin/edicao_professor", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      professor: professor1,
    });
  } else if (req.body.residencial) {
    if (req.body.residencial.length < 14) {
      error = "Número residencial invalido";
      res.render("admin/edicao_professor", {
        usuario,
        error,
        foto: foto_admin,
        matricula: admin_matricula,
        professor: professor1,
      });
    }
  }
  if (req.body.senha !== req.body.senha2) {
    error = "Senhas diferentes";
    res.render("admin/edicao_professor", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      professor: professor1,
    });
  } else if (
    req.body.matricula != professor1.matricula &&
    req.body.email != professor1.email &&
    req.body.celular != professor1.telefone_celular &&
    req.body.residencial != professor1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_professor", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  professor: professor1,
                                });
                              } else {
                                bd1
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render("admin/edicao_professor", {
                                        usuario,
                                        error,
                                        foto: foto_admin,
                                        matricula: admin_matricula,
                                        professor: professor1,
                                      });
                                    } else {
                                      bd2
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render(
                                              "admin/edicao_professor",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                matricula: admin_matricula,
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
                                                  "admin/edicao_professor",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_admin,
                                                    matricula: admin_matricula,
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
                                                        "admin/edicao_professor",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_admin,
                                                          matricula:
                                                            admin_matricula,
                                                          professor: professor1,
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
                                                              "admin/edicao_professor",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_admin,
                                                                matricula:
                                                                  admin_matricula,
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
                                                              "admin/edicao_professor",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_admin,
                                                                matricula:
                                                                  admin_matricula,
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
                                                                  "admin/edicao_professor",
                                                                  {
                                                                    usuario,
                                                                    error,
                                                                    foto: foto_admin,
                                                                    matricula:
                                                                      admin_matricula,
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
                                                                          "admin/edicao_professor",
                                                                          {
                                                                            usuario,
                                                                            error,
                                                                            foto: foto_admin,
                                                                            matricula:
                                                                              admin_matricula,
                                                                            professor:
                                                                              professor1,
                                                                          }
                                                                        );
                                                                      } else {
                                                                        bd2
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
                                                                                  "admin/edicao_professor",
                                                                                  {
                                                                                    usuario,
                                                                                    error,
                                                                                    foto: foto_admin,
                                                                                    matricula:
                                                                                      admin_matricula,
                                                                                    professor:
                                                                                      professor1,
                                                                                  }
                                                                                );
                                                                              } else {
                                                                                bd.delete_update_professor(
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
                                                                                ).then(
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
                                                                                        "/admin/professor"
                                                                                      );
                                                                                    } else {
                                                                                      req.flash(
                                                                                        "sucess_msg",
                                                                                        "Alteração do professor feita com sucesso"
                                                                                      );
                                                                                      res.redirect(
                                                                                        "/admin/professor"
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_professor", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    professor: professor1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_professor", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          professor: professor1,
                                        });
                                      } else {
                                        bd2
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "admin/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
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
                                                "admin/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
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
                                                    "admin/edicao_professor",
                                                    {
                                                      usuario,
                                                      error,
                                                      foto: foto_admin,
                                                      matricula:
                                                        admin_matricula,
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
                                                          "admin/edicao_professor",
                                                          {
                                                            usuario,
                                                            error,
                                                            foto: foto_admin,
                                                            matricula:
                                                              admin_matricula,
                                                            professor:
                                                              professor1,
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
                                                                "admin/edicao_professor",
                                                                {
                                                                  usuario,
                                                                  error,
                                                                  foto: foto_admin,
                                                                  matricula:
                                                                    admin_matricula,
                                                                  professor:
                                                                    professor1,
                                                                }
                                                              );
                                                            } else {
                                                              bd.delete_update_professor(
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
                                                              ).then(
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
                                                                      "/admin/professor"
                                                                    );
                                                                  } else {
                                                                    req.flash(
                                                                      "sucess_msg",
                                                                      "Alteração do professor feita com sucesso"
                                                                    );
                                                                    res.redirect(
                                                                      "/admin/professor"
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_professor", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  professor: professor1,
                                });
                              } else {
                                bd1
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render("admin/edicao_professor", {
                                        usuario,
                                        error,
                                        foto: foto_admin,
                                        matricula: admin_matricula,
                                        professor: professor1,
                                      });
                                    } else {
                                      bd2
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render(
                                              "admin/edicao_professor",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                matricula: admin_matricula,
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
                                                  "admin/edicao_professor",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_admin,
                                                    matricula: admin_matricula,
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
                                                        "admin/edicao_professor",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_admin,
                                                          matricula:
                                                            admin_matricula,
                                                          professor: professor1,
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
                                                              "admin/edicao_professor",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_admin,
                                                                matricula:
                                                                  admin_matricula,
                                                                professor:
                                                                  professor1,
                                                              }
                                                            );
                                                          } else {
                                                            bd.delete_update_professor(
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
                                                            ).then(
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
                                                                    "/admin/professor"
                                                                  );
                                                                } else {
                                                                  req.flash(
                                                                    "sucess_msg",
                                                                    "Alteração do professor feita com sucesso"
                                                                  );
                                                                  res.redirect(
                                                                    "/admin/professor"
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_professor", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  professor: professor1,
                                });
                              } else {
                                bd1
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render("admin/edicao_professor", {
                                        usuario,
                                        error,
                                        foto: foto_admin,
                                        matricula: admin_matricula,
                                        professor: professor1,
                                      });
                                    } else {
                                      bd2
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render(
                                              "admin/edicao_professor",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                matricula: admin_matricula,
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
                                              "admin/edicao_professor",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                matricula: admin_matricula,
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
                                                  "admin/edicao_professor",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_admin,
                                                    matricula: admin_matricula,
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
                                                        "admin/edicao_professor",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_admin,
                                                          matricula:
                                                            admin_matricula,
                                                          professor: professor1,
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
                                                              "admin/edicao_professor",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_admin,
                                                                matricula:
                                                                  admin_matricula,
                                                                professor:
                                                                  professor1,
                                                              }
                                                            );
                                                          } else {
                                                            bd.delete_update_professor(
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
                                                            ).then(
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
                                                                    "/admin/professor"
                                                                  );
                                                                } else {
                                                                  req.flash(
                                                                    "sucess_msg",
                                                                    "Alteração do professor feita com sucesso"
                                                                  );
                                                                  res.redirect(
                                                                    "/admin/professor"
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_professor", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    professor: professor1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_professor", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          professor: professor1,
                                        });
                                      } else {
                                        bd2
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "admin/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
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
                                                "admin/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
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
                                                    "admin/edicao_professor",
                                                    {
                                                      usuario,
                                                      error,
                                                      foto: foto_admin,
                                                      matricula:
                                                        admin_matricula,
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
                                                          "admin/edicao_professor",
                                                          {
                                                            usuario,
                                                            error,
                                                            foto: foto_admin,
                                                            matricula:
                                                              admin_matricula,
                                                            professor:
                                                              professor1,
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
                                                                "admin/edicao_professor",
                                                                {
                                                                  usuario,
                                                                  error,
                                                                  foto: foto_admin,
                                                                  matricula:
                                                                    admin_matricula,
                                                                  professor:
                                                                    professor1,
                                                                }
                                                              );
                                                            } else {
                                                              bd.delete_update_professor(
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
                                                              ).then(
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
                                                                      "/admin/professor"
                                                                    );
                                                                  } else {
                                                                    req.flash(
                                                                      "sucess_msg",
                                                                      "Alteração do professor feita com sucesso"
                                                                    );
                                                                    res.redirect(
                                                                      "/admin/professor"
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_professor", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    professor: professor1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_professor", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          professor: professor1,
                                        });
                                      } else {
                                        bd2
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "admin/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
                                                  professor: professor1,
                                                }
                                              );
                                            } else {
                                              bd.delete_update_professor({
                                                matricula: req.body.matricula,
                                                usuario: req.body.usuario,
                                                email: req.body.email,
                                                celular: req.body.celular,
                                                residencial:
                                                  req.body.residencial,
                                                senha: professor1.senha,
                                                matricula1:
                                                  professor1.matricula,
                                              }).then((professor) => {
                                                if (professor === "error") {
                                                  req.flash(
                                                    "error_msg",
                                                    "Error no sistema tente novamente mais tarde"
                                                  );
                                                  res.redirect(
                                                    "/admin/professor"
                                                  );
                                                } else {
                                                  req.flash(
                                                    "sucess_msg",
                                                    "Alteração do professor feita com sucesso"
                                                  );
                                                  res.redirect(
                                                    "/admin/professor"
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_professor", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    professor: professor1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_professor", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          professor: professor1,
                                        });
                                      } else {
                                        bd2
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "admin/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
                                                  professor: professor1,
                                                }
                                              );
                                            } else {
                                              bd.delete_update_professor({
                                                matricula: req.body.matricula,
                                                usuario: req.body.usuario,
                                                email: req.body.email,
                                                celular: req.body.celular,
                                                residencial:
                                                  req.body.residencial,
                                                senha: professor1.senha,
                                                matricula1:
                                                  professor1.matricula,
                                              }).then((professor) => {
                                                if (professor === "error") {
                                                  req.flash(
                                                    "error_msg",
                                                    "Error no sistema tente novamente mais tarde"
                                                  );
                                                  res.redirect(
                                                    "/admin/professor"
                                                  );
                                                } else {
                                                  req.flash(
                                                    "sucess_msg",
                                                    "Alteração do professor feita com sucesso"
                                                  );
                                                  res.redirect(
                                                    "/admin/professor"
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_email(req.body.email).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_professor", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  professor: professor1,
                                });
                              } else {
                                bd1.select_email(req.body.email).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("admin/edicao_professor", {
                                      usuario,
                                      error,
                                      foto: foto_admin,
                                      matricula: admin_matricula,
                                      professor: professor1,
                                    });
                                  } else {
                                    bd2
                                      .select_email(req.body.email)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render("admin/edicao_professor", {
                                            usuario,
                                            error,
                                            foto: foto_admin,
                                            matricula: admin_matricula,
                                            professor: professor1,
                                          });
                                        } else {
                                          bd.delete_update_professor({
                                            matricula: req.body.matricula,
                                            usuario: req.body.usuario,
                                            email: req.body.email,
                                            celular: req.body.celular,
                                            residencial: req.body.residencial,
                                            senha: professor1.senha,
                                            matricula1: professor1.matricula,
                                          }).then((professor) => {
                                            if (professor === "error") {
                                              req.flash(
                                                "error_msg",
                                                "Error no sistema tente novamente mais tarde"
                                              );
                                              res.redirect("/admin/professor");
                                            } else {
                                              req.flash(
                                                "sucess_msg",
                                                "Alteração do professor feita com sucesso"
                                              );
                                              res.redirect("/admin/professor");
                                            }
                                          });
                                        }
                                      });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else if (
                            req.body.senha.length <= 7 ||
                            req.body.senha2.length <= 7
                          ) {
                            error = "A senha deve ter no mínimo 8 caracteres";
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_senha(req.body.senha).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_professor", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  professor: professor1,
                                });
                              } else {
                                bd1.select_senha(req.body.senha).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("admin/edicao_professor", {
                                      usuario,
                                      error,
                                      foto: foto_admin,
                                      matricula: admin_matricula,
                                      professor: professor1,
                                    });
                                  } else {
                                    bd2
                                      .select_senha(req.body.senha)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render("admin/edicao_professor", {
                                            usuario,
                                            error,
                                            foto: foto_admin,
                                            matricula: admin_matricula,
                                            professor: professor1,
                                          });
                                        } else {
                                          bd.delete_update_professor({
                                            matricula: req.body.matricula,
                                            usuario: req.body.usuario,
                                            email: req.body.email,
                                            celular: req.body.celular,
                                            residencial: req.body.residencial,
                                            senha: req.body.senha,
                                            matricula1: professor1.matricula,
                                          }).then((professor) => {
                                            if (professor === "error") {
                                              req.flash(
                                                "error_msg",
                                                "Error no sistema tente novamente mais tarde"
                                              );
                                              res.redirect("/admin/professor");
                                            } else {
                                              req.flash(
                                                "sucess_msg",
                                                "Alteração do professor feita com sucesso"
                                              );
                                              res.redirect("/admin/professor");
                                            }
                                          });
                                        }
                                      });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else if (
                            req.body.senha.length <= 7 ||
                            req.body.senha2.length <= 7
                          ) {
                            error = "A senha deve ter no mínimo 8 caracteres";
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_senha(req.body.senha).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_professor", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  professor: professor1,
                                });
                              } else {
                                bd1.select_senha(req.body.senha).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("admin/edicao_professor", {
                                      usuario,
                                      error,
                                      foto: foto_admin,
                                      matricula: admin_matricula,
                                      professor: professor1,
                                    });
                                  } else {
                                    bd2
                                      .select_senha(req.body.senha)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render("admin/edicao_professor", {
                                            usuario,
                                            error,
                                            foto: foto_admin,
                                            matricula: admin_matricula,
                                            professor: professor1,
                                          });
                                        } else {
                                          bd.delete_update_professor({
                                            matricula: req.body.matricula,
                                            usuario: req.body.usuario,
                                            email: req.body.email,
                                            celular: req.body.celular,
                                            residencial: req.body.residencial,
                                            senha: req.body.senha,
                                            matricula1: professor1.matricula,
                                          }).then((professor) => {
                                            if (professor === "error") {
                                              req.flash(
                                                "error_msg",
                                                "Error no sistema tente novamente mais tarde"
                                              );
                                              res.redirect("/admin/professor");
                                            } else {
                                              req.flash(
                                                "sucess_msg",
                                                "Alteração do professor feita com sucesso"
                                              );
                                              res.redirect("/admin/professor");
                                            }
                                          });
                                        }
                                      });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("admin/edicao_professor", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                professor: professor1,
                              });
                            } else if (
                              req.body.senha.length <= 7 ||
                              req.body.senha2.length <= 7
                            ) {
                              error = "A senha deve ter no mínimo 8 caracteres";
                              res.render("admin/edicao_professor", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                professor: professor1,
                              });
                            } else {
                              bd.select_senha(req.body.senha).then((msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_professor", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    professor: professor1,
                                  });
                                } else {
                                  bd1
                                    .select_senha(req.body.senha)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_professor", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          professor: professor1,
                                        });
                                      } else {
                                        bd2
                                          .select_senha(req.body.senha)
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "admin/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
                                                  professor: professor1,
                                                }
                                              );
                                            } else {
                                              bd.delete_update_professor({
                                                matricula: req.body.matricula,
                                                usuario: req.body.usuario,
                                                email: req.body.email,
                                                celular: req.body.celular,
                                                residencial:
                                                  req.body.residencial,
                                                senha: req.body.senha,
                                                matricula1:
                                                  professor1.matricula,
                                              }).then((professor) => {
                                                if (professor === "error") {
                                                  req.flash(
                                                    "error_msg",
                                                    "Error no sistema tente novamente mais tarde"
                                                  );
                                                  res.redirect(
                                                    "/admin/professor"
                                                  );
                                                } else {
                                                  req.flash(
                                                    "sucess_msg",
                                                    "Alteração do professor feita com sucesso"
                                                  );
                                                  res.redirect(
                                                    "/admin/professor"
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.delete_update_professor({
                              matricula: req.body.matricula,
                              usuario: req.body.usuario,
                              email: req.body.email,
                              celular: req.body.celular,
                              residencial: req.body.residencial,
                              senha: professor1.senha,
                              matricula1: professor1.matricula,
                            }).then((professor) => {
                              if (professor === "error") {
                                req.flash(
                                  "error_msg",
                                  "Error no sistema tente novamente mais tarde"
                                );
                                res.redirect("/admin/professor");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do professor feita com sucesso"
                                );
                                res.redirect("/admin/professor");
                              }
                            });
                          }
                        });
                      }
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.delete_update_professor({
                              matricula: req.body.matricula,
                              usuario: req.body.usuario,
                              email: req.body.email,
                              celular: req.body.celular,
                              residencial: req.body.residencial,
                              senha: professor1.senha,
                              matricula1: professor1.matricula,
                            }).then((professor) => {
                              if (professor === "error") {
                                req.flash(
                                  "error_msg",
                                  "Error no sistema tente novamente mais tarde"
                                );
                                res.redirect("/admin/professor");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do professor feita com sucesso"
                                );
                                res.redirect("/admin/professor");
                              }
                            });
                          }
                        });
                      }
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("admin/edicao_professor", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                professor: professor1,
                              });
                            } else {
                              bd.delete_update_professor({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: professor1.senha,
                                matricula1: professor1.matricula,
                              }).then((professor) => {
                                if (professor === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/admin/professor");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do professor feita com sucesso"
                                  );
                                  res.redirect("/admin/professor");
                                }
                              });
                            }
                          });
                      }
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.delete_update_professor({
                              matricula: req.body.matricula,
                              usuario: req.body.usuario,
                              email: req.body.email,
                              celular: req.body.celular,
                              residencial: req.body.residencial,
                              senha: req.body.senha,
                              matricula1: professor1.matricula,
                            }).then((professor) => {
                              if (professor === "error") {
                                req.flash(
                                  "error_msg",
                                  "Error no sistema tente novamente mais tarde"
                                );
                                res.redirect("/admin/professor");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do professor feita com sucesso"
                                );
                                res.redirect("/admin/professor");
                              }
                            });
                          }
                        });
                      }
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
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.delete_update_professor({
                  matricula: req.body.matricula,
                  usuario: req.body.usuario,
                  email: req.body.email,
                  celular: req.body.celular,
                  residencial: req.body.residencial,
                  senha: professor1.senha,
                  matricula1: professor1.matricula,
                }).then((professor) => {
                  if (professor === "error") {
                    req.flash(
                      "error_msg",
                      "Error no sistema tente novamente mais tarde"
                    );
                    res.redirect("/admin/professor");
                  } else {
                    req.flash(
                      "sucess_msg",
                      "Alteração do professor feita com sucesso"
                    );
                    res.redirect("/admin/professor");
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
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_professor", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    professor: professor1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_professor", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          professor: professor1,
                                        });
                                      } else {
                                        bd2
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "admin/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
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
                                                "admin/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
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
                                                    "admin/edicao_professor",
                                                    {
                                                      usuario,
                                                      error,
                                                      foto: foto_admin,
                                                      matricula:
                                                        admin_matricula,
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
                                                          "admin/edicao_professor",
                                                          {
                                                            usuario,
                                                            error,
                                                            foto: foto_admin,
                                                            matricula:
                                                              admin_matricula,
                                                            professor:
                                                              professor1,
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
                                                                "admin/edicao_professor",
                                                                {
                                                                  usuario,
                                                                  error,
                                                                  foto: foto_admin,
                                                                  matricula:
                                                                    admin_matricula,
                                                                  professor:
                                                                    professor1,
                                                                }
                                                              );
                                                            } else {
                                                              bd.update_professor(
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
                                                              ).then(
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
                                                                      "/admin/professor"
                                                                    );
                                                                  } else {
                                                                    req.flash(
                                                                      "sucess_msg",
                                                                      "Alteração do professor feita com sucesso"
                                                                    );
                                                                    res.redirect(
                                                                      "/admin/professor"
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
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else if (
                            req.body.senha.length <= 7 ||
                            req.body.senha2.length <= 7
                          ) {
                            error = "A senha deve ter no mínimo 8 caracteres";
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_senha(req.body.senha).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_professor", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  professor: professor1,
                                });
                              } else {
                                bd1.select_senha(req.body.senha).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("admin/edicao_professor", {
                                      usuario,
                                      error,
                                      foto: foto_admin,
                                      matricula: admin_matricula,
                                      professor: professor1,
                                    });
                                  } else {
                                    bd2
                                      .select_senha(req.body.senha)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render("admin/edicao_professor", {
                                            usuario,
                                            error,
                                            foto: foto_admin,
                                            matricula: admin_matricula,
                                            professor: professor1,
                                          });
                                        } else {
                                          bd.update_professor({
                                            matricula: req.body.matricula,
                                            usuario: req.body.usuario,
                                            email: req.body.email,
                                            celular: req.body.celular,
                                            residencial: req.body.residencial,
                                            senha: req.body.senha,
                                            matricula1: professor1.matricula,
                                          }).then((professor) => {
                                            if (professor === "error") {
                                              req.flash(
                                                "error_msg",
                                                "Error no sistema tente novamente mais tarde"
                                              );
                                              res.redirect("/admin/professor");
                                            } else {
                                              req.flash(
                                                "sucess_msg",
                                                "Alteração do professor feita com sucesso"
                                              );
                                              res.redirect("/admin/professor");
                                            }
                                          });
                                        }
                                      });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
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
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("admin/edicao_professor", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                professor: professor1,
                              });
                            } else if (
                              req.body.senha.length <= 7 ||
                              req.body.senha2.length <= 7
                            ) {
                              error = "A senha deve ter no mínimo 8 caracteres";
                              res.render("admin/edicao_professor", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                professor: professor1,
                              });
                            } else {
                              bd.select_senha(req.body.senha).then((msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_professor", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    professor: professor1,
                                  });
                                } else {
                                  bd1
                                    .select_senha(req.body.senha)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_professor", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          professor: professor1,
                                        });
                                      } else {
                                        bd2
                                          .select_senha(req.body.senha)
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "admin/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
                                                  professor: professor1,
                                                }
                                              );
                                            } else {
                                              bd.update_professor({
                                                matricula: req.body.matricula,
                                                usuario: req.body.usuario,
                                                email: req.body.email,
                                                celular: req.body.celular,
                                                residencial:
                                                  req.body.residencial,
                                                senha: req.body.senha,
                                                matricula1:
                                                  professor1.matricula,
                                              }).then((professor) => {
                                                if (professor === "error") {
                                                  req.flash(
                                                    "error_msg",
                                                    "Error no sistema tente novamente mais tarde"
                                                  );
                                                  res.redirect(
                                                    "/admin/professor"
                                                  );
                                                } else {
                                                  req.flash(
                                                    "sucess_msg",
                                                    "Alteração do professor feita com sucesso"
                                                  );
                                                  res.redirect(
                                                    "/admin/professor"
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
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("admin/edicao_professor", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                professor: professor1,
                              });
                            } else if (
                              req.body.senha.length <= 7 ||
                              req.body.senha2.length <= 7
                            ) {
                              error = "A senha deve ter no mínimo 8 caracteres";
                              res.render("admin/edicao_professor", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                professor: professor1,
                              });
                            } else {
                              bd.select_senha(req.body.senha).then((msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_professor", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    professor: professor1,
                                  });
                                } else {
                                  bd1
                                    .select_senha(req.body.senha)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_professor", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          professor: professor1,
                                        });
                                      } else {
                                        bd2
                                          .select_senha(req.body.senha)
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "admin/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
                                                  professor: professor1,
                                                }
                                              );
                                            } else {
                                              bd.update_professor({
                                                matricula: req.body.matricula,
                                                usuario: req.body.usuario,
                                                email: req.body.email,
                                                celular: req.body.celular,
                                                residencial:
                                                  req.body.residencial,
                                                senha: req.body.senha,
                                                matricula1:
                                                  professor1.matricula,
                                              }).then((professor) => {
                                                if (professor === "error") {
                                                  req.flash(
                                                    "error_msg",
                                                    "Error no sistema tente novamente mais tarde"
                                                  );
                                                  res.redirect(
                                                    "/admin/professor"
                                                  );
                                                } else {
                                                  req.flash(
                                                    "sucess_msg",
                                                    "Alteração do professor feita com sucesso"
                                                  );
                                                  res.redirect(
                                                    "/admin/professor"
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
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_professor", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    professor: professor1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_professor", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          professor: professor1,
                                        });
                                      } else {
                                        bd2
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "admin/edicao_professor",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
                                                  professor: professor1,
                                                }
                                              );
                                            } else {
                                              bd.update_professor({
                                                matricula: req.body.matricula,
                                                usuario: req.body.usuario,
                                                email: req.body.email,
                                                celular: req.body.celular,
                                                residencial:
                                                  req.body.residencial,
                                                senha: professor1.senha,
                                                matricula1:
                                                  professor1.matricula,
                                              }).then((professor) => {
                                                if (professor === "error") {
                                                  req.flash(
                                                    "error_msg",
                                                    "Error no sistema tente novamente mais tarde"
                                                  );
                                                  res.redirect(
                                                    "/admin/professor"
                                                  );
                                                } else {
                                                  req.flash(
                                                    "sucess_msg",
                                                    "Alteração do professor feita com sucesso"
                                                  );
                                                  res.redirect(
                                                    "/admin/professor"
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
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("admin/edicao_professor", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                professor: professor1,
                              });
                            } else {
                              bd.update_professor({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: professor1.senha,
                                matricula1: professor1.matricula,
                              }).then((professor) => {
                                if (professor === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/admin/professor");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do professor feita com sucesso"
                                  );
                                  res.redirect("/admin/professor");
                                }
                              });
                            }
                          });
                      }
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
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.update_professor({
                              matricula: req.body.matricula,
                              usuario: req.body.usuario,
                              email: req.body.email,
                              celular: req.body.celular,
                              residencial: req.body.residencial,
                              senha: professor1.senha,
                              matricula1: professor1.matricula,
                            }).then((professor) => {
                              if (professor === "error") {
                                req.flash(
                                  "error_msg",
                                  "Error no sistema tente novamente mais tarde"
                                );
                                res.redirect("/admin/professor");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do professor feita com sucesso"
                                );
                                res.redirect("/admin/professor");
                              }
                            });
                          }
                        });
                      }
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
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("admin/edicao_professor", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                professor: professor1,
                              });
                            } else {
                              bd.update_professor({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: professor1.senha,
                                matricula1: professor1.matricula,
                              }).then((professor) => {
                                if (professor === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/admin/professor");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do professor feita com sucesso"
                                  );
                                  res.redirect("/admin/professor");
                                }
                              });
                            }
                          });
                      }
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
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.update_professor({
                              matricula: req.body.matricula,
                              usuario: req.body.usuario,
                              email: req.body.email,
                              celular: req.body.celular,
                              residencial: req.body.residencial,
                              senha: req.body.senha,
                              matricula1: professor1.matricula,
                            }).then((professor) => {
                              if (professor === "error") {
                                req.flash(
                                  "error_msg",
                                  "Error no sistema tente novamente mais tarde"
                                );
                                res.redirect("/admin/professor");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do professor feita com sucesso"
                                );
                                res.redirect("/admin/professor");
                              }
                            });
                          }
                        });
                      }
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
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.update_professor({
                  matricula: req.body.matricula,
                  usuario: req.body.usuario,
                  email: req.body.email,
                  celular: req.body.celular,
                  residencial: req.body.residencial,
                  senha: professor1.senha,
                  matricula1: professor1.matricula,
                }).then((professor) => {
                  if (professor === "error") {
                    req.flash(
                      "error_msg",
                      "Error no sistema tente novamente mais tarde"
                    );
                    res.redirect("/admin/professor");
                  } else {
                    req.flash(
                      "sucess_msg",
                      "Alteração do professor feita com sucesso"
                    );
                    res.redirect("/admin/professor");
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
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.update_professor({
                              matricula: req.body.matricula,
                              usuario: req.body.usuario,
                              email: req.body.email,
                              celular: req.body.celular,
                              residencial: req.body.residencial,
                              senha: req.body.senha,
                              matricula1: professor1.matricula,
                            }).then((professor) => {
                              if (professor === "error") {
                                req.flash(
                                  "error_msg",
                                  "Error no sistema tente novamente mais tarde"
                                );
                                res.redirect("/admin/professor");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do professor feita com sucesso"
                                );
                                res.redirect("/admin/professor");
                              }
                            });
                          }
                        });
                      }
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
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.update_professor({
                  matricula: req.body.matricula,
                  usuario: req.body.usuario,
                  email: req.body.email,
                  celular: req.body.celular,
                  residencial: req.body.residencial,
                  senha: professor1.senha,
                  matricula1: professor1.matricula,
                }).then((professor) => {
                  if (professor === "error") {
                    req.flash(
                      "error_msg",
                      "Error no sistema tente novamente mais tarde"
                    );
                    res.redirect("/admin/professor");
                  } else {
                    req.flash(
                      "sucess_msg",
                      "Alteração do professor feita com sucesso"
                    );
                    res.redirect("/admin/professor");
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
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_residencial(req.body.residencial).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_residencial(req.body.residencial).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_professor", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      professor: professor1,
                    });
                  } else {
                    bd1.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_professor", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          professor: professor1,
                        });
                      } else {
                        bd2.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_professor", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              professor: professor1,
                            });
                          } else {
                            bd.update_professor({
                              matricula: req.body.matricula,
                              usuario: req.body.usuario,
                              email: req.body.email,
                              celular: req.body.celular,
                              residencial: req.body.residencial,
                              senha: req.body.senha,
                              matricula1: professor1.matricula,
                            }).then((professor) => {
                              if (professor === "error") {
                                req.flash(
                                  "error_msg",
                                  "Error no sistema tente novamente mais tarde"
                                );
                                res.redirect("/admin/professor");
                              } else {
                                req.flash(
                                  "sucess_msg",
                                  "Alteração do professor feita com sucesso"
                                );
                                res.redirect("/admin/professor");
                              }
                            });
                          }
                        });
                      }
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
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_residencial(req.body.residencial).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_residencial(req.body.residencial).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.update_professor({
                  matricula: req.body.matricula,
                  usuario: req.body.usuario,
                  email: req.body.email,
                  celular: req.body.celular,
                  residencial: req.body.residencial,
                  senha: professor1.senha,
                  matricula1: professor1.matricula,
                }).then((professor) => {
                  if (professor === "error") {
                    req.flash(
                      "error_msg",
                      "Error no sistema tente novamente mais tarde"
                    );
                    res.redirect("/admin/professor");
                  } else {
                    req.flash(
                      "sucess_msg",
                      "Alteração do professor feita com sucesso"
                    );
                    res.redirect("/admin/professor");
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
        res.render("admin/edicao_professor", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          professor: professor1,
        });
      } else {
        bd1.select_senha(req.body.senha).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_professor", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              professor: professor1,
            });
          } else {
            bd2.select_senha(req.body.senha).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("admin/edicao_professor", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  professor: professor1,
                });
              } else {
                bd.update_professor({
                  matricula: req.body.matricula,
                  usuario: req.body.usuario,
                  email: req.body.email,
                  celular: req.body.celular,
                  residencial: req.body.residencial,
                  senha: req.body.senha,
                  matricula1: professor1.matricula,
                }).then((professor) => {
                  if (professor === "error") {
                    req.flash(
                      "error_msg",
                      "Error no sistema tente novamente mais tarde"
                    );
                    res.redirect("/admin/professor");
                  } else {
                    req.flash(
                      "sucess_msg",
                      "Alteração do professor feita com sucesso"
                    );
                    res.redirect("/admin/professor");
                  }
                });
              }
            });
          }
        });
      }
    });
  } else {
    bd.update_professor({
      matricula: req.body.matricula,
      usuario: req.body.usuario,
      email: req.body.email,
      celular: req.body.celular,
      residencial: req.body.residencial,
      senha: professor1.senha,
      matricula1: professor1.matricula,
    }).then((professor) => {
      if (professor === "error") {
        req.flash("error_msg", "Error no sistema tente novamente mais tarde");
        res.redirect("/admin/professor");
      } else {
        req.flash("sucess_msg", "Alteração do professor feita com sucesso");
        res.redirect("/admin/professor");
      }
    });
  }
});

/*alteracao de dados do funcionario*/
router.get("/funcionario/alteracao/:matricula", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }
  } catch (error) {
    var admin_matricula = null;
  }

  bd1.select_admin(admin_matricula).then((admin) => {
    if (admin === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_admin = admin[0].foto_perfil;
    } else if (admin === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_admin = admin[0].foto_perfil;
    } else {
      usuario = admin[0].usuario;
      foto_admin = admin[0].foto_perfil;
    }
  });
  bd1.select_funcionario1(req.params.matricula).then((funcionario) => {
    if (funcionario === "vazio") {
      req.flash("error_msg", "funcionário não encontrado");
      res.redirect("/admin/funcionario");
    } else if (funcionario === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/admin/funcionario");
    } else {
      funcionario = funcionario[0];
      funcionario1 = funcionario;
      res.render("admin/edicao_funcionario", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
        funcionario,
      });
    }
  });
});

router.post("/funcionario/alteracao/foto", eAdmin, (req, res) => {
  admin_perfil(req, res, () => {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_admin !== "undefined") {
      fs.unlink("./public/upload/admin/" + foto_admin, () => {});
    }

    bd1
      .update_foto_admin({
        foto_perfil: req.file.filename,
        matricula: admin_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do admin");
        } else {
          res.redirect(
            "/admin/funcionario/alteracao/" + funcionario1.matricula
          );
        }
      });
  });
});

router.post("/funcionario/alteracao", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin != 1) {
      usuario = "[Você não devia estar aqui!!!]";
    } else if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
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
    res.render("admin/edicao_funcionario", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      funcionario: funcionario1,
    });
  } else if (
    !req.body.usuario ||
    typeof req.body.usuario === undefined ||
    req.body.usuario === null
  ) {
    error = "Usuário invalido";
    res.render("admin/edicao_funcionario", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      funcionario: funcionario1,
    });
  } else if (
    !req.body.email ||
    typeof req.body.email === undefined ||
    req.body.email === null
  ) {
    error = "Email invalido";
    res.render("admin/edicao_funcionario", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      funcionario: funcionario1,
    });
  } else if (
    !req.body.celular ||
    typeof req.body.celular === undefined ||
    req.body.celular === null
  ) {
    error = "Telefone celular invalido";
    res.render("admin/edicao_funcionario", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      funcionario: funcionario1,
    });
  } else if (req.body.celular.length < 15) {
    error = "Número de celular invalido";
    res.render("admin/edicao_funcionario", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      funcionario: funcionario1,
    });
  } else if (req.body.residencial && req.body.residencial.length < 14) {
    error = "Número residencial invalido";
    res.render("admin/edicao_funcionario", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      funcionario: funcionario1,
    });
  } else if (req.body.senha !== req.body.senha2) {
    error = "Senhas diferentes";
    res.render("admin/edicao_funcionario", {
      usuario,
      error,
      foto: foto_admin,
      matricula: admin_matricula,
      funcionario: funcionario1,
    });
  } else if (
    req.body.matricula != funcionario1.matricula &&
    req.body.email != funcionario1.email &&
    req.body.celular != funcionario1.telefone_celular &&
    req.body.residencial != funcionario1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_funcionario", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  funcionario: funcionario1,
                                });
                              } else {
                                bd1
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render("admin/edicao_funcionario", {
                                        usuario,
                                        error,
                                        foto: foto_admin,
                                        matricula: admin_matricula,
                                        funcionario: funcionario1,
                                      });
                                    } else {
                                      bd2
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render(
                                              "admin/edicao_funcionario",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                matricula: admin_matricula,
                                                funcionario: funcionario1,
                                              }
                                            );
                                          } else {
                                            bd.select_residencial(
                                              req.body.residencial
                                            ).then((msg) => {
                                              if (msg) {
                                                error = msg;
                                                res.render(
                                                  "admin/edicao_funcionario",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_admin,
                                                    matricula: admin_matricula,
                                                    funcionario: funcionario1,
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
                                                        "admin/edicao_funcionario",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_admin,
                                                          matricula:
                                                            admin_matricula,
                                                          funcionario:
                                                            funcionario1,
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
                                                              "admin/edicao_funcionario",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_admin,
                                                                matricula:
                                                                  admin_matricula,
                                                                funcionario:
                                                                  funcionario1,
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
                                                              "admin/edicao_funcionario",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_admin,
                                                                matricula:
                                                                  admin_matricula,
                                                                funcionario:
                                                                  funcionario1,
                                                              }
                                                            );
                                                          } else {
                                                            bd.select_senha(
                                                              req.body.senha
                                                            ).then((msg) => {
                                                              if (msg) {
                                                                error = msg;
                                                                res.render(
                                                                  "admin/edicao_funcionario",
                                                                  {
                                                                    usuario,
                                                                    error,
                                                                    foto: foto_admin,
                                                                    matricula:
                                                                      admin_matricula,
                                                                    funcionario:
                                                                      funcionario1,
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
                                                                          "admin/edicao_funcionario",
                                                                          {
                                                                            usuario,
                                                                            error,
                                                                            foto: foto_admin,
                                                                            matricula:
                                                                              admin_matricula,
                                                                            funcionario:
                                                                              funcionario1,
                                                                          }
                                                                        );
                                                                      } else {
                                                                        bd2
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
                                                                                  "admin/edicao_funcionario",
                                                                                  {
                                                                                    usuario,
                                                                                    error,
                                                                                    foto: foto_admin,
                                                                                    matricula:
                                                                                      admin_matricula,
                                                                                    funcionario:
                                                                                      funcionario1,
                                                                                  }
                                                                                );
                                                                              } else {
                                                                                bd1
                                                                                  .update_funcionario(
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
                                                                                        funcionario1.matricula,
                                                                                    }
                                                                                  )
                                                                                  .then(
                                                                                    (
                                                                                      funcionario
                                                                                    ) => {
                                                                                      if (
                                                                                        funcionario ===
                                                                                        "error"
                                                                                      ) {
                                                                                        req.flash(
                                                                                          "error_msg",
                                                                                          "Error no sistema tente novamente mais tarde"
                                                                                        );
                                                                                        res.redirect(
                                                                                          "/admin/funcionario"
                                                                                        );
                                                                                      } else {
                                                                                        req.flash(
                                                                                          "sucess_msg",
                                                                                          "Alteração do funcionário feita com sucesso"
                                                                                        );
                                                                                        res.redirect(
                                                                                          "/admin/funcionario"
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
    req.body.matricula != funcionario1.matricula &&
    req.body.celular != funcionario1.telefone_celular &&
    req.body.residencial != funcionario1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_funcionario", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    funcionario: funcionario1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_funcionario", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          funcionario: funcionario1,
                                        });
                                      } else {
                                        bd2
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "admin/edicao_funcionario",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
                                                  funcionario: funcionario1,
                                                }
                                              );
                                            } else if (
                                              req.body.senha.length <= 7 ||
                                              req.body.senha2.length <= 7
                                            ) {
                                              error =
                                                "A senha deve ter no mínimo 8 caracteres";
                                              res.render(
                                                "admin/edicao_funcionario",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
                                                  funcionario: funcionario1,
                                                }
                                              );
                                            } else {
                                              bd.select_senha(
                                                req.body.senha
                                              ).then((msg) => {
                                                if (msg) {
                                                  error = msg;
                                                  res.render(
                                                    "admin/edicao_funcionario",
                                                    {
                                                      usuario,
                                                      error,
                                                      foto: foto_admin,
                                                      matricula:
                                                        admin_matricula,
                                                      funcionario: funcionario1,
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
                                                          "admin/edicao_funcionario",
                                                          {
                                                            usuario,
                                                            error,
                                                            foto: foto_admin,
                                                            matricula:
                                                              admin_matricula,
                                                            funcionario:
                                                              funcionario1,
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
                                                                "admin/edicao_funcionario",
                                                                {
                                                                  usuario,
                                                                  error,
                                                                  foto: foto_admin,
                                                                  matricula:
                                                                    admin_matricula,
                                                                  funcionario:
                                                                    funcionario1,
                                                                }
                                                              );
                                                            } else {
                                                              bd1
                                                                .update_funcionario(
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
                                                                      funcionario1.matricula,
                                                                  }
                                                                )
                                                                .then(
                                                                  (
                                                                    funcionario
                                                                  ) => {
                                                                    if (
                                                                      funcionario ===
                                                                      "error"
                                                                    ) {
                                                                      req.flash(
                                                                        "error_msg",
                                                                        "Error no sistema tente novamente mais tarde"
                                                                      );
                                                                      res.redirect(
                                                                        "/admin/funcionario"
                                                                      );
                                                                    } else {
                                                                      req.flash(
                                                                        "sucess_msg",
                                                                        "Alteração do funcionário feita com sucesso"
                                                                      );
                                                                      res.redirect(
                                                                        "/admin/funcionario"
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
    req.body.matricula != funcionario1.matricula &&
    req.body.email != funcionario1.email &&
    req.body.celular != funcionario1.telefone_celular &&
    req.body.residencial != funcionario1.telefone_residencial
  ) {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_funcionario", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  funcionario: funcionario1,
                                });
                              } else {
                                bd1
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render("admin/edicao_funcionario", {
                                        usuario,
                                        error,
                                        foto: foto_admin,
                                        matricula: admin_matricula,
                                        funcionario: funcionario1,
                                      });
                                    } else {
                                      bd2
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render(
                                              "admin/edicao_funcionario",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                matricula: admin_matricula,
                                                funcionario: funcionario1,
                                              }
                                            );
                                          } else {
                                            bd.select_residencial(
                                              req.body.residencial
                                            ).then((msg) => {
                                              if (msg) {
                                                error = msg;
                                                res.render(
                                                  "admin/edicao_funcionario",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_admin,
                                                    matricula: admin_matricula,
                                                    funcionario: funcionario1,
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
                                                        "admin/edicao_funcionario",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_admin,
                                                          matricula:
                                                            admin_matricula,
                                                          funcionario:
                                                            funcionario1,
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
                                                              "admin/edicao_funcionario",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_admin,
                                                                matricula:
                                                                  admin_matricula,
                                                                funcionario:
                                                                  funcionario1,
                                                              }
                                                            );
                                                          } else {
                                                            bd1
                                                              .update_funcionario(
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
                                                                    funcionario1.senha,
                                                                  matricula1:
                                                                    funcionario1.matricula,
                                                                }
                                                              )
                                                              .then(
                                                                (
                                                                  funcionario
                                                                ) => {
                                                                  if (
                                                                    funcionario ===
                                                                    "error"
                                                                  ) {
                                                                    req.flash(
                                                                      "error_msg",
                                                                      "Error no sistema tente novamente mais tarde"
                                                                    );
                                                                    res.redirect(
                                                                      "/admin/funcionario"
                                                                    );
                                                                  } else {
                                                                    req.flash(
                                                                      "sucess_msg",
                                                                      "Alteração do funcionário feita com sucesso"
                                                                    );
                                                                    res.redirect(
                                                                      "/admin/funcionario"
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
    req.body.matricula != funcionario1.matricula &&
    req.body.email != funcionario1.email &&
    req.body.celular != funcionario1.telefone_celular &&
    req.body.senha != ""
  ) {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else {
                            bd.select_celular(req.body.celular).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_funcionario", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  funcionario: funcionario1,
                                });
                              } else {
                                bd1
                                  .select_celular(req.body.celular)
                                  .then((msg) => {
                                    if (msg) {
                                      error = msg;
                                      res.render("admin/edicao_funcionario", {
                                        usuario,
                                        error,
                                        foto: foto_admin,
                                        matricula: admin_matricula,
                                        funcionario: funcionario1,
                                      });
                                    } else {
                                      bd2
                                        .select_celular(req.body.celular)
                                        .then((msg) => {
                                          if (msg) {
                                            error = msg;
                                            res.render(
                                              "admin/edicao_funcionario",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                matricula: admin_matricula,
                                                funcionario: funcionario1,
                                              }
                                            );
                                          } else if (
                                            req.body.senha.length <= 7 ||
                                            req.body.senha2.length <= 7
                                          ) {
                                            error =
                                              "A senha deve ter no mínimo 8 caracteres";
                                            res.render(
                                              "admin/edicao_funcionario",
                                              {
                                                usuario,
                                                error,
                                                foto: foto_admin,
                                                matricula: admin_matricula,
                                                funcionario: funcionario1,
                                              }
                                            );
                                          } else {
                                            bd.select_senha(
                                              req.body.senha
                                            ).then((msg) => {
                                              if (msg) {
                                                error = msg;
                                                res.render(
                                                  "admin/edicao_funcionario",
                                                  {
                                                    usuario,
                                                    error,
                                                    foto: foto_admin,
                                                    matricula: admin_matricula,
                                                    funcionario: funcionario1,
                                                  }
                                                );
                                              } else {
                                                bd1
                                                  .select_senha(req.body.senha)
                                                  .then((msg) => {
                                                    if (msg) {
                                                      error = msg;
                                                      res.render(
                                                        "admin/edicao_funcionario",
                                                        {
                                                          usuario,
                                                          error,
                                                          foto: foto_admin,
                                                          matricula:
                                                            admin_matricula,
                                                          funcionario:
                                                            funcionario1,
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
                                                              "admin/edicao_funcionario",
                                                              {
                                                                usuario,
                                                                error,
                                                                foto: foto_admin,
                                                                matricula:
                                                                  admin_matricula,
                                                                funcionario:
                                                                  funcionario1,
                                                              }
                                                            );
                                                          } else {
                                                            bd1
                                                              .update_funcionario(
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
                                                                    funcionario1.matricula,
                                                                }
                                                              )
                                                              .then(
                                                                (
                                                                  funcionario
                                                                ) => {
                                                                  if (
                                                                    funcionario ===
                                                                    "error"
                                                                  ) {
                                                                    req.flash(
                                                                      "error_msg",
                                                                      "Error no sistema tente novamente mais tarde"
                                                                    );
                                                                    res.redirect(
                                                                      "/admin/funcionario"
                                                                    );
                                                                  } else {
                                                                    req.flash(
                                                                      "sucess_msg",
                                                                      "Alteração do funcionário feita com sucesso"
                                                                    );
                                                                    res.redirect(
                                                                      "/admin/funcionario"
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
    req.body.matricula != funcionario1.matricula &&
    req.body.email != funcionario1.email &&
    req.body.residencial != funcionario1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_funcionario", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    funcionario: funcionario1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_funcionario", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          funcionario: funcionario1,
                                        });
                                      } else {
                                        bd2
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "admin/edicao_funcionario",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
                                                  funcionario: funcionario1,
                                                }
                                              );
                                            } else if (
                                              req.body.senha.length <= 7 ||
                                              req.body.senha2.length <= 7
                                            ) {
                                              error =
                                                "A senha deve ter no mínimo 8 caracteres";
                                              res.render(
                                                "admin/edicao_funcionario",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
                                                  funcionario: funcionario1,
                                                }
                                              );
                                            } else {
                                              bd.select_senha(
                                                req.body.senha
                                              ).then((msg) => {
                                                if (msg) {
                                                  error = msg;
                                                  res.render(
                                                    "admin/edicao_funcionario",
                                                    {
                                                      usuario,
                                                      error,
                                                      foto: foto_admin,
                                                      matricula:
                                                        admin_matricula,
                                                      funcionario: funcionario1,
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
                                                          "admin/edicao_funcionario",
                                                          {
                                                            usuario,
                                                            error,
                                                            foto: foto_admin,
                                                            matricula:
                                                              admin_matricula,
                                                            funcionario:
                                                              funcionario1,
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
                                                                "admin/edicao_funcionario",
                                                                {
                                                                  usuario,
                                                                  error,
                                                                  foto: foto_admin,
                                                                  matricula:
                                                                    admin_matricula,
                                                                  funcionario:
                                                                    funcionario1,
                                                                }
                                                              );
                                                            } else {
                                                              bd1
                                                                .update_funcionario(
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
                                                                      funcionario1.matricula,
                                                                  }
                                                                )
                                                                .then(
                                                                  (
                                                                    funcionario
                                                                  ) => {
                                                                    if (
                                                                      funcionario ===
                                                                      "error"
                                                                    ) {
                                                                      req.flash(
                                                                        "error_msg",
                                                                        "Error no sistema tente novamente mais tarde"
                                                                      );
                                                                      res.redirect(
                                                                        "/admin/funcionario"
                                                                      );
                                                                    } else {
                                                                      req.flash(
                                                                        "sucess_msg",
                                                                        "Alteração do funcionário feita com sucesso"
                                                                      );
                                                                      res.redirect(
                                                                        "/admin/funcionario"
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
    req.body.matricula != funcionario1.matricula &&
    req.body.celular != funcionario1.telefone_celular &&
    req.body.residencial != funcionario1.telefone_residencial
  ) {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_funcionario", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    funcionario: funcionario1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_funcionario", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          funcionario: funcionario1,
                                        });
                                      } else {
                                        bd2
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "admin/edicao_funcionario",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
                                                  funcionario: funcionario1,
                                                }
                                              );
                                            } else {
                                              bd1
                                                .update_funcionario({
                                                  matricula: req.body.matricula,
                                                  usuario: req.body.usuario,
                                                  email: req.body.email,
                                                  celular: req.body.celular,
                                                  residencial:
                                                    req.body.residencial,
                                                  senha: funcionario1.senha,
                                                  matricula1:
                                                    funcionario1.matricula,
                                                })
                                                .then((funcionario) => {
                                                  if (funcionario === "error") {
                                                    req.flash(
                                                      "error_msg",
                                                      "Error no sistema tente novamente mais tarde"
                                                    );
                                                    res.redirect(
                                                      "/admin/funcionario"
                                                    );
                                                  } else {
                                                    req.flash(
                                                      "sucess_msg",
                                                      "Alteração do funcionário feita com sucesso"
                                                    );
                                                    res.redirect(
                                                      "/admin/funcionario"
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
    req.body.matricula != funcionario1.matricula &&
    req.body.email != funcionario1.email &&
    req.body.residencial != funcionario1.telefone_residencial
  ) {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_funcionario", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    funcionario: funcionario1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_funcionario", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          funcionario: funcionario1,
                                        });
                                      } else {
                                        bd2
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "admin/edicao_funcionario",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
                                                  funcionario: funcionario1,
                                                }
                                              );
                                            } else {
                                              bd1
                                                .update_funcionario({
                                                  matricula: req.body.matricula,
                                                  usuario: req.body.usuario,
                                                  email: req.body.email,
                                                  celular: req.body.celular,
                                                  residencial:
                                                    req.body.residencial,
                                                  senha: funcionario1.senha,
                                                  matricula1:
                                                    funcionario1.matricula,
                                                })
                                                .then((funcionario) => {
                                                  if (funcionario === "error") {
                                                    req.flash(
                                                      "error_msg",
                                                      "Error no sistema tente novamente mais tarde"
                                                    );
                                                    res.redirect(
                                                      "/admin/funcionario"
                                                    );
                                                  } else {
                                                    req.flash(
                                                      "sucess_msg",
                                                      "Alteração do funcionário feita com sucesso"
                                                    );
                                                    res.redirect(
                                                      "/admin/funcionario"
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
    req.body.matricula != funcionario1.matricula &&
    req.body.celular != funcionario1.telefone_celular &&
    req.body.email != funcionario1.telefone_email
  ) {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else {
                            bd.select_email(req.body.email).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_funcionario", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  funcionario: funcionario1,
                                });
                              } else {
                                bd1.select_email(req.body.email).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("admin/edicao_funcionario", {
                                      usuario,
                                      error,
                                      foto: foto_admin,
                                      matricula: admin_matricula,
                                      funcionario: funcionario1,
                                    });
                                  } else {
                                    bd2
                                      .select_email(req.body.email)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render(
                                            "admin/edicao_funcionario",
                                            {
                                              usuario,
                                              error,
                                              foto: foto_admin,
                                              matricula: admin_matricula,
                                              funcionario: funcionario1,
                                            }
                                          );
                                        } else {
                                          bd1
                                            .update_funcionario({
                                              matricula: req.body.matricula,
                                              usuario: req.body.usuario,
                                              email: req.body.email,
                                              celular: req.body.celular,
                                              residencial: req.body.residencial,
                                              senha: funcionario1.senha,
                                              matricula1:
                                                funcionario1.matricula,
                                            })
                                            .then((funcionario) => {
                                              if (funcionario === "error") {
                                                req.flash(
                                                  "error_msg",
                                                  "Error no sistema tente novamente mais tarde"
                                                );
                                                res.redirect(
                                                  "/admin/funcionario"
                                                );
                                              } else {
                                                req.flash(
                                                  "sucess_msg",
                                                  "Alteração do funcionário feita com sucesso"
                                                );
                                                res.redirect(
                                                  "/admin/funcionario"
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
    req.body.matricula != funcionario1.matricula &&
    req.body.email != funcionario1.email &&
    req.body.senha != ""
  ) {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else if (
                            req.body.senha.length <= 7 ||
                            req.body.senha2.length <= 7
                          ) {
                            error = "A senha deve ter no mínimo 8 caracteres";
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else {
                            bd.select_senha(req.body.senha).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_funcionario", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  funcionario: funcionario1,
                                });
                              } else {
                                bd1.select_senha(req.body.senha).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("admin/edicao_funcionario", {
                                      usuario,
                                      error,
                                      foto: foto_admin,
                                      matricula: admin_matricula,
                                      funcionario: funcionario1,
                                    });
                                  } else {
                                    bd2
                                      .select_senha(req.body.senha)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render(
                                            "admin/edicao_funcionario",
                                            {
                                              usuario,
                                              error,
                                              foto: foto_admin,
                                              matricula: admin_matricula,
                                              funcionario: funcionario1,
                                            }
                                          );
                                        } else {
                                          bd1
                                            .update_funcionario({
                                              matricula: req.body.matricula,
                                              usuario: req.body.usuario,
                                              email: req.body.email,
                                              celular: req.body.celular,
                                              residencial: req.body.residencial,
                                              senha: req.body.senha,
                                              matricula1:
                                                funcionario1.matricula,
                                            })
                                            .then((funcionario) => {
                                              if (funcionario === "error") {
                                                req.flash(
                                                  "error_msg",
                                                  "Error no sistema tente novamente mais tarde"
                                                );
                                                res.redirect(
                                                  "/admin/funcionario"
                                                );
                                              } else {
                                                req.flash(
                                                  "sucess_msg",
                                                  "Alteração do funcionário feita com sucesso"
                                                );
                                                res.redirect(
                                                  "/admin/funcionario"
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
    req.body.matricula != funcionario1.matricula &&
    req.body.celular != funcionario1.telefone_celular &&
    req.body.senha != ""
  ) {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else if (
                            req.body.senha.length <= 7 ||
                            req.body.senha2.length <= 7
                          ) {
                            error = "A senha deve ter no mínimo 8 caracteres";
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else {
                            bd.select_senha(req.body.senha).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_funcionario", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  funcionario: funcionario1,
                                });
                              } else {
                                bd1.select_senha(req.body.senha).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("admin/edicao_funcionario", {
                                      usuario,
                                      error,
                                      foto: foto_admin,
                                      matricula: admin_matricula,
                                      funcionario: funcionario1,
                                    });
                                  } else {
                                    bd2
                                      .select_senha(req.body.senha)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render(
                                            "admin/edicao_funcionario",
                                            {
                                              usuario,
                                              error,
                                              foto: foto_admin,
                                              matricula: admin_matricula,
                                              funcionario: funcionario1,
                                            }
                                          );
                                        } else {
                                          bd1
                                            .update_funcionario({
                                              matricula: req.body.matricula,
                                              usuario: req.body.usuario,
                                              email: req.body.email,
                                              celular: req.body.celular,
                                              residencial: req.body.residencial,
                                              senha: req.body.senha,
                                              matricula1:
                                                funcionario1.matricula,
                                            })
                                            .then((funcionario) => {
                                              if (funcionario === "error") {
                                                req.flash(
                                                  "error_msg",
                                                  "Error no sistema tente novamente mais tarde"
                                                );
                                                res.redirect(
                                                  "/admin/funcionario"
                                                );
                                              } else {
                                                req.flash(
                                                  "sucess_msg",
                                                  "Alteração do funcionário feita com sucesso"
                                                );
                                                res.redirect(
                                                  "/admin/funcionario"
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
    req.body.matricula != funcionario1.matricula &&
    req.body.residencial != funcionario1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("admin/edicao_funcionario", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                funcionario: funcionario1,
                              });
                            } else if (
                              req.body.senha.length <= 7 ||
                              req.body.senha2.length <= 7
                            ) {
                              error = "A senha deve ter no mínimo 8 caracteres";
                              res.render("admin/edicao_funcionario", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                funcionario: funcionario1,
                              });
                            } else {
                              bd.select_senha(req.body.senha).then((msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_funcionario", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    funcionario: funcionario1,
                                  });
                                } else {
                                  bd1
                                    .select_senha(req.body.senha)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_funcionario", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          funcionario: funcionario1,
                                        });
                                      } else {
                                        bd2
                                          .select_senha(req.body.senha)
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "admin/edicao_funcionario",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
                                                  funcionario: funcionario1,
                                                }
                                              );
                                            } else {
                                              bd1
                                                .update_funcionario({
                                                  matricula: req.body.matricula,
                                                  usuario: req.body.usuario,
                                                  email: req.body.email,
                                                  celular: req.body.celular,
                                                  residencial:
                                                    req.body.residencial,
                                                  senha: req.body.senha,
                                                  matricula1:
                                                    funcionario1.matricula,
                                                })
                                                .then((funcionario) => {
                                                  if (funcionario === "error") {
                                                    req.flash(
                                                      "error_msg",
                                                      "Error no sistema tente novamente mais tarde"
                                                    );
                                                    res.redirect(
                                                      "/admin/funcionario"
                                                    );
                                                  } else {
                                                    req.flash(
                                                      "sucess_msg",
                                                      "Alteração do funcionário feita com sucesso"
                                                    );
                                                    res.redirect(
                                                      "/admin/funcionario"
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
    req.body.matricula != funcionario1.matricula &&
    req.body.email != funcionario1.email
  ) {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else {
                            bd1
                              .update_funcionario({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: funcionario1.senha,
                                matricula1: funcionario1.matricula,
                              })
                              .then((funcionario) => {
                                if (funcionario === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/admin/funcionario");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do funcionário feita com sucesso"
                                  );
                                  res.redirect("/admin/funcionario");
                                }
                              });
                          }
                        });
                      }
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
    req.body.matricula != funcionario1.matricula &&
    req.body.celular != funcionario1.telefone_celular
  ) {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else {
                            bd1
                              .update_funcionario({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: funcionario1.senha,
                                matricula1: funcionario1.matricula,
                              })
                              .then((funcionario) => {
                                if (funcionario === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/admin/funcionario");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do funcionário feita com sucesso"
                                  );
                                  res.redirect("/admin/funcionario");
                                }
                              });
                          }
                        });
                      }
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
    req.body.matricula != funcionario1.matricula &&
    req.body.residencial != funcionario1.telefone_residencial
  ) {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("admin/edicao_funcionario", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                funcionario: funcionario1,
                              });
                            } else {
                              bd1
                                .update_funcionario({
                                  matricula: req.body.matricula,
                                  usuario: req.body.usuario,
                                  email: req.body.email,
                                  celular: req.body.celular,
                                  residencial: req.body.residencial,
                                  senha: funcionario1.senha,
                                  matricula1: funcionario1.matricula,
                                })
                                .then((funcionario) => {
                                  if (funcionario === "error") {
                                    req.flash(
                                      "error_msg",
                                      "Error no sistema tente novamente mais tarde"
                                    );
                                    res.redirect("/admin/funcionario");
                                  } else {
                                    req.flash(
                                      "sucess_msg",
                                      "Alteração do funcionário feita com sucesso"
                                    );
                                    res.redirect("/admin/funcionario");
                                  }
                                });
                            }
                          });
                      }
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
    req.body.matricula != funcionario1.matricula &&
    req.body.senha != ""
  ) {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else {
                            bd1
                              .update_funcionario({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: req.body.senha,
                                matricula1: funcionario1.matricula,
                              })
                              .then((funcionario) => {
                                if (funcionario === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/admin/funcionario");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do funcionário feita com sucesso"
                                  );
                                  res.redirect("/admin/funcionario");
                                }
                              });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (req.body.matricula != funcionario1.matricula) {
    bd.select_professor(req.body.matricula).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_funcionario(req.body.matricula).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_aluno(req.body.matricula).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd1
                  .update_funcionario({
                    matricula: req.body.matricula,
                    usuario: req.body.usuario,
                    email: req.body.email,
                    celular: req.body.celular,
                    residencial: req.body.residencial,
                    senha: funcionario1.senha,
                    matricula1: funcionario1.matricula,
                  })
                  .then((funcionario) => {
                    if (funcionario === "error") {
                      req.flash(
                        "error_msg",
                        "Error no sistema tente novamente mais tarde"
                      );
                      res.redirect("/admin/funcionario");
                    } else {
                      req.flash(
                        "sucess_msg",
                        "Alteração do funcionário feita com sucesso"
                      );
                      res.redirect("/admin/funcionario");
                    }
                  });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.email != funcionario1.email &&
    req.body.celular != funcionario1.telefone_celular &&
    req.body.residencial != funcionario1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_email(req.body.email).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_funcionario", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    funcionario: funcionario1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_funcionario", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          funcionario: funcionario1,
                                        });
                                      } else {
                                        bd2
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "admin/edicao_funcionario",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
                                                  funcionario: funcionario1,
                                                }
                                              );
                                            } else if (
                                              req.body.senha.length <= 7 ||
                                              req.body.senha2.length <= 7
                                            ) {
                                              error =
                                                "A senha deve ter no mínimo 8 caracteres";
                                              res.render(
                                                "admin/edicao_funcionario",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
                                                  funcionario: funcionario1,
                                                }
                                              );
                                            } else {
                                              bd.select_senha(
                                                req.body.senha
                                              ).then((msg) => {
                                                if (msg) {
                                                  error = msg;
                                                  res.render(
                                                    "admin/edicao_funcionario",
                                                    {
                                                      usuario,
                                                      error,
                                                      foto: foto_admin,
                                                      matricula:
                                                        admin_matricula,
                                                      funcionario: funcionario1,
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
                                                          "admin/edicao_funcionario",
                                                          {
                                                            usuario,
                                                            error,
                                                            foto: foto_admin,
                                                            matricula:
                                                              admin_matricula,
                                                            funcionario:
                                                              funcionario1,
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
                                                                "admin/edicao_funcionario",
                                                                {
                                                                  usuario,
                                                                  error,
                                                                  foto: foto_admin,
                                                                  matricula:
                                                                    admin_matricula,
                                                                  funcionario:
                                                                    funcionario1,
                                                                }
                                                              );
                                                            } else {
                                                              bd1
                                                                .update_funcionario(
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
                                                                      funcionario1.matricula,
                                                                  }
                                                                )
                                                                .then(
                                                                  (
                                                                    funcionario
                                                                  ) => {
                                                                    if (
                                                                      funcionario ===
                                                                      "error"
                                                                    ) {
                                                                      req.flash(
                                                                        "error_msg",
                                                                        "Error no sistema tente novamente mais tarde"
                                                                      );
                                                                      res.redirect(
                                                                        "/admin/funcionario"
                                                                      );
                                                                    } else {
                                                                      req.flash(
                                                                        "sucess_msg",
                                                                        "Alteração do funcionário feita com sucesso"
                                                                      );
                                                                      res.redirect(
                                                                        "/admin/funcionario"
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
    req.body.celular != funcionario1.telefone_celular &&
    req.body.email != funcionario1.email &&
    req.body.senha != ""
  ) {
    bd.select_celular(req.body.celular).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else if (
                            req.body.senha.length <= 7 ||
                            req.body.senha2.length <= 7
                          ) {
                            error = "A senha deve ter no mínimo 8 caracteres";
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else {
                            bd.select_senha(req.body.senha).then((msg) => {
                              if (msg) {
                                error = msg;
                                res.render("admin/edicao_funcionario", {
                                  usuario,
                                  error,
                                  foto: foto_admin,
                                  matricula: admin_matricula,
                                  funcionario: funcionario1,
                                });
                              } else {
                                bd1.select_senha(req.body.senha).then((msg) => {
                                  if (msg) {
                                    error = msg;
                                    res.render("admin/edicao_funcionario", {
                                      usuario,
                                      error,
                                      foto: foto_admin,
                                      matricula: admin_matricula,
                                      funcionario: funcionario1,
                                    });
                                  } else {
                                    bd2
                                      .select_senha(req.body.senha)
                                      .then((msg) => {
                                        if (msg) {
                                          error = msg;
                                          res.render(
                                            "admin/edicao_funcionario",
                                            {
                                              usuario,
                                              error,
                                              foto: foto_admin,
                                              matricula: admin_matricula,
                                              funcionario: funcionario1,
                                            }
                                          );
                                        } else {
                                          bd1
                                            .update_funcionario({
                                              matricula: req.body.matricula,
                                              usuario: req.body.usuario,
                                              email: req.body.email,
                                              celular: req.body.celular,
                                              residencial: req.body.residencial,
                                              senha: req.body.senha,
                                              matricula1:
                                                funcionario1.matricula,
                                            })
                                            .then((funcionario) => {
                                              if (funcionario === "error") {
                                                req.flash(
                                                  "error_msg",
                                                  "Error no sistema tente novamente mais tarde"
                                                );
                                                res.redirect(
                                                  "/admin/funcionario"
                                                );
                                              } else {
                                                req.flash(
                                                  "sucess_msg",
                                                  "Alteração do funcionário feita com sucesso"
                                                );
                                                res.redirect(
                                                  "/admin/funcionario"
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
    req.body.email != funcionario1.email &&
    req.body.residencial != funcionario1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_email(req.body.email).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("admin/edicao_funcionario", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                funcionario: funcionario1,
                              });
                            } else if (
                              req.body.senha.length <= 7 ||
                              req.body.senha2.length <= 7
                            ) {
                              error = "A senha deve ter no mínimo 8 caracteres";
                              res.render("admin/edicao_funcionario", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                funcionario: funcionario1,
                              });
                            } else {
                              bd.select_senha(req.body.senha).then((msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_funcionario", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    funcionario: funcionario1,
                                  });
                                } else {
                                  bd1
                                    .select_senha(req.body.senha)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_funcionario", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          funcionario: funcionario1,
                                        });
                                      } else {
                                        bd2
                                          .select_senha(req.body.senha)
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "admin/edicao_funcionario",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
                                                  funcionario: funcionario1,
                                                }
                                              );
                                            } else {
                                              bd1
                                                .update_funcionario({
                                                  matricula: req.body.matricula,
                                                  usuario: req.body.usuario,
                                                  email: req.body.email,
                                                  celular: req.body.celular,
                                                  residencial:
                                                    req.body.residencial,
                                                  senha: req.body.senha,
                                                  matricula1:
                                                    funcionario1.matricula,
                                                })
                                                .then((funcionario) => {
                                                  if (funcionario === "error") {
                                                    req.flash(
                                                      "error_msg",
                                                      "Error no sistema tente novamente mais tarde"
                                                    );
                                                    res.redirect(
                                                      "/admin/funcionario"
                                                    );
                                                  } else {
                                                    req.flash(
                                                      "sucess_msg",
                                                      "Alteração do funcionário feita com sucesso"
                                                    );
                                                    res.redirect(
                                                      "/admin/funcionario"
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
    req.body.celular != funcionario1.telefone_celular &&
    req.body.residencial != funcionario1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_celular(req.body.celular).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("admin/edicao_funcionario", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                funcionario: funcionario1,
                              });
                            } else if (
                              req.body.senha.length <= 7 ||
                              req.body.senha2.length <= 7
                            ) {
                              error = "A senha deve ter no mínimo 8 caracteres";
                              res.render("admin/edicao_funcionario", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                funcionario: funcionario1,
                              });
                            } else {
                              bd.select_senha(req.body.senha).then((msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_funcionario", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    funcionario: funcionario1,
                                  });
                                } else {
                                  bd1
                                    .select_senha(req.body.senha)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_funcionario", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          funcionario: funcionario1,
                                        });
                                      } else {
                                        bd2
                                          .select_senha(req.body.senha)
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "admin/edicao_funcionario",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
                                                  funcionario: funcionario1,
                                                }
                                              );
                                            } else {
                                              bd1
                                                .update_funcionario({
                                                  matricula: req.body.matricula,
                                                  usuario: req.body.usuario,
                                                  email: req.body.email,
                                                  celular: req.body.celular,
                                                  residencial:
                                                    req.body.residencial,
                                                  senha: req.body.senha,
                                                  matricula1:
                                                    funcionario1.matricula,
                                                })
                                                .then((funcionario) => {
                                                  if (funcionario === "error") {
                                                    req.flash(
                                                      "error_msg",
                                                      "Error no sistema tente novamente mais tarde"
                                                    );
                                                    res.redirect(
                                                      "/admin/funcionario"
                                                    );
                                                  } else {
                                                    req.flash(
                                                      "sucess_msg",
                                                      "Alteração do funcionário feita com sucesso"
                                                    );
                                                    res.redirect(
                                                      "/admin/funcionario"
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
    req.body.email != funcionario1.email &&
    req.body.celular != funcionario1.telefone_celular &&
    req.body.residencial != funcionario1.telefone_residencial
  ) {
    bd.select_email(req.body.email).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_celular(req.body.celular).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_celular(req.body.celular).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2.select_celular(req.body.celular).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else {
                            bd.select_residencial(req.body.residencial).then(
                              (msg) => {
                                if (msg) {
                                  error = msg;
                                  res.render("admin/edicao_funcionario", {
                                    usuario,
                                    error,
                                    foto: foto_admin,
                                    matricula: admin_matricula,
                                    funcionario: funcionario1,
                                  });
                                } else {
                                  bd1
                                    .select_residencial(req.body.residencial)
                                    .then((msg) => {
                                      if (msg) {
                                        error = msg;
                                        res.render("admin/edicao_funcionario", {
                                          usuario,
                                          error,
                                          foto: foto_admin,
                                          matricula: admin_matricula,
                                          funcionario: funcionario1,
                                        });
                                      } else {
                                        bd2
                                          .select_residencial(
                                            req.body.residencial
                                          )
                                          .then((msg) => {
                                            if (msg) {
                                              error = msg;
                                              res.render(
                                                "admin/edicao_funcionario",
                                                {
                                                  usuario,
                                                  error,
                                                  foto: foto_admin,
                                                  matricula: admin_matricula,
                                                  funcionario: funcionario1,
                                                }
                                              );
                                            } else {
                                              bd1
                                                .update_funcionario({
                                                  matricula: req.body.matricula,
                                                  usuario: req.body.usuario,
                                                  email: req.body.email,
                                                  celular: req.body.celular,
                                                  residencial:
                                                    req.body.residencial,
                                                  senha: funcionario1.senha,
                                                  matricula1:
                                                    funcionario1.matricula,
                                                })
                                                .then((funcionario) => {
                                                  if (funcionario === "error") {
                                                    req.flash(
                                                      "error_msg",
                                                      "Error no sistema tente novamente mais tarde"
                                                    );
                                                    res.redirect(
                                                      "/admin/funcionario"
                                                    );
                                                  } else {
                                                    req.flash(
                                                      "sucess_msg",
                                                      "Alteração do funcionário feita com sucesso"
                                                    );
                                                    res.redirect(
                                                      "/admin/funcionario"
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
    req.body.email != funcionario1.email &&
    req.body.residencial != funcionario1.telefone_residencial
  ) {
    bd.select_email(req.body.email).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("admin/edicao_funcionario", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                funcionario: funcionario1,
                              });
                            } else {
                              bd1
                                .update_funcionario({
                                  matricula: req.body.matricula,
                                  usuario: req.body.usuario,
                                  email: req.body.email,
                                  celular: req.body.celular,
                                  residencial: req.body.residencial,
                                  senha: funcionario1.senha,
                                  matricula1: funcionario1.matricula,
                                })
                                .then((funcionario) => {
                                  if (funcionario === "error") {
                                    req.flash(
                                      "error_msg",
                                      "Error no sistema tente novamente mais tarde"
                                    );
                                    res.redirect("/admin/funcionario");
                                  } else {
                                    req.flash(
                                      "sucess_msg",
                                      "Alteração do funcionário feita com sucesso"
                                    );
                                    res.redirect("/admin/funcionario");
                                  }
                                });
                            }
                          });
                      }
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
    req.body.celular != funcionario1.telefone_celular &&
    req.body.email != funcionario1.email
  ) {
    bd.select_celular(req.body.celular).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_email(req.body.email).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_email(req.body.email).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2.select_email(req.body.email).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else {
                            bd1
                              .update_funcionario({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: funcionario1.senha,
                                matricula1: funcionario1.matricula,
                              })
                              .then((funcionario) => {
                                if (funcionario === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/admin/funcionario");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do funcionário feita com sucesso"
                                  );
                                  res.redirect("/admin/funcionario");
                                }
                              });
                          }
                        });
                      }
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
    req.body.celular != funcionario1.telefone_celular &&
    req.body.residencial != funcionario1.telefone_residencial
  ) {
    bd.select_celular(req.body.celular).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_residencial(req.body.residencial).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_residencial(req.body.residencial).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2
                          .select_residencial(req.body.residencial)
                          .then((msg) => {
                            if (msg) {
                              error = msg;
                              res.render("admin/edicao_funcionario", {
                                usuario,
                                error,
                                foto: foto_admin,
                                matricula: admin_matricula,
                                funcionario: funcionario1,
                              });
                            } else {
                              bd1
                                .update_funcionario({
                                  matricula: req.body.matricula,
                                  usuario: req.body.usuario,
                                  email: req.body.email,
                                  celular: req.body.celular,
                                  residencial: req.body.residencial,
                                  senha: funcionario1.senha,
                                  matricula1: funcionario1.matricula,
                                })
                                .then((funcionario) => {
                                  if (funcionario === "error") {
                                    req.flash(
                                      "error_msg",
                                      "Error no sistema tente novamente mais tarde"
                                    );
                                    res.redirect("/admin/funcionario");
                                  } else {
                                    req.flash(
                                      "sucess_msg",
                                      "Alteração do funcionário feita com sucesso"
                                    );
                                    res.redirect("/admin/funcionario");
                                  }
                                });
                            }
                          });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (req.body.email != funcionario1.email && req.body.senha != "") {
    bd.select_email(req.body.email).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else {
                            bd1
                              .update_funcionario({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: req.body.senha,
                                matricula1: funcionario1.matricula,
                              })
                              .then((funcionario) => {
                                if (funcionario === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/admin/funcionario");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do funcionário feita com sucesso"
                                  );
                                  res.redirect("/admin/funcionario");
                                }
                              });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (req.body.email != funcionario1.email) {
    bd.select_email(req.body.email).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_email(req.body.email).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_email(req.body.email).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd1
                  .update_funcionario({
                    matricula: req.body.matricula,
                    usuario: req.body.usuario,
                    email: req.body.email,
                    celular: req.body.celular,
                    residencial: req.body.residencial,
                    senha: funcionario1.senha,
                    matricula1: funcionario1.matricula,
                  })
                  .then((funcionario) => {
                    if (funcionario === "error") {
                      req.flash(
                        "error_msg",
                        "Error no sistema tente novamente mais tarde"
                      );
                      res.redirect("/admin/funcionario");
                    } else {
                      req.flash(
                        "sucess_msg",
                        "Alteração do funcionario feita com sucesso"
                      );
                      res.redirect("/admin/funcionário");
                    }
                  });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.celular != funcionario1.telefone_celular &&
    req.body.senha != ""
  ) {
    bd.select_celular(req.body.celular).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else {
                            bd1
                              .update_funcionario({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: req.body.senha,
                                matricula1: funcionario1.matricula,
                              })
                              .then((funcionario) => {
                                if (funcionario === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/admin/funcionario");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do funcionário feita com sucesso"
                                  );
                                  res.redirect("/admin/funcionario");
                                }
                              });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (req.body.celular != funcionario1.telefone_celular) {
    bd.select_celular(req.body.celular).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_celular(req.body.celular).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_celular(req.body.celular).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd1
                  .update_funcionario({
                    matricula: req.body.matricula,
                    usuario: req.body.usuario,
                    email: req.body.email,
                    celular: req.body.celular,
                    residencial: req.body.residencial,
                    senha: funcionario1.senha,
                    matricula1: funcionario1.matricula,
                  })
                  .then((funcionario) => {
                    if (funcionario === "error") {
                      req.flash(
                        "error_msg",
                        "Error no sistema tente novamente mais tarde"
                      );
                      res.redirect("/admin/funcionario");
                    } else {
                      req.flash(
                        "sucess_msg",
                        "Alteração do funcionário feita com sucesso"
                      );
                      res.redirect("/admin/funcionario");
                    }
                  });
              }
            });
          }
        });
      }
    });
  } else if (
    req.body.residencial != funcionario1.telefone_residencial &&
    req.body.senha != ""
  ) {
    bd.select_residencial(req.body.residencial).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_residencial(req.body.residencial).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_residencial(req.body.residencial).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd.select_senha(req.body.senha).then((msg) => {
                  if (msg) {
                    error = msg;
                    res.render("admin/edicao_funcionario", {
                      usuario,
                      error,
                      foto: foto_admin,
                      matricula: admin_matricula,
                      funcionario: funcionario1,
                    });
                  } else {
                    bd1.select_senha(req.body.senha).then((msg) => {
                      if (msg) {
                        error = msg;
                        res.render("admin/edicao_funcionario", {
                          usuario,
                          error,
                          foto: foto_admin,
                          matricula: admin_matricula,
                          funcionario: funcionario1,
                        });
                      } else {
                        bd2.select_senha(req.body.senha).then((msg) => {
                          if (msg) {
                            error = msg;
                            res.render("admin/edicao_funcionario", {
                              usuario,
                              error,
                              foto: foto_admin,
                              matricula: admin_matricula,
                              funcionario: funcionario1,
                            });
                          } else {
                            bd1
                              .update_funcionario({
                                matricula: req.body.matricula,
                                usuario: req.body.usuario,
                                email: req.body.email,
                                celular: req.body.celular,
                                residencial: req.body.residencial,
                                senha: req.body.senha,
                                matricula1: funcionario1.matricula,
                              })
                              .then((funcionario) => {
                                if (funcionario === "error") {
                                  req.flash(
                                    "error_msg",
                                    "Error no sistema tente novamente mais tarde"
                                  );
                                  res.redirect("/admin/funcionario");
                                } else {
                                  req.flash(
                                    "sucess_msg",
                                    "Alteração do funcionário feita com sucesso"
                                  );
                                  res.redirect("/admin/funcionario");
                                }
                              });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (req.body.residencial != funcionario1.telefone_residencial) {
    bd.select_residencial(req.body.residencial).then((msg) => {
      if (msg) {
        error = msg;
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_residencial(req.body.residencial).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_residencial(req.body.residencial).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd1
                  .update_funcionario({
                    matricula: req.body.matricula,
                    usuario: req.body.usuario,
                    email: req.body.email,
                    celular: req.body.celular,
                    residencial: req.body.residencial,
                    senha: funcionario1.senha,
                    matricula1: funcionario1.matricula,
                  })
                  .then((funcionario) => {
                    if (funcionario === "error") {
                      req.flash(
                        "error_msg",
                        "Error no sistema tente novamente mais tarde"
                      );
                      res.redirect("/admin/funcionario");
                    } else {
                      req.flash(
                        "sucess_msg",
                        "Alteração do funcionário feita com sucesso"
                      );
                      res.redirect("/admin/funcionario");
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
        res.render("admin/edicao_funcionario", {
          usuario,
          error,
          foto: foto_admin,
          matricula: admin_matricula,
          funcionario: funcionario1,
        });
      } else {
        bd1.select_senha(req.body.senha).then((msg) => {
          if (msg) {
            error = msg;
            res.render("admin/edicao_funcionario", {
              usuario,
              error,
              foto: foto_admin,
              matricula: admin_matricula,
              funcionario: funcionario1,
            });
          } else {
            bd2.select_senha(req.body.senha).then((msg) => {
              if (msg) {
                error = msg;
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else if (
                req.body.senha.length <= 7 ||
                req.body.senha2.length <= 7
              ) {
                error = "A senha deve ter no mínimo 8 caracteres";
                res.render("admin/edicao_funcionario", {
                  usuario,
                  error,
                  foto: foto_admin,
                  matricula: admin_matricula,
                  funcionario: funcionario1,
                });
              } else {
                bd1
                  .update_funcionario({
                    matricula: req.body.matricula,
                    usuario: req.body.usuario,
                    email: req.body.email,
                    celular: req.body.celular,
                    residencial: req.body.residencial,
                    senha: req.body.senha,
                    matricula1: funcionario1.matricula,
                  })
                  .then((funcionario) => {
                    if (funcionario === "error") {
                      req.flash(
                        "error_msg",
                        "Error no sistema tente novamente mais tarde"
                      );
                      res.redirect("/admin/funcionario");
                    } else {
                      req.flash(
                        "sucess_msg",
                        "Alteração do funcionário feita com sucesso"
                      );
                      res.redirect("/admin/funcionario");
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
      .update_funcionario({
        matricula: req.body.matricula,
        usuario: req.body.usuario,
        email: req.body.email,
        celular: req.body.celular,
        residencial: req.body.residencial,
        senha: funcionario1.senha,
        matricula1: funcionario1.matricula,
      })
      .then((funcionario) => {
        if (funcionario === "error") {
          req.flash("error_msg", "Error no sistema tente novamente mais tarde");
          res.redirect("/admin/funcionario");
        } else {
          req.flash("sucess_msg", "Alteração do funcionário feita com sucesso");
          res.redirect("/admin/funcionario");
        }
      });
  }
});

/*alteracao do chamado*/
router.get("/chamado/alteracao/:id", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }
  } catch (error) {
    var admin_matricula = null;
  }

  bd1.select_admin(admin_matricula).then((admin) => {
    if (admin === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_admin = admin[0].foto_perfil;
    } else if (admin === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_admin = admin[0].foto_perfil;
    } else {
      usuario = admin[0].usuario;
      foto_admin = admin[0].foto_perfil;
    }
  });
  bd3.select_chamado1(req.params.id).then((chamado) => {
    if (chamado === "vazio") {
      req.flash("error_msg", "Chamado não encontrado");
      res.redirect("/admin/chamado");
    } else if (chamado === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/admin/chamado");
    } else {
      chamado = chamado[0];
      chamado1 = chamado;
      res.render("admin/edicao_chamado", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
        chamado,
      });
    }
  });
});

router.post("/chamado/alteracao/foto", eAdmin, (req, res) => {
  admin_perfil(req, res, () => {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_admin !== "undefined") {
      fs.unlink("./public/upload/admin/" + foto_admin, () => {});
    }

    bd1
      .update_foto_admin({
        foto_perfil: req.file.filename,
        matricula: admin_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do admin");
        } else {
          res.redirect("/admin/chamado/alteracao/" + chamado1.id);
        }
      });
  });
});

router.post("/chamado/alteracao", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin != 1) {
      usuario = "[Você não devia estar aqui!!!]";
    } else if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
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
          res.render("admin/edicao_chamado", {
            usuario,
            foto: foto_admin,
            matricula: admin_matricula,
            error: err,
          });
        } else if (err) {
          res.setTimeout(480000);
          res.render("admin/edicao_chamado", {
            usuario,
            foto: foto_admin,
            matricula: admin_matricula,
            error: err,
          });
        } else {
          bd3
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
                res.redirect("/admin/chamado");
              } else {
                req.flash(
                  "sucess_msg",
                  "Alteração do chamado feita com sucesso"
                );
                res.redirect("/admin/chamado");
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
        bd3
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
              res.redirect("/admin/chamado");
            } else {
              req.flash("sucess_msg", "Exclusão das imagens feita com sucesso");
              res.redirect("/admin/chamado/alteracao/" + chamado1.id);
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
          res.render("admin/edicao_chamado", {
            usuario,
            foto: foto_admin,
            matricula: admin_matricula,
            error: err,
          });
        } else if (err) {
          res.setTimeout(480000);
          res.render("admin/edicao_chamado", {
            usuario,
            foto: foto_admin,
            matricula: admin_matricula,
            error: err,
          });
        } else {
          bd3
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
                res.redirect("/admin/chamado");
              } else {
                req.flash(
                  "sucess_msg",
                  "Alteração do chamado feita com sucesso"
                );
                res.redirect("/admin/chamado");
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
        bd3
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
              res.redirect("/admin/chamado");
            } else {
              req.flash("sucess_msg", "Exclusão das imagens feita com sucesso");
              res.redirect("/admin/chamado/alteracao/" + chamado1.id);
            }
          });
      }
    });
  }
});

/*exclusão do professor*/
router.get("/professor/exclusao/:matricula", eAdmin, (req, res) => {
  bd.delete_professor(req.params.matricula).then((error) => {
    if (error === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/admin/professor");
    } else {
      req.flash("sucess_msg", "Exclusão do professor feita com sucesso");
      res.redirect("/admin/professor");
    }
  });
});

/*exclusão da foto de perfil do admin na pagina inicial*/
router.get("/exclusao/:matricula", eAdmin, (req, res) => {
  bd1
    .update_foto_admin({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do admin");
      } else {
        fs.unlink("./public/upload/admin/" + foto_admin, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/admin");
      }
    });
});

/*exclusão da foto de perfil do admin na pagina de cadastro de professor*/
router.get("/cadastrar-professor/exclusao/:matricula", eAdmin, (req, res) => {
  bd1
    .update_foto_admin({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do admin");
      } else {
        fs.unlink("./public/upload/admin/" + foto_admin, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/admin/cadastrar-professor");
      }
    });
});

/*exclusão da foto de perfil do admin na pagina de cadastro de funcionario*/
router.get("/cadastrar-funcionario/exclusao/:matricula", eAdmin, (req, res) => {
  bd1
    .update_foto_admin({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do admin");
      } else {
        fs.unlink("./public/upload/admin/" + foto_admin, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/admin/cadastrar-funcionario");
      }
    });
});

/*exclusão da foto de perfil do admin na pagina de cadastro de aluno*/
router.get("/cadastrar-aluno/exclusao/:matricula", eAdmin, (req, res) => {
  bd1
    .update_foto_admin({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do admin");
      } else {
        fs.unlink("./public/upload/admin/" + foto_admin, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/admin/cadastrar-aluno");
      }
    });
});

/*exclusão da foto de perfil do admin na pagina de alunos*/
router.get("/aluno/foto/exclusao/:matricula", eAdmin, (req, res) => {
  bd1
    .update_foto_admin({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do admin");
      } else {
        fs.unlink("./public/upload/admin/" + foto_admin, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/admin/aluno");
      }
    });
});

/*exclusão da foto de perfil do admin na pagina de professores*/
router.get("/professor/foto/exclusao/:matricula", eAdmin, (req, res) => {
  bd1
    .update_foto_admin({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do admin");
      } else {
        fs.unlink("./public/upload/admin/" + foto_admin, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/admin/professor");
      }
    });
});

/*exclusão da foto de perfil do admin na pagina de funcionarios*/
router.get("/funcionario/foto/exclusao/:matricula", eAdmin, (req, res) => {
  bd1
    .update_foto_admin({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do admin");
      } else {
        fs.unlink("./public/upload/admin/" + foto_admin, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/admin/funcionario");
      }
    });
});

/*exclusão da foto de perfil do admin na pagina de chamados*/
router.get("/chamado/foto/exclusao/:matricula", eAdmin, (req, res) => {
  bd1
    .update_foto_admin({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do admin");
      } else {
        fs.unlink("./public/upload/admin/" + foto_admin, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/admin/chamado");
      }
    });
});

/*exclusão da foto de perfil do admin na pagina de relatorios*/
router.get("/relatorio/foto/exclusao/:matricula", eAdmin, (req, res) => {
  bd1
    .update_foto_admin({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do admin");
      } else {
        fs.unlink("./public/upload/admin/" + foto_admin, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/admin/relatorio");
      }
    });
});

/*exclusão da foto de perfil do admin na pagina de alteração de relatorio*/
router.get("/relatorio/alteracao/exclusao/:matricula", eAdmin, (req, res) => {
  bd1
    .update_foto_admin({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do admin");
      } else {
        fs.unlink("./public/upload/admin/" + foto_admin, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/admin/relatorio/alteracao/" + relatorio1.id);
      }
    });
});

/*exclusão da foto de perfil do admin na pagina de alteração de aluno*/
router.get("/aluno/alteracao/exclusao/:matricula", eAdmin, (req, res) => {
  bd1
    .update_foto_admin({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do admin");
      } else {
        fs.unlink("./public/upload/admin/" + foto_admin, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/admin/aluno/alteracao/" + aluno1.matricula);
      }
    });
});

/*exclusão da foto de perfil do admin na pagina de alteração do chamado*/
router.get("/chamado/alteracao/exclusao/:matricula", eAdmin, (req, res) => {
  bd1
    .update_foto_admin({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do admin");
      } else {
        fs.unlink("./public/upload/admin/" + foto_admin, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/admin/chamado/alteracao/" + chamado1.id);
      }
    });
});

/*exclusão da foto de perfil do admin na pagina de alteração do funcionario */
router.get("/funcionario/alteracao/exclusao/:matricula", eAdmin, (req, res) => {
  bd1
    .update_foto_admin({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do admin");
      } else {
        fs.unlink("./public/upload/admin/" + foto_admin, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/admin/funcionario/alteracao/" + funcionario1.matricula);
      }
    });
});

/*exclusão da foto de do admin na pagina de chat*/
router.get("/chat/exclusao/:matricula", eAdmin, (req, res) => {
  bd1
    .update_foto_admin({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do admin");
      } else {
        fs.unlink("./public/upload/admin/" + foto_admin, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/admin/chat");
      }
    });
});

/*exclusão da foto de perfil do admin na pagina de alteração do professor*/
router.get("/professor/alteracao/exclusao/:matricula", eAdmin, (req, res) => {
  bd1
    .update_foto_admin({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do admin");
      } else {
        fs.unlink("./public/upload/admin/" + foto_admin, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/admin/professor/alteracao/" + professor1.matricula);
      }
    });
});

/*exclusão do relatorio*/
router.get("/relatorio/exclusao/:id", eAdmin, (req, res) => {
  bd1.delete_relatorio(req.params.id).then((error) => {
    if (error === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/admin/relatorio");
    } else {
      req.flash("sucess_msg", "Exclusão do relatório feita com sucesso");
      res.redirect("/admin/relatorio");
    }
  });
});

/*exclusão do chamado*/
router.get("/chamado/exclusao/:id", eAdmin, (req, res) => {
  bd3.select_usuario_imagem(req.params.id).then((usuario) => {
    if (usuario === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/admin/chamado");
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
      console.log(chamado1);
    }
  });
  bd3.delete_chamado(req.params.id).then((error) => {
    if (error === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/admin/chamado");
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
      res.redirect("/admin/chamado");
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
      res.redirect("/admin/chamado");
    }
  });
});

/*exclusao do aluno*/
router.get("/aluno/exclusao/:matricula", eAdmin, (req, res) => {
  bd2.delete_aluno(req.params.matricula).then((error) => {
    if (error === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/admin/aluno");
    } else {
      req.flash("sucess_msg", "Exclusão do aluno feita com sucesso");
      res.redirect("/admin/aluno");
    }
  });
});

/*exclusao do funcionario*/
router.get("/funcionario/exclusao/:matricula", eAdmin, (req, res) => {
  bd1.delete_funcionario(req.params.maricula).then((error) => {
    if (error === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/admin/funcionario");
    } else {
      req.flash("sucess_msg", "Exclusão do funcionário feita com sucesso");
      res.redirect("/admin/funcionario");
    }
  });
});

/*chat*/
router.get("/chat", eAdmin, (req, res) => {
  try {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
      var admin_eAdmin = req.user[0].eAdmin;
    } else {
      var admin_matricula = null;
    }
  } catch (error) {
    var admin_matricula = null;
  }

  bd1.select_admin(admin_matricula).then((admin) => {
    if (admin === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_admin = admin[0].foto_perfil;
    } else if (admin === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_admin = admin[0].foto_perfil;
    } else {
      usuario = admin[0].usuario;
      foto_admin = admin[0].foto_perfil;
    }
  });
  bd3.select_chamadochat().then((chamado) => {
    if (chamado === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/admin");
    } else {
      res.render("admin/chat", {
        usuario,
        foto: foto_admin,
        matricula: admin_matricula,
        eAdmin: admin_eAdmin,
        chamado,
      });
    }
  });
});

router.post("/chat/foto", eAdmin, (req, res) => {
  admin_perfil(req, res, () => {
    if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    } else {
      var admin_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_admin !== "undefined") {
      fs.unlink("./public/upload/admin/" + foto_admin, () => {});
    }

    bd1
      .update_foto_admin({
        foto_perfil: req.file.filename,
        matricula: admin_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do admin");
        } else {
          res.redirect("/admin/chat");
        }
      });
  });
});

/*logout do admin*/
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash("error_msg", "Error ao deslogar como admin!!!");
      res.redirect("/");
    } else {
      req.flash("sucess_msg", "Deslogado como admin feito com sucesso!!!");
      res.redirect("/");
    }
  });
});
module.exports = router;
