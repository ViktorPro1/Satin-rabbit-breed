/**
 * script.js — Satin Rabbit Landing
 * Функціонал:
 *  1. Навігація: фіксований nav зі зміною фону при скролі
 *  2. Мобільне меню (бургер)
 *  3. Плавне підсвічування активного пункту меню
 *  4. FAQ акордеон (доступний, aria)
 *  5. Reveal-анімації при скролі (IntersectionObserver)
 *  6. Кнопка "Повернутися вгору"
 *  7. Плавний скрол по якорях (з урахуванням висоти навбару)
 */

(function () {
    'use strict';

    /* ─── DOM ─────────────────────────────────── */
    const nav = document.querySelector('.nav');
    const burger = document.getElementById('navBurger');
    const navLinks = document.getElementById('navLinks');
    const backToTop = document.getElementById('backToTop');
    const faqItems = document.querySelectorAll('.faq-item');
    const revealEls = document.querySelectorAll('.reveal');
    const allAnchors = document.querySelectorAll('a[href^="#"]');

    /* ═══════════════════════════════════════════
       1. NAVBAR — scroll styling
    ═══════════════════════════════════════════ */
    function onScroll() {
        const scrolled = window.scrollY > 60;
        nav.classList.toggle('scrolled', scrolled);
        backToTop.classList.toggle('visible', window.scrollY > 400);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial call

    /* ═══════════════════════════════════════════
       2. MOBILE MENU (burger)
    ═══════════════════════════════════════════ */
    function closeMenu() {
        burger.classList.remove('open');
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    function openMenu() {
        burger.classList.add('open');
        navLinks.classList.add('open');
        burger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-controls', 'navLinks');

    burger.addEventListener('click', () => {
        const isOpen = burger.classList.contains('open');
        isOpen ? closeMenu() : openMenu();
    });

    // Закриваємо меню при кліку на посилання
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Закриваємо меню при кліку поза ним
    document.addEventListener('click', (e) => {
        if (
            navLinks.classList.contains('open') &&
            !navLinks.contains(e.target) &&
            !burger.contains(e.target)
        ) {
            closeMenu();
        }
    });

    // Закриваємо меню при Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
            closeMenu();
            burger.focus();
        }
    });

    /* ═══════════════════════════════════════════
       3. ACTIVE NAV LINK (підсвічування секції)
    ═══════════════════════════════════════════ */
    const sections = document.querySelectorAll('section[id], header[id]');

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.querySelectorAll('a').forEach(a => {
                        const href = a.getAttribute('href');
                        a.classList.toggle('active', href === `#${id}`);
                    });
                }
            });
        },
        { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach(s => sectionObserver.observe(s));

    /* ═══════════════════════════════════════════
       4. FAQ ACCORDION
    ═══════════════════════════════════════════ */
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-item__question');
        const answer = item.querySelector('.faq-item__answer');

        // Початковий стан
        answer.style.maxHeight = '0px';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height .38s cubic-bezier(.25,.46,.45,.94), padding .38s ease';
        answer.removeAttribute('hidden');

        btn.addEventListener('click', () => {
            const isOpen = btn.getAttribute('aria-expanded') === 'true';

            // Закриваємо всі інші
            faqItems.forEach(other => {
                if (other !== item) {
                    const otherBtn = other.querySelector('.faq-item__question');
                    const otherAnswer = other.querySelector('.faq-item__answer');
                    otherBtn.setAttribute('aria-expanded', 'false');
                    otherAnswer.style.maxHeight = '0px';
                }
            });

            // Перемикаємо поточний
            if (isOpen) {
                btn.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = '0px';
            } else {
                btn.setAttribute('aria-expanded', 'true');
                // Встановлюємо точну висоту для плавної анімації
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    /* ═══════════════════════════════════════════
       5. REVEAL ANIMATIONS (IntersectionObserver)
    ═══════════════════════════════════════════ */
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Невелика затримка для кожного елемента в групі
                    const delay = Math.min(i * 80, 300);
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => revealObserver.observe(el));

    /* ═══════════════════════════════════════════
       6. BACK TO TOP
    ═══════════════════════════════════════════ */
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ═══════════════════════════════════════════
       7. ПЛАВНИЙ СКРОЛ ПО ЯКОРЯХ
          З урахуванням висоти навбару
    ═══════════════════════════════════════════ */
    allAnchors.forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const navHeight = nav.offsetHeight;
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;

            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ═══════════════════════════════════════════
       ДОДАТКОВО: Stagger-анімація для карток у сітках
       (spec-card, care-card, color-card)
    ═══════════════════════════════════════════ */
    const gridObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = entry.target.children;
                    Array.from(cards).forEach((card, i) => {
                        card.style.transitionDelay = `${i * 60}ms`;
                        card.classList.add('visible');
                    });
                    gridObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08 }
    );

    // Застосовуємо до сіток карток
    document.querySelectorAll('.specs-grid, .care-grid, .colors-grid').forEach(grid => {
        // Спочатку ховаємо всі дочірні картки
        Array.from(grid.children).forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(24px)';
            card.style.transition = 'opacity .45s ease, transform .45s ease';
        });
        gridObserver.observe(grid);
    });

    // Коли картка стає visible — знімаємо offset
    const cardVisibleObserver = new MutationObserver(() => { });
    document.querySelectorAll('.specs-grid > *, .care-grid > *, .colors-grid > *').forEach(card => {
        card.classList.add = ((origAdd) => function (...args) {
            origAdd.apply(this, args);
            if (args.includes('visible')) {
                card.style.opacity = '1';
                card.style.transform = 'none';
            }
        })(card.classList.add);
    });

    /* ─── Виправлена версія stagger через прямий observer ─── */
    const staggerObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = Array.from(entry.target.children);
                    cards.forEach((card, i) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'none';
                        }, i * 65);
                    });
                    staggerObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.07 }
    );

    document.querySelectorAll('.specs-grid, .care-grid, .colors-grid').forEach(grid => {
        staggerObserver.observe(grid);
    });

})();