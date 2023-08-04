module.exports = {
  eAluno: (req, res, next) => {
    if (req.isAuthenticated() && req.user[0].eAdmin == 3) {
      console.log("logado como aluno feito com sucesso");
      return next();
    } else {
      req.flash(
        "error_msg",
        "Você precisa está logado como aluno para acessar essa página!!!"
      );
      res.redirect("/");
    }
  },
};
