/*
Função que cria uma instancia (objeto) do jogo.
Executa todos funções que alteram o jogo (adicionar, remover e mover jogadores e frutas).
É uma Factory e também um Subject.
*/
export default function createGame() {
    
    /*
    Estrutura de dados que guarda as informações do estado do jogo.
    É uma representação abstrata da visualização do jogo.
    Estrutura será enviada do servidor para os clientes para cada cliente construir a visualização do jogo.
    Cada cliente irá alterar o jogo e enviará ao servidor um comando para ele alterar essa estrutura.
    */
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
    }

    /*
    Array que contém todos Observers inscritos para receber notificação desse Subject 
    Observers: Quando um jogador, no cliente, adicionar, remover ou mover um jogador ou fruta.
    */
    const observers = []

    /*
    Função, exposta pela Factory, a qual permite que um Observer se registre para receber notificações desse Subject.
    O Observer vai registrar uma função que será executada quando o Subject for notifcar os Observers.
    */
    function subscribe(observerFunction) {  
        observers.push(observerFunction)
    }

    /*
    Função que notifica os Observers.
    O Subject executa todas as funções cadastradas por todos Observers.
    A funções são executadas recebendo o parâmetro 'command'.
    */
    function notifyAll(command) {
        for (const observerFunction of observers){
            observerFunction(command)
        }
    }
    
    /*
    Função que recebe um novo estado do jogo, vindo do servidor, e atualiza o estado no cliente.
    */
    function setState(newState) {
        Object.assign(state, newState)
    }

    /*
    Função que adiciona um jogador.
    É executada tanto no cliente como servidor.
    */
    function addPlayer(command) {
        const playerId = command.playerId
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

        state.players[playerId] = {
            x: playerX,
            y: playerY
        }

        /*
        Quando um jogador for adicionado esse Subjec, no cliente, notifica o servidor.
        Envia um comando de aadicionar player apara o servidor.
        No servidor ele também adicionará um jogador no estado do jogo.
        */
        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerX: playerX,
            playerY, playerY
        })
    }

    /* função que remove jogadores */
    function removePlayer(command) {
        const playerId = command.playerId

        delete state.players[playerId]

        /* quando remover player  o subject 'avisa' todos os observers */
        notifyAll({
            type: 'remove-player',
            playerId: playerId
        })
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
        setState,
        state,
        subscribe
    } 

}