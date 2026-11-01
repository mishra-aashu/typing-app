/**
 * TypeForge - Stats, Canvas Charting & Achievements Visualizer
 */

class StatsManager {
  constructor() {
    this.stats = null;
  }

  async fetchStats() {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        this.stats = await res.json();
        return this.stats;
      }
    } catch (err) {
      console.warn('Could not fetch stats from backend:', err);
    }
    return null;
  }

  async resetStats() {
    try {
      const res = await fetch('/api/stats/reset', { method: 'POST' });
      if (res.ok) {
        this.stats = await res.json();
        return this.stats;
      }
    } catch (err) {
      console.error('Failed to reset stats:', err);
    }
    return null;
  }

  drawSpeedChart(canvasId, wpmGraphData) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    if (!wpmGraphData || wpmGraphData.length < 2) {
      ctx.fillStyle = '#64748b';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Typing speed curve will appear here after completion', width / 2, height / 2);
      return;
    }

    const padding = { top: 20, right: 30, bottom: 30, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Determine scale limits
    let maxWpm = Math.max(...wpmGraphData.map(d => Math.max(d.wpm, d.raw_wpm || d.wpm)));
    maxWpm = Math.max(maxWpm + 10, 40);
    const maxSec = Math.max(wpmGraphData[wpmGraphData.length - 1].seconds, 1.0);

    const getX = (sec) => padding.left + (sec / maxSec) * chartW;
    const getY = (wpm) => padding.top + chartH - (wpm / maxWpm) * chartH;

    // Draw horizontal grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right';

    const step = maxWpm > 100 ? 25 : 20;
    for (let w = 0; w <= maxWpm; w += step) {
      const y = getY(w);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.fillText(`${w}`, padding.left - 8, y + 3);
    }

    // Gradient fill under the Net WPM curve
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, 'rgba(121, 82, 255, 0.45)');
    gradient.addColorStop(1, 'rgba(121, 82, 255, 0.0)');

    ctx.beginPath();
    ctx.moveTo(getX(wpmGraphData[0].seconds), getY(0));
    wpmGraphData.forEach(d => {
      ctx.lineTo(getX(d.seconds), getY(d.wpm));
    });
    ctx.lineTo(getX(wpmGraphData[wpmGraphData.length - 1].seconds), getY(0));
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw Raw WPM Line (dashed cyan)
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.6)';
    ctx.lineWidth = 2;
    wpmGraphData.forEach((d, i) => {
      const x = getX(d.seconds);
      const y = getY(d.raw_wpm || d.wpm);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // Draw Net WPM Main Line (electric violet solid)
    ctx.beginPath();
    ctx.strokeStyle = '#7952ff';
    ctx.lineWidth = 3;
    wpmGraphData.forEach((d, i) => {
      const x = getX(d.seconds);
      const y = getY(d.wpm);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Data points & error dots
    wpmGraphData.forEach(d => {
      const x = getX(d.seconds);
      const y = getY(d.wpm);

      // Primary Point
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.strokeStyle = '#7952ff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Error marker
      if (d.errors > 0) {
        ctx.beginPath();
        ctx.arc(x, y - 8, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#f43f5e';
        ctx.fill();
      }
    });

    // Time Axis Label
    ctx.textAlign = 'center';
    ctx.fillText(`${maxSec.toFixed(1)}s`, width - padding.right, height - 10);
    ctx.fillText('0s', padding.left, height - 10);
  }

  renderAchievementsList(containerId, achievements) {
    const container = document.getElementById(containerId);
    if (!container || !achievements) return;
    container.innerHTML = '';

    achievements.forEach(ach => {
      const card = document.createElement('div');
      card.className = `achievement-card ${ach.unlocked ? 'unlocked' : ''}`;

      card.innerHTML = `
        <div class="achievement-icon">${ach.icon}</div>
        <div class="achievement-details">
          <div class="achievement-name">${ach.title}</div>
          <div class="achievement-desc">${ach.description}</div>
          ${ach.unlocked ? '<div style="font-size:0.65rem; color:#10b981; margin-top:2px;">✔ Unlocked</div>' : ''}
        </div>
      `;

      container.appendChild(card);
    });
  }
}

window.StatsManager = StatsManager;
