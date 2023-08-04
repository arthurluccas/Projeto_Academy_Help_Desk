const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bd = require("../conexao");

const professor = async (professor1) => {
  try {
    const conn = await bd.con();
    const sql = "SELECT * FROM professor WHERE usuario = ? AND senha = ?;";
    const values = [professor1.usuario, professor1.senha];
    const [professor] = await conn.query(sql, values);
    if (professor == "") {
      return [{ error: "error" }];
    } else {
      return professor;
    }
  } catch (error) {
    console.log("deu error", error);
  }
};

const auth_professor1 = () => {
  passport.use(
    new localStrategy(
      { usernameField: "usuario", passwordField: "senha" },
      async (usuario, senha, done) => {
        try {
          const conn = await bd.con();
          const sql =
            "SELECT * FROM professor WHERE usuario = ? AND senha = ?;";
          const values = [usuario, senha];
          const [professor] = await conn.query(sql, values);
          if (professor == "") {
            return done(null, false, {
              message: "Usuário ou Senha incorretos",
            });
          } else {
            return done(null, professor);
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
module.exports = { professor, auth_professor1 };
