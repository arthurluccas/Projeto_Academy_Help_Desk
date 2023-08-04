const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bd = require("../conexao");

const aluno = async (aluno1) => {
  try {
    const conn = await bd.con();
    const sql = "SELECT * FROM aluno WHERE usuario = ? AND senha = ?;";
    const values = [aluno1.usuario, aluno1.senha];
    const [aluno] = await conn.query(sql, values);
    if (aluno == "") {
      return [{ error: "error" }];
    } else {
      return aluno;
    }
  } catch (error) {
    console.log("deu error", error);
  }
};

const auth_aluno1 = () => {
  passport.use(
    new localStrategy(
      { usernameField: "usuario", passwordField: "senha" },
      async (usuario, senha, done) => {
        try {
          const conn = await bd.con();
          const sql = "SELECT * FROM aluno WHERE usuario = ? AND senha = ?;";
          const values = [usuario, senha];
          const [aluno] = await conn.query(sql, values);
          if (aluno == "") {
            return done(null, false, {
              message: "Usuário ou Senha incorretos",
            });
          } else {
            return done(null, aluno);
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

module.exports = { aluno, auth_aluno1 };
