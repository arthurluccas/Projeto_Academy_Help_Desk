const bd = require("../conexao");

/*inclusão de dados do chamado*/
const insert_chamado = async (chamado) => {
  try {
    const conn = await bd.con();
    const sql =
      "INSERT INTO chamado(titulo,assunto,nivel,prioridade,descricao,img1,img2,img3,fk_aluno,fk_professor) VALUES (?,?,?,?,?,?,?,?,?,?)";
    const values = [
      chamado.titulo,
      chamado.assunto,
      chamado.nivel,
      chamado.prioridade,
      chamado.descricao,
      chamado.img1,
      chamado.img2,
      chamado.img3,
      chamado.fk_aluno,
      chamado.fk_professor,
    ];
    await conn.execute(sql, values);
    console.log("cadastramento do chamado realizado com sucesso");
  } catch (error) {
    console.log("deu erro, por alguma causa", error);
    return "Error no sistema tente novamente mais tarde";
  }
};

/*seleção de todos os chamados*/
const select_chamadoAll = async () => {
  try {
    const conn = await bd.con();
    const [chamado] = await conn.execute(
      "SELECT c.id, c.titulo, c.assunto, c.statusd, c.nivel, c.prioridade, c.img1, c.img2, c.img3, c.descricao, a.usuario AS nome_aluno, p.usuario AS nome_professor, a.email AS email_aluno, p.email AS email_professor, a.telefone_celular AS celular_aluno, p.telefone_celular AS celular_professor, a.telefone_residencial AS residencial_aluno, p.telefone_residencial AS residencial_professor FROM ((chamado AS c LEFT JOIN professor AS p ON c.fk_professor = p.matricula) LEFT JOIN aluno AS a ON c.fk_aluno = a.matricula);"
    );
    if (chamado == "") {
      return "vazio";
    } else {
      console.log("seleção dos chamados realizado com sucesso");
      console.log(chamado);
      return chamado;
    }
  } catch (error) {
    console.log("deu erro, por alguma causa", error);
    return "Error";
  }
};

/*seleção de um chamado*/
const select_chamado1 = async (id) => {
  try {
    const conn = await bd.con();
    const sql =
      "SELECT c.id, c.titulo, c.assunto, c.statusd, c.nivel, c.prioridade, c.img1, c.img2, c.img3, c.descricao, a.usuario AS nome_aluno, p.usuario AS nome_professor, a.email AS email_aluno, p.email AS email_professor, a.telefone_celular AS celular_aluno, p.telefone_residencial AS residencial_professor FROM ((chamado AS c LEFT JOIN professor AS p ON c.fk_professor = p.matricula) LEFT JOIN aluno AS a ON c.fk_aluno = a.matricula) where id = ?;";
    const value = [id];
    const [chamado] = await conn.execute(sql, value);
    if (chamado == "") {
      return "vazio";
    } else {
      console.log("selecionamento do chamado realizado com sucesso");
      return chamado;
    }
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

/*seleção de um chamado com imagens*/
const select_usuario_imagem = async (id) => {
  try {
    const conn = await bd.con();
    const sql =
      "SELECT c.img1, c.img2, c.img3, a.usuario AS nome_aluno, p.usuario AS nome_professor, a.email AS email_aluno, p.email AS email_professor, a.telefone_celular AS celular_aluno, p.telefone_celular AS celular_professor, a.telefone_residencial AS residencial_aluno, p.telefone_residencial AS residencial_professor FROM ((chamado AS c LEFT JOIN professor AS p ON c.fk_professor = p.matricula) LEFT JOIN aluno AS a ON c.fk_aluno = a.matricula) where id = ?;";
    const value = [id];
    const [chamado] = await conn.execute(sql, value);
    console.log("selecionamento do chamado realizado com sucesso");
    return chamado;
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

const select_chamadoProfessor = async (professor) => {
  try {
    if (professor[0].eAdmin == 2) {
      var professor_matricula = [professor[0].matricula];
      const conn = await bd.con();
      const sql =
        "SELECT c.id, c.titulo, c.assunto, c.statusd, c.nivel, c.prioridade, c.img1, c.img2, c.img3, c.descricao, p.usuario AS nome_professor, f.usuario AS nome_funcionario, p.email AS email_professor, p.telefone_celular AS celular_professor, p.telefone_residencial AS residencial_professor FROM (chamado AS c JOIN professor AS p ON c.fk_professor = p.matricula) LEFT JOIN funcionario AS f ON c.fk_funcionario = f.matricula WHERE p.matricula = ?;";
      const [chamado_professor] = await conn.execute(sql, professor_matricula);
      if (chamado_professor == "") {
        return "vazio";
      } else {
        console.log("seleção dos chamados do professor realizado com sucesso");
        return chamado_professor;
      }
    } else {
      return "matricula";
    }
  } catch (error) {
    console.log("deu erro, por alguma causa", error);
    return "Error";
  }
};

const select_chamadoAluno = async (aluno) => {
  try {
    if (aluno[0].eAdmin == 3) {
      var aluno_matricula = [aluno[0].matricula];
      const conn = await bd.con();
      const sql =
        "SELECT c.id, c.titulo, c.assunto, c.statusd, c.nivel, c.prioridade, c.img1, c.img2, c.img3, c.descricao, a.usuario AS nome_aluno, f.usuario AS nome_funcionario, a.email AS email_aluno, a.telefone_celular AS celular_aluno, a.telefone_residencial AS residencial_aluno FROM (chamado AS c JOIN aluno AS a ON c.fk_aluno = a.matricula) LEFT JOIN funcionario AS f ON c.fk_funcionario = f.matricula WHERE a.matricula = ?;";
      const [chamado_aluno] = await conn.execute(sql, aluno_matricula);
      if (chamado_aluno == "") {
        return "vazio";
      } else {
        console.log("seleção dos chamados do aluno realizado com sucesso");
        return chamado_aluno;
      }
    } else {
      return "matricula";
    }
  } catch (error) {
    console.log("deu erro, por alguma causa", error);
    return "Error";
  }
};

const select_chamadofuncionario = async (funcionario) => {
  try {
    if (funcionario[0].eAdmin == 0) {
      var funcionario_matricula = [funcionario[0].matricula];
      const conn = await bd.con();
      const sql =
        "SELECT c.id, c.titulo, c.assunto, a.usuario AS nome_aluno, f.usuario AS nome_funcionario, p.usuario AS nome_professor FROM (((chamado AS c LEFT JOIN professor AS p ON c.fk_professor = p.matricula) LEFT JOIN funcionario AS f ON c.fk_funcionario = f.matricula) LEFT JOIN aluno AS a ON c.fk_aluno = a.matricula) WHERE f.matricula = ?;";
      const [chamado_funcionario] = await conn.execute(
        sql,
        funcionario_matricula
      );
      if (chamado_funcionario == "") {
        return "vazio";
      } else {
        console.log(
          "seleção dos chamados do funcionario realizado com sucesso"
        );
        return chamado_funcionario;
      }
    } else {
      return "matricula";
    }
  } catch (error) {
    console.log("deu erro, por alguma causa", error);
    return "Error";
  }
};

const update_chamado = async (chamado) => {
  try {
    const conn = await bd.con();
    const sql =
      "UPDATE chamado SET titulo = ?, assunto = ?, statusd = ?, nivel = ?, prioridade = ?, img1 = ?, img2 = ?, img3 = ?, descricao = ? WHERE id = ?;";
    const values = [
      chamado.titulo,
      chamado.assunto,
      chamado.statusd,
      chamado.nivel,
      chamado.prioridade,
      chamado.img1,
      chamado.img2,
      chamado.img3,
      chamado.descricao,
      chamado.id,
    ];
    await conn.execute(sql, values);
    console.log("alteração do chamado realizado com sucesso");
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

/*update do funcionario no chamado*/
const update_chamado_funcionario = async (chamado) => {
  try {
    const conn = await bd.con();
    const sql =
      "UPDATE chamado SET fk_funcionario = ?, statusd = ? WHERE id = ?;";
    const values = [chamado.fk_funcionario, chamado.statusd, chamado.id];
    await conn.execute(sql, values);
    console.log("alteração do funcionario no chamado realizado com sucesso");
  } catch (error) {
    console.log("deu erro, por alguma causa", error);
    return "Error";
  }
};

const update_imagem = async (chamado) => {
  try {
    const conn = await bd.con();
    const sql = "UPDATE chamado SET img1 = ?, img2 = ?, img3 = ? WHERE id = ?;";
    const values = [chamado.img1, chamado.img2, chamado.img3, chamado.id];
    await conn.execute(sql, values);
    console.log("alteração das imagens realizado com sucesso");
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

const delete_chamado = async (id) => {
  try {
    const conn = await bd.con();
    const sql = "DELETE FROM chamado WHERE id = ?;";
    await conn.execute(sql, [id]);
    console.log("exclução do chamado feita com sucesso");
  } catch (error) {
    console.log("deu error por alguma causa", error);
    return "error";
  }
};

//seleção chamado-chat
const select_chamadochat = async () => {
  try {
    const conn = await bd.con();
    const [chamado] = await conn.execute(
      "SELECT c.id, c.titulo, c.assunto, a.usuario AS nome_aluno, f.usuario AS nome_funcionario, p.usuario AS nome_professor FROM (((chamado AS c LEFT JOIN professor AS p ON c.fk_professor = p.matricula) LEFT JOIN funcionario AS f ON c.fk_funcionario = f.matricula) LEFT JOIN aluno AS a ON c.fk_aluno = a.matricula);"
    );
    if (chamado == "") {
      return "vazio";
    } else {
      console.log("seleção dos chamados realizado com sucesso");
      console.log(chamado);
      return chamado;
    }
  } catch (error) {
    console.log("deu erro, por alguma causa", error);
    return "Error";
  }
};

module.exports = {
  insert_chamado,
  update_chamado_funcionario,
  select_chamadoAll,
  select_chamado1,
  select_usuario_imagem,
  select_chamadoProfessor,
  select_chamadoAluno,
  select_chamadofuncionario,
  select_chamadochat,
  update_chamado,
  update_imagem,
  delete_chamado,
};
