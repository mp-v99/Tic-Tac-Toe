// This function creates a board and sets up two players with their respective marker.
// It doesn't create the players, just sets that there will always be
// only two players, "0" will always correspond to player one and so 
// will "x" to player two

const gameSetup = (function settingBoard() {
    const matrixBoard = [["[ ]", "[ ]", "[ ]"],
                         ["[ ]", "[ ]", "[ ]"],
                         ["[ ]", "[ ]", "[ ]"]]

    let playerOne = "0";
    let playerTwo = "x"

    const getBoard = () => {console.log(matrixBoard)}
    const getPlayerOne = () => {console.log(playerOne)}
    const getPlayerTwo = () => {console.log(playerTwo)}

    console.log(`The game is afoot. 
        Player One = 0
        Player Two = x
        
        The board: `)
    getBoard()    
     
    return {getBoard, getPlayerOne, getPlayerTwo}
})()

// This is the factory function for both of the players, it relies on closure
// to prevent the record and the marker values from being accessed directly

const createPlayer = function(name, playerMarker) {
    let record = 0;
    let marker = playerMarker; 

    const getPlayerName = () => {return name}
    const getPlayerMarker = () => {return marker}
    const setPlayerMarker = () => {return marker} 
    const getRecord = () => {return record}
    const increaseRecord = () => {record++, getRecord()}

    return {getPlayerName, getPlayerMarker, setPlayerMarker, getRecord, increaseRecord}
}