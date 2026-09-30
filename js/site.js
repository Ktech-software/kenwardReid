// Site behaviour: mobile nav, before/after reveal, footer year.
// Kept in a file (not inline) so the Content-Security-Policy can use script-src 'self'.
(function () {
    'use strict';

    // Mobile nav
    var toggle = document.querySelector('.nav__toggle');
    var menu = document.getElementById('nav-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            var open = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!open));
            if (open) {
                menu.removeAttribute('data-open');
            } else {
                menu.setAttribute('data-open', '');
            }
        });

        // Collapse after picking a destination
        menu.addEventListener('click', function (e) {
            if (e.target.closest('a')) {
                toggle.setAttribute('aria-expanded', 'false');
                menu.removeAttribute('data-open');
            }
        });
    }

    // Before/after reveal. The range input owns the value, so drag,
    // keyboard, and assistive tech all work without extra handling.
    document.querySelectorAll('[data-ba]').forEach(function (figure) {
        var range = figure.querySelector('.ba__range');
        if (!range) return;

        var paint = function () {
            figure.style.setProperty('--pos', range.value + '%');
        };

        range.addEventListener('input', paint);
        paint();
    });

    // Keep the copyright honest without editing the file each January
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
})();
