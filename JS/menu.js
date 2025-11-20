const toggleButton = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
const indicator = document.querySelector('.nav__indicator');
const nav = document.querySelector('.nav');
const links = document.querySelectorAll('.nav__links a');

const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const setIndicatorPosition = (activeLink) => {
    if (!indicator || !activeLink || window.innerWidth <= 860) return;
    const { left, width } = activeLink.getBoundingClientRect();
    const parentLeft = navLinks.getBoundingClientRect().left;
    indicator.style.setProperty('--indicator-x', `${left - parentLeft}px`);
    indicator.style.setProperty('--indicator-width', `${width}px`);
    navLinks.dataset.hasActive = 'true';
};

const closeMenu = () => {
    toggleButton?.classList.remove('is-open');
    navLinks?.classList.remove('is-open');
    if (toggleButton) {
        toggleButton.ariaExpanded = 'false';
    }
};

if (toggleButton && navLinks) {
    toggleButton.addEventListener('click', () => {
        toggleButton.classList.toggle('is-open');
        navLinks.classList.toggle('is-open');
        toggleButton.ariaExpanded = toggleButton.classList.contains('is-open').toString();
    });

    navLinks.addEventListener('click', (event) => {
        if (event.target.closest('a')) closeMenu();
    });
}

links.forEach((link, index) => {
    if (!isReducedMotion) {
        link.animate(
            [
                { opacity: 0, transform: 'translateY(12px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ],
            {
                delay: index * 90 + 120,
                duration: 380,
                easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
                fill: 'both'
            }
        );
    }

    link.addEventListener('mouseenter', () => setIndicatorPosition(link));
    link.addEventListener('focus', () => setIndicatorPosition(link));

    link.addEventListener('click', () => {
        links.forEach((item) => item.classList.remove('is-active'));
        link.classList.add('is-active');
        setIndicatorPosition(link);
    });
});

const updateNavOnScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 20);
};

window.addEventListener('scroll', updateNavOnScroll);
updateNavOnScroll();

const activeLink = document.querySelector('.nav__links a.is-active');
setIndicatorPosition(activeLink);

window.addEventListener('resize', () => setIndicatorPosition(document.querySelector('.nav__links a.is-active')));

