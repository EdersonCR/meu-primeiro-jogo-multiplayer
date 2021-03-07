 /* função que escuta o teclado e capitura a tecla apertada SUBJECT */ 
export default function createKeyboardListener(document) { 
    
    /* array que contem todos observer inscritos */
    const state = {
        observers: []
    }

    /* funcao pela qual o observer se registra no subject (regsita uma função que será executada)*/
    function subscribe(observerFunction) {  
        state.observers.push(observerFunction)
    }

    /* função pela qual o subject 'avisa' todos os observers quando acha necessario */
    /* recebe o objeto comando que tem a tecla apertada */
    function notifyAll(command) {

        /* itera todos observer e executas as funções dos observers passando o objeto comando */
        for (const observerFunction of state.observers){
            observerFunction(command)
        }
    }

    document.addEventListener('keydown', handleKeydown) /* fica 'escurando' os inputs do TECLADO */

    /* capitura o evento e realiza as ações */
    function handleKeydown(event) {
        const keyPressed = event.key

        /* cria objeto que envia info (tecla apertada) da camada de Input pra camada de Lógica */
        const command = {
            playerId: 'player1', 
            keyPressed
        }

        notifyAll(command) /* notifica todos observer quando ouver tecla apertada */
    }

    return {
        subscribe /* retorna a proprieda de inscrever um observer */
    }

}