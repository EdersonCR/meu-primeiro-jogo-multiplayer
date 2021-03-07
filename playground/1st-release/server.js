import express from 'express'
import http from 'http'
import createGame from './public/game.js'

const app = express()
const server  = http.createServer(app)

app.use(express.static('public'))

const game = createGame()

game.addPlayer({ playerId: 'player1', playerX: 0, playerY: 0 })
game.addPlayer({ playerId: 'player2', playerX: 5, playerY: 4 })
game.addPlayer({ playerId: 'player3', playerX: 7, playerY: 2 })
game.addFruit({ fruitId: 'fruit1', fruitX: 3, fruitY: 3 })
game.addFruit({ fruitId: 'fruit2', fruitX: 6, fruitY: 8 })

console.log(game.state)

server.listen(3000, () => {
    console.log(`> Servidor escutando na porta: 3000`)
})