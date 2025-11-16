// This function creates a board and sets up two players with their respective marker.
// It doesn't create the players, just sets that there will always be
// only two players, "0" will always correspond to player one and so 
// will "x" to player two

const gameBoard = (function() {

    const matrixBoard = [0, 0, 0,
        0, 0, 0,
        0, 0, 0]

    const getBoard = () => { return matrixBoard }    

    const updateBoard = (marker, square) => {
        matrixBoard.splice(square, 1, `[${marker}]`);       
    }

    const resetBoard = () => {
           // Reset board
           let i = 0;

           for (let square of matrixBoard) {
               matrixBoard.splice(i, 1, 0)
               i++
           }
           console.log(matrixBoard)

    }

    const isBoardFull = function() {
        let cellCount = 0;

        for (const square of gameLoop.getBoard()) {
     
            if (square != 0) {
                    cellCount++
                }
            
        }

        if (cellCount === 9) {
            return true
        }
        else {
            return false
        }
    
    
    };


    return {getBoard, updateBoard, resetBoard, isBoardFull}
})();

const gameLoop = (function() {

    let turn = 1;                
  
    const getTurn = () => {
        return turn
    }

    const resetGame = () => {
        // Reset turn count
        turn = 1;
        gameBoard.resetBoard();
    }    


    const checkPlayerTurn = function(player, marker) {
        const isXTurn = turn % 2 === 0;
        
        if (isXTurn && marker === "1") {
            console.log(`It is not ${player}'s turn`)
            return false;
        }
        else if (!isXTurn && marker === "2") {
            console.log(`It is not ${player}'s turn`)
            return false;
        }
        else {
            return true;
        }
    
    };


    return {getTurn, checkPlayerTurn, resetGame}
})();

// This is the factory function for both of the players, it relies on closure
// to prevent the record and the marker values from being accessed directly

const createPlayer = function (name, playerMarker) {
    let record = 0;
    let playerName = `@${name}`;
    let marker = playerMarker;
    
    const setPlayerName = (name) => {playerName = `@${name}`}
    const getPlayerName = () => { return playerName }
    const getPlayerMarker = () => { return marker }
    const getRecord = () => { return record }
    const increaseRecord = () => { record++}


    return {setPlayerName, getPlayerName, getPlayerMarker, getRecord, increaseRecord}
};

// Global Variables

    const playerOne = createPlayer("Player One", "1");
    const playerTwo = createPlayer("Player Two", "2")
    

// Controller Refactor: It's main purpose is to orchestrate the events of each round while referring to gameLoop's modules

const gameController = function(player, move) {

    // These variables allow to have different values each time that the function is invoked, meaning that
    // depending on the context, it stores a different player's value: 

    const playerName  = player.getPlayerName();
    const playerMarker = player.getPlayerMarker();
    const isPlayerTurn = gameLoop.checkPlayerTurn(playerName, playerMarker);
    
        if (!isPlayerTurn) {
            return
        }
    
        else if (isPlayerTurn) {
       
        gameBoard.updateBoard(playerName, playerMarker, move);
        const isGameWon = gameController.checkWin(player);
    
        if (isGameWon) {
            uiModule.getResultBoard().textContent = `${playerName} wins!`;
    
            player.increaseRecord()
            setTimeout(() => {        
                uiModule.resetUI();          
                gameLoop.resetGame();     
                uiModule.getPlayerRecord(player).textContent = `Record: ${player.getRecord()}`
            }, 1500);
    
            return
        }
    
        else if (!isGameWon) {
    
            if (isBoardFull()) {
                uiModule.getResultBoard().textContent = "Game ended in a tie.";
    
                setTimeout(() => {
                    uiModule.getResultBoard().textContent = "Starting new game...";
                }, 1500);
    
                setTimeout(() => {
                    uiModule.getResultBoard().textContent = "";
                }, 3000);
    
                setTimeout(() => {         
                    uiModule.resetUI();
                    gameLoop.resetGame();       
                }, 3000);
            }
            else {
                return
            }
        }        
        }   
};





// DOM Control

const uiModule = (function() {

    // UI elements:

    const resultBoard = document.querySelector(".result_board");
    const squares = document.querySelectorAll('.square');
    const restartButton = document.querySelector("#restart_button");
    const playerOneRecord = document.querySelector('.player_one_record');
    const playerTwoRecord = document.querySelector('.player_two_record');
    const playerInput = document.querySelectorAll('.player_input');

    // Player markers for UI game:

    const getResultBoard = () => {return resultBoard};
    const getRestartButton = () => {return restartButton};
    const getPlayerInput = () => {return playerInput}
    const getSquares = () => {return squares};
    const getPlayerRecord = (player) => {
        return player.getPlayerMarker() === "2" ? playerTwoRecord: playerOneRecord;
    } 
    const getPlayerOneMarker = () => {
        const playerOneMarker = document.createElement('img');

        playerOneMarker.src = 'pics/player_x_marker.png';
        playerOneMarker.alt = 'player_one_marker';

        return playerOneMarker;
    }
    const getPlayerTwoMarker = () => {
        const playerTwoMarker = document.createElement('img');

        playerTwoMarker.src = 'pics/player_0_marker.png';
        playerTwoMarker.alt = 'player_two_marker';

        return playerTwoMarker;
    }

    //  UI board 

    const resetUI = function() {
        uiModule.getSquares().forEach((square) => {
            square.innerHTML = '';
            square.className = "square" 
        });
        
        uiModule.getResultBoard().textContent = "";
    }



    return {getResultBoard, getSquares, getPlayerRecord, resetUI, getRestartButton, getPlayerInput, getPlayerOneMarker, getPlayerTwoMarker}

})();



uiModule.getSquares().forEach((square, index) => {
    
    
    square.addEventListener('click', () => {

        const currentTurn = gameLoop.getTurn();

        if (square.className === "square played") {
            uiModule.getResultBoard().textContent = "This cell is already occupied";
            setTimeout(() => {
                uiModule.getResultBoard().textContent = "";
            }, 500)
            return
        }
        else {
            currentTurn % 2 === 0 ?
            square.appendChild(uiModule.getPlayerTwoMarker()): //player two
            square.appendChild(uiModule.getPlayerOneMarker()); // player one

            square.className = 'square played'
        }

        currentTurn % 2 === 0 ? gameController(playerTwo, index):
        gameController(playerOne, index)

    })
})
 
uiModule.getRestartButton().addEventListener("click", () => {
    uiModule.resetUI();
    gameLoop.resetGame();
})

uiModule.getPlayerInput().forEach((input) => {
    input.addEventListener('input', (event) => {

        if (input.id === "player_one_name") {
            playerOne.setPlayerName(event.target.value);
        }
        else if (input.id === "player_two_name") {
            playerTwo.setPlayerName(event.target.value);
        }

    });
})