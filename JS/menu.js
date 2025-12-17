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

// Animations pour les cartes de jeux
const gameCards = document.querySelectorAll('.game-card');
if (gameCards.length > 0 && !isReducedMotion) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.animate(
                    [
                        { opacity: 0, transform: 'translateY(30px) scale(0.95)' },
                        { opacity: 1, transform: 'translateY(0) scale(1)' }
                    ],
                    {
                        delay: (index % 5) * 100,
                        duration: 500,
                        easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
                        fill: 'both'
                    }
                );
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    gameCards.forEach((card) => observer.observe(card));
}

// Interaction au clic sur les boutons play
document.querySelectorAll('.game-card__play').forEach((button) => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        button.animate(
            [
                { transform: 'scale(1)' },
                { transform: 'scale(0.9)' },
                { transform: 'scale(1.1)' },
                { transform: 'scale(1)' }
            ],
            { duration: 300, easing: 'ease-out' }
        );
    });
});

// Vérification des informations utilisateur (sans affichage dans le menu)
function displayUserInfo() {
    const userData = localStorage.getItem('user');
    
    if (userData) {
        try {
            const user = JSON.parse(userData);
            
            // Afficher les informations dans la console uniquement
            console.log('Utilisateur connecté:', user);
            console.log('Email:', user.email);
            console.log('Nom:', user.name);
            console.log('Provider:', user.provider);
            
            // Ne pas afficher le profil dans le menu (photo et email retirés)
            
        } catch (error) {
            console.error('Erreur lors de la lecture des données utilisateur:', error);
        }
    } else {
        console.log('Aucun utilisateur connecté');

    }
}

// Appeler la fonction au chargement de la page
displayUserInfo();

