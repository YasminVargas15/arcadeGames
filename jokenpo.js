let playerWins = 0;
let cpuWins = 0;
let ties = 0;
let gameHistory = [];
let currentStreak = { type: 'none', count: 0 };
let bestStreak = 0;
let round = 0;
let gameMode = 'classic'; // 'classic', 'best-of-3', 'tournament'

// IA mais inteligente baseada em padrões
let cpuPatternMemory = [];
let playerPatternBias = { Pedra: 0, Papel: 0, Tesoura: 0 };

function jogar(escolhaPlayer) {
    round++;
    
    // Atualiza bias do jogador
    playerPatternBias[escolhaPlayer]++;
    
    // IA inteligente: analisa padrão recente do jogador
    const escolhaCPU = getSmartCPUChoice(escolhaPlayer);
    
    // Registra jogada
    const gameResult = analyzeMatch(escolhaPlayer, escolhaCPU);
    gameHistory.unshift({ 
        round, 
        player: escolhaPlayer, 
        cpu: escolhaCPU, 
        result: gameResult.result,
        streak: currentStreak.count 
    });
    
    if (gameHistory.length > 20) gameHistory.pop();
    
    // Animação épica de confronto
    showEpicMatchup(escolhaPlayer, escolhaCPU, gameResult);
    
    updateAllStats();
    
    // Verifica modo best-of-3
    if (gameMode === 'best-of-3' && (playerWins >= 2 || cpuWins >= 2)) {
        setTimeout(() => endBestOf3(gameResult.winner), 2000);
    }
}

function getSmartCPUChoice(playerChoice) {
    const opcoes = ['Pedra', 'Papel', 'Tesoura'];
    
    // 70% chance de contra-ataque inteligente, 30% aleatório
    if (Math.random() < 0.7) {
        // Contra-ataque perfeito
        const counters = {
            'Pedra': 'Papel',
            'Papel': 'Tesoura', 
            'Tesoura': 'Pedra'
        };
        return counters[playerChoice];
    }
    
    // Análise de bias: evita escolha mais frequente do jogador
    const mostBiased = Object.entries(playerPatternBias)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];
    
    let smartChoice = opcoes[Math.floor(Math.random() * 3)];
    while (smartChoice === mostBiased && Math.random() < 0.6) {
        smartChoice = opcoes[Math.floor(Math.random() * 3)];
    }
    
    return smartChoice;
}

function analyzeMatch(player, cpu) {
    if (player === cpu) {
        ties++;
        updateStreak('tie');
        return { result: 'tie', winner: 'none' };
    }
    
    const playerWinsMatch = (
        (player === 'Pedra' && cpu === 'Tesoura') ||
        (player === 'Papel' && cpu === 'Pedra') ||
        (player === 'Tesoura' && cpu === 'Papel')
    );
    
    if (playerWinsMatch) {
        playerWins++;
        updateStreak('win');
        return { result: 'win', winner: 'player' };
    } else {
        cpuWins++;
        updateStreak('lose');
        return { result: 'lose', winner: 'cpu' };
    }
}

function updateStreak(type) {
    if (type === currentStreak.type) {
        currentStreak.count++;
        if (currentStreak.count > bestStreak) bestStreak = currentStreak.count;
    } else {
        currentStreak = { type, count: 1 };
    }
}

function showEpicMatchup(player, cpu, result) {
    const emojis = { Pedra: '✊', Papel: '✋', Tesoura: '✌️' };
    const resultEmojis = { win: '🏆', lose: '💻', tie: '🤝' };
    
    document.getElementById('resultado').innerHTML = `
        <div class="epic-battle">
            <div class="battle-arena">
                <div class="fighter player-fighter">${emojis[player]} ${player}</div>
                <div class="battle-vs">⚔️ VS ⚔️</div>
                <div class="fighter cpu-fighter">${emojis[cpu]} ${cpu}</div>
            </div>
            <div class="battle-result ${result.result}">
                <span class="mega-emoji">${resultEmojis[result.result]}</span>
                <div>${result.result === 'win' ? 'VOCÊ VENCEU!' : 
                     result.result === 'lose' ? 'CPU VENCEU!' : 'EMPATE!'}</div>
            </div>
        </div>
    `;
}

function updateAllStats() {
    // Placar principal
    document.getElementById('player').textContent = playerWins;
    document.getElementById('cpu').textContent = cpuWins;
    
    // Stats avançadas
    const totalGames = playerWins + cpuWins + ties;
    const winRate = totalGames ? ((playerWins/totalGames)*100).toFixed(1) : 0;
    
    let statsHTML = `
        <div class="stats-panel">
            <div>⚡ Sequência: <span class="streak-${currentStreak.type}">${currentStreak.count}</span></div>
            <div>🏅 Melhor: ${bestStreak}</div>
            <div>📊 Vitória: ${winRate}%</div>
            <div>🎯 Total: ${totalGames}</div>
            <div>🎲 Round: ${round}</div>
        </div>
    `;
    
    let statsPanel = document.querySelector('.stats-panel');
    if (!statsPanel) {
        statsPanel = document.createElement('div');
        statsPanel.className = 'stats-panel';
        document.querySelector('.score').parentNode.insertBefore(statsPanel, document.querySelector('.score').nextSibling);
    }
    statsPanel.innerHTML = statsHTML;
    
    // Histórico com destaques
    updateHistory();
}

function updateHistory() {
    const historyDiv = document.getElementById('history');
    if (!historyDiv) createHistoryPanel();
    
    let historyHTML = gameHistory.slice(0, 12).map(game => {
        const resultClass = game.result;
        const streakBadge = game.streak > 2 ? ` 🔥x${game.streak}` : '';
        return `<div class="history-item ${resultClass}">
            R${game.round}: ${game.player} vs ${game.cpu}${streakBadge}
        </div>`;
    }).join('');
    
    document.getElementById('history').innerHTML = `
        <h4>⚔️ Batalhas Recentes</h4>
        <div class="history-list">${historyHTML}</div>
    `;
}

function createHistoryPanel() {
    const historyPanel = document.createElement('div');
    historyPanel.id = 'history';
    historyPanel.className = 'history-panel';
    document.querySelector('.stats-panel').insertAdjacentElement('afterend', historyPanel);
}

function changeGameMode(mode) {
    gameMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (mode === 'best-of-3') {
        playerWins = cpuWins = 0;
        round = 0;
        updateAllStats();
    }
}

function resetGame() {
    playerWins = cpuWins = ties = 0;
    round = 0;
    currentStreak = { type: 'none', count: 0 };
    bestStreak = 0;
    gameHistory = [];
    playerPatternBias = { Pedra: 0, Papel: 0, Tesoura: 0 };
    
    document.getElementById('player').textContent = '0';
    document.getElementById('cpu').textContent = '0';
    document.getElementById('resultado').innerHTML = '';
    
    // Remove painéis
    document.querySelector('.stats-panel')?.remove();
    document.getElementById('history')?.remove();
}

function endBestOf3(winner) {
    const finalMsg = winner === 'player' ? 
        '🏆🏆 VOCÊ É O CAMPEÃO! 🏆🏆' : 
        '🤖💻 CPU DOMINOU! 💻🤖';
    
    document.getElementById('resultado').innerHTML += `
        <div class="champion-banner ${winner}">
            <div class="trophy">🏆</div>
            <h2>${finalMsg}</h2>
            <button onclick="resetGame()" class="reset-btn">Nova Série</button>
        </div>
    `;
}