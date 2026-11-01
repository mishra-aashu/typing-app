/**
 * TypeForge - Interactive Mechanical Keyboard Controller
 */

class VisualKeyboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.keyMap = new Map();
    this.targetKey = null;
    this.layout = [
      // Row 1 (Numbers)
      [
        { key: '`', sub: '~', code: 'Backquote', finger: 'lp' },
        { key: '1', sub: '!', code: 'Digit1', finger: 'lp' },
        { key: '2', sub: '@', code: 'Digit2', finger: 'lr' },
        { key: '3', sub: '#', code: 'Digit3', finger: 'lm' },
        { key: '4', sub: '$', code: 'Digit4', finger: 'li' },
        { key: '5', sub: '%', code: 'Digit5', finger: 'li' },
        { key: '6', sub: '^', code: 'Digit6', finger: 'ri' },
        { key: '7', sub: '&', code: 'Digit7', finger: 'ri' },
        { key: '8', sub: '*', code: 'Digit8', finger: 'rm' },
        { key: '9', sub: '(', code: 'Digit9', finger: 'rr' },
        { key: '0', sub: ')', code: 'Digit0', finger: 'rp' },
        { key: '-', sub: '_', code: 'Minus', finger: 'rp' },
        { key: '=', sub: '+', code: 'Equal', finger: 'rp' },
        { key: 'Backspace', code: 'Backspace', class: 'key-backspace', finger: 'rp' },
      ],
      // Row 2 (Top Row)
      [
        { key: 'Tab', code: 'Tab', class: 'key-tab', finger: 'lp' },
        { key: 'Q', code: 'KeyQ', finger: 'lp' },
        { key: 'W', code: 'KeyW', finger: 'lr' },
        { key: 'E', code: 'KeyE', finger: 'lm' },
        { key: 'R', code: 'KeyR', finger: 'li' },
        { key: 'T', code: 'KeyT', finger: 'li' },
        { key: 'Y', code: 'KeyY', finger: 'ri' },
        { key: 'U', code: 'KeyU', finger: 'ri' },
        { key: 'I', code: 'KeyI', finger: 'rm' },
        { key: 'O', code: 'KeyO', finger: 'rr' },
        { key: 'P', code: 'KeyP', finger: 'rp' },
        { key: '[', sub: '{', code: 'BracketLeft', finger: 'rp' },
        { key: ']', sub: '}', code: 'BracketRight', finger: 'rp' },
        { key: '\\', sub: '|', code: 'Backslash', finger: 'rp' },
      ],
      // Row 3 (Home Row)
      [
        { key: 'Caps', code: 'CapsLock', class: 'key-caps', finger: 'lp' },
        { key: 'A', code: 'KeyA', finger: 'lp' },
        { key: 'S', code: 'KeyS', finger: 'lr' },
        { key: 'D', code: 'KeyD', finger: 'lm' },
        { key: 'F', code: 'KeyF', finger: 'li' },
        { key: 'G', code: 'KeyG', finger: 'li' },
        { key: 'H', code: 'KeyH', finger: 'ri' },
        { key: 'J', code: 'KeyJ', finger: 'ri' },
        { key: 'K', code: 'KeyK', finger: 'rm' },
        { key: 'L', code: 'KeyL', finger: 'rr' },
        { key: ';', sub: ':', code: 'Semicolon', finger: 'rp' },
        { key: "'", sub: '"', code: 'Quote', finger: 'rp' },
        { key: 'Enter', code: 'Enter', class: 'key-enter', finger: 'rp' },
      ],
      // Row 4 (Bottom Row)
      [
        { key: 'Shift', code: 'ShiftLeft', class: 'key-shift-l', finger: 'lp' },
        { key: 'Z', code: 'KeyZ', finger: 'lp' },
        { key: 'X', code: 'KeyX', finger: 'lr' },
        { key: 'C', code: 'KeyC', finger: 'lm' },
        { key: 'V', code: 'KeyV', finger: 'li' },
        { key: 'B', code: 'KeyB', finger: 'li' },
        { key: 'N', code: 'KeyN', finger: 'ri' },
        { key: 'M', code: 'KeyM', finger: 'ri' },
        { key: ',', sub: '<', code: 'Comma', finger: 'rm' },
        { key: '.', sub: '>', code: 'Period', finger: 'rr' },
        { key: '/', sub: '?', code: 'Slash', finger: 'rp' },
        { key: 'Shift', code: 'ShiftRight', class: 'key-shift-r', finger: 'rp' },
      ],
      // Row 5 (Space & Modifiers)
      [
        { key: 'Ctrl', code: 'ControlLeft', class: 'key-ctrl', finger: 'lp' },
        { key: 'Alt', code: 'AltLeft', class: 'key-alt', finger: 'th' },
        { key: 'Space', code: 'Space', class: 'key-space', finger: 'th' },
        { key: 'Alt', code: 'AltRight', class: 'key-alt', finger: 'th' },
        { key: 'Ctrl', code: 'ControlRight', class: 'key-ctrl', finger: 'rp' },
      ],
    ];

    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';

    this.layout.forEach(rowDef => {
      const rowEl = document.createElement('div');
      rowEl.className = 'kb-row';

      rowDef.forEach(item => {
        const keyEl = document.createElement('div');
        keyEl.className = `key ${item.class || ''}`;
        keyEl.dataset.code = item.code;
        keyEl.dataset.key = item.key.toLowerCase();
        if (item.sub) keyEl.dataset.sub = item.sub;
        if (item.finger) keyEl.dataset.finger = item.finger;

        let content = '';
        if (item.sub) {
          content += `<span class="key-sub-label">${item.sub}</span>`;
        }
        content += `<span class="key-label">${item.key}</span>`;
        keyEl.innerHTML = content;

        rowEl.appendChild(keyEl);
        this.keyMap.set(item.code, keyEl);
        this.keyMap.set(item.key.toLowerCase(), keyEl);
        if (item.sub) {
          this.keyMap.set(item.sub, keyEl);
        }
      });

      this.container.appendChild(rowEl);
    });
  }

  pressKey(code, key) {
    let el = this.keyMap.get(code);
    if (!el && key) {
      el = this.keyMap.get(key.toLowerCase());
    }
    if (el) {
      el.classList.add('pressed');
      setTimeout(() => {
        el.classList.remove('pressed');
      }, 140);
    }
  }

  setTargetKey(char) {
    // Clear previous target
    if (this.targetEl) {
      this.targetEl.classList.remove('target-key');
      this.targetEl = null;
    }

    if (!char) return;

    let targetCode = null;
    if (char === ' ') {
      targetCode = 'Space';
    } else {
      targetCode = char.toLowerCase();
    }

    let el = this.keyMap.get(targetCode);
    if (el) {
      el.classList.add('target-key');
      this.targetEl = el;
    }
  }

  applyHeatmap(heatmapData) {
    // Clear existing heat classes
    this.keyMap.forEach(el => {
      el.classList.remove('heat-low', 'heat-medium', 'heat-high');
    });

    if (!heatmapData) return;

    let maxError = 1;
    for (const count of Object.values(heatmapData)) {
      if (count > maxError) maxError = count;
    }

    for (const [char, count] of Object.entries(heatmapData)) {
      const el = this.keyMap.get(char.toLowerCase());
      if (el) {
        const ratio = count / maxError;
        if (ratio > 0.6) {
          el.classList.add('heat-high');
        } else if (ratio > 0.3) {
          el.classList.add('heat-medium');
        } else if (ratio > 0.05) {
          el.classList.add('heat-low');
        }
      }
    }
  }
}

window.VisualKeyboard = VisualKeyboard;
