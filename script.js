// This function creates a board and sets up two players with their respective marker.
// It doesn't create the players, just sets that there will always be
// only two players, "0" will always correspond to player one and so 
// will "x" to player two

const boardSetup = (function() {

    const matrixBoard = [["[0]", "[ ]", "[0]"],
                         ["[x]", "[0]", "[x]"],
                         ["[0]", "[x]", "[x]"]]

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
       }
    }

    const resetBoard =() => {

        for (const row of matrixBoard) {
            let i = 0;
            for (const cell of row) {
                row.splice(i, 1, "[ ]")
                i++
            }   
        }
    }

    console.log(`The game is afoot. 
        Player One = 0
        Player Two = x
        
        The board: `)
    console.log(matrixBoard)


    return {getBoard, updateBoard, resetBoard}
})()

// This is the factory function for both of the players, it relies on closure
// to prevent the record and the marker values from being accessed directly

const createPlayer = function (name, playerMarker) {
    let record = 0;
    let marker = playerMarker;
    

    const getPlayerName = () => { return name }
    const getPlayerMarker = () => { return marker }
    const setPlayerMarker = () => { return marker }
    const getRecord = () => { return record }
    const increaseRecord = () => { record++}


    return { getPlayerName, getPlayerMarker, setPlayerMarker, getRecord, increaseRecord}
}


// Global Variables

const playerOne = createPlayer(`Player One`, "0");
const playerTwo = createPlayer(`Player Two`, "x");

 
// This will be the gameController

const gameController = function(player, row, col) {

    // These variables allow to have different values each time that the function is invoked, meaning that
    // depending on the context, it stores a different player's value:

    const playerName = player.getPlayerName();
    const playerMarker = player.getPlayerMarker();    
    
     
    boardSetup.updateBoard(playerName, playerMarker, row, col);
    winCheck(player);

    let isBoardFull = checkBoardStatus();

        if (isBoardFull) {
            console.log("Game ended in a tie, Starting new game...") 
            setTimeout(() => {                  // Had to use setTimeOut because the console was logging the board blank
                boardSetup.resetBoard();        // skipping the last move
            }, 2000);
        }
    

}


// This loop checks if the board is full.  

const checkBoardStatus = function() {
    let cellCount = 0;

    for (const row of boardSetup.getBoard()) {
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


// This function checks for a win of the respective player. It loops through each row and checks if 
// the player's marker makes 3 in a row. 


const winCheck = function(player) {

    const playerName = player.getPlayerName(); // I pass a player arg so that it knows which player is making the move
    const playerMarker = player.getPlayerMarker();
    const matrixBoard = boardSetup.getBoard(); // unlike the board which is always the same
    
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
            boardSetup.resetBoard();        // skipping the last move
        }, 2000);
    }
}

// Run these commands to test it out:

// gameController(playerOne, 0,2);
// playerOne.getRecord();

