document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const strengthBar = document.querySelector('.strength-bar');
    const submitButton = form.querySelector('.signup-btn');
    const successMessage = document.getElementById('success-message');

    // Animation d'entrée
    const container = document.querySelector('.signup-container');
    if (container) {
        container.animate(
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

    // Animation des champs
    inputs.forEach((input, index) => {
        const box = input.closest('.input-box');
        if (box) {
            box.animate(
                [
                    { opacity: 0, transform: 'translateY(15px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ],
                {
                    delay: 100 * index,
                    duration: 480,
                    easing: 'ease-out',
                    fill: 'both'
                }
            );
        }

        // Effet glow au focus
        input.addEventListener('focus', () => {
            box.classList.add('glow');
        });

        input.addEventListener('blur', () => {
            box.classList.remove('glow');
            validateField(input);
        });

        input.addEventListener('input', () => {
            clearError(input);
            if (input === passwordInput) {
                checkPasswordStrength(input.value);
            }
        });
    });

    // Toggle password visibility
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.closest('.input-box').querySelector('input[type="password"]');
            const icon = button.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Vérification de la force du mot de passe
    function checkPasswordStrength(password) {
        if (!strengthBar) return;
        
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;

        strengthBar.className = 'strength-bar';
        if (password.length === 0) {
            strengthBar.style.width = '0%';
        } else if (strength <= 1) {
            strengthBar.classList.add('weak');
        } else if (strength <= 2) {
            strengthBar.classList.add('medium');
        } else {
            strengthBar.classList.add('strong');
        }
    }

    // Validation des champs
    function validateField(input) {
        const box = input.closest('.input-box');
        const errorSpan = box.querySelector('.error-message');
        let isValid = true;
        let errorText = '';

        // Validation spécifique selon le type
        if (input.id === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                errorText = 'Adresse e-mail invalide';
            }
        }

        if (input.id === 'password') {
            if (input.value.length < 8) {
                isValid = false;
                errorText = 'Le mot de passe doit contenir au moins 8 caractères';
            }
        }

        if (input.id === 'confirm-password') {
            if (input.value !== passwordInput.value) {
                isValid = false;
                errorText = 'Les mots de passe ne correspondent pas';
            }
        }

        if (input.id === 'username') {
            const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
            if (!usernameRegex.test(input.value)) {
                isValid = false;
                errorText = '3-20 caractères (lettres, chiffres, _)';
            }
        }

        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            errorText = 'Ce champ est requis';
        }

        // Mise à jour visuelle
        box.classList.remove('error', 'success');
        if (input.value.trim()) {
            if (isValid) {
                box.classList.add('success');
            } else {
                box.classList.add('error');
            }
        }

        if (errorSpan) {
            errorSpan.textContent = errorText;
            errorSpan.classList.toggle('show', !isValid && errorText);
        }

        return isValid;
    }

    function clearError(input) {
        const box = input.closest('.input-box');
        const errorSpan = box.querySelector('.error-message');
        box.classList.remove('error');
        if (errorSpan) {
            errorSpan.textContent = '';
            errorSpan.classList.remove('show');
        }
    }

    // Validation du formulaire complet
    function validateForm() {
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        // Vérification des termes
        const termsCheckbox = document.getElementById('terms');
        const termsBox = termsCheckbox.closest('.terms-box');
        const termsError = termsBox.querySelector('.error-message');
        
        if (!termsCheckbox.checked) {
            isValid = false;
            if (termsError) {
                termsError.textContent = 'Vous devez accepter les conditions';
                termsError.classList.add('show');
            }
        } else {
            if (termsError) {
                termsError.textContent = '';
                termsError.classList.remove('show');
            }
        }

        return isValid;
    }

    // Soumission du formulaire
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // Animation de secousse pour les erreurs
            form.animate(
                [
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-10px)' },
                    { transform: 'translateX(10px)' },
                    { transform: 'translateX(-10px)' },
                    { transform: 'translateX(0)' }
                ],
                { duration: 400, easing: 'ease-in-out' }
            );
            return;
        }

        // Désactiver le bouton et afficher le loader
        submitButton.disabled = true;
        submitButton.classList.add('loading');

        // Récupérer les données du formulaire
        const formData = {
            nom: document.getElementById('nom').value.trim(),
            email: document.getElementById('email').value.trim(),
            username: document.getElementById('username').value.trim(),
            password: document.getElementById('password').value,
            createdAt: new Date().toISOString()
        };

        // Simulation d'envoi (remplacer par une vraie requête API)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Ajouter l'utilisateur à la base de données
            const result = UserDatabase.addUser(formData);

            if (!result.success) {
                // Erreur : utilisateur existe déjà
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
                
                const emailInput = document.getElementById('email');
                const usernameInput = document.getElementById('username');
                const emailBox = emailInput.closest('.input-box');
                const usernameBox = usernameInput.closest('.input-box');
                
                // Réinitialiser les erreurs
                emailBox.classList.remove('error');
                usernameBox.classList.remove('error');
                const emailError = emailBox.querySelector('.error-message');
                const usernameError = usernameBox.querySelector('.error-message');
                if (emailError) {
                    emailError.textContent = '';
                    emailError.classList.remove('show');
                }
                if (usernameError) {
                    usernameError.textContent = '';
                    usernameError.classList.remove('show');
                }
                
                // Afficher l'erreur appropriée
                if (result.field === 'email') {
                    emailBox.classList.add('error');
                    if (emailError) {
                        emailError.textContent = result.message;
                        emailError.classList.add('show');
                    }
                } else if (result.field === 'username') {
                    usernameBox.classList.add('error');
                    if (usernameError) {
                        usernameError.textContent = result.message;
                        usernameError.classList.add('show');
                    }
                }

                form.animate(
                    [
                        { transform: 'translateX(0)' },
                        { transform: 'translateX(-10px)' },
                        { transform: 'translateX(10px)' },
                        { transform: 'translateX(-10px)' },
                        { transform: 'translateX(0)' }
                    ],
                    { duration: 400, easing: 'ease-in-out' }
                );
                return;
            }

            // Stocker les informations utilisateur pour la session
            const userData = {
                id: result.user.id,
                username: result.user.username,
                email: result.user.email,
                name: result.user.nom,
                picture: result.user.picture,
                loginMethod: 'credentials',
                loginDate: new Date().toISOString()
            };
            localStorage.setItem('user', JSON.stringify(userData));

            // Afficher le message de succès
            successMessage.classList.add('show');

            // Redirection après 2 secondes vers le menu
            setTimeout(() => {
                window.location.href = 'menu.html';
            }, 2000);

        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            
            // Afficher un message d'erreur
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    });

    // Effet glow sur le bouton
    submitButton.addEventListener('mousemove', (event) => {
        const rect = submitButton.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        submitButton.style.setProperty('--glow-x', `${x}px`);
        submitButton.style.setProperty('--glow-y', `${y}px`);
    });

    submitButton.addEventListener('click', () => {
        submitButton.animate(
            [
                { transform: 'scale(1)' },
                { transform: 'scale(0.96)' },
                { transform: 'scale(1)' }
            ],
            { duration: 220, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
        );
    });
});

