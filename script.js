// This function creates a board and sets up two players with their respective marker.
// It doesn't create the players, just sets that there will always be
// only two players, "0" will always correspond to player one and so 
// will "x" to player two

const gameSetup = (function settingBoard() {
    const matrixBoard = [["[ ]", "[ ]", "[ ]"],
                         ["[ ]", "[ ]", "[ ]"],
                         ["[ ]", "[ ]", "[ ]"]]
    // alert("Hey what's up G, give us your name!")
    // let playerOne = prompt("Ready Player One?")
    // let playerTwo = prompt("Ready Player Two?")

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

