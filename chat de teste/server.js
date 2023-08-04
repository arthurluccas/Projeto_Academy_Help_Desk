const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

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

    // Envia as mensagens existentes no chat para o novo usuário
    socket.emit('chatMessages', chats[chatId]);
  });

  // Evento para enviar uma mensagem
  socket.on('message', (message, chatId) => {
    console.log(`Nova mensagem no chat ${chatId}: ${message}`);

    // Adiciona a mensagem ao chat
    chats[chatId].push({ user: socket.id, message });

    // Envia a mensagem para todos os usuários no chat
    io.to(chatId).emit('message', { user: socket.id, message });
  });

  // Evento para desconectar o usuário
  socket.on('disconnect', () => {
    console.log(`Usuário ${socket.id} desconectado`);
  });
});

server.listen(3000, () => {
  console.log('Servidor escutando na porta 3000');
});
