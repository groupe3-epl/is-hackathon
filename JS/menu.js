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

// Vérification et affichage des informations utilisateur
function displayUserInfo() {
    const userData = localStorage.getItem('user');
    
    if (userData) {
        try {
            const user = JSON.parse(userData);
            
            // Afficher les informations dans la console
            console.log('Utilisateur connecté:', user);
            console.log('Email:', user.email);
            console.log('Nom:', user.name);
            console.log('Provider:', user.provider);
            
            // Créer ou mettre à jour l'affichage du profil dans le menu
            const navLinks = document.querySelector('.nav__links');
            if (navLinks) {
                // Vérifier si le profil utilisateur existe déjà
                let userProfile = document.querySelector('.user-profile');
                
                if (!userProfile) {
                    // Créer l'élément profil utilisateur
                    userProfile = document.createElement('li');
                    userProfile.className = 'user-profile';
                    userProfile.innerHTML = `
                        <div class="user-profile__container">
                            <img src="${user.picture || 'https://i.pravatar.cc/150'}" alt="${user.name}" class="user-profile__avatar">
                            <div class="user-profile__info">
                                <span class="user-profile__name">${user.name}</span>
                                <span class="user-profile__email">${user.email}</span>
                            </div>
                            <button class="user-profile__logout" title="Déconnexion">
                                <i class="fa-solid fa-sign-out-alt"></i>
                            </button>
                        </div>
                    `;
                    
                    // Insérer avant le dernier élément (bouton Démo/Inscription)
                    const lastItem = navLinks.querySelector('li:last-child');
                    if (lastItem) {
                        navLinks.insertBefore(userProfile, lastItem);
                    } else {
                        navLinks.appendChild(userProfile);
                    }
                    
                    // Ajouter les styles si nécessaire
                    if (!document.querySelector('#user-profile-styles')) {
                        const style = document.createElement('style');
                        style.id = 'user-profile-styles';
                        style.textContent = `
                            .user-profile {
                                margin-left: auto;
                                padding: 0 8px;
                            }
                            .user-profile__container {
                                display: flex;
                                align-items: center;
                                gap: 10px;
                                padding: 6px 12px;
                                border-radius: 20px;
                                background: rgba(255, 255, 255, 0.05);
                                border: 1px solid rgba(255, 255, 255, 0.1);
                            }
                            .user-profile__avatar {
                                width: 32px;
                                height: 32px;
                                border-radius: 50%;
                                object-fit: cover;
                                border: 2px solid rgba(83, 179, 255, 0.5);
                            }
                            .user-profile__info {
                                display: flex;
                                flex-direction: column;
                                gap: 2px;
                            }
                            .user-profile__name {
                                font-size: 0.85rem;
                                font-weight: 600;
                                color: var(--text);
                            }
                            .user-profile__email {
                                font-size: 0.7rem;
                                color: var(--muted);
                            }
                            .user-profile__logout {
                                background: none;
                                border: none;
                                color: var(--muted);
                                cursor: pointer;
                                padding: 4px;
                                font-size: 0.9rem;
                                transition: color 0.25s ease;
                            }
                            .user-profile__logout:hover {
                                color: #ff5757;
                            }
                            @media (max-width: 860px) {
                                .user-profile {
                                    margin-left: 0;
                                    width: 100%;
                                }
                                .user-profile__container {
                                    width: 100%;
                                    justify-content: space-between;
                                }
                            }
                        `;
                        document.head.appendChild(style);
                    }
                    
                    // Gestion de la déconnexion
                    const logoutBtn = userProfile.querySelector('.user-profile__logout');
                    if (logoutBtn) {
                        logoutBtn.addEventListener('click', () => {
                            if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
                                localStorage.removeItem('user');
                                window.location.href = 'protection.html';
                            }
                        });
                    }
                }
            }
            
            // Afficher un message de bienvenue dans le hero
            const heroContent = document.querySelector('.hero__content h1');
            if (heroContent && !heroContent.dataset.modified) {
                heroContent.textContent = `Bienvenue ${user.name} !`;
                heroContent.dataset.modified = 'true';
            }
            
        } catch (error) {
            console.error('Erreur lors de la lecture des données utilisateur:', error);
        }
    } else {
        console.log('Aucun utilisateur connecté');
    }
}

// Appeler la fonction au chargement de la page
displayUserInfo();

