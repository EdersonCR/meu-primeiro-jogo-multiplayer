/* cria uma instancia (objeto) do jogo */
export default function createGame() {
    
    /* estrutura de dados que guarda as info do jogo */
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
    }
    
    /* função que adiciona jogadore*/
    function addPlayer(command) {
        const playerId = command.playerId
        const playerX = command.playerX
        const playerY = command.playerY

        state.players[playerId] = {
            x: playerX,
            y: playerY
        }
    }

    /* função que remove jogadores */
    function removePlayer(command) {
        const playerId = command.playerId

        delete state.players[playerId]
    }

        /* função que adiciona frutas*/
    function addFruit(command) {
        const fruitId = command.fruitId
        const fruitX = command.fruitX
        const fruitY = command.fruitY

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        }
    }

    /* função que remove feutas */
    function removeFruit(command) {
        const fruitId = command.fruitId

        delete state.fruits[fruitId]
    }

    /* propriedade movePlayer é uma função que recebe um objeto (comando) que vem da camada de Input */
    function movePlayer(command) {

        /* cria um objeto onde a chave é a tecla qeuserá apertada e o valor é a função que executa o movimento dessa tecla*/
        const acceptedMoves = {
            ArrowUp(player) {
                if (player.y - 1 >= 0) {
                    player.y = player.y - 1
                    return
                }
            },
            ArrowDown(player) {
                if (player.y + 1 < state.screen.height) {
                    player.y = player.y + 1
                }
            },
            ArrowLeft(player) {
                if (player.x - 1 >= 0) {
                    player.x = player.x - 1
                } 
            },
            ArrowRight(player) {
                if (player.x + 1 < state.screen.width) {
                    player.x = player.x + 1
                }
            }
        }

        const keyPressed = command.keyPressed
        const playerId = command.playerId
        const player = state.players[command.playerId] /* seleciona o player que foi passado no comando */
        const moveFunction = acceptedMoves[keyPressed] /* acessa objeto passando a chave (tecla apertada) e pega o valor (função de movimento da tecla) */
        
            /* executa a função de movimento correspondente a tecla apartada */
        if (player && moveFunction) { /* verifica se existe o jogador e a função uma função para a tecla */
                moveFunction(player)
                checkForFruitCollision(playerId)
        }
    }

    function checkForFruitCollision(playerId) {
        const player = state.players[playerId]

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]
            console.log(`Checando ${playerId} e ${fruitId}`)

            if (player.x === fruit.x && player.y === fruit.y) {
                console.log(`COLISÃO entre ${playerId} e ${fruitId}`)
                removeFruit({ fruitId: fruitId })
            }
        }
    }

    return {
        addPlayer,
        removePlayer,
        movePlayer, /* retorna a propriedade movePlayer do objeto jogo */
        addFruit,
        removeFruit,
        state
    } 

}