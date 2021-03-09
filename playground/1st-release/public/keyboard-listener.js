 /*
 Função que cria um objeto que capitura a tecla a apartada pelo jogador e notifica o jogo do cliente
 É executada apenas no cliente
 É uma Factory e também um Subject
 */ 
export default function createKeyboardListener(document) { 
    
    /*
    Array que contém todos Observers inscritos para receber notificação desse Subject 
    Observers: Função de mover jogador no jogo do cliente.
    */
    const state = {
        observers: [],
        playerId: null
    }

    /*
    Função que define o 'id' do jogador como sendo o 'id' do cliente
    */
    function registerPlayerId(playerId) {
        state.playerId = playerId
    }

    /*
    Função, exposta pela Factory, a qual permite que um Observer se registre para receber notificações desse Subject.
    O Observer vai registrar uma função que será executada quando o Subject for notifcar os Observers.
    O jogo do cliente vai inscrever a função de mover jogador no jogo
    */
    function subscribe(observerFunction) {  
        state.observers.push(observerFunction)
    }

    /*
    Função que notifica os Observers.
    O Subject executa todas as funções cadastradas por todos Observers.
    A funções são executadas recebendo o parâmetro 'command'.
    Vai executar a função de mover jogador no jogo do cliente
    */
    function notifyAll(command) {
        for (const observerFunction of state.observers){
            observerFunction(command)
        }
    }

    /*
    Capitura a tecla aprtada no teclado
    */
    document.addEventListener('keydown', handleKeydown)

    /*
    Função que cria o comando que será enviado para os Observers depois que uma tecla é apertada
    Envia para os Observers o comando informado a tecla apertada e o 'id' do jogador que apertou
    */
    function handleKeydown(event) {
        const keyPressed = event.key
       
        notifyAll({
            type: 'move-player',
            playerId: state.playerId, 
            keyPressed
        })
    }

    /*
    Expõe as propriedades dessa Factory que ficaram públicas para o jogo no cliente
    */
    return {
        subscribe,
        registerPlayerId
    }

}