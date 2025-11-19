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
        matrixBoard.splice(square, 1, `${marker}`);       
    }

    const resetBoard = () => {
           // Reset board
           let i = 0;

           for (let square of matrixBoard) {
               matrixBoard.splice(i, 1, 0)
               i++
           }

    }

    const isBoardFull = function() {
        let cellCount = 0;

        for (const square of matrixBoard) {
     
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

    const isCellOccupied = function(cell) {
        if (matrixBoard[cell] != 0) {
            return true;
        }

        else {
            return false;
        }
    }


    return {getBoard, updateBoard, resetBoard, isBoardFull, isCellOccupied}
})();

const gameLoop = (function() {

    let turn = 1;                
  
    const getTurn = () => {
        return turn
    }

    const increaseTurn = () => {
        return turn++
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

    const checkWin = function(player) { 
        const playerMarker = player.getPlayerMarker(); 
        const matrixBoard = gameBoard.getBoard(); 
        const winCombinations = [[2,4,6], [0,4,8], [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8]] 
        // [0, 1, 2] // [3, 4, 5] // [6, 7, 8] 
        let markerCombinations = [];  
        let hasCombination;
        let i = 0; 
        
        for (const cell of matrixBoard) { 
            if (cell === playerMarker) { 
                markerCombinations.splice(i, 1, i); } i++ 
        }

        for (let i = 0; i< winCombinations.length; i++) { 
            hasCombination = winCombinations[i].every(value => markerCombinations.includes(value)); 
            if (hasCombination === true) { 
                break; 
            } 
        } 
        
        if ( hasCombination) { 
            return true; 
        } 
        else if (!hasCombination) { 
           
            return false; 
        } 
    };

    return {getTurn, increaseTurn, checkPlayerTurn, resetGame, checkWin}
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


        if (gameBoard.isCellOccupied(move)) {
            uiModule.getResultBoard().textContent = "This cell is already occupied";
            setTimeout(() => {
                uiModule.getResultBoard().textContent = "";
            }, 500)
            return
        }

        else if (!gameBoard.isCellOccupied(move)){
    
            if (!isPlayerTurn) {
                return
            }
        
            else if (isPlayerTurn) {
        
            gameBoard.updateBoard(playerMarker, move);
            gameLoop.increaseTurn();
            const isGameWon = gameLoop.checkWin(player);

            // Append Marker in DOM:
            

        
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

                const isBoardFull = gameBoard.isBoardFull();
        
                if (isBoardFull) {
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
        }
};


//  uiModule.getResultBoard().textContent = "This cell is already occupied";
//  setTimeout(() => {
//    uiModule.getResultBoard().textContent = "";
//   }, 500)
//   return


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

// Play Round:

uiModule.getSquares().forEach((square, index) => {
    
    square.addEventListener('click', () => {

            const currentTurn = gameLoop.getTurn();
      
            if (!gameBoard.isCellOccupied(index)) {
                currentTurn % 2 === 0 ?
                square.appendChild(uiModule.getPlayerTwoMarker()): //player two
                square.appendChild(uiModule.getPlayerOneMarker()); // player one
            }
            
            currentTurn % 2 === 0 ? gameController(playerTwo, index):
            gameController(playerOne, index)

    })

})

// Restart Game:
 
uiModule.getRestartButton().addEventListener("click", () => {
    uiModule.resetUI();
    gameLoop.resetGame();
})

// Rename Player:x

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