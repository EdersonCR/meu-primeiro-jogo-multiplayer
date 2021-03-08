import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import { Server } from 'socket.io'
import { disconnect } from 'cluster'

const app = express()
const server  = http.createServer(app)
const sockets = new Server(server)

app.use(express.static('public')) /* define a pasta 'public' com sendo a que o cliente vai ter acesso */

const game = createGame()

/* se increve como observer do game */  
game.subscribe((command) => {
    console.log(`> Emitindo ${command.type}`)
    sockets.emit(command.type, command) /* emite o comando para o cliente */
})

/* quando um client se conectado no servidor */
sockets.on('connection', (socket) => {
    const playerId = socket.id
    console.log(`> Jogador conectado no servidor com id: ${playerId}`)

    game.addPlayer({ playerId: playerId }) /* adiciona novo jogador com id do secket */
    
    socket.emit('setup', game.state) /* envia o game.state para o cliente */

    /* quando cliente se desconetar, remove player */
    socket.on('disconnect', () => {
        game.removePlayer({ playerId: playerId })
        console.log(`> Jogador desconectado: ${playerId}`)
    })
})

server.listen(3000, () => {
    console.log(`> Servidor escutando na porta: 3000`)
})