// script.js
// let size = 4;
let board;
let emptyTileRow;
let emptyTileCol;
let moveCount = 0;
let startTime;
let timer;
let leaderboard = [];
size = (document.getElementById("size").value);
console.log(typeof(size));
console.log(size);
function updateBoardSize() {
    const size = document.getElementById("size").value;
    console.log(typeof(size));
    // console.log(+"33.3");
    // console.log(size);
    const boardDiv = document.getElementById("board");
    var tileSize = 100 / size; // Adjust the tileSize based on the number of tiles in a row/column

    boardDiv.style.gridTemplateColumns = `repeat(${size}, ${tileSize}%)`;
    const a=`repeat(${size}, ${tileSize}%)`;
    console.log(a);
    console.log(size);
    console.log(tileSize);
}
// Function to create the puzzle board
function createPuzzleBoard() {
    board = Array.from({ length: size }, () => Array.from({ length: size }));
    let tileNumber = 1;

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (tileNumber === size * size) {
                board[row][col] = "";
                emptyTileRow = row;
                emptyTileCol = col;
            } else {
                board[row][col] = tileNumber;
            }
            tileNumber++;
        }
    }

    renderBoard();
}

// Function to render the puzzle board on the screen
function renderBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const tileValue = board[row][col];
            const tileDiv = document.createElement("div");
            tileDiv.classList.add("tile");
            tileDiv.textContent = tileValue;
            tileDiv.addEventListener("click", () => moveTile(row, col));
            boardDiv.appendChild(tileDiv);
        }
    }
}

// Function to move the tile when clicked
function moveTile(row, col) {
    if (isPuzzleSolved()) {
        alert("Congratulations! You solved the puzzle.");
        return;
    }

    if ((row === emptyTileRow && col !== emptyTileCol) || (row !== emptyTileRow && col === emptyTileCol)) {
        let distance = 0;
        if (row === emptyTileRow) {
            distance = Math.abs(col - emptyTileCol);
            const direction = col < emptyTileCol ? -1 : 1;
            for (let i = 0; i < distance; i++) {
                swapTiles(row, emptyTileCol + direction * i, row, emptyTileCol + direction * (i + 1));
            }
        } else {
            distance = Math.abs(row - emptyTileRow);
            const direction = row < emptyTileRow ? -1 : 1;
            for (let i = 0; i < distance; i++) {
                swapTiles(emptyTileRow + direction * i, col, emptyTileRow + direction * (i + 1), col);
            }
        }

        updateEmptyTilePosition(row, col);
        moveCount++;
        document.getElementById("moveCount").textContent = moveCount;
    }
}

// Function to swap the positions of two tiles
function swapTiles(row1, col1, row2, col2) {
    const temp = board[row1][col1];
    board[row1][col1] = board[row2][col2];
    board[row2][col2] = temp;

    renderBoard();
}

// Function to check if the puzzle is solved
function isPuzzleSolved() {
    let tileNumber = 1;
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] !== tileNumber && tileNumber !== size * size) {
                return false;
            }
            tileNumber++;
        }
    }
    return true;
}

// Function to shuffle the tiles
function shuffleTiles() {
    if (timer) {
        clearInterval(timer);
    }

    moveCount = 0;
    document.getElementById("moveCount").textContent = moveCount;
    startTime = Date.now();
    timer = setInterval(updateTimer, 1000);

    const numShuffles = size * size * 10; // Increase the number of shuffles for larger puzzles
    for (let i = 0; i < numShuffles; i++) {
        const neighbors = [];
        if (emptyTileRow > 0) {
            neighbors.push({ row: emptyTileRow - 1, col: emptyTileCol });
        }
        if (emptyTileRow < size - 1) {
            neighbors.push({ row: emptyTileRow + 1, col: emptyTileCol });
        }
        if (emptyTileCol > 0) {
            neighbors.push({ row: emptyTileRow, col: emptyTileCol - 1 });
        }
        if (emptyTileCol < size - 1) {
            neighbors.push({ row: emptyTileRow, col: emptyTileCol + 1 });
        }

        // Choose a random neighbor to move with the empty tile
        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];

        // Move the chosen tile to the empty tile position
        swapTiles(randomNeighbor.row, randomNeighbor.col, emptyTileRow, emptyTileCol);
        updateEmptyTilePosition(randomNeighbor.row, randomNeighbor.col);
    }
}

// Function to update the empty tile position
function updateEmptyTilePosition(row, col) {
    emptyTileRow = row;
    emptyTileCol = col;
}

// Function to update the timer
function updateTimer() {
    const currentTime = Date.now();
    const timeDifference = currentTime - startTime;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    document.getElementById("timer").textContent = `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
}

// Function to start a new game
function startNewGame() {
    if (timer) {
        clearInterval(timer);
    }
    moveCount = 0;
    document.getElementById("moveCount").textContent = moveCount;
    createPuzzleBoard();
    startTime = Date.now();
    timer = setInterval(updateTimer, 1000);
}

// Function to reset the game to the initial state
function resetGame() {
    if (timer) {
        clearInterval(timer);
    }
    moveCount = 0;
    document.getElementById("moveCount").textContent = moveCount;
    clearInterval(timer);
    document.getElementById("timer").textContent = "0:00";
    createPuzzleBoard();
    leaderboard = JSON.parse(localStorage.getItem(`leaderboard-${size}`)) || [];
    updateLeaderboard();
}

// Function to update the leaderboard
function updateLeaderboard() {
    leaderboard.push(getElapsedTimeInSeconds());
    leaderboard.sort((a, b) => a - b);
    leaderboard = leaderboard.slice(0, 5);
    localStorage.setItem(`leaderboard-${size}`, JSON.stringify(leaderboard));

    const leaderboardDiv = document.getElementById("leaderboard");
    leaderboardDiv.innerHTML = `<h2>Leaderboard</h2>
        <table>
            <tr>
                <th>Rank</th>
                <th>Time</th>
            </tr>
            ${leaderboard.map((time, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, "0")}</td>
                </tr>`).join("")}
        </table>`;
}

// Function to get elapsed time in seconds
function getElapsedTimeInSeconds() {
    const currentTime = Date.now();
    const timeDifference = currentTime - startTime;
    return Math.floor(timeDifference / 1000);
}

// Function to initialize the game on page load
window.addEventListener("load", function () {
    size = parseInt(document.getElementById("size").value);
    document.getElementById("size").addEventListener("change", function () {
        size = parseInt(document.getElementById("size").value);
        resetGame();
    });

    resetGame();
});
