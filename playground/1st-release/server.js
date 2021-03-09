import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import { Server } from 'socket.io'
import { disconnect } from 'cluster'

const app = express()
const server  = http.createServer(app)
const sockets = new Server(server)
/*
Define a pasta 'public' como sendo a que o cliente vai ter acesso a se conectar ao servidor
*/
app.use(express.static('public')) /* define a pasta 'public' com sendo a que o cliente vai ter acesso */

/*
Instância do jogo rodando no servidor
*/
const game = createGame()
game.start()

/*
Servidor se inscreve como Observer do jogo rodado no servidor
Quando um comando for executado no jogo do servidor, vai emitir esse comando para jogo dos clientes
*/  
game.subscribe((command) => {
    console.log(`> Emitindo ${command.type}`)
    sockets.emit(command.type, command)
})

/* 
Quando um novo cliente realizar a conexão com o servidor
Servidor recebe uma mensagem do tipo 'connection' recebendo o 'socket' como parâmetro
*/
sockets.on('connection', (socket) => {
    const playerId = socket.id
    console.log(`> Jogador conectado no servidor com id: ${playerId}`)

    /*
    Adiciona o novo cliente como um novo jogador no jogo do servidor
    'id' do jogador será o 'id' do socket
    */
    game.addPlayer({ playerId: playerId })
    
    /*
    Envia o estado do jogo do servidor para o jogo do novo cliente
    Envia uma mensagem do tipo 'setup' para o novo cliente passando como parâmetro o 'game.state' do jogo
    É onde sincroniza o novo cliente com o servidor
    */
    socket.emit('setup', game.state)

    /* 
    Quando o novo cliente se desconectar
    Recebe uma mensagem do novo cliente do tipo 'disconect'
    */
    socket.on('disconnect', () => {
        /*
        Remove o jogador correspondente ao novo cliente do jogo do servidor
        */
        game.removePlayer({ playerId: playerId })
        console.log(`> Jogador desconectado: ${playerId}`)
    })

    /*
    Recebe o comando de mover o jogador vindo do cliente e move no ojgo do servidor
    */
    socket.on('move-player', (command) => {

        /*
        Sobrescreve o comando e o 'id' player para o 'id' do socket
        Garante que não vira outro comando e outro 'id'
        */
        command.playerId = playerId
        command.type = 'move-player'

        game.movePlayer(command)
    })
})

/*
Abre a porta 3000 para o servidor escutar as requisições dos clientes
*/
server.listen(3000, () => {
    console.log(`> Servidor escutando na porta: 3000`)
})