const bd = require("../conexao");

/*inclusão do aluno*/
const insert_aluno = async (aluno) => {
  try {
    const conn = await bd.con();
    const sql =
      "INSERT INTO aluno(matricula,usuario,email,telefone_celular,telefone_residencial,senha) VALUES (?,?,?,?,?,?);";
    const values = [
      aluno.matricula,
      aluno.usuario,
      aluno.email,
      aluno.celular,
      aluno.residencial,
      aluno.senha,
    ];
    await conn.execute(sql, values);
    console.log("cadastramento do aluno realizado com sucesso");
  } catch (error) {
    console.log("deu erro, por alguma causa", error);
    return "Erro no sistema tente novamente mais tarde";
  }
};

/*seleção de todos os alunos*/
const select_alunoAll = async () => {
  try {
    const conn = await bd.con();
    const sql = "SELECT * FROM aluno;";
    const [aluno] = await conn.execute(sql);
    if (aluno == "") {
      return "vazio";
    } else {
      console.log("selecionamento dos alunos realizado com sucesso");
      return aluno;
    }
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "Error";
  }
};

/*seleção da matricula do aluno*/
const select_aluno = async (aluno) => {
  try {
    const conn = await bd.con();
    const sql = "SELECT matricula FROM aluno WHERE matricula = ?;";
    const value = [aluno];
    const [matricula] = await conn.execute(sql, value);
    if (matricula == "") {
      return false;
    } else {
      console.log("selecionamento da matricula do aluno realizado com sucesso");
      return "Matrícula já cadastrada no sistema";
    }
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "Error no sistema tente novamente mais tarde";
  }
};

/*seleção da email do aluno*/
const select_email = async (aluno) => {
  try {
    const conn = await bd.con();
    const sql = "SELECT email FROM aluno WHERE email = ?;";
    const value = [aluno];
    const [email] = await conn.execute(sql, value);
    if (email == "") {
      return false;
    } else {
      console.log("selecionamento do email do aluno realizado com sucesso");
      return "Email já cadastrado no sistema";
    }
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "Error no sistema tente novamente mais tarde";
  }
};

/*seleção de senha do aluno*/
const select_senha = async (aluno) => {
  try {
    const conn = await bd.con();
    const sql = "SELECT senha FROM aluno WHERE senha = ?;";
    const value = [aluno];
    const [senha] = await conn.execute(sql, value);
    if (senha == "") {
      return false;
    } else {
      console.log("selecionamento da senha do aluno realizado com sucesso");
      return "Senha já cadastrada no sistema";
    }
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "Error no sistema tente novamente mais tarde";
  }
};

/*seleção do telefone celular*/
const select_celular = async (aluno) => {
  try {
    const conn = await bd.con();
    const sql = "SELECT telefone_celular FROM aluno WHERE telefone_celular = ?";
    const value = [aluno];
    const [celular] = await conn.execute(sql, value);
    if (celular == "") {
      return false;
    } else {
      console.log(
        "selecionamento do telefone celular do aluno realizado com sucesso"
      );
      return "Telefone celular já cadastrado no sistema";
    }
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "Error no sistema tente novamente mais tarde";
  }
};

/*seleção do telefone residencial*/
const select_residencial = async (aluno) => {
  try {
    const conn = await bd.con();
    const sql =
      "SELECT telefone_residencial FROM aluno WHERE telefone_residencial = ?";
    const value = [aluno];
    const [residencial] = await conn.execute(sql, value);
    if (residencial == "" || residencial[0].telefone_residencial == "") {
      return false;
    } else {
      console.log(
        "selecionamento do telefone residencial do aluno realizado com sucesso"
      );
      return "Telefone residencial já cadastrado no sistema";
    }
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "Error no sistema tente novamente mais tarde";
  }
};

/*seleção de um aluno*/
const select_aluno1 = async (matricula) => {
  try {
    const conn = await bd.con();
    const sql = "SELECT * FROM aluno WHERE matricula = ?;";
    const value = [matricula];
    const [aluno] = await conn.execute(sql, value);
    if (aluno == "") {
      return "vazio";
    } else {
      console.log("selecionamento do aluno realizado com sucesso");
      return aluno;
    }
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

/*seleção de um usuário de um aluno*/
const select_aluno_usuario = async (matricula) => {
  try {
    const conn = await bd.con();
    const sql = "SELECT usuario, foto_perfil FROM aluno WHERE matricula = ?;";
    const value = [matricula];
    const [aluno] = await conn.execute(sql, value);
    if (aluno == "") {
      return "vazio";
    } else {
      return aluno;
    }
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

/*exclusão do chamado e alteração de um aluno*/
const delete_update_aluno = async (aluno) => {
  try {
    const conn = await bd.con();
    const sql = "DELETE FROM chamado WHERE fk_aluno = ?;";
    const values = [aluno.matricula1];
    await conn.execute(sql, values);
    console.log("deletação do chamado do aluno feita com sucesso");
    const sql1 =
      "UPDATE aluno SET matricula = ?, usuario = ?, email = ?, telefone_celular = ?, telefone_residencial = ?, senha = ? WHERE matricula = ?;";
    const values1 = [
      aluno.matricula,
      aluno.usuario,
      aluno.email,
      aluno.celular,
      aluno.residencial,
      aluno.senha,
      aluno.matricula1,
    ];
    await conn.execute(sql1, values1);
    console.log("alteração do aluno feita com sucesso");
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

/*alteração do aluno*/
const update_aluno = async (aluno) => {
  try {
    const conn = await bd.con();
    const sql =
      "UPDATE aluno SET matricula = ?, usuario = ?, email = ?, telefone_celular = ?, telefone_residencial = ?, senha = ? WHERE matricula = ?;";
    const values = [
      aluno.matricula,
      aluno.usuario,
      aluno.email,
      aluno.celular,
      aluno.residencial,
      aluno.senha,
      aluno.matricula1,
    ];
    await conn.execute(sql, values);
    console.log("alteração do aluno feita com sucesso");
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

/*alteração de senha do aluno*/
const update_aluno_senha = async (aluno) => {
  try {
    const conn = await bd.con();
    const sql = "UPDATE aluno SET senha = ? WHERE matricula = ?;";
    const values = [aluno.senha, aluno.matricula];
    update = await conn.execute(sql, values);
    if (update[0].changedRows == 0) {
      return "falha";
    } else {
      console.log("alteração do aluno feita com sucesso");
      return "sucesso";
    }
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

/*alteração da foto de perfil do aluno*/
const update_foto_aluno = async (aluno) => {
  try {
    const conn = await bd.con();
    const sql = "UPDATE aluno SET foto_perfil = ? WHERE matricula = ?;";
    const values = [aluno.foto_perfil, aluno.matricula];
    await conn.execute(sql, values);
    console.log("alteração de foto de perfil do aluno feita com sucesso");
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

/*exclusão do aluno*/
const delete_aluno = async (matricula) => {
  try {
    const conn = await bd.con();
    const sql = "DELETE FROM chamado WHERE fk_aluno = ?;";
    await conn.execute(sql, [matricula]);
    console.log("exclução do chamado do aluno feita com sucesso");
    const sql1 = "DELETE FROM aluno WHERE matricula = ?;";
    await conn.execute(sql1, [matricula]);
    console.log("exclução do aluno feita com sucesso");
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

module.exports = {
  insert_aluno,
  select_alunoAll,
  select_aluno,
  select_email,
  select_senha,
  select_celular,
  select_residencial,
  select_aluno1,
  select_aluno_usuario,
  delete_update_aluno,
  update_aluno,
  update_aluno_senha,
  update_foto_aluno,
  delete_aluno,
};
