const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bd = require("../conexao");

const admin = async (admin1) => {
  try {
    const conn = await bd.con();
    const sql = "SELECT * FROM funcionario WHERE usuario = ? AND senha = ?;";
    const values = [admin1.usuario, admin1.senha];
    const [admin] = await conn.query(sql, values);
    if (admin == "") {
      return [{ error: "error" }];
    } else {
      return admin;
    }
  } catch (error) {
    console.log("deu error", error);
  }
};

const auth_admin1 = () => {
  passport.use(
    new localStrategy(
      { usernameField: "usuario", passwordField: "senha" },
      async (usuario, senha, done) => {
        try {
          const conn = await bd.con();
          const sql =
            "SELECT * FROM funcionario WHERE usuario = ? AND senha = ?;";
          const values = [usuario, senha];
          const [admin] = await conn.query(sql, values);
          if (admin == "") {
            return done(null, false, {
              message: "Usuário ou Senha incorretos",
            });
          } else {
            return done(null, admin);
          }
        } catch (error) {
          console.log("deu error", error);
        }
      }
    )
  );

  passport.serializeUser((usuario, done) => {
    done(null, usuario);
  });

  passport.deserializeUser((usuario, done) => {
    done(null, usuario);
  });
};

module.exports = { admin, auth_admin1 };
