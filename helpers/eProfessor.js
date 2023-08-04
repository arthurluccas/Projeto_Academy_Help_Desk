module.exports = {
  eProfessor: (req, res, next) => {
    if (req.isAuthenticated() && req.user[0].eAdmin == 2) {
      console.log("logado como professor feito com sucesso");
      return next();
    } else {
      req.flash(
        "error_msg",
        "Você precisa está logado como professor para acessar essa página!!!"
      );
      res.redirect("/");
    }
  },
};
