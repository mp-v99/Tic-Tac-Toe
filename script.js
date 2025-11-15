// This function creates a board and sets up two players with their respective marker.
// It doesn't create the players, just sets that there will always be
// only two players, "0" will always correspond to player one and so 
// will "x" to player two

const gameLoop = (function() {

    const matrixBoard = [0, 0, 0,
                         0, 0, 0,
                         0, 0, 0]

    let turn = 1;                

    const getBoard = () => { return matrixBoard }

    /* This function will receive the player's move to update the board and 
     log a message with the update: */

    const updateBoard = (player, marker, square) => {
       
        matrixBoard.splice(square, 1, `[${marker}]`);
        console.log(`${player}'s move:`)
        console.log(matrixBoard)

        // Update the turn only after making a valid move:
        turn++
       
    }

    const getTurn = () => {
        return turn
    }

    const resetGame = () => {

        // Reset turn count

        turn = 1;

        // Reset board
        let i = 0;

        for (let square of matrixBoard) {
            matrixBoard.splice(i, 1, 0)
            i++
        }


    }    



    return {getBoard, updateBoard, getTurn, resetGame}
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
    

// This will be the gameController

const gameController = function(player, square) {

    // These variables allow to have different values each time that the function is invoked, meaning that
    // depending on the context, it stores a different player's value:

    const playerName = player.getPlayerName();
    const playerMarker = player.getPlayerMarker();    
 
    // Modules:

    const checkTurn = function(player, marker, turn) {
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

    // This loop checks if the board is full.  

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


// This function checks for a win of the respective player. It loops through an array of
// winning combinations and returns true of the player's marker features the same triplet
// as one of the combinations 


    const checkWin = function(player) {

        const playerName = player.getPlayerName(); // I pass a player arg so that it knows which player is making the move
        const playerMarker = player.getPlayerMarker();
        const matrixBoard = gameLoop.getBoard(); // unlike the board which is always the same
        
        const winCombinations = [[2,4,6], [0,4,8], [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8]]

            // [0, 1, 2]
            // [3, 4, 5] 
            // [6, 7, 8]

        let markerCombinations = []; // It takes every index position where a player's marker is located at;
        let hasCombination; // truthy/falsy value that will check if there are any winCombinations in the markerCombinations array

        let i = 0;

        for (const cell of matrixBoard) {
            if (cell === `[${playerMarker}]`) {
                markerCombinations.splice(i, 1, i); 
            }
            i++
        }

        
        for (let i = 0; i< winCombinations.length; i++) {
            hasCombination = winCombinations[i].every(value => markerCombinations.includes(value));
            if (hasCombination === true) {
                break;
            }
        }
        

        if (
        hasCombination) {   
            return true;
        }
        else if (!hasCombination) {
            return false;
        }

       
    };

    // Booleans:

    const isPlayerTurn = checkTurn(playerName, playerMarker, gameLoop.getTurn());
    
    if (!isPlayerTurn) {
        return
    }

    else if (isPlayerTurn) {
   
    gameLoop.updateBoard(playerName, playerMarker, square);
    const isGameWon = checkWin(player);

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

        console.log(currentTurn);
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