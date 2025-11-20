// La base de données est maintenant dans database.js
// On utilise UserDatabase qui est chargé via le script dans HTML

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    const loginButton = form.querySelector('.login-btn');
    const errorMessage = document.getElementById('error-message');
    const togglePasswordBtn = document.querySelector('.toggle-password');

    // Animation d'entrée
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
        input.addEventListener('blur', () => {
            box.classList.remove('glow');
            validateField(input);
        });
    });

    // Toggle password visibility
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            const icon = togglePasswordBtn.querySelector('i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // Validation des champs
    function validateField(input) {
        const box = input.closest('.input-box');
        const errorSpan = box.querySelector('.error-message');
        
        box.classList.remove('error', 'success');
        
        if (!input.value.trim()) {
            if (errorSpan) {
                errorSpan.textContent = 'Ce champ est requis';
                errorSpan.classList.add('show');
            }
            box.classList.add('error');
            return false;
        } else {
            if (errorSpan) {
                errorSpan.textContent = '';
                errorSpan.classList.remove('show');
            }
            box.classList.add('success');
            return true;
        }
    }

    // Vérifier si l'utilisateur est déjà connecté
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            if (user.loginMethod === 'social' || user.id) {
                // Rediriger vers le menu si déjà connecté
                window.location.href = 'menu.html';
            }
        } catch (e) {
            // Ignorer l'erreur
        }
    }

    // Récupérer les identifiants sauvegardés
    const savedUsername = localStorage.getItem('savedUsername');
    if (savedUsername && rememberCheckbox) {
        usernameInput.value = savedUsername;
        rememberCheckbox.checked = true;
    }

    // Soumission du formulaire
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Masquer les erreurs précédentes
        errorMessage.classList.remove('show');
        errorMessage.textContent = '';

        // Valider les champs
        const isUsernameValid = validateField(usernameInput);
        const isPasswordValid = validateField(passwordInput);

        if (!isUsernameValid || !isPasswordValid) {
            errorMessage.textContent = 'Veuillez remplir tous les champs';
            errorMessage.classList.add('show');
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
        loginButton.disabled = true;
        loginButton.classList.add('loading');

        // Simuler un délai de vérification
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Vérifier les identifiants dans la base de données
        const user = UserDatabase.authenticate(usernameInput.value.trim(), passwordInput.value);

        if (user) {
            // Connexion réussie
            console.log('Connexion réussie:', user);

            // Stocker les informations utilisateur
            const userData = {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.nom || user.name || user.username,
                picture: user.picture || `https://i.pravatar.cc/150?u=${user.username}`,
                loginMethod: 'credentials',
                loginDate: new Date().toISOString()
            };

            localStorage.setItem('user', JSON.stringify(userData));

            // Sauvegarder le nom d'utilisateur si "Se souvenir" est coché
            if (rememberCheckbox && rememberCheckbox.checked) {
                localStorage.setItem('savedUsername', user.username);
            } else {
                localStorage.removeItem('savedUsername');
            }

            // Afficher un message de succès
            loginButton.classList.remove('loading');
            loginButton.innerHTML = '<i class="fa-solid fa-check"></i> Connexion réussie !';
            loginButton.style.background = 'linear-gradient(120deg, #52ffa8, #3a8bfd)';

            // Redirection vers le menu après 1 seconde
            setTimeout(() => {
                window.location.href = 'menu.html';
            }, 1000);

        } else {
            // Identifiants incorrects
            loginButton.disabled = false;
            loginButton.classList.remove('loading');
            
            errorMessage.textContent = 'Nom d\'utilisateur ou mot de passe incorrect';
            errorMessage.classList.add('show');

            // Animation d'erreur
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

            // Réinitialiser les champs en erreur
            inputBoxes.forEach(box => {
                box.classList.add('error');
                box.classList.remove('success');
            });
        }
    });

    // Effet glow sur le bouton
    loginButton.addEventListener('mousemove', (event) => {
        const rect = loginButton.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        loginButton.style.setProperty('--glow-x', `${x}px`);
        loginButton.style.setProperty('--glow-y', `${y}px`);
    });

    loginButton.addEventListener('click', () => {
        loginButton.animate(
            [
                { transform: 'scale(1)' },
                { transform: 'scale(0.96)' },
                { transform: 'scale(1)' }
            ],
            { duration: 220, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
        );
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

    // Gestion du mot de passe oublié
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const forgotIdentifierInput = document.getElementById('forgot-identifier');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const forgotErrorMessage = document.getElementById('forgot-error-message');
    let currentUserIdentifier = '';

    // Ouvrir le modal
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            openForgotPasswordModal();
        });
    }

    // Fermer le modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            closeForgotPasswordModal();
        });
    }

    // Fermer le modal en cliquant en dehors
    if (forgotPasswordModal) {
        forgotPasswordModal.addEventListener('click', (e) => {
            if (e.target === forgotPasswordModal) {
                closeForgotPasswordModal();
            }
        });
    }

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && forgotPasswordModal && forgotPasswordModal.classList.contains('active')) {
            closeForgotPasswordModal();
        }
    });

    function openForgotPasswordModal() {
        if (forgotPasswordModal) {
            forgotPasswordModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Réinitialiser le formulaire
            resetForgotPasswordForm();
            // Animation d'entrée
            const modalContent = forgotPasswordModal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.animate(
                    [
                        { opacity: 0, transform: 'scale(0.9) translateY(-20px)' },
                        { opacity: 1, transform: 'scale(1) translateY(0)' }
                    ],
                    { duration: 300, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }
                );
            }
        }
    }

    function closeForgotPasswordModal() {
        if (forgotPasswordModal) {
            forgotPasswordModal.classList.remove('active');
            document.body.style.overflow = '';
            resetForgotPasswordForm();
        }
    }

    function resetForgotPasswordForm() {
        if (forgotPasswordForm) {
            forgotPasswordForm.reset();
        }
        if (step1) step1.style.display = 'block';
        if (step2) step2.style.display = 'none';
        if (forgotErrorMessage) {
            forgotErrorMessage.classList.remove('show');
            forgotErrorMessage.textContent = '';
        }
        currentUserIdentifier = '';
        // Réinitialiser les erreurs des champs
        const inputBoxes = forgotPasswordForm?.querySelectorAll('.input-box');
        if (inputBoxes) {
            inputBoxes.forEach(box => {
                box.classList.remove('error', 'success');
                const errorSpan = box.querySelector('.error-message');
                if (errorSpan) {
                    errorSpan.textContent = '';
                    errorSpan.classList.remove('show');
                }
            });
        }
    }

    // Toggle password visibility dans le modal
    const modalToggleButtons = forgotPasswordForm?.querySelectorAll('.toggle-password');
    if (modalToggleButtons) {
        modalToggleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const input = btn.closest('.input-box').querySelector('input');
                const icon = btn.querySelector('i');
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
    }

    // Validation des champs du modal
    function validateForgotField(input) {
        const box = input.closest('.input-box');
        const errorSpan = box.querySelector('.error-message');
        
        box.classList.remove('error', 'success');
        
        if (!input.value.trim()) {
            if (errorSpan) {
                errorSpan.textContent = 'Ce champ est requis';
                errorSpan.classList.add('show');
            }
            box.classList.add('error');
            return false;
        }

        // Validation spéciale pour les mots de passe
        if (input.id === 'new-password' || input.id === 'confirm-password') {
            if (input.value.length < 6) {
                if (errorSpan) {
                    errorSpan.textContent = 'Le mot de passe doit contenir au moins 6 caractères';
                    errorSpan.classList.add('show');
                }
                box.classList.add('error');
                return false;
            }
        }

        // Vérifier que les mots de passe correspondent
        if (input.id === 'confirm-password' && newPasswordInput && confirmPasswordInput) {
            if (newPasswordInput.value !== confirmPasswordInput.value) {
                if (errorSpan) {
                    errorSpan.textContent = 'Les mots de passe ne correspondent pas';
                    errorSpan.classList.add('show');
                }
                box.classList.add('error');
                return false;
            }
        }

        if (errorSpan) {
            errorSpan.textContent = '';
            errorSpan.classList.remove('show');
        }
        box.classList.add('success');
        return true;
    }

    // Ajouter les événements de validation
    if (forgotIdentifierInput) {
        forgotIdentifierInput.addEventListener('blur', () => validateForgotField(forgotIdentifierInput));
    }
    if (newPasswordInput) {
        newPasswordInput.addEventListener('blur', () => {
            validateForgotField(newPasswordInput);
            // Re-valider la confirmation si elle est déjà remplie
            if (confirmPasswordInput && confirmPasswordInput.value) {
                validateForgotField(confirmPasswordInput);
            }
        });
    }
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', () => validateForgotField(confirmPasswordInput));
    }

    // Soumission du formulaire de mot de passe oublié
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Masquer les erreurs précédentes
            if (forgotErrorMessage) {
                forgotErrorMessage.classList.remove('show');
                forgotErrorMessage.textContent = '';
            }

            // Étape 1 : Vérifier l'identifiant
            if (step1 && step1.style.display !== 'none') {
                const isIdentifierValid = validateForgotField(forgotIdentifierInput);
                
                if (!isIdentifierValid) {
                    if (forgotErrorMessage) {
                        forgotErrorMessage.textContent = 'Veuillez entrer un nom d\'utilisateur ou un email valide';
                        forgotErrorMessage.classList.add('show');
                    }
                    return;
                }

                // Vérifier si l'utilisateur existe
                const identifier = forgotIdentifierInput.value.trim();
                const user = UserDatabase.getUserByUsername(identifier) || UserDatabase.getUserByEmail(identifier);

                if (!user) {
                    if (forgotErrorMessage) {
                        forgotErrorMessage.textContent = 'Aucun compte trouvé avec ces informations';
                        forgotErrorMessage.classList.add('show');
                    }
                    forgotIdentifierInput.closest('.input-box').classList.add('error');
                    return;
                }

                if (!user.isActive) {
                    if (forgotErrorMessage) {
                        forgotErrorMessage.textContent = 'Ce compte est désactivé';
                        forgotErrorMessage.classList.add('show');
                    }
                    return;
                }

                // Désactiver le bouton et afficher le loader
                const submitBtn = forgotPasswordForm.querySelector('.login-btn');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.classList.add('loading');
                }

                // Simuler un délai de vérification
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Vérification correcte : connecter automatiquement l'utilisateur
                console.log('Vérification réussie, connexion automatique:', user);

                // Stocker les informations utilisateur (comme lors d'une connexion normale)
                const userData = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    name: user.nom || user.name || user.username,
                    picture: user.picture || `https://i.pravatar.cc/150?u=${user.username}`,
                    loginMethod: 'credentials',
                    loginDate: new Date().toISOString()
                };

                localStorage.setItem('user', JSON.stringify(userData));

                // Mettre à jour la date de dernière connexion
                UserDatabase.updateUser(user.id, { lastLogin: new Date().toISOString() });

                // Afficher un message de succès
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Connexion réussie !';
                    submitBtn.style.background = 'linear-gradient(120deg, #52ffa8, #3a8bfd)';
                }

                // Fermer le modal et rediriger vers le menu après 1 seconde
                setTimeout(() => {
                    closeForgotPasswordModal();
                    window.location.href = 'menu.html';
                }, 1000);

            } else {
                // Étape 2 : Réinitialiser le mot de passe
                const isNewPasswordValid = validateForgotField(newPasswordInput);
                const isConfirmPasswordValid = validateForgotField(confirmPasswordInput);

                if (!isNewPasswordValid || !isConfirmPasswordValid) {
                    if (forgotErrorMessage) {
                        forgotErrorMessage.textContent = 'Veuillez remplir tous les champs correctement';
                        forgotErrorMessage.classList.add('show');
                    }
                    return;
                }

                if (newPasswordInput.value !== confirmPasswordInput.value) {
                    if (forgotErrorMessage) {
                        forgotErrorMessage.textContent = 'Les mots de passe ne correspondent pas';
                        forgotErrorMessage.classList.add('show');
                    }
                    return;
                }

                // Désactiver le bouton
                const submitBtn = forgotPasswordForm.querySelector('.login-btn');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.classList.add('loading');
                }

                // Simuler un délai
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Réinitialiser le mot de passe
                const result = UserDatabase.resetPassword(currentUserIdentifier, newPasswordInput.value);

                if (result.success) {
                    // Succès
                    if (submitBtn) {
                        submitBtn.classList.remove('loading');
                        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Mot de passe réinitialisé !';
                        submitBtn.style.background = 'linear-gradient(120deg, #52ffa8, #3a8bfd)';
                    }

                    // Fermer le modal après 1.5 secondes
                    setTimeout(() => {
                        closeForgotPasswordModal();
                        // Afficher un message de succès dans le formulaire principal
                        if (errorMessage) {
                            errorMessage.textContent = 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.';
                            errorMessage.style.background = 'rgba(82, 255, 168, 0.15)';
                            errorMessage.style.borderColor = 'rgba(82, 255, 168, 0.3)';
                            errorMessage.style.color = '#52ffa8';
                            errorMessage.classList.add('show');
                            setTimeout(() => {
                                errorMessage.classList.remove('show');
                                errorMessage.style.background = '';
                                errorMessage.style.borderColor = '';
                                errorMessage.style.color = '';
                            }, 5000);
                        }
                    }, 1500);
                } else {
                    // Erreur
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('loading');
                    }
                    if (forgotErrorMessage) {
                        forgotErrorMessage.textContent = result.message || 'Une erreur est survenue';
                        forgotErrorMessage.classList.add('show');
                    }
                }
            }
        });
    }
});

// Exporter Database pour utilisation dans inscription.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Database };
}
