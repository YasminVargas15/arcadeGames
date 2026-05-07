let playerStreak = 0;
let bestStreak = 0;
let totalGames = 0;
let correctGuesses = 0;
let history = [];

function jogar(escolha) {
    const resultado = Math.random() < 0.5 ? 'Cara' : 'Coroa';
    const emojis = { 'Cara': '😀', 'Coroa': '👑' };
    
    totalGames++;
    history.unshift({ guess: escolha, result: resultado });
    if (history.length > 12) history.pop();

    let acertou = escolha === resultado;
    if (acertou) {
        correctGuesses++;
        playerStreak++;
        if (playerStreak > bestStreak) bestStreak = playerStreak;
    } else {
        playerStreak = 0;
    }

    // Animação da moeda girando
    animateCoinFlip(resultado, acertou);
    
    setTimeout(() => {
        document.getElementById('resultado').innerHTML = `
            <div class="coin-result">
                <div class="coin-display ${resultado.toLowerCase()}">${emojis[resultado]}</div>
                <div>Resultado: ${resultado}</div><br>
                ${acertou ? 
                    '<span class="win-text">🎉 Você acertou!</span>' : 
                    '<span class="lose-text">❌ Você errou!</span>'
                }
            </div>
        `;
        
        updateStats();
        updateHistory();
        
        // Animação final
        const resultDiv = document.getElementById('resultado');
        resultDiv.style.animation = 'flipIn 0.8s ease';
    }, 1500);
}

function animateCoinFlip(resultado, acertou) {
    document.getElementById('resultado').innerHTML = `
        <div class="coin-flip-animation">
            <div class="coin-spinning">🪙</div>
            <div class="flip-text">GIRANDO...</div>
        </div>
    `;
}

function updateStats() {
    const statsDiv = document.querySelector('.stats') || createStatsDiv();
    const accuracy = ((correctGuesses / totalGames) * 100).toFixed(1);
    
    statsDiv.innerHTML = `
        <div>Acertos: ${correctGuesses}/${totalGames}</div>
        <div>Precisão: ${accuracy}%</div>
        <div>Melhor sequência: ${bestStreak}</div>
        <div>Sequência atual: ${playerStreak}</div>
    `;
}

function createStatsDiv() {
    const stats = document.createElement('div');
    stats.className = 'stats';
    document.querySelector('.game-buttons').insertAdjacentElement('afterend', stats);
    return stats;
}

function updateHistory() {
    const historyDiv = document.getElementById('history');
    if (!historyDiv) {
        const historyEl = document.createElement('div');
        historyEl.id = 'history';
        historyEl.className = 'history';
        historyEl.innerHTML = '<h4>📈 Últimos resultados</h4>';
        document.querySelector('.stats').insertAdjacentElement('afterend', historyEl);
    }
    
    let historyHTML = '';
    history.slice(0, 10).forEach((game, index) => {
        const acertou = game.guess === game.result;
        historyHTML += `
            <div class="history-item ${acertou ? 'win' : 'lose'}">
                ${game.guess} → ${game.result} ${acertou ? '✅' : '❌'}
            </div>
        `;
    });
    
    document.getElementById('history').innerHTML = `
        <h4>📈 Últimos resultados</h4>
        <div class="history-list">${historyHTML}</div>
    `;
}

function resetStats() {
    playerStreak = 0;
    totalGames = 0;
    correctGuesses = 0;
    history = [];
    document.getElementById('resultado').innerHTML = '';
    const stats = document.querySelector('.stats');
    const historyDiv = document.getElementById('history');
    if (stats) stats.remove();
    if (historyDiv) historyDiv.remove();
}