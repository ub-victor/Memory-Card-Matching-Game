document.addEventListener('DOMContentLoaded', () => {
    // Game variables
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let timer = 0;
    let timerInterval;
    let matchedPairs = 0;
    const totalPairs = 8;

    // DOM elements
    const gameBoard = document.getElementById('game-board');
    const movesDisplay = document.getElementById('moves');
    const timerDisplay = document.getElementById('timer');
    const restartBtn = document.getElementById('restart');
    const winMessage = document.getElementById('win-message');
    const finalMoves = document.getElementById('final-moves');
    const finalTime = document.getElementById('final-time');
    const playAgainBtn = document.getElementById('play-again');
    const currentYear = document.getElementById('current-year');

    // Set current year in footer
    currentYear.textContent = new Date().getFullYear();

    // Initialize the game
    function initGame() {
        // Reset game state
        cards = [];
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        moves = 0;
        matchedPairs = 0;
        movesDisplay.textContent = moves;
        
        // Clear the game board
        gameBoard.innerHTML = '';
        
        // Stop any running timer
        clearInterval(timerInterval);
        timer = 0;
        timerDisplay.textContent = timer;
        
        // Hide win message
        winMessage.classList.add('hidden');
        
        // Create card pairs
        const icons = [
            '🍎', '🍌', '🍒', '🍓', 
            '🍕', '🍔', '🍟', '🍩',
            '⚽', '🏀', '🏈', '⚾',
            '🐶', '🐱', '🐭', '🐹'
        ].slice(0, totalPairs);
        
        // Duplicate to create pairs and shuffle
        const cardValues = [...icons, ...icons];
        shuffleArray(cardValues);
        
        // Create cards
        cardValues.forEach((value, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.value = value;
            card.dataset.index = index;
            
            card.innerHTML = `
                <div class="card-face card-back"></div>
                <div class="card-face card-front">${value}</div>
            `;
            
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
            cards.push(card);
        });
    }

    // Shuffle array using Fisher-Yates algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Flip card when clicked
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        if (this.classList.contains('matched')) return;
        
        // Start timer on first move
        if (moves === 0) {
            startTimer();
        }
        
        this.classList.add('flipped');
        
        if (!hasFlippedCard) {
            // First click
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Second click
        secondCard = this;
        checkForMatch();
    }

    // Check if cards match
    function checkForMatch() {
        moves++;
        movesDisplay.textContent = moves;
        
        const isMatch = firstCard.dataset.value === secondCard.dataset.value;
        
        if (isMatch) {
            disableCards();
            matchedPairs++;
            
            // Check for win
            if (matchedPairs === totalPairs) {
                endGame();
            }
        } else {
            unflipCards();
        }
    }

    // Disable matched cards
    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        resetBoard();
    }

    // Unflip mismatched cards
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            
            resetBoard();
        }, 1000);
    }

    // Reset board state
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    // Timer functions
    function startTimer() {
        timerInterval = setInterval(() => {
            timer++;
            timerDisplay.textContent = timer;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    // End game when all pairs are matched
    function endGame() {
        stopTimer();
        finalMoves.textContent = moves;
        finalTime.textContent = timer;
        winMessage.classList.remove('hidden');
    }

    // Event listeners
    restartBtn.addEventListener('click', initGame);
    playAgainBtn.addEventListener('click', initGame);

    // Initialize the game
    initGame();
});