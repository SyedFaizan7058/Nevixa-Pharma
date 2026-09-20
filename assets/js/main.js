document.addEventListener('DOMContentLoaded', function () {
  var hamburger = document.getElementById('hamburger');
  var navbar = document.getElementById('navbar');

  if (hamburger && navbar) {
    function toggle() {
      navbar.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', navbar.classList.contains('active') ? 'true' : 'false');
    }

    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.addEventListener('click', toggle);
    hamburger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });

    navbar.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navbar.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Typewriter effect for Hero heading ("Innovation", "Quality", "Commitment")
  var typewriterEl = document.getElementById('nvxTypewriter');
  if (typewriterEl) {
    var words = ['Innovation', 'Quality', 'Commitment'];
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      typewriterEl.textContent = words[0];
    } else {
      var wordIdx = 0;
      var charIdx = words[0].length;
      var isDeleting = false;
      var timer = null;
      var isPaused = false;

      function step() {
        if (isPaused) return;

        var currentWord = words[wordIdx];

        if (isDeleting) {
          charIdx--;
          typewriterEl.textContent = currentWord.substring(0, charIdx);
          if (charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            timer = setTimeout(step, 300);
            return;
          }
          timer = setTimeout(step, 45);
        } else {
          charIdx++;
          typewriterEl.textContent = currentWord.substring(0, charIdx);
          if (charIdx === currentWord.length) {
            isDeleting = true;
            timer = setTimeout(step, 1500); // 1.5s pause on complete word
            return;
          }
          timer = setTimeout(step, 85);
        }
      }

      // Initial delay before deleting first word
      timer = setTimeout(function () {
        isDeleting = true;
        step();
      }, 1500);

      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          isPaused = true;
          if (timer) clearTimeout(timer);
        } else if (isPaused) {
          isPaused = false;
          step();
        }
      });
    }
  }
});
