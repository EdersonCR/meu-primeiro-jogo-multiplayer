/*
Função que cria uma instancia (objeto) do jogo.
Executa todos funções que alteram o jogo (adicionar, remover e mover jogadores e frutas).
É executado tanto no cliente, como no servidor
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
    Fnção que adiciona frutas ao jogo com uma determinada frequência
    */
    function start(){
        const frequency = 3000

        setInterval(addFruit, frequency)
    }

    /*
    Função, exposta pela Factory, a qual permite que um Observer se registre para receber notificações desse Subject.
    O Observer vai registrar uma função que será executada quando o Subject for notifcar os Observers.
    Servidor vai inscrever uma função anônima que recebe um comando do jogo do servidor.
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
        Quando um jogador for adicionado esse Subjec, notifica o servidor.
        Envia um comando de adicionar player para o servidor.
        No servidor ele também adicionará um jogador no estado do jogo.
        */
        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerX: playerX,
            playerY: playerY
        })
    }

    /*
    Função que remove um jogador.
    Recebe como parâmentro um comando com a direção de movimento e o 'id' do jogador a ser movido.
    */
    function removePlayer(command) {
        const playerId = command.playerId

        delete state.players[playerId]

        /*
        Envia para os Observers o comando do tipo 'remove-player' informado o id do jogador que desconectou.
        */
        notifyAll({
            type: 'remove-player',
            playerId: playerId
        })
    }

    /*
    Função que adiciona frutas.
    */
    function addFruit(command) {
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 1000000)
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        }

        /*
        Quando uma fruta for adicionadoa esse Subjec, notifica o servidor.
        Envia um comando de adicionar fruta para o servidor.
        No servidor ele também adicionará uma fruta no estado do jogo.
        */
        notifyAll({
            type: 'add-fruit',
            fruitId: fruitId,
            fruitX: fruitX,
            fruitY: fruitY
        })
    }

    /*
    Função que remove frutas*/
    function removeFruit(command) {
        const fruitId = command.fruitId
        delete state.fruits[fruitId]

       
        /*
        Envia para os Observers o comando do tipo 'remove-fruit' informado o id da fruta removida.
        */
        notifyAll({
            type: 'remove-fruit',
            fruitId: fruitId
        })
    }

    /*
    Função que movimenta um jogador
    Esta incrit pelo cliente como Obserever do 'keyBoardListener' e é executada no jogo do cliente quando uma tecla é aprtada pelo cliente
    */
    function movePlayer(command) {

        /*
        Envia para os Observers o comando do tipo 'ove-player' informado a tecla apertada e o 'id' do jogador que apertou.
        */
        notifyAll(command)

        /* 
        Cria um objeto chave: valor
        Chave = Tecla que é apertada pelo cliente
        Valor: FUnção que executa o movimento do jogador
        */
        const acceptedMoves = {
            ArrowUp(player) {
                if (player.y - 1 >= 0) {
                    player.y = player.y - 1
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
        const player = state.players[command.playerId]

        /*
        Acessa o objeto contendo as funções de movimento e recupera a função correspondente a tecla apertada
        */
        const moveFunction = acceptedMoves[keyPressed]
        
        /* 
        Executa a função de movimento correspondente a tecla apartada
        Verifica se o jogador existe se existe uma função de movimento associada a tecla apertada
        */
        if (player && moveFunction) {
                moveFunction(player)
                checkForFruitCollision(playerId)
        }
    }

    /*
    Função que verifica se houve uma colisão entre um jogador e uma fruta, casso ocorra, remove a fruta
    */
    function checkForFruitCollision(playerId) {
        const player = state.players[playerId]

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]

            if (player.x === fruit.x && player.y === fruit.y) {
                removeFruit({ fruitId: fruitId })
            }
        }
    }

    /*
    Expõe as propriedades dessa factory que ficaram públicas para o cliente e para o servidor
    */
    return {
        addPlayer,
        removePlayer,
        movePlayer,
        addFruit,
        removeFruit,
        setState,
        state,
        subscribe,
        start
    } 

}