const express = require("express");
const router = express.Router();
const bd = require("../models/bd_chamado");
const bd1 = require("../models/bd_aluno");
const upload = require("../config/multer");
const multer = require("multer");
const fs = require("fs");
const { eAluno } = require("../helpers/eAluno");
const uploadChamadoAluno = upload
  .upload_chamado_aluno()
  .array("imagem_chamado2", 3);
const alteracaoAlunoImagem = upload
  .alteracao_aluno_imagem()
  .array("imagem_alteracao_chamado", 3);
const aluno_perfil = upload.upload_aluno().single("aluno_foto");
var chamado1;
var usuario;
var foto_aluno;

/*pagina inicial*/
router.get("/", eAluno, (req, res) => {
  try {
    if (req.user[0].eAdmin == 3) {
      var aluno_matricula = req.user[0].matricula;
    } else {
      var aluno_matricula = null;
    }
  } catch (error) {
    var aluno_matricula = null;
  }

  bd1.select_aluno_usuario(aluno_matricula).then((aluno) => {
    if (aluno === "vazio") {
      res.render("aluno/index", {
        usuario: "[Você não devia estar aqui!!!]",
        foto: aluno[0].foto_perfil,
      });
    } else if (aluno === "error") {
      res.render("aluno/index", {
        usuario: "[Error com o nome do usuário]",
        foto: aluno[0].foto_perfil,
      });
    } else {
      foto_aluno = aluno[0].foto_perfil;
      res.render("aluno/index", {
        usuario: aluno[0].usuario,
        foto: aluno[0].foto_perfil,
        matricula: aluno_matricula,
      });
    }
  });
});

router.post("/", eAluno, (req, res) => {
  aluno_perfil(req, res, () => {
    if (req.user[0].eAdmin == 3) {
      var aluno_matricula = req.user[0].matricula;
    } else {
      var aluno_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_aluno !== "undefined") {
      fs.unlink("./public/upload/aluno/" + foto_aluno, () => {});
    }

    bd1
      .update_foto_aluno({
        foto_perfil: req.file.filename,
        matricula: aluno_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do aluno");
        } else {
          res.redirect("/aluno");
        }
      });
  });
});

/*inclusão de dados do chamado do aluno*/
router.get("/criar-chamado", eAluno, (req, res) => {
  try {
    if (req.user[0].eAdmin == 3) {
      var aluno_matricula = req.user[0].matricula;
    } else {
      var aluno_matricula = null;
    }
  } catch (error) {
    var aluno_matricula = null;
  }

  bd1.select_aluno_usuario(aluno_matricula).then((aluno) => {
    if (aluno === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      res.render("aluno/criar_chamado", {
        usuario: "[Você não devia estar aqui!!!]",
        foto: aluno[0].foto_perfil,
      });
    } else if (aluno === "error") {
      usuario = "[Error com o nome do usuário]";
      res.render("aluno/criar_chamado", {
        usuario: "[Error com o nome do usuário]",
        foto: aluno[0].foto_perfil,
      });
    } else {
      usuario = aluno[0].usuario;
      foto_aluno = aluno[0].foto_perfil;
      res.render("aluno/criar_chamado", {
        usuario: aluno[0].usuario,
        foto: aluno[0].foto_perfil,
        matricula: aluno_matricula,
      });
    }
  });
});

router.post("/criar-chamado/foto", eAluno, (req, res) => {
  aluno_perfil(req, res, () => {
    if (req.user[0].eAdmin == 3) {
      var aluno_matricula = req.user[0].matricula;
    } else {
      var aluno_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_aluno !== "undefined") {
      fs.unlink("./public/upload/aluno/" + foto_aluno, () => {});
    }

    bd1
      .update_foto_aluno({
        foto_perfil: req.file.filename,
        matricula: aluno_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do aluno");
        } else {
          res.redirect("/aluno/criar-chamado");
        }
      });
  });
});

router.post("/criar-chamado/nova", eAluno, (req, res) => {
  uploadChamadoAluno(req, res, (err) => {
    try {
      if (req.user[0].eAdmin != 3) {
        usuario = "[Você não devia estar aqui!!!]";
      }
    } catch (error) {
      usuario = "[Você não devia estar aqui!!!]";
    }
    var dados = {
      titulo: req.body.titulo,
      assunto: req.body.assunto,
      nivel: req.body.nivel,
      prioridade: req.body.prioridade,
      descricao: req.body.descricao,
    };
    var error;
    if (req.user[0].eAdmin == 3) {
      var aluno_matricula = req.user[0].matricula;
    } else {
      var aluno_matricula = null;
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
      res.render("aluno/criar_chamado", {
        usuario,
        error,
        foto: foto_aluno,
        matricula: aluno_matricula,
        dados,
      });
    } else if (
      !req.body.assunto ||
      typeof req.body.assunto === undefined ||
      req.body.assunto === null
    ) {
      error = "Assunto invalido";
      res.render("aluno/criar_chamado", {
        usuario,
        error,
        foto: foto_aluno,
        matricula: aluno_matricula,
        dados,
      });
    } else if (
      !req.body.nivel ||
      typeof req.body.nivel === undefined ||
      req.body.nivel === null ||
      req.body.nivel === "Selecione"
    ) {
      error = "Nível invalido";
      res.render("aluno/criar_chamado", {
        usuario,
        error,
        foto: foto_aluno,
        matricula: aluno_matricula,
        dados,
      });
    } else if (
      !req.body.prioridade ||
      typeof req.body.prioridade === undefined ||
      req.body.prioridade === null ||
      req.body.prioridade === "Selecione"
    ) {
      error = "Prioridade invalida";
      res.render("aluno/criar_chamado", {
        usuario,
        error,
        foto: foto_aluno,
        matricula: aluno_matricula,
        dados,
      });
    } else if (
      !req.body.descricao ||
      typeof req.body.descricao === undefined ||
      req.body.descricao === null
    ) {
      error = "Descrição invalida";
      res.render("aluno/criar_chamado", {
        usuario,
        error,
        foto: foto_aluno,
        matricula: aluno_matricula,
        dados,
      });
    } else if (err instanceof multer.MulterError) {
      err = "Envio de arquivos invalida";
      res.render("aluno/criar_chamado", {
        usuario,
        error: err,
        foto: foto_aluno,
        matricula: aluno_matricula,
        dados,
      });
    } else if (err) {
      res.render("aluno/criar_chamado", {
        usuario,
        error: err,
        foto: foto_aluno,
        matricula: aluno_matricula,
        dados,
      });
    } else {
      bd.insert_chamado({
        titulo: req.body.titulo,
        assunto: req.body.assunto,
        nome: req.body.nome,
        nivel: req.body.nivel,
        prioridade: req.body.prioridade,
        descricao: req.body.descricao,
        img1: req.files[0].filename,
        img2: req.files[1].filename,
        img3: req.files[2].filename,
        fk_aluno: aluno_matricula,
        fk_professor: null,
      }).then((msg) => {
        if (msg) {
          error = msg;
          res.render("aluno/criar_chamado", {
            usuario,
            error,
            foto: foto_aluno,
            matricula: aluno_matricula,
            dados,
          });
        } else {
          var sucesso = "Chamado cadastrado com sucesso";
          res.render("aluno/criar_chamado", {
            usuario,
            sucesso,
            foto: foto_aluno,
            matricula: aluno_matricula,
          });
        }
      });
    }
  });
});

/*seleção do chamado do aluno*/
router.get("/chamado", eAluno, (req, res) => {
  try {
    if (req.user[0].eAdmin == 3) {
      var aluno_matricula = req.user[0].matricula;
    } else {
      var aluno_matricula = null;
    }
  } catch (error) {
    var aluno_matricula = null;
  }

  bd1.select_aluno_usuario(aluno_matricula).then((aluno) => {
    if (aluno === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_aluno = aluno[0].foto_perfil;
    } else if (aluno === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_aluno = aluno[0].foto_perfil;
    } else {
      usuario = aluno[0].usuario;
      foto_aluno = aluno[0].foto_perfil;
    }
  });
  bd.select_chamadoAluno(req.user).then((chamado_aluno) => {
    if (chamado_aluno === "Error") {
      var error_mensagem = "Error no sistema tente novamente mais tarde";
      res.render("aluno/chamado_aluno", {
        usuario,
        error_mensagem,
        foto: foto_aluno,
        matricula: aluno_matricula,
      });
    } else if (chamado_aluno === "matricula") {
      res.render("aluno/chamado_aluno");
      error_mensagem = "Você não é aluno, o que você tá fazendo aqui?";
      res.render("aluno/chamado_aluno", { usuario, error_mensagem });
    } else if (chamado_aluno === "vazio") {
      var aviso_mensagem = "!!! Você não cadastrou nenhum chamado !!!";
      res.render("aluno/chamado_aluno", {
        usuario,
        aviso_mensagem,
        foto: foto_aluno,
        matricula: aluno_matricula,
      });
    } else {
      chamado_aluno.forEach((valor, i) => {
        if (chamado_aluno[i].statusd == "Aberto") {
          chamado_aluno[i].i1 = "algo";
        } else if (chamado_aluno[i].statusd == "Em Atendimento") {
          chamado_aluno[i].i2 = "algo";
        } else if (chamado_aluno[i].statusd == "Fechado") {
          chamado_aluno[i].i3 = "algo";
        }
      });
      res.render("aluno/chamado_aluno", {
        usuario,
        chamado_aluno,
        foto: foto_aluno,
        matricula: aluno_matricula,
      });
    }
  });
});

router.post("/chamado/foto", eAluno, (req, res) => {
  aluno_perfil(req, res, () => {
    if (req.user[0].eAdmin == 3) {
      var aluno_matricula = req.user[0].matricula;
    } else {
      var aluno_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_aluno !== "undefined") {
      fs.unlink("./public/upload/aluno/" + foto_aluno, () => {});
    }

    bd1
      .update_foto_aluno({
        foto_perfil: req.file.filename,
        matricula: aluno_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do aluno");
        } else {
          res.redirect("/aluno/chamado");
        }
      });
  });
});

/*alteracao do chamado*/
router.get("/chamado/alteracao/:id", eAluno, (req, res) => {
  try {
    if (req.user[0].eAdmin == 3) {
      var aluno_matricula = req.user[0].matricula;
    } else {
      var aluno_matricula = null;
    }
  } catch (error) {
    var aluno_matricula = null;
  }

  bd1.select_aluno_usuario(aluno_matricula).then((aluno) => {
    if (aluno === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_aluno = aluno[0].foto_perfil;
    } else if (aluno === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_aluno = aluno[0].foto_perfil;
    } else {
      usuario = aluno[0].usuario;
      foto_aluno = aluno[0].foto_perfil;
    }
  });
  bd.select_chamado1(req.params.id).then((chamado) => {
    if (chamado === "vazio") {
      req.flash("error_msg", "Chamado não encontrado");
      res.redirect("/aluno/chamado");
    } else if (chamado === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/aluno/chamado");
    } else {
      chamado = chamado[0];
      chamado1 = chamado;
      res.render("aluno/edicao_chamado", {
        usuario,
        foto: foto_aluno,
        matricula: aluno_matricula,
        chamado,
      });
    }
  });
});

router.post("/chamado/alteracao/foto", eAluno, (req, res) => {
  aluno_perfil(req, res, () => {
    if (req.user[0].eAdmin == 3) {
      var aluno_matricula = req.user[0].matricula;
    } else {
      var aluno_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_aluno !== "undefined") {
      fs.unlink("./public/upload/aluno/" + foto_aluno, () => {});
    }

    bd1
      .update_foto_aluno({
        foto_perfil: req.file.filename,
        matricula: aluno_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do aluno");
        } else {
          res.redirect("/aluno/chamado/alteracao/" + chamado1.id);
        }
      });
  });
});

router.post("/chamado/alteracao", eAluno, (req, res) => {
  try {
    if (req.user[0].eAdmin != 3) {
      usuario = "[Você não devia estar aqui!!!]";
    }
  } catch (error) {
    usuario = "[Você não devia estar aqui!!!]";
  }
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
      } else if (
        typeof req.files[2] !== "undefined" &&
        chamado1.img3 !== null
      ) {
        fs.unlink("./public/upload/chamado_aluno/" + chamado1.img1, (err) => {
          if (err) {
            console.log("olá", err);
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
        res.render("aluno/edicao_chamado", { usuario, error: err });
      } else if (err) {
        res.setTimeout(480000);
        res.render("aluno/edicao_chamado", { usuario, error: err });
      } else {
        bd.update_chamado({
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
        }).then((error) => {
          if (error === "error") {
            req.flash(
              "error_msg",
              "Error no sistema tente novamente mais tarde"
            );
            res.redirect("/aluno/chamado");
          } else {
            req.flash("sucess_msg", "Alteração do chamado feita com sucesso");
            res.redirect("/aluno/chamado");
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
      bd.update_imagem({
        img1: null,
        img2: null,
        img3: null,
        id: chamado1.id,
      }).then((error) => {
        if (error === "error") {
          req.flash("error_msg", "Error no sistema tente novamente mais tarde");
          res.redirect("/aluno/chamado");
        } else {
          req.flash("sucess_msg", "Exclusão das imagens feita com sucesso");
          res.redirect("/aluno/chamado/alteracao/" + chamado1.id);
        }
      });
    }
  });
});

/*exclusão da foto de perfil do aluno na pagina inicial*/
router.get("/exclusao/:matricula", eAluno, (req, res) => {
  bd1
    .update_foto_aluno({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do aluno");
      } else {
        fs.unlink("./public/upload/aluno/" + foto_aluno, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/aluno");
      }
    });
});

/*exclusão da foto de perfil do aluno na pagina de chamados*/
router.get("/chamado/foto/exclusao/:matricula", eAluno, (req, res) => {
  bd1
    .update_foto_aluno({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do aluno");
      } else {
        fs.unlink("./public/upload/aluno/" + foto_aluno, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/aluno/chamado");
      }
    });
});

/*exclusão da foto de do aluno na pagina de chat*/
router.get("/chat/exclusao/:matricula", eAluno, (req, res) => {
  bd1
    .update_foto_aluno({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do aluno");
      } else {
        fs.unlink("./public/upload/aluno/" + foto_aluno, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/aluno/chat");
      }
    });
});

/*exclusão da foto de perfil do aluno na pagina de criação de chamados*/
router.get("/criar-chamado/exclusao/:matricula", eAluno, (req, res) => {
  bd1
    .update_foto_aluno({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do aluno");
      } else {
        fs.unlink("./public/upload/aluno/" + foto_aluno, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/aluno/criar-chamado");
      }
    });
});

/*exclusão da foto de perfil do aluno na pagina de alteração de chamados*/
router.get("/chamado/alteracao/exclusao/:matricula", eAluno, (req, res) => {
  bd1
    .update_foto_aluno({
      foto_perfil: "",
      matricula: req.params.matricula,
    })
    .then((error) => {
      if (error === "error") {
        console.log("error ao excluir a foto de perfil do aluno");
      } else {
        fs.unlink("./public/upload/aluno/" + foto_aluno, (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/aluno/chamado/alteracao/" + chamado1.id);
      }
    });
});

/*exclusão do chamado*/
router.get("/chamado/exclusao/:id", eAluno, (req, res) => {
  bd.select_usuario_imagem(req.params.id).then((usuario) => {
    if (usuario === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/aluno/chamado");
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
  bd.delete_chamado(req.params.id).then((error) => {
    if (error === "error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/aluno/chamado");
    } else if (chamado1.img1 != null) {
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
    res.redirect("/aluno/chamado");
  });
});

/*chat*/
router.get("/chat", eAluno, (req, res) => {
  try {
    if (req.user[0].eAdmin == 3) {
      var aluno_matricula = req.user[0].matricula;
      var aluno_eAdmin = req.user[0].eAdmin;
    } else if (req.user[0].eAdmin == 1) {
      var admin_matricula = req.user[0].matricula;
    }
  } catch (error) {
    var aluno_matricula = null;
  }

  bd1.select_aluno_usuario(aluno_matricula).then((aluno) => {
    if (aluno === "vazio") {
      usuario = "[Você não devia estar aqui!!!]";
      foto_aluno = aluno[0].foto_perfil;
    } else if (aluno === "error") {
      usuario = "[Error com o nome do usuário]";
      foto_aluno = aluno[0].foto_perfil;
    } else {
      usuario = aluno[0].usuario;
      foto_aluno = aluno[0].foto_perfil;
    }
  });
  bd.select_chamadoAluno(req.user).then((chamado) => {
    if (chamado === "Error") {
      req.flash("error_msg", "Error no sistema tente novamente mais tarde");
      res.redirect("/aluno");
    } else {
      res.render("aluno/chat", {
        usuario,
        foto: foto_aluno,
        aluno_matricula,
        eAdmin: aluno_eAdmin,
        admin_matricula,
        chamado,
      });
    }
  });
});

router.post("/chat/foto", eAluno, (req, res) => {
  aluno_perfil(req, res, () => {
    if (req.user[0].eAdmin == 3) {
      var aluno_matricula = req.user[0].matricula;
    } else {
      var aluno_matricula = null;
    }

    if (typeof req.file === "undefined") {
      req.file.filename = null;
    } else if (typeof foto_aluno !== "undefined") {
      fs.unlink("./public/upload/aluno/" + foto_aluno, () => {});
    }

    bd1
      .update_foto_aluno({
        foto_perfil: req.file.filename,
        matricula: aluno_matricula,
      })
      .then((error) => {
        if (error === "error") {
          console.log("error ao fazer upload da foto de perfil do aluno");
        } else {
          res.redirect("/aluno/chat");
        }
      });
  });
});

/*logout do aluno*/
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash("error_msg", "Error ao deslogar como aluno!!!");
      res.redirect("/");
    } else {
      req.flash("sucess_msg", "Deslogado como aluno feito com sucesso!!!");
      res.redirect("/");
    }
  });
});
module.exports = router;
