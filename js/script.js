(function (window, document) {
  'use strict';

  var header = document.getElementById('header');
  var splash = document.getElementById('splash');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lastScrollY = window.pageYOffset || 0;

  function showHeader() {
    if (!header) {
      return;
    }
    header.classList.remove('UpMove');
    header.classList.add('DownMove');
  }

  function updateHeader() {
    var currentScrollY;
    var expandedMenu;

    if (!header || reduceMotion) {
      return;
    }

    currentScrollY = window.pageYOffset || 0;
    expandedMenu = header.querySelector('.navbar-collapse.in');

    if (expandedMenu || currentScrollY < 120 || currentScrollY < lastScrollY) {
      showHeader();
    } else if (currentScrollY > lastScrollY) {
      header.classList.remove('DownMove');
      header.classList.add('UpMove');
    }

    lastScrollY = currentScrollY;
  }

  function initSplash() {
    var splashText = document.getElementById('splash_text');
    var duration = 1400;
    var startTime;

    if (!splash || reduceMotion) {
      return;
    }

    splash.classList.add('is-active');
    splash.style.setProperty('--splash-progress', '0%');

    if (splashText) {
      splashText.textContent = '0 %';
    }

    function updateSplash(timestamp) {
      var progress;

      if (!startTime) {
        startTime = timestamp;
      }

      progress = Math.min((timestamp - startTime) / duration, 1);
      splash.style.setProperty('--splash-progress', Math.round(progress * 100) + '%');

      if (splashText) {
        splashText.textContent = Math.round(progress * 100) + ' %';
      }

      if (progress < 1) {
        window.requestAnimationFrame(updateSplash);
        return;
      }

      window.setTimeout(function () {
        splash.classList.add('is-fading');

        window.setTimeout(function () {
          splash.classList.remove('is-active', 'is-fading');
          splash.style.removeProperty('--splash-progress');

          if (splashText) {
            splashText.textContent = 'Loading';
          }
        }, 400);
      }, 700);
    }

    window.requestAnimationFrame(updateSplash);
  }

  function initNavigation() {
    if (!header) {
      return;
    }

    header.addEventListener('focusin', showHeader);
    header.addEventListener('mouseenter', showHeader);
    window.addEventListener('scroll', updateHeader, { passive: true });

    Array.prototype.forEach.call(
      header.querySelectorAll('[data-toggle="collapse"]'),
      function (toggle) {
        toggle.addEventListener('click', showHeader);
      }
    );
  }

  function initSkipLinks() {
    Array.prototype.forEach.call(
      document.querySelectorAll('.skip-link'),
      function (skipLink) {
        skipLink.addEventListener('click', function () {
          var targetId = skipLink.getAttribute('href');
          var target = targetId && targetId.charAt(0) === '#'
            ? document.getElementById(targetId.slice(1))
            : null;

          if (target) {
            window.setTimeout(function () {
              target.focus();
            }, 0);
          }
        });
      }
    );
  }

  function init() {
    initSplash();
    initNavigation();
    initSkipLinks();
    showHeader();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}(window, document));
