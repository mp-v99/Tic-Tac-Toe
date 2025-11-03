// This function creates a board and sets up two players with their respective marker.
// It doesn't create the players, just sets that there will always be
// only two players, "0" will always correspond to player one and so 
// will "x" to player two

const boardSetup = (function() {
    const matrixBoard = [["[ ]", "[ ]", "[ ]"],
                         ["[ ]", "[ ]", "[ ]"],
                         ["[ ]", "[ ]", "[ ]"]]

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

    console.log(`The game is afoot. 
        Player One = 0
        Player Two = x
        
        The board: `)
    console.log(matrixBoard)


    return {getBoard, updateBoard}
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
    const increaseRecord = () => { record++, getRecord() }

    return { getPlayerName, getPlayerMarker, setPlayerMarker, getRecord, increaseRecord }
}


const playerOne = createPlayer(`Player One`, "0");
const playerTwo = createPlayer(`Player Two`, "x");

console.log(
    `${playerOne.getPlayerName()} is: ${playerOne.getPlayerMarker()}
    ${playerTwo.getPlayerName()} is: ${playerTwo.getPlayerMarker()}`
)