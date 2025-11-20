document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('section');
    if (section) {
        section.animate(
            [
                { opacity: 0, transform: 'translateY(40px) scale(0.95)' },
                { opacity: 1, transform: 'translateY(0) scale(1)' }
            ],
            {
                duration: 700,
                easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
                fill: 'forwards'
            }
        );
    }

    const inputBoxes = document.querySelectorAll('.input-box');
    inputBoxes.forEach((box, index) => {
        box.animate(
            [
                { opacity: 0, transform: 'translateY(15px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ],
            {
                delay: 120 * index,
                duration: 480,
                easing: 'ease-out',
                fill: 'both'
            }
        );

        const input = box.querySelector('input');
        if (!input) return;
        input.addEventListener('focus', () => box.classList.add('glow'));
        input.addEventListener('blur', () => box.classList.remove('glow'));
    });

    const remember = document.querySelector('.remenber-forget');
    if (remember) {
        remember.animate(
            [
                { opacity: 0, transform: 'translateY(10px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ],
            { delay: 360, duration: 420, easing: 'ease-out', fill: 'both' }
        );
    }

    const button = document.querySelector('.login-btn');
    if (button) {
        button.animate(
            [
                { opacity: 0, transform: 'translateY(20px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ],
            { delay: 420, duration: 420, easing: 'ease-out', fill: 'both' }
        );

        button.addEventListener('mousemove', (event) => {
            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            button.style.setProperty('--glow-x', `${x}px`);
            button.style.setProperty('--glow-y', `${y}px`);
        });

        button.addEventListener('click', () => {
            button.animate(
                [
                    { transform: 'scale(1)' },
                    { transform: 'scale(0.96)' },
                    { transform: 'scale(1)' }
                ],
                { duration: 220, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
            );
        });
    }

    const register = document.querySelector('.registrer-link');
    if (register) {
        register.animate(
            [
                { opacity: 0, transform: 'translateY(8px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ],
            { delay: 520, duration: 420, easing: 'ease-out', fill: 'both' }
        );
    }
});
