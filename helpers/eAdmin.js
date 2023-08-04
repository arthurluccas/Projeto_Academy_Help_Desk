module.exports = {
  eAdmin: (req, res, next) => {
    if (req.isAuthenticated() && req.user[0].eAdmin == 1) {
      console.log("logado como admin feito com sucesso");
      return next();
    } else {
      req.flash(
        "error_msg",
        "Você precisa está logado como admin para acessar essa página!!!"
      );
      res.redirect("/");
    }
  },
};
