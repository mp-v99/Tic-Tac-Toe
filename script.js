// This function creates a board and sets up two players with their respective marker.
// It doesn't create the players, just sets that there will always be
// only two players, "0" will always correspond to player one and so 
// will "x" to player two

const gameLoop = (function() {

    const matrixBoard = [["[ ]", "[ ]", "[ ]"],
                         ["[ ]", "[ ]", "[ ]"],
                         ["[ ]", "[ ]", "[ ]"]]

    let turn = 0;                

    const getBoard = () => { return matrixBoard }

    /* This function will receive the player's move to update the board and 
     log a message with the update: */

    const updateBoard = (player, marker, row, col) => {
       if (matrixBoard[row][col] != "[ ]") {
        console.log("This cell is already occupied")
        console.log(matrixBoard)
       }
       else {
        matrixBoard[row].splice(col, 1, `[${marker}]`);
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

        turn = 0;

        // Reset board

        for (const row of matrixBoard) {
            let i = 0;
            for (const cell of row) {
                row.splice(i, 1, "[ ]")
                i++
            }   
        }
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

    const playerOne = createPlayer("Arnold", "x");
    const playerTwo = createPlayer("Michael", "0")
    

// This will be the gameController

const gameController = function(player, row, col) {

    // These variables allow to have different values each time that the function is invoked, meaning that
    // depending on the context, it stores a different player's value:

    const playerName = player.getPlayerName();
    const playerMarker = player.getPlayerMarker();    
 
    // Modules:

    const isPlayerTurn = function(player, marker, turn) {
        const isXTurn = turn % 2 === 0;
        
        if (isXTurn && marker === "0") {
            console.log(`It is not ${player}'s turn`)
            return false;
        }
        else if (!isXTurn && marker === "x") {
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

        for (const row of gameLoop.getBoard()) {
            for (const cell of row) {
            if (cell != "[ ]") {
                    cellCount++
                }
            }
        }

    // Change isBoardFull state if it meets condition. This will later evolve into win check and reset

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


    const isGameWon = function(player) {

    const playerName = player.getPlayerName(); // I pass a player arg so that it knows which player is making the move
    const playerMarker = player.getPlayerMarker();
    const matrixBoard = gameLoop.getBoard(); // unlike the board which is always the same
    
    const winCombinations = [[2,4,6], [0,4,8], [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8]]

        // [0, 1, 2]
        // [3, 4, 5] 
        // [6, 7, 8]


    let flatBoard = matrixBoard.flat() // it turns the 2-D array into a 0-8 indexed array
    let markerCombinations = []; // It takes every index position where a player's marker is located at;
    let hasCombination; // truthy/falsy value that will check if there are any winCombinations in the markerCombinations array

    let i = 0;

    for (const cell of flatBoard) {
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
        console.log(`${playerName} Wins!!!!!!!`);
        player.increaseRecord()
        setTimeout(() => {                  // Had to use setTimeOut because the console was logging the board blank
            gameLoop.resetGame();        // skipping the last move
        }, 5000);

        return true;
    }
    else if (!hasCombination) {
        return false;
    }
    };
   
    if (!isPlayerTurn(playerName, playerMarker, gameLoop.getTurn())) {
        return
    }

    else if (isPlayerTurn(playerName, playerMarker, gameLoop.getTurn())) {

    console.log(`This is the turn: ${gameLoop.getTurn() + 1}`);
   
    gameLoop.updateBoard(playerName, playerMarker, row, col);

    if (isGameWon(player)) {
        return
    }

    else if (!isGameWon(player)) {

        if (isBoardFull()) {
            console.log("Game ended in a tie, Starting new game...") 
            setTimeout(() => {                  // Had to use setTimeOut because the console was logging the board blank
                gameLoop.resetGame();         // skipping the last move
            }, 5000);
        }
        else {
            return
        }
    }        
    }
};






// Run this command to test it out:
// gameController(playerOne, 0,2);


