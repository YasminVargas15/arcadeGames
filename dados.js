let playerWins = 0;
let cpuWins = 0;
let ties = 0;
let rollsHistory = [];
let currentStreak = 0;
let bestStreak = 0;
let totalRolls = 0;
let diceMode = 'single'; // 'single', 'double', 'triple'
let betMode = false;
let virtualChips = 1000;

function rolarDados() {
    totalRolls++;
    const rolls = getDiceRolls();
    const playerRoll = rolls.player;
    const cpuRoll = rolls.cpu;
    
    // Registra resultado
    const result = analyzeDiceRoll(playerRoll, cpuRoll);
    rollsHistory.unshift({ 
        player: playerRoll, 
        cpu: cpuRoll, 
        result: result.type,
        streak: currentStreak,
        chips: betMode ? virtualChips : null
    });
    
    if (rollsHistory.length > 25) rollsHistory.pop();
    
    // Chips betting system
    if (betMode) {
        if (result.type === 'win') virtualChips += 20;
        else if (result.type === 'lose') virtualChips -= 10;
    }
    
    // Animação 3D dos dados
    animate3DDiceRoll(playerRoll, cpuRoll, rolls.diceCount);
    
    updateAllDashboard();
    
    // Verifica streak
    if (result.type === 'win') {
        currentStreak++;
        if (currentStreak > bestStreak) bestStreak = currentStreak;
    } else {
        currentStreak = 0;
    }
}

function getDiceRolls() {
    if (diceMode === 'double') {
        return {
            player: [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1].reduce((a,b)=>a+b,0),
            cpu: [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1].reduce((a,b)=>a+b,0),
            diceCount: 2
        };
    } else if (diceMode === 'triple') {
        return {
            player: [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1].reduce((a,b)=>a+b,0),
            cpu: [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1].reduce((a,b)=>a+b,0),
            diceCount: 3
        };
    }
    
    return {
        player: Math.floor(Math.random() * 6) + 1,
        cpu: Math.floor(Math.random() * 6) + 1,
        diceCount: 1
    };
}

function analyzeDiceRoll(player, cpu) {
    if (player > cpu) {
        playerWins++;
        return { type: 'win', msg: '🎉 VOCÊ VENCEU!' };
    } else if (cpu > player) {
        cpuWins++;
        return { type: 'lose', msg: '🤖 CPU VENCEU!' };
    } else {
        ties++;
        return { type: 'tie', msg: '😎 EMPATE!' };
    }
}

function animate3DDiceRoll(playerRoll, cpuRoll, diceCount) {
    const diceFaces = ['⚀','⚁','⚂','⚃','⚄','⚅'];
    
    document.getElementById('resultado').innerHTML = `
        <div class="dice-arena">
            <div class="dice-container player-dice">
                ${Array(diceCount).fill().map(() => 
                    `<div class="dice spinning">${diceFaces[Math.floor(Math.random()*6)]}</div>`
                ).join('')}
            </div>
            <div class="dice-vs">🎲 VS 🎲</div>
            <div class="dice-container cpu-dice">
                ${Array(diceCount).fill().map(() => 
                    `<div class="dice spinning">${diceFaces[Math.floor(Math.random()*6)]}</div>`
                ).join('')}
            </div>
        </div>
        <div class="rolling-text">ROLANDO...</div>
    `;
    
    setTimeout(() => {
        document.getElementById('resultado').innerHTML = `
            <div class="final-roll">
                <div class="roll-result player-roll">
                    <span class="roll-number">${playerRoll}</span>
                    <div class="dice-display">${diceFaces[playerRoll-1]}</div>
                </div>
                <div class="roll-vs">VS</div>
                <div class="roll-result cpu-roll">
                    <span class="roll-number">${cpuRoll}</span>
                    <div class="dice-display">${diceFaces[cpuRoll-1]}</div>
                </div>
                <div class="roll-winner">${analyzeDiceRoll(playerRoll, cpuRoll).msg}</div>
            </div>
        `;
    }, 2000);
}

function updateAllDashboard() {
    // Placar principal
    const scoreHTML = `
        <div class="score">
            Você: <span id="playerScore">${playerWins}</span> |
            CPU: <span id="cpuScore">${cpuWins}</span> |
            Empates: ${ties}
        </div>
    `;
    
    let scoreEl = document.querySelector('.score');
    if (!scoreEl) {
        scoreEl = document.createElement('div');
        scoreEl.className = 'score';
        document.querySelector('.game-buttons').after(scoreEl);
    }
    scoreEl.outerHTML = scoreHTML;
    
    // Dashboard completo
    const winRate = totalRolls ? ((playerWins/totalRolls)*100).toFixed(1) : 0;
    const dashboardHTML = `
        <div class="dashboard">
            <div class="stat-item">
                <span>🔥 Sequência</span>
                <span class="highlight">${currentStreak}</span>
            </div>
            <div class="stat-item">
                <span>⭐ Melhor</span>
                <span class="highlight">${bestStreak}</span>
            </div>
            <div class="stat-item">
                <span>📊 Vitória</span>
                <span class="highlight">${winRate}%</span>
            </div>
            ${betMode ? `<div class="stat-item">
                <span>💰 Fichas</span>
                <span class="highlight chips">${virtualChips}</span>
            </div>` : ''}
            <div class="stat-item">
                <span>🎲 Total</span>
                <span>${totalRolls}</span>
            </div>
        </div>
    `;
    
    let dashboard = document.querySelector('.dashboard');
    if (!dashboard) {
        dashboard = document.createElement('div');
        dashboard.className = 'dashboard';
        document.querySelector('.score').after(dashboard);
    }
    dashboard.outerHTML = dashboardHTML;
    
    updateRollHistory();
}

function updateRollHistory() {
    const historyDiv = document.getElementById('rollHistory');
    if (!historyDiv) createHistoryPanel();
    
    const recentRolls = rollsHistory.slice(0, 15);
    let historyHTML = recentRolls.map(roll => {
        const resultClass = roll.result;
        const streakBadge = roll.streak > 2 ? ` 🔥${roll.streak}` : '';
        return `<div class="history-roll ${resultClass}">
            ${roll.player} vs ${roll.cpu}${streakBadge}
        </div>`;
    }).join('');
    
    document.getElementById('rollHistory').innerHTML = `
        <h4>📜 Últimos Lances</h4>
        <div class="history-list">${historyHTML}</div>
    `;
}

function createHistoryPanel() {
    const historyPanel = document.createElement('div');
    historyPanel.id = 'rollHistory';
    historyPanel.className = 'history-panel';
    document.querySelector('.dashboard').insertAdjacentElement('afterend', historyPanel);
}

function toggleBetMode() {
    betMode = !betMode;
    document.querySelector('.bet-toggle').textContent = betMode ? '💰 OFF' : '💰 ON';
    document.querySelector('.bet-toggle').classList.toggle('active', betMode);
}

function changeDiceMode(mode) {
    diceMode = mode;
    document.querySelectorAll('.dice-mode-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function resetGame() {
    playerWins = cpuWins = ties = 0;
    totalRolls = 0;
    currentStreak = 0;
    rollsHistory = [];
    virtualChips = 1000;
    
    document.getElementById('resultado').innerHTML = '';
    document.querySelector('.score')?.remove();
    document.querySelector('.dashboard')?.remove();
    document.getElementById('rollHistory')?.remove();
}