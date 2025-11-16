// This function creates a board and sets up two players with their respective marker.
// It doesn't create the players, just sets that there will always be
// only two players, "0" will always correspond to player one and so 
// will "x" to player two

const gameBoard = (function() {

    const matrixBoard = [0, 0, 0,
        0, 0, 0,
        0, 0, 0]

    const getBoard = () => { return matrixBoard }    

    const updateBoard = (player, marker, square) => {
       
        matrixBoard.splice(square, 1, `[${marker}]`);

        // Update the turn only after making a valid move:
        turn++
       
    }

    const resetBoard = () => {
           // Reset board
           let i = 0;

           for (let square of matrixBoard) {
               matrixBoard.splice(i, 1, 0)
               i++
           }
    }

    return {getBoard, updateBoard, resetBoard}
})();

const gameLoop = function() {
};

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




// This will be the gameController

const gameController = (function() {

 

})();





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