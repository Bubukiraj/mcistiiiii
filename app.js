class KahootVideoGame {
  constructor() {
    this.playerName = 'Bajnok';
    this.quizPack = [];
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.correctCount = 0;

    this.gameState = 'LOBBY';

    this.timerDuration = 15;
    this.timerRemaining = 15;
    this.timerInterval = null;
    this.timeTickerInterval = null;
    this.hasAnswered = false;

    this.dom = {
      screenLobby: document.getElementById('screen-lobby'),
      screenArena: document.getElementById('screen-arena'),
      screenPodium: document.getElementById('screen-podium'),
      btnHome: document.getElementById('btn-home'),
      btnFullscreen: document.getElementById('btn-fullscreen'),
      btnOpenEditor: document.getElementById('btn-open-editor'),
      playerNickname: document.getElementById('player-nickname'),
      btnStartGame: document.getElementById('btn-start-game'),
      hudQuestionNumber: document.getElementById('hud-question-number'),
      hudTimerContainer: document.getElementById('hud-timer-container'),
      hudTimer: document.getElementById('hud-timer'),
      hudStreak: document.getElementById('hud-streak'),
      hudScore: document.getElementById('hud-score'),
      arenaTitle: document.getElementById('arena-question-title'),
      arenaHint: document.getElementById('arena-question-hint'),
      videoStage: document.getElementById('video-stage'),
      quizVideo: document.getElementById('quiz-video'),
      videoBadge: document.getElementById('video-badge'),
      videoBadgeIcon: document.getElementById('video-badge-icon'),
      videoBadgeText: document.getElementById('video-badge-text'),
      partIndicator: document.getElementById('part-indicator'),
      timelineProgress: document.getElementById('timeline-progress'),
      timerBox: document.getElementById('timer-box'),
      timerVal: document.getElementById('timer-val'),
      revealBanner: document.getElementById('reveal-banner'),
      revealIcon: document.getElementById('reveal-icon'),
      revealTitle: document.getElementById('reveal-title'),
      revealExplanation: document.getElementById('reveal-explanation'),
      btnNextQuestion: document.getElementById('btn-next-question'),
      cards: [
        document.getElementById('card-0'),
        document.getElementById('card-1'),
        document.getElementById('card-2'),
        document.getElementById('card-3')
      ].filter(Boolean),
      ansTexts: [
        document.getElementById('ans-text-0'),
        document.getElementById('ans-text-1'),
        document.getElementById('ans-text-2'),
        document.getElementById('ans-text-3')
      ].filter(Boolean),
      podiumWinnerName: document.getElementById('podium-winner-name'),
      statFinalScore: document.getElementById('stat-final-score'),
      statFinalAccuracy: document.getElementById('stat-final-accuracy'),
      statFinalStreak: document.getElementById('stat-final-streak'),
      btnReplay: document.getElementById('btn-replay'),
      modalEditor: document.getElementById('editor-modal'),
      btnCloseModal: document.getElementById('btn-close-modal'),
      editQuestionSelect: document.getElementById('edit-question-select'),
      editorQTitle: document.getElementById('editor-q-title'),
      editorQHint: document.getElementById('editor-q-hint'),
      editorAnswers: [
        document.getElementById('editor-ans-0'),
        document.getElementById('editor-ans-1'),
        document.getElementById('editor-ans-2'),
        document.getElementById('editor-ans-3')
      ].filter(Boolean),
      btnSaveEditedQuestion: document.getElementById('btn-save-edited-question')
    };

    this.init();
  }

  init() {
    this.initBackgroundParticles();
    this.initConfetti();
    this.loadQuizPack();
    this.bindEvents();
  }

  loadQuizPack() {
    if (typeof DEFAULT_QUIZ_PACK !== 'undefined' && Array.isArray(DEFAULT_QUIZ_PACK)) {
      this.quizPack = JSON.parse(JSON.stringify(DEFAULT_QUIZ_PACK));
    } else {
      this.quizPack = [];
    }
  }

  initBackgroundParticles() {
    const container = document.getElementById('bg-particles');
    if (!container) return;

    const symbols = ['▲', '◆', '●', '■', '★'];
    const colors = ['#e21b3c', '#1368ce', '#ffa602', '#26890c', '#a855f7'];

    for (let i = 0; i < 24; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.innerText = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.color = colors[Math.floor(Math.random() * colors.length)];
      p.style.fontSize = `${Math.floor(Math.random() * 26) + 16}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDuration = `${Math.random() * 14 + 12}s`;
      p.style.animationDelay = `${Math.random() * 8}s`;
      container.appendChild(p);
    }
  }

  initConfetti() {
    this.confettiCanvas = document.getElementById('confetti-canvas');
    if (!this.confettiCanvas) return;

    this.confettiCtx = this.confettiCanvas.getContext('2d');
    this.confettiParticles = [];

    const resize = () => {
      if (!this.confettiCanvas) return;
      this.confettiCanvas.width = window.innerWidth;
      this.confettiCanvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const loop = () => {
      this.updateConfetti();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  triggerConfetti(count = 70) {
    if (!this.confettiParticles) return;
    const colors = ['#e21b3c', '#1368ce', '#ffa602', '#26890c', '#ffffff', '#ff00c8'];
    for (let i = 0; i < count; i++) {
      this.confettiParticles.push({
        x: window.innerWidth * (0.3 + Math.random() * 0.4),
        y: window.innerHeight * 0.4,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 18,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        opacity: 1
      });
    }
  }

  updateConfetti() {
    if (!this.confettiCtx || !this.confettiCanvas) return;
    this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
    for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
      const p = this.confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4;
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.012;

      if (p.opacity <= 0 || p.y > this.confettiCanvas.height) {
        this.confettiParticles.splice(i, 1);
        continue;
      }

      this.confettiCtx.save();
      this.confettiCtx.translate(p.x, p.y);
      this.confettiCtx.rotate((p.rotation * Math.PI) / 180);
      this.confettiCtx.globalAlpha = p.opacity;
      this.confettiCtx.fillStyle = p.color;
      this.confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      this.confettiCtx.restore();
    }
  }

  bindEvents() {
    if (this.dom.btnHome) {
      this.dom.btnHome.addEventListener('click', () => this.switchScreen('screen-lobby'));
    }

    if (this.dom.btnFullscreen) {
      this.dom.btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
    }

    if (this.dom.btnOpenEditor) {
      this.dom.btnOpenEditor.addEventListener('click', () => this.openEditorModal());
    }

    if (this.dom.btnCloseModal) {
      this.dom.btnCloseModal.addEventListener('click', () => this.closeEditorModal());
    }

    if (this.dom.btnStartGame) {
      this.dom.btnStartGame.addEventListener('click', () => {
        if (window.soundEngine) {
          window.soundEngine.init();
          window.soundEngine.playClick();
        }
        this.startGame();
      });
    }

    this.dom.cards.forEach((card, idx) => {
      if (card) {
        card.addEventListener('click', () => this.handleAnswer(idx));
      }
    });

    if (this.dom.btnNextQuestion) {
      this.dom.btnNextQuestion.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playClick();
        this.nextQuestion();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (this.gameState === 'GUESSING') {
        const key = e.key.toUpperCase();
        if (key === '1' || key === 'A') this.handleAnswer(0);
        if (key === '2' || key === 'B') this.handleAnswer(1);
        if (key === '3' || key === 'C') this.handleAnswer(2);
        if (key === '4' || key === 'D') this.handleAnswer(3);
      } else if (this.gameState === 'PLAYING_PART2' || this.gameState === 'PART2_ENDED') {
        if (e.key === ' ' || e.key === 'Enter') {
          this.nextQuestion();
        }
      }
    });

    const vid = this.dom.quizVideo;
    if (vid) {
      vid.addEventListener('ended', () => {
        if (this.gameState === 'PLAYING_PART1') {
          const q = this.quizPack[this.currentIndex];
          this.triggerCliffhangerPhase(q);
        } else if (this.gameState === 'PLAYING_PART2') {
          this.gameState = 'PART2_ENDED';
          this.updateVideoBadge('🏁', 'Leleplezés befejeződött!', false);
          if (this.dom.btnNextQuestion) this.dom.btnNextQuestion.focus();
        }
      });

      vid.addEventListener('timeupdate', () => {
        if (vid.duration) {
          const progress = Math.min(100, Math.max(0, (vid.currentTime / vid.duration) * 100));
          if (this.dom.timelineProgress) {
            this.dom.timelineProgress.style.width = `${progress}%`;
          }

          if (this.gameState === 'PLAYING_PART1' && vid.currentTime >= vid.duration - 0.2) {
            vid.pause();
            const q = this.quizPack[this.currentIndex];
            this.triggerCliffhangerPhase(q);
          }
        }
      });
    }

    if (this.dom.btnReplay) {
      this.dom.btnReplay.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playClick();
        this.startGame();
      });
    }

    if (this.dom.editQuestionSelect) {
      this.dom.editQuestionSelect.addEventListener('change', (e) => {
        this.populateEditorForm(parseInt(e.target.value, 10));
      });
    }

    if (this.dom.btnSaveEditedQuestion) {
      this.dom.btnSaveEditedQuestion.addEventListener('click', () => {
        this.saveEditedQuestion();
      });
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  switchScreen(screenId) {
    [this.dom.screenLobby, this.dom.screenArena, this.dom.screenPodium].forEach(screen => {
      if (screen) screen.classList.remove('active');
    });
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
  }

  startGame() {
    this.loadQuizPack();

    if (this.dom.playerNickname && this.dom.playerNickname.value.trim()) {
      this.playerName = this.dom.playerNickname.value.trim();
    } else {
      this.playerName = 'Bajnok';
    }

    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.correctCount = 0;

    this.switchScreen('screen-arena');
    this.loadQuestion(this.currentIndex);
  }

  loadQuestion(index) {
    if (!this.quizPack || index >= this.quizPack.length) {
      this.showPodium();
      return;
    }

    this.gameState = 'PLAYING_PART1';
    this.hasAnswered = false;
    const q = this.quizPack[index];

    if (this.dom.hudQuestionNumber) {
      this.dom.hudQuestionNumber.innerText = `${index + 1} / ${this.quizPack.length}`;
    }
    if (this.dom.hudTimer) {
      this.dom.hudTimer.innerText = '⏱️ 15 mp';
    }
    if (this.dom.hudTimerContainer) {
      this.dom.hudTimerContainer.classList.remove('timer-urgent');
    }
    if (this.dom.hudScore) {
      this.dom.hudScore.innerText = this.score.toLocaleString();
    }
    this.updateStreakBadge();

    if (this.dom.arenaTitle) {
      this.dom.arenaTitle.innerText = q.title || `${index + 1}. Kérdés: Mit mond a videóban?`;
    }
    if (this.dom.arenaHint) {
      this.dom.arenaHint.innerText = q.hint || '';
    }

    this.dom.cards.forEach((card, idx) => {
      if (card) {
        card.disabled = true;
        card.classList.remove('selected', 'is-correct', 'is-dimmed');
      }
      if (this.dom.ansTexts[idx] && q.options && q.options[idx]) {
        this.dom.ansTexts[idx].innerText = q.options[idx].text;
      }
    });

    if (this.dom.revealBanner) {
      this.dom.revealBanner.classList.remove('show');
    }

    this.updateVideoBadge('🎬', `1. Rész: ${q.videoPart1}`, false);
    if (this.dom.partIndicator) {
      this.dom.partIndicator.innerText = `1. RÉSZ (KÉRDÉS: ${index + 1}/${this.quizPack.length})`;
      this.dom.partIndicator.classList.remove('reveal-mode');
    }

    const vid = this.dom.quizVideo;
    if (vid) {
      vid.pause();
      vid.src = q.videoPart1;
      vid.load();

      const startPlay = () => {
        vid.currentTime = 0;
        vid.muted = false;
        const p = vid.play();
        if (p !== undefined) {
          p.catch(() => {
            vid.muted = true;
            vid.play().catch(() => {});
          });
        }
      };

      if (vid.readyState >= 2) {
        startPlay();
      } else {
        vid.onloadedmetadata = () => {
          startPlay();
          vid.onloadedmetadata = null;
        };
      }
    }
  }

  triggerCliffhangerPhase(q) {
    if (this.gameState === 'GUESSING') return;
    this.gameState = 'GUESSING';

    this.updateVideoBadge('🛑', 'ÁLLJ! Mit mond a videóban? Tippelj!', true);
    if (window.soundEngine) window.soundEngine.playCliffhanger();

    this.dom.cards.forEach(card => {
      if (card) card.disabled = false;
    });

    this.startTimer(this.timerDuration, q);
  }

  startTimer(seconds, q) {
    clearInterval(this.timerInterval);
    clearInterval(this.timeTickerInterval);

    this.timerRemaining = seconds;
    if (this.dom.hudTimer) this.dom.hudTimer.innerText = `⏱️ ${this.timerRemaining} mp`;
    if (this.dom.hudTimerContainer) this.dom.hudTimerContainer.classList.remove('timer-urgent');

    this.timeTickerInterval = setInterval(() => {
      if (this.gameState !== 'GUESSING') {
        clearInterval(this.timeTickerInterval);
        return;
      }
      const pitch = this.timerRemaining <= 5 ? 1.4 : 1.0;
      if (window.soundEngine) window.soundEngine.playTick(pitch);
    }, 1000);

    const startTimeStamp = Date.now();

    this.timerInterval = setInterval(() => {
      const elapsed = (Date.now() - startTimeStamp) / 1000;
      this.timerRemaining = Math.max(0, seconds - elapsed);

      if (this.dom.hudTimer) {
        this.dom.hudTimer.innerText = `⏱️ ${Math.ceil(this.timerRemaining)} mp`;
      }

      if (this.timerRemaining <= 5 && this.dom.hudTimerContainer) {
        this.dom.hudTimerContainer.classList.add('timer-urgent');
      }

      if (this.timerRemaining <= 0) {
        clearInterval(this.timerInterval);
        clearInterval(this.timeTickerInterval);
        this.handleTimeout(q);
      }
    }, 100);
  }

  handleAnswer(selectedIndex) {
    if (this.gameState !== 'GUESSING' || this.hasAnswered) return;
    this.hasAnswered = true;

    clearInterval(this.timerInterval);
    clearInterval(this.timeTickerInterval);

    const q = this.quizPack[this.currentIndex];
    const isCorrect = (selectedIndex === q.correctIndex);

    if (this.dom.cards[selectedIndex]) {
      this.dom.cards[selectedIndex].classList.add('selected');
    }
    this.dom.cards.forEach((card, idx) => {
      if (!card) return;
      card.disabled = true;
      if (idx === q.correctIndex) {
        card.classList.add('is-correct');
      } else {
        card.classList.add('is-dimmed');
      }
    });

    let pointsEarned = 0;
    if (isCorrect) {
      this.correctCount++;
      this.streak++;
      if (this.streak > this.maxStreak) this.maxStreak = this.streak;

      const ratio = this.timerRemaining / this.timerDuration;
      const basePoints = Math.round(500 + 500 * ratio);
      const streakMultiplier = Math.min(2.5, 1 + (this.streak - 1) * 0.25);
      pointsEarned = Math.round(basePoints * streakMultiplier);

      this.score += pointsEarned;
      if (this.dom.hudScore) this.dom.hudScore.innerText = this.score.toLocaleString();

      if (window.soundEngine) window.soundEngine.playCorrect();
      this.triggerConfetti(60);

      if (this.streak >= 2 && window.soundEngine) {
        setTimeout(() => window.soundEngine.playStreak(), 400);
      }

      this.showRevealBanner(
        '🎉',
        `Helyes válasz! (+${pointsEarned} pont)`,
        q.explanation || 'Most indul a 2. videó a leleplezéssel!'
      );
    } else {
      this.streak = 0;
      if (window.soundEngine) window.soundEngine.playWrong();

      const correctText = (q.options && q.options[q.correctIndex]) ? q.options[q.correctIndex].text : '';
      this.showRevealBanner(
        '❌',
        `Sajnos nem talált! (0 pont)`,
        q.explanation || `A helyes válasz: ${correctText}`
      );
    }

    this.updateStreakBadge();

    this.playPart2Video(q);
  }

  handleTimeout(q) {
    if (this.hasAnswered) return;
    this.hasAnswered = true;

    this.streak = 0;
    this.updateStreakBadge();
    if (window.soundEngine) window.soundEngine.playTimesUp();

    this.dom.cards.forEach((card, idx) => {
      if (!card) return;
      card.disabled = true;
      if (idx === q.correctIndex) {
        card.classList.add('is-correct');
      } else {
        card.classList.add('is-dimmed');
      }
    });

    const correctText = (q.options && q.options[q.correctIndex]) ? q.options[q.correctIndex].text : '';
    this.showRevealBanner(
      '⏰',
      'Lejárt az idő!',
      q.explanation || `A helyes válasz: ${correctText}`
    );

    this.playPart2Video(q);
  }

  playPart2Video(q) {
    this.gameState = 'PLAYING_PART2';
    this.updateVideoBadge('✨', `2. Rész: ${q.videoPart2}`, false);
    if (this.dom.partIndicator) {
      this.dom.partIndicator.innerText = `2. RÉSZ (MEGOLDÁS: ${this.currentIndex + 1}/${this.quizPack.length})`;
      this.dom.partIndicator.classList.add('reveal-mode');
    }

    const vid = this.dom.quizVideo;
    if (vid) {
      vid.pause();
      vid.src = q.videoPart2;
      vid.load();

      const startPart2 = () => {
        vid.currentTime = 0;
        vid.muted = false;
        vid.play().catch(() => {
          vid.muted = true;
          vid.play().catch(() => {});
        });
      };

      if (vid.readyState >= 2) {
        startPart2();
      } else {
        vid.onloadedmetadata = () => {
          startPart2();
          vid.onloadedmetadata = null;
        };
      }
    }
  }

  showRevealBanner(icon, title, explanation) {
    if (this.dom.revealIcon) this.dom.revealIcon.innerText = icon;
    if (this.dom.revealTitle) this.dom.revealTitle.innerText = title;
    if (this.dom.revealExplanation) this.dom.revealExplanation.innerText = explanation;
    if (this.dom.revealBanner) this.dom.revealBanner.classList.add('show');
  }

  updateVideoBadge(icon, text, isAlert = false) {
    if (this.dom.videoBadgeIcon) this.dom.videoBadgeIcon.innerText = icon;
    if (this.dom.videoBadgeText) this.dom.videoBadgeText.innerText = text;
    if (this.dom.videoBadge) {
      if (isAlert) {
        this.dom.videoBadge.classList.add('paused');
      } else {
        this.dom.videoBadge.classList.remove('paused');
      }
    }
  }

  updateStreakBadge() {
    if (!this.dom.hudStreak) return;
    if (this.streak >= 2) {
      this.dom.hudStreak.innerText = `🔥 ${this.streak}x Széria!`;
      this.dom.hudStreak.style.display = 'inline-flex';
    } else {
      this.dom.hudStreak.style.display = 'none';
    }
  }

  nextQuestion() {
    this.currentIndex++;
    this.loadQuestion(this.currentIndex);
  }

  showPodium() {
    this.gameState = 'PODIUM';
    this.switchScreen('screen-podium');

    if (this.dom.podiumWinnerName) this.dom.podiumWinnerName.innerText = this.playerName;

    const total = this.quizPack.length || 1;
    const accuracy = Math.round((this.correctCount / total) * 100);
    if (this.dom.statFinalScore) this.dom.statFinalScore.innerText = this.score.toLocaleString();
    if (this.dom.statFinalAccuracy) this.dom.statFinalAccuracy.innerText = `${accuracy}%`;
    if (this.dom.statFinalStreak) this.dom.statFinalStreak.innerText = `${this.maxStreak} 🔥`;

    if (window.soundEngine) window.soundEngine.playPodiumFanfare();
    this.triggerConfetti(120);
    setTimeout(() => this.triggerConfetti(80), 800);
  }

  openEditorModal() {
    if (!this.dom.modalEditor) return;
    this.populateEditorForm(0);
    this.dom.modalEditor.classList.add('active');
  }

  closeEditorModal() {
    if (!this.dom.modalEditor) return;
    this.dom.modalEditor.classList.remove('active');
  }

  populateEditorForm(idx) {
    if (!this.dom.editQuestionSelect || !this.quizPack[idx]) return;
    this.dom.editQuestionSelect.value = idx.toString();
    const q = this.quizPack[idx];

    if (this.dom.editorQTitle) this.dom.editorQTitle.value = q.title || '';
    if (this.dom.editorQHint) this.dom.editorQHint.value = q.hint || '';

    this.dom.editorAnswers.forEach((inp, i) => {
      if (inp && q.options && q.options[i]) {
        inp.value = q.options[i].text;
      }
    });

    const radios = document.querySelectorAll('input[name="editor-correct"]');
    radios.forEach((r, i) => {
      r.checked = (i === q.correctIndex);
    });
  }

  saveEditedQuestion() {
    if (!this.dom.editQuestionSelect) return;
    const idx = parseInt(this.dom.editQuestionSelect.value, 10);
    const q = this.quizPack[idx];
    if (!q) return;

    if (this.dom.editorQTitle) q.title = this.dom.editorQTitle.value.trim();
    if (this.dom.editorQHint) q.hint = this.dom.editorQHint.value.trim();

    this.dom.editorAnswers.forEach((inp, i) => {
      if (inp && q.options && q.options[i]) {
        q.options[i].text = inp.value.trim();
      }
    });

    const correctRadio = document.querySelector('input[name="editor-correct"]:checked');
    if (correctRadio) {
      q.correctIndex = parseInt(correctRadio.value, 10);
    }

    alert(`✅ A(z) ${idx + 1}. videó kérdése és válaszai sikeresen elmentve!`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.gameApp = new KahootVideoGame();
});
