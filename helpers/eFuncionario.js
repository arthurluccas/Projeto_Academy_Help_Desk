module.exports = {
  eFuncionario: (req, res, next) => {
    if (req.isAuthenticated() && req.user[0].eAdmin == 0) {
      console.log("logado com funcionario feito com sucesso");
      return next();
    } else {
      req.flash(
        "error_msg",
        "Você precisa está logado como funcionário para acessar essa página!!!"
      );
      res.redirect("/");
    }
  },
};
