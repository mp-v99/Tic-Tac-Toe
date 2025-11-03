


const gameSetup = (function playerNames() {
    const matrixBoard = [["[ ]", "[ ]", "[ ]"],
                         ["[ ]", "[ ]", "[ ]"],
                         ["[ ]", "[ ]", "[ ]"]]
    // alert("Hey what's up G, give us your name!")
    // let playerOne = prompt("Ready Player One?")
    // let playerTwo = prompt("Ready Player Two?")

    let playerOne = "Player One";
    let playerTwo = "Player Two"

    console.log(`The game is afoot. 
        ${playerOne} = 0
        ${playerTwo} = x
        
        The board: `)
     
    return {matrixBoard, playerOne, playerTwo}
})()

