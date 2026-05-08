export function createUI(root, onMove, onRetry) {
  const layer = document.createElement('div');
  layer.className = 'ui-layer';
  layer.innerHTML = `
    <div class="score">Score: <span id="scoreValue">0</span></div>
    <div class="instructions" id="intro">Use WASD / Arrow Keys</div>
    <div class="paused" id="paused">Paused</div>
    <div class="mobile-controls">
      <button class="up">▲</button><button class="left">◀</button><button class="down">▼</button><button class="right">▶</button>
    </div>
    <div class="modal" id="gameOverModal"><div class="panel"><h2>Game Over</h2><p>Final Score: <span id="finalScore">0</span></p><button id="retryBtn">Retry</button></div></div>`;
  root.append(layer);
  layer.querySelector('.up').onclick = () => onMove({ x: 0, z: 1 });
  layer.querySelector('.down').onclick = () => onMove({ x: 0, z: -1 });
  layer.querySelector('.left').onclick = () => onMove({ x: -1, z: 0 });
  layer.querySelector('.right').onclick = () => onMove({ x: 1, z: 0 });
  layer.querySelector('#retryBtn').onclick = onRetry;
  return {
    setScore(v) { layer.querySelector('#scoreValue').textContent = String(v); },
    hideIntro() { layer.querySelector('#intro').style.display = 'none'; },
    setPaused(v) { layer.querySelector('#paused').classList.toggle('show', v); },
    showGameOver(score) { layer.querySelector('#finalScore').textContent = String(score); layer.querySelector('#gameOverModal').classList.add('show'); },
    hideGameOver() { layer.querySelector('#gameOverModal').classList.remove('show'); }
  };
}
