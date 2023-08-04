const bd = require("../conexao");

/*inclusão do funcionario*/
const insert_funcionario = async (funcionario) => {
  try {
    const conn = await bd.con();
    const sql =
      "INSERT INTO funcionario(matricula,usuario,email,telefone_celular,telefone_residencial,senha) VALUES (?,?,?,?,?,?)";
    const values = [
      funcionario.matricula,
      funcionario.usuario,
      funcionario.email,
      funcionario.celular,
      funcionario.residencial,
      funcionario.senha,
    ];
    await conn.execute(sql, values);
    console.log("cadastramento do funcionario realizado com sucesso");
  } catch (error) {
    console.log("deu erro, por alguma causa", error);
    return "Error no sistema tente novamente mais tarde";
  }
};

/*inclusão de relatorio do funcionario*/
const insert_relatorio = async (relatorio) => {
  try {
    const conn = await bd.con();
    const sql =
      "INSERT INTO relatorio(titulo,conteudo,fk_funcionario) VALUES (?,?,?)";
    const values = [
      relatorio.titulo,
      relatorio.conteudo,
      relatorio.fk_funcionario,
    ];
    await conn.execute(sql, values);
    console.log("inclusão do relatorio do funcionario feita com sucesso");
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

/*seleção de todos os funcionarios*/
const select_funcionarioAll = async () => {
  try {
    const conn = await bd.con();
    const sql = "SELECT * FROM funcionario;";
    const [funcionario] = await conn.execute(sql);
    if (funcionario == "") {
      return "vazio";
    } else {
      console.log("selcionamento do funcionario realizado com sucesso");
      return funcionario;
    }
  } catch (error) {
    console.log("deu error, por alguma causa", error);
    return "Error";
  }
};

/*seleção de todos os relatorios*/
const select_relatorioAll = async () => {
  try {
    const conn = await bd.con();
    const sql =
      "SELECT r.id, r.titulo, r.conteudo, f.usuario AS nome_funcionario FROM relatorio AS r JOIN funcionario AS f ON r.fk_funcionario = f.matricula;";
    const [relatorio] = await conn.execute(sql);
    if (relatorio == "") {
      return "vazio";
    } else {
      console.log("selecionamento dos relatorios realizado com sucesso");
      return relatorio;
    }
  } catch (error) {
    console.log("deu error, por alguma causa", error);
    return "Error";
  }
};

/*seleção dos relatorios de um funcionario*/
const select_relatorio_funcionario = async (funcionario) => {
  try {
    if (funcionario[0].eAdmin == 0) {
      var funcionario_matricula = [funcionario[0].matricula];
      const conn = await bd.con();
      const sql =
        "SELECT r.id, r.titulo, r.conteudo FROM relatorio AS r JOIN funcionario AS f ON r.fk_funcionario = f.matricula WHERE f.matricula = ?;";
      const [relatorio] = await conn.execute(sql, funcionario_matricula);
      if (relatorio == "") {
        return "vazio";
      } else {
        console.log(
          "selecionamento do relatorio de um funcionario realizado com sucesso"
        );
        return relatorio;
      }
    } else {
      return "matricula";
    }
  } catch (error) {
    console.log("deu error, por alguma causa", error);
    return "Error";
  }
};

/*seleção da matricula do funcionario*/
const select_funcionario = async (funcionario) => {
  try {
    const conn = await bd.con();
    const sql = "SELECT matricula FROM funcionario WHERE matricula = ?;";
    const value = [funcionario];
    const [matricula] = await conn.execute(sql, value);
    if (matricula == "") {
      return false;
    } else {
      console.log(
        "selecionamento da matricula do funcionario realizado com sucesso"
      );
      return "Matrícula já cadastrada no sistema";
    }
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "Error no sistema tente novamente mais tarde";
  }
};

/*seleção da email do funcionario*/
const select_email = async (funcionario) => {
  try {
    const conn = await bd.con();
    const sql = "SELECT email FROM funcionario WHERE email = ?;";
    const value = [funcionario];
    const [email] = await conn.execute(sql, value);
    if (email == "") {
      return false;
    } else {
      console.log(
        "selecionamento do email do funcionario realizado com sucesso"
      );
      return "Email já cadastrado no sistema";
    }
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "Error no sistema tente novamente mais tarde";
  }
};

/*seleção da senha do funcionario*/
const select_senha = async (funcionario) => {
  try {
    const conn = await bd.con();
    const sql = "SELECT senha FROM funcionario WHERE senha = ?;";
    const value = [funcionario];
    const [senha] = await conn.execute(sql, value);
    if (senha == "") {
      return false;
    } else {
      console.log(
        "selecionamento da senha do funcionario realizado com sucesso"
      );
      return "Senha já cadastrada no sistema";
    }
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "Error no sistema tente novamente mais tarde";
  }
};

/*seleção do telefone celular*/
const select_celular = async (funcionario) => {
  try {
    const conn = await bd.con();
    const sql =
      "SELECT telefone_celular FROM funcionario WHERE telefone_celular = ?;";
    const value = [funcionario];
    const [celular] = await conn.execute(sql, value);
    if (celular == "") {
      return false;
    } else {
      console.log(
        "selecionamento do telefone celular do funcionario realizado com sucesso"
      );
      return "Telefone celular já cadastrado no sistema";
    }
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "Error no sistema tente novamente mais tarde";
  }
};

/*seleção do telefone residencial*/
const select_residencial = async (funcionario) => {
  try {
    const conn = await bd.con();
    const sql =
      "SELECT telefone_residencial FROM funcionario WHERE telefone_residencial = ?;";
    const value = [funcionario];
    const [residencial] = await conn.execute(sql, value);
    if (residencial == "" || residencial[0].telefone_residencial == "") {
      return false;
    } else {
      console.log(
        "selecionamento do telefone residencial do funcionario realizado com sucesso"
      );
      return "Telefone residencial já cadastrado no sistema";
    }
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "Error no sistema tente novamente mais tarde";
  }
};

/*seleção de um funcionario*/
const select_funcionario1 = async (matricula) => {
  try {
    const conn = await bd.con();
    const sql = "SELECT * FROM funcionario WHERE matricula = ?;";
    const value = [matricula];
    const [funcionario] = await conn.execute(sql, value);
    if (funcionario == "") {
      return "vazio";
    } else {
      console.log("selecionamento do funcionario realizado com sucesso");
      return funcionario;
    }
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

/*seleção de um relatorio*/
const select_relatorio1 = async (id) => {
  try {
    const conn = await bd.con();
    const sql = "SELECT * FROM relatorio WHERE id = ?;";
    const value = [id];
    const [relatorio] = await conn.execute(sql, value);
    if (relatorio == "") {
      return "vazio";
    } else {
      console.log("selecionamento do relatorio realizado com sucesso");
      return relatorio;
    }
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

/*seleção do usuario e foto de perfil do admin*/
const select_admin = async (matricula) => {
  try {
    const conn = await bd.con();
    const sql =
      "SELECT usuario, foto_perfil FROM funcionario WHERE matricula = ? AND eAdmin = 1;";
    const value = [matricula];
    const [admin] = await conn.execute(sql, value);
    if (admin == "") {
      return "vazio";
    } else {
      return admin;
    }
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

/*seleção do usuario do funcionario*/
const select_funcionario_usuario = async (matricula) => {
  try {
    const conn = await bd.con();
    const sql =
      "SELECT usuario, foto_perfil FROM funcionario WHERE matricula = ?;";
    const value = [matricula];
    const [funcionario] = await conn.execute(sql, value);
    if (funcionario == "") {
      return "vazio";
    } else {
      return funcionario;
    }
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

/*alteração de dados do relatorio do funcionario*/
const update_relatorio = async (relatorio) => {
  try {
    const conn = await bd.con();
    const sql = "UPDATE relatorio SET titulo = ?, conteudo = ? WHERE id = ?;";
    const values = [relatorio.titulo, relatorio.conteudo, relatorio.id];
    await conn.execute(sql, values);
    console.log("alteração do relatorio feita com sucesso");
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

/*alteração do funcionario*/
const update_funcionario = async (funcionario) => {
  try {
    const conn = await bd.con();
    const sql =
      "UPDATE funcionario SET matricula = ?, usuario = ?, email = ?, telefone_celular = ?, telefone_residencial = ?, senha = ? WHERE matricula = ?;";
    const values = [
      funcionario.matricula,
      funcionario.usuario,
      funcionario.email,
      funcionario.celular,
      funcionario.residencial,
      funcionario.senha,
      funcionario.matricula1,
    ];
    await conn.execute(sql, values);
    console.log("alteração do funcionario feita com sucesso");
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

/*alteração de senha do funcionario*/
const update_funcionario_senha = async (funcionario) => {
  try {
    const conn = await bd.con();
    const sql = "UPDATE funcionario SET senha = ? WHERE matricula = ?;";
    const values = [funcionario.senha, funcionario.matricula];
    update = await conn.execute(sql, values);
    if (update[0].changedRows == 0) {
      return "falha";
    } else {
      console.log("alteração do funcionario feita com sucesso");
      return "sucesso";
    }
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

/*alteração da foto de perfil do admin*/
const update_foto_admin = async (funcionario) => {
  try {
    const conn = await bd.con();
    const sql = "UPDATE funcionario SET foto_perfil = ? WHERE matricula = ? AND eAdmin = 1;";
    const values = [funcionario.foto_perfil, funcionario.matricula];
    await conn.execute(sql, values);
    console.log("alteração de foto de perfil do admin feita com sucesso");
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

/*alteração da foto de perfil do funcionario*/
const update_foto_funcionario = async (funcionario) => {
  try {
    const conn = await bd.con();
    const sql = "UPDATE funcionario SET foto_perfil = ? WHERE matricula = ?;";
    const values = [funcionario.foto_perfil, funcionario.matricula];
    await conn.execute(sql, values);
    console.log("alteração de foto de perfil do funcionario feita com sucesso");
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

/*exclusão do funcionario*/
const delete_funcionario = async (matricula) => {
  try {
    const conn = await bd.con();
    const sql = "DELETE FROM funcionario WHERE matricula = ?;";
    await conn.execute(sql, [matricula]);
    console.log("exclução do funcionario feita com sucesso");
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

/*exclusão do relatorio*/
const delete_relatorio = async (id) => {
  try {
    const conn = await bd.con();
    const sql = "DELETE FROM relatorio WHERE id = ?;";
    await conn.execute(sql, [id]);
    console.log("exclução do relatorio feita com sucesso");
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};
module.exports = {
  insert_funcionario,
  select_funcionarioAll,
  select_relatorioAll,
  select_relatorio_funcionario,
  select_funcionario,
  select_email,
  select_senha,
  select_celular,
  select_residencial,
  select_funcionario1,
  select_relatorio1,
  select_admin,
  select_funcionario_usuario,
  update_funcionario,
  update_relatorio,
  update_funcionario_senha,
  update_foto_admin,
  update_foto_funcionario,
  insert_relatorio,
  delete_funcionario,
  delete_relatorio,
};
