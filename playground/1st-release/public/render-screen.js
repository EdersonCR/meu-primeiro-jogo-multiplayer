/* desenha os elementos na tela */
export default function renderScreen(screen, game, requestAnimationFrame){
    const context = screen.getContext('2d')
    context.clearRect(0, 0, 10, 10) /* limpa a tela antes de rendeziar proxima imagem */

    /* itera e imprimi os jogadores */
    for (const playerId in game.state.players){
        const player = game.state.players[playerId]
        context.fillStyle = 'black' /* prepara a ferramenta pra impressão*/
        context.fillRect(player.x, player.y, 1, 1) /* imprimi retanguo na tela*/
    }

    /* itera e imprimi as rutas */
    for (const fruitId in game.state.fruits){
        const fruit = game.state.fruits[fruitId]
        context.fillStyle = 'green'
        context.fillRect(fruit.x, fruit.y, 1, 1)
    }

    /* chama o render da tela recursivamente */
    requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame)
    }) 
}