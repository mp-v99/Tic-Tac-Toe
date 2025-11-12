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
       if (matrixBoard[square] != 0) {
        console.log("This cell is already occupied")
        console.log(matrixBoard)
       }
       else {
        matrixBoard.splice(square, 1, `[${marker}]`);
        console.log(`${player}'s move:`)
        console.log(matrixBoard)

        // Update the turn only after making a valid move:
        turn++
       }
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

        resetUI();
    }    



    return {getBoard, updateBoard, getTurn, resetGame}
})();

// This is the factory function for both of the players, it relies on closure
// to prevent the record and the marker values from being accessed directly

const createPlayer = function (name, playerMarker) {
    let record = 0;
    let marker = playerMarker;
    

    const getPlayerName = () => { return name }
    const getPlayerMarker = () => { return marker }
    const getRecord = () => { return record }
    const increaseRecord = () => { record++}


    return {getPlayerName, getPlayerMarker, getRecord, increaseRecord}
};

// Global Variables

    const playerOne = createPlayer("Arnold", "1");
    const playerTwo = createPlayer("Michael", "2")
    

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

    // Change isBoardFull state i(playerName, playerMarker, gameLoop.getTurn())f it meets condition. This will later evolve into win check and reset

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

    console.log(`This is the turn: ${gameLoop.getTurn()}`);
   
    gameLoop.updateBoard(playerName, playerMarker, square);
    const isGameWon = checkWin(player);

    if (isGameWon) {
        resultBoard.textContent = `${playerName} wins!`;

        player.increaseRecord()
        setTimeout(() => {                  // Had to use setTimeOut because the console was logging the board blank
            gameLoop.resetGame();        // skipping the last move
            playerMarker === "1" ?  playerOneRecord.textContent = `Record: ${player.getRecord()}` :
            playerTwoRecord.textContent = `Record: ${player.getRecord()}`
        }, 1500);

        return
    }

    else if (!isGameWon) {

        if (isBoardFull()) {
            resultBoard.textContent = "Game ended in a tie.";

            setTimeout(() => {
                resultBoard.textContent = "Starting new game...";
            }, 1500);

            setTimeout(() => {
                resultBoard.textContent = "";
            }, 3000);

            setTimeout(() => {                  // Had to use setTimeOut because the console was logging the board blank
                gameLoop.resetGame();         // skipping the last move
            }, 3000);
        }
        else {
            return
        }
    }        
    }
};



// DOM Control

const resultBoard = document.querySelector(".result_board");
const squares = document.querySelectorAll('.square');
const playerOneRecord = document.querySelector('.player_one_record');
const playerTwoRecord = document.querySelector('.player_two_record');

let uxRound = 1;
squares.forEach((square, index) => {
    
    square.addEventListener('click', () => {
        if (square.className === "square played") {
            return
        }
        else {
            (uxRound) % 2 === 0 ?
            square.style.backgroundColor = "#00FFFF":
            square.style.backgroundColor = "#E50914";

            square.className = 'square played'
            uxRound++
        }

        uxRound % 2 === 0 ? gameController(playerOne, index):
        gameController(playerTwo, index)

    })
})
 

//  UI board 

const resetUI = function() {
    squares.forEach((square) => {
        square.style.backgroundColor = "black";
        square.className = "square" 
    });
    
    resultBoard.textContent = "";
    uxRound = 1;
}