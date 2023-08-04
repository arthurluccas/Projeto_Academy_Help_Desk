const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mysql = require('mysql');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

// Configuração do banco de dados MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'sua_senha_do_mysql',
  database: 'nome_do_banco_de_dados',
};

// Criação da conexão com o banco de dados
const connection = mysql.createConnection(dbConfig);

// Verifica se a conexão com o banco de dados foi estabelecida com sucesso
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conexão bem-sucedida com o banco de dados');
  }
});

// Armazenamento dos chats e suas mensagens
const chats = {};

io.on('connection', (socket) => {
  console.log('Novo usuário conectado');

  // Evento para entrar em uma sala específica
  socket.on('join', (chatId) => {
    // Verifica se o chat existe, caso contrário, cria um novo
    if (!chats[chatId]) {
      chats[chatId] = [];
    }

    // Adiciona o usuário ao chat
    socket.join(chatId);

    console.log(`Usuário ${socket.id} entrou no chat ${chatId}`);

    // Carrega as mensagens existentes do chat a partir do banco de dados
    connection.query(
      'SELECT * FROM messages WHERE chat_id = ?',
      [chatId],
      (error, results) => {
        if (error) {
          console.error('Erro ao carregar mensagens do banco de dados:', error);
        } else {
          // Envia as mensagens existentes no chat para o novo usuário
          socket.emit('chatMessages', results);

          // Adiciona as mensagens carregadas ao objeto de armazenamento dos chats
          chats[chatId] = results;
        }
      }
    );
  });

  // Evento para enviar uma mensagem
  socket.on('message', (message, chatId) => {
    console.log(`Nova mensagem no chat ${chatId}: ${message}`);

    // Insere a mensagem no banco de dados
    connection.query(
      'INSERT INTO messages (chat_id, user, message) VALUES (?, ?, ?)',
      [chatId, socket.id, message],
      (error, result) => {
        if (error) {
          console.error('Erro ao inserir mensagem no banco de dados:', error);
        } else {
          // Adiciona a mensagem ao chat
          const newMessage = {
            id: result.insertId,
            chat_id: chatId,
            user: socket.id,
            message: message,
          };
          chats[chatId].push(newMessage);

          // Envia a mensagem para todos os usuários no chat
          io.to(chatId).emit('message', newMessage);
        }
      }
    );
  });

  // Evento para desconectar o usuário
  socket.on('disconnect', () => {
    console.log(`Usuário ${socket.id} desconectado`);
  });
});

server.listen(3000, () => {
  console.log('Servidor escutando na porta 3000');
});
