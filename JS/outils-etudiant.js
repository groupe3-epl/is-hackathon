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
});

