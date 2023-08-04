create database academy_desk;
use academy_desk;
create table professor
(
matricula varchar(150) not null primary key,
usuario varchar(90) not null,
senha varchar(40) not null,
telefone_celular varchar(15) not null,
telefone_residencial varchar(14),
email varchar(100) not null,
foto_perfil varchar(150),
eAdmin int not null default 2
);
create table aluno
(
matricula varchar(150) not null primary key,
usuario varchar(90) not null,
senha varchar(40) not null,
telefone_celular varchar(15),
telefone_residencial varchar(14),
email varchar(100) not null,
foto_perfil varchar(150),
eAdmin int not null default 3
);
create table funcionario
(
matricula varchar(150) not null primary key,
usuario varchar(90) not null,
senha varchar(40) not null,
telefone_celular varchar(15),
telefone_residencial varchar(14),
email varchar(100) not null,
foto_perfil varchar(150),
eAdmin int not null default 0
);
create table relatorio (
id int not null primary key auto_increment,
titulo varchar(40) not null,
conteudo text not null,
fk_funcionario varchar(150)
);
alter table relatorio
add foreign key(fk_funcionario) references funcionario(matricula);


create table chamado
(
id int not null primary key auto_increment,
titulo varchar(90) not null,
assunto varchar(20) not null,
statusd varchar(20) default "Aberto",
nivel char(1) not null,
prioridade varchar(8),
descricao text not null,
img1 varchar(150),
img2 varchar(150),
img3 varchar(150),
fk_funcionario varchar(150),
fk_professor varchar(150),
fk_aluno varchar(150)
);
alter table chamado
add foreign key(fk_aluno) references aluno(matricula),
add foreign key(fk_professor) references professor(matricula),
add foreign key(fk_funcionario) references funcionario(matricula);


create table chat (
id_chat int not null primary key auto_increment, 
id_chamado int,
matricula_A varchar(150),
matricula_F varchar(150),
mens_professor text not null,
mens_aluno text not null,
id_funcionario int,
mens_func text not null
);


alter table chat
add foreign key(id_chamado) references chamado(id),
add foreign key(matricula_A) references aluno(matricula),
add foreign key(matricula_F) references professor(matricula);

insert into funcionario (matricula, usuario, senha, telefone_celular, email, eAdmin) values (147, "admin", "admin", "(11) 93698-1478", "lucas@gmail.com", 1);
insert into aluno (matricula, usuario, senha, telefone_celular, email, eAdmin) values (456, "aluno", "aluno123", "(11) 99999-9990", "aluno@gmail.com", 3);
insert into funcionario (matricula, usuario, senha, telefone_celular, email, eAdmin) values (123, "funcionario", "funcionario", "(11) 99999-9999", "funcionario@gmail.com", 0);
insert into professor (matricula, usuario, senha, telefone_celular, email, eAdmin) values (789, "professor", "professor", "(11) 99999-9991", "professor@gmail.com", 2);

