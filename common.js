/* ===== Common JavaScript for Article Pages ===== */
/* Requires: each page defines PAGE_CONFIG with accent, quizName, storagePrefix */

(function() {
  const cfg = window.PAGE_CONFIG || {};

  // ===== Navigation =====
  const sidebar = document.getElementById('sidebar');
  const navToggle = document.getElementById('nav-toggle');
  if (navToggle && sidebar) {
    function showOverlay() {
      let overlay = document.getElementById('sidebar-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'sidebar-overlay';
        sidebar.parentNode.insertBefore(overlay, sidebar);
      }
      overlay.classList.add('visible');
    }
    function hideOverlay() {
      const overlay = document.getElementById('sidebar-overlay');
      if (overlay) overlay.classList.remove('visible');
    }
    navToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      const isOpen = sidebar.classList.contains('open');
      navToggle.classList.toggle('hidden', isOpen);
      isOpen ? showOverlay() : hideOverlay();
    });
    sidebar.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        sidebar.classList.remove('open');
        setTimeout(() => navToggle.classList.remove('hidden'), 300);
        hideOverlay();
      });
    });
    document.addEventListener('click', e => {
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== navToggle) {
        sidebar.classList.remove('open');
        setTimeout(() => navToggle.classList.remove('hidden'), 300);
        hideOverlay();
      }
    });
  }

  // ===== Scroll spy =====
  const sections = document.querySelectorAll('.section');
  const navLinks = sidebar ? sidebar.querySelectorAll('a') : [];
  function updateNav() {
    let current = 'hero';
    sections.forEach(s => {
      if (s.getBoundingClientRect().top < 200) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', updateNav, { passive: true });

  // ===== Progress bar =====
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      progressBar.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  // ===== Fade in on scroll =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  sections.forEach(s => observer.observe(s));

  // ===== Tooltip for highlighted words =====
  const tooltip = document.getElementById('tooltip');
  if (tooltip) {
    let activeTipEl = null;
    function showTip(el, pageOffset) {
      const text = el.getAttribute('data-tip');
      if (!text) return;
      tooltip.textContent = text;
      tooltip.classList.add('show');
      const rect = el.getBoundingClientRect();
      let left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
      let top = rect.top - tooltip.offsetHeight - 10 + pageOffset;
      const vw = window.innerWidth;
      if (left < 8) left = 8;
      if (left + tooltip.offsetWidth > vw - 8) left = vw - tooltip.offsetWidth - 8;
      if (top < pageOffset + 8) top = rect.bottom + pageOffset + 10;
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
      activeTipEl = el;
    }
    function hideTip() {
      tooltip.classList.remove('show');
      activeTipEl = null;
    }
    document.querySelectorAll('.hl').forEach(el => {
      // Desktop only: hover (skip on touch)
      el.addEventListener('mouseenter', (e) => {
        if (e.pointerType === 'touch') return;
        showTip(el, 0);
      });
      el.addEventListener('mouseleave', () => { if (activeTipEl === el) hideTip(); });
      // Touch: toggle on tap
      el.addEventListener('click', (e) => {
        e.preventDefault();
        if (activeTipEl === el) { hideTip(); return; }
        showTip(el, window.scrollY);
      });
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (activeTipEl === el) { hideTip(); return; }
          showTip(el, window.scrollY);
        }
      });
    });
    // Tap outside to close tooltip on touch devices
    document.addEventListener('click', (e) => {
      if (activeTipEl && !e.target.classList.contains('hl')) hideTip();
    });
  }

  // ===== Mini quizzes =====
  document.querySelectorAll('.mini-quiz').forEach(quiz => {
    quiz.querySelectorAll('.opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (quiz.classList.contains('answered')) return;
        quiz.classList.add('answered');
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        btn.classList.add(isCorrect ? 'correct' : 'wrong');
        quiz.querySelectorAll('.opt-btn').forEach(b => {
          b.classList.add('disabled');
          if (b.getAttribute('data-correct') === 'true') b.classList.add('correct');
        });
        quiz.querySelector('.explanation').classList.add('show');
      });
    });
  });

  // ===== Find the device game =====
  document.querySelectorAll('.find-game .sentence').forEach(row => {
    row.querySelectorAll('.device-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (row.classList.contains('answered')) return;
        const answer = row.getAttribute('data-answer');
        const chosen = btn.getAttribute('data-answer');
        row.classList.add('answered');
        if (chosen === answer) {
          btn.classList.add('correct');
        } else {
          btn.classList.add('wrong');
          row.querySelectorAll('.device-btn').forEach(b => {
            if (b.getAttribute('data-answer') === answer) b.classList.add('correct');
          });
        }
        row.querySelectorAll('.device-btn').forEach(b => b.classList.add('disabled'));
      });
    });
  });

  // ===== Notes saving =====
  document.querySelectorAll('.notes-area').forEach(area => {
    const textarea = area.querySelector('textarea');
    const saveBtn = area.querySelector('.save-btn');
    const savedMsg = area.querySelector('.saved-msg');
    const key = (cfg.storagePrefix || 'note_') + area.dataset.key;
    try {
      const saved = localStorage.getItem(key);
      if (saved && textarea) textarea.value = saved;
    } catch { /* localStorage unavailable */ }
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (!textarea) return;
        try { localStorage.setItem(key, textarea.value); } catch { /* unavailable */ }
        if (savedMsg) {
          savedMsg.classList.add('show');
          setTimeout(() => savedMsg.classList.remove('show'), 2000);
        }
      });
    }
  });

  // ===== Final quiz =====
  let quizScore = 0;
  let quizAnswered = 0;
  const totalQuiz = document.querySelectorAll('#quiz-container .quiz-item').length;

  document.querySelectorAll('#quiz-container .quiz-item').forEach(item => {
    item.querySelectorAll('.q-opt').forEach(opt => {
      opt.setAttribute('tabindex', '0');
      opt.setAttribute('role', 'button');
      opt.addEventListener('click', () => {
        if (item.classList.contains('answered')) return;
        item.classList.add('answered');
        const isCorrect = opt.getAttribute('data-correct') === 'true';
        opt.classList.add(isCorrect ? 'correct' : 'wrong');
        item.querySelector('.q-explain').classList.add('show');
        if (isCorrect) quizScore++;
        item.querySelectorAll('.q-opt').forEach(o => {
          o.classList.add('disabled');
          if (o.getAttribute('data-correct') === 'true') o.classList.add('correct');
        });
        quizAnswered++;
        if (quizAnswered === totalQuiz) {
          showQuizResult();
        }
      });
      opt.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          opt.click();
        }
      });
    });
  });

  function showQuizResult() {
    const result = document.getElementById('quiz-result');
    const scoreEl = document.getElementById('quiz-score');
    const msgEl = document.getElementById('quiz-msg');
    if (!result) return;
    result.style.display = 'block';
    scoreEl.textContent = quizScore + ' / ' + totalQuiz;
    const name = cfg.quizName || '这篇文章';
    if (quizScore === totalQuiz) {
      msgEl.textContent = '🎉 满分！你对《' + name + '》的理解非常棒！';
    } else if (quizScore >= totalQuiz * 0.7) {
      msgEl.textContent = '👍 很不错！再看看错题，加深理解吧！';
    } else {
      msgEl.textContent = '💪 继续加油！回头再看看课文吧！';
    }
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function resetQuiz() {
    quizScore = 0;
    quizAnswered = 0;
    const result = document.getElementById('quiz-result');
    if (!result) return;
    result.style.display = 'none';
    document.querySelectorAll('#quiz-container .quiz-item').forEach(item => {
      item.classList.remove('answered');
      item.querySelector('.q-explain').classList.remove('show');
      item.querySelectorAll('.q-opt').forEach(o => {
        o.classList.remove('correct', 'wrong', 'disabled');
      });
    });
  }
  const btnReset = document.getElementById('btn-reset-quiz');
  if (btnReset) btnReset.addEventListener('click', resetQuiz);

  // ===== 延伸阅读展开/折叠 =====
  document.querySelectorAll('.extend-card-header').forEach(header => {
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'button');
    header.addEventListener('click', () => {
      header.parentElement.classList.toggle('open');
    });
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.parentElement.classList.toggle('open');
      }
    });
  });

  // ===== Bar chart animation =====
  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill').forEach(bar => {
          const w = bar.style.width;
          bar.style.width = '0%';
          setTimeout(() => { bar.style.width = w; }, 100);
        });
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.chart-bar-container, .mood-chart').forEach(c => chartObserver.observe(c));

})();
