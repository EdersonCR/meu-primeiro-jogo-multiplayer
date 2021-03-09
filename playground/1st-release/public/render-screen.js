/*
Função que renderiza o jogo na tela
*/
export default function renderScreen(screen, game, requestAnimationFrame, currentPlayerId){
    const context = screen.getContext('2d')

    /*
    Limpa a tela antes de renderizar a póxima imagem
    */
    context.clearRect(0, 0, 10, 10)

    /*
    Itera e imprime todos jogadores na tela
    */
    for (const playerId in game.state.players){
        const player = game.state.players[playerId]
        context.fillStyle = 'black'
        context.fillRect(player.x, player.y, 1, 1)
    }

    /*
    Itera e imprime todas frutas na tela
    */
    for (const fruitId in game.state.fruits){
        const fruit = game.state.fruits[fruitId]
        context.fillStyle = 'green'
        context.fillRect(fruit.x, fruit.y, 1, 1)
    }

    /*
    Extrai o jogador corrente da lista de jogadores
    */
    const currentPlayer = game.state.players[currentPlayerId]

    /*
    Se o jogador no eatdo do jogo já existir no cliente, altera a cor do jogador
    */
    if (currentPlayer) {
        context.fillStyle = '#F0DB4F'
        context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1) 
    }

    /*
    Chama afunção que renderiza o jogo na tela recursivmante
    */
    requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame, currentPlayerId)
    }) 
}