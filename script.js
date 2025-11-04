// This function creates a board and sets up two players with their respective marker.
// It doesn't create the players, just sets that there will always be
// only two players, "0" will always correspond to player one and so 
// will "x" to player two

const boardSetup = (function() {

    const matrixBoard = [["[0]", "[0]", "[x]"],
                         ["[x]", "[0]", "[0]"],
                         ["[x]", "[x]", "[0]"]]

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
    
    let isBoardFull = checkBoardStatus();
    
    if (isBoardFull)  { 
        boardSetup.resetBoard();
        console.log(`Starting new game:`)
        boardSetup.updateBoard(playerName, playerMarker, row, col);
    }
    else {
    boardSetup.updateBoard(playerName, playerMarker, row, col);
    winCheck(player)
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

const winCheck = (player) => {
    let marker = player.getPlayerMarker();
    let playerName = player.getPlayerName();

    console.log(`Win check:`)
    for (const row of boardSetup.getBoard()) {
        let rowCount = 0;

        for (const cell of row) {
            if (cell === `[${marker}]`) {rowCount++}

        }
        if (rowCount === 3) {
            console.log(`${playerName} Wins!!!!!!!`);
            player.increaseRecord()
            boardSetup.resetBoard();
        }
    }
};

// Run these commands to test it out:

// gameController(playerOne, 0,2);
// playerOne.getRecord();

