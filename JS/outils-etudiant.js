// Animation d'entrée pour les cartes de ressources
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.resource-card');
    
    // Animation d'apparition progressive
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 50);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });

    // Effet de parallaxe léger sur le scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const sceneGlow = document.querySelector('.scene__glow');
        
        if (sceneGlow) {
            const speed = currentScroll * 0.1;
            sceneGlow.style.transform = `translateX(-50%) translateY(${speed}px)`;
        }
        
        lastScroll = currentScroll;
    });

    // Gestion du toggle de la sidebar mobile
    const toggleBtn = document.getElementById('toggleSidebar');
    const categoriesNav = document.getElementById('categoriesNav');
    const toolsContainer = document.querySelector('.tools-container');
    const categoryLinks = document.querySelectorAll('.category-link');

    if (toggleBtn && categoriesNav) {
        toggleBtn.addEventListener('click', () => {
            categoriesNav.classList.toggle('active');
            toggleBtn.classList.toggle('active');
            toolsContainer.classList.toggle('sidebar-shifted');
            document.body.classList.toggle('sidebar-open');
        });

        // Fermer la sidebar quand on clique sur un lien
        categoryLinks.forEach(link => {
            link.addEventListener('click', () => {
                categoriesNav.classList.remove('active');
                toggleBtn.classList.remove('active');
                toolsContainer.classList.remove('sidebar-shifted');
                document.body.classList.remove('sidebar-open');
            });
        });

        // Fermer la sidebar quand on clique en dehors
        document.addEventListener('click', (e) => {
            if (!categoriesNav.contains(e.target) && !toggleBtn.contains(e.target)) {
                categoriesNav.classList.remove('active');
                toggleBtn.classList.remove('active');
                toolsContainer.classList.remove('sidebar-shifted');
                document.body.classList.remove('sidebar-open');
            }
        });
    }

    // Gestion de la modale À propos
    const aboutBtn = document.getElementById('aboutBtn');
    const aboutModal = document.getElementById('aboutModal');
    const closeAboutBtn = document.getElementById('closeAboutBtn');
    const aboutCategoryLinks = document.querySelectorAll('.about-categories-grid a');

    if (aboutBtn && aboutModal) {
        aboutBtn.addEventListener('click', () => {
            aboutModal.classList.add('active');
            categoriesNav.classList.remove('active');
        });

        closeAboutBtn.addEventListener('click', () => {
            aboutModal.classList.remove('active');
        });

        // Fermer la modale en cliquant sur une catégorie
        aboutCategoryLinks.forEach(link => {
            link.addEventListener('click', () => {
                aboutModal.classList.remove('active');
            });
        });

        // Fermer la modale en cliquant en dehors
        aboutModal.addEventListener('click', (e) => {
            if (e.target === aboutModal) {
                aboutModal.classList.remove('active');
            }
        });

        // Fermer la modale avec la touche Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && aboutModal.classList.contains('active')) {
                aboutModal.classList.remove('active');
            }
        });
    }
});

