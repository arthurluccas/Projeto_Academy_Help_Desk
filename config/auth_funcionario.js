const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bd = require("../conexao");

const funcionario = async (funcionario1) => {
  try {
    const conn = await bd.con();
    const sql = "SELECT * FROM funcionario WHERE usuario = ? AND senha = ?;";
    const values = [funcionario1.usuario, funcionario1.senha];
    const [funcionario] = await conn.query(sql, values);
    if (funcionario == "") {
      return [{ error: "error" }];
    } else {
      return funcionario;
    }
  } catch (error) {
    console.log("deu error", error);
  }
};

const auth_funcionario1 = () => {
  passport.use(
    new localStrategy(
      { usernameField: "usuario", passwordField: "senha" },
      async (usuario, senha, done) => {
        try {
          const conn = await bd.con();
          const sql =
            "SELECT * FROM funcionario WHERE usuario = ? AND senha = ?;";
          const values = [usuario, senha];
          const [funcionario] = await conn.query(sql, values);
          if (funcionario == "") {
            return done(null, false, {
              message: "Usuário ou Senha incorretos",
            });
          } else {
            return done(null, funcionario);
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
module.exports = { funcionario, auth_funcionario1 };
