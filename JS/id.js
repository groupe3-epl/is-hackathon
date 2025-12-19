// Fonction pour récupérer l'utilisateur actuel (synchronisée)
function getCurrentUserSync() {
    const username = localStorage.getItem('currentUser');
    if (!username) {
        return null;
    }

    // Essayer de récupérer depuis localStorage
    const userData = localStorage.getItem(`user_${username}`);
    if (userData) {
        return JSON.parse(userData);
    }

    return null;
}

// Rendre getCurrentUserSync accessible globalement pour inscription.js
window.getCurrentUserSync = getCurrentUserSync;

function getCurrentUser() {
    // Récupérer l'utilisateur connecté depuis localStorage
    const username = localStorage.getItem('currentUser');
    if (!username) {
        return null;
    }

    // Récupérer les données utilisateur depuis IndexedDB
    return new Promise((resolve) => {
        if (typeof db === 'undefined' || !db) {
            // Si la base de données n'est pas encore initialisée, attendre
            setTimeout(() => {
                getUserFromDB(username).then(resolve);
            }, 500);
        } else {
            getUserFromDB(username).then(resolve);
        }
    });
}

function getUserFromDB(username) {
    return new Promise((resolve) => {
        if (typeof db === 'undefined' || !db) {
            // Essayer de récupérer depuis localStorage comme fallback
            const userData = localStorage.getItem(`user_${username}`);
            if (userData) {
                resolve(JSON.parse(userData));
            } else {
                resolve(null);
            }
            return;
        }

        const transaction = db.transaction(['users'], 'readonly');
        const store = transaction.objectStore('users');
        const index = store.index('username');
        const request = index.get(username);

        request.onsuccess = function() {
            resolve(request.result || null);
        };

        request.onerror = function() {
            // Fallback vers localStorage
            const userData = localStorage.getItem(`user_${username}`);
            if (userData) {
                resolve(JSON.parse(userData));
            } else {
                resolve(null);
            }
        };
    });
}

async function displayUserInfo(user) {
    if (!user) {
        return;
    }

    // Afficher les informations de base
    document.getElementById('profile-name').textContent = user.nom || user.username || 'Utilisateur';
    document.getElementById('profile-email').textContent = user.email || 'email@example.com';
    
    // Afficher les informations détaillées
    document.getElementById('info-nom').textContent = user.nom || '-';
    document.getElementById('info-username').textContent = user.username || '-';
    document.getElementById('info-email').textContent = user.email || '-';
    
    // Date d'inscription
    if (user.dateInscription) {
        const date = new Date(user.dateInscription);
        document.getElementById('info-date').textContent = date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } else {
        document.getElementById('info-date').textContent = '-';
    }

    // Statistiques (à adapter selon vos besoins)
    const stats = getUserStats(user.username);
    document.getElementById('stat-games').textContent = stats.games || 0;
    document.getElementById('stat-score').textContent = stats.score || 0;
    document.getElementById('stat-days').textContent = stats.days || 0;
}

// Rendre displayUserInfo accessible globalement
window.displayUserInfo = displayUserInfo;

function getUserStats(username) {
    // Récupérer les statistiques depuis localStorage ou IndexedDB
    const stats = localStorage.getItem(`stats_${username}`);
    if (stats) {
        return JSON.parse(stats);
    }
    
    // Valeurs par défaut
    return {
        games: 0,
        score: 0,
        days: 0
    };
}

function setupActionButtons() {
    // Bouton modifier le profil
    const editBtn = document.getElementById('edit-profile-btn');
    const modal = document.getElementById('edit-profile-modal');
    const closeBtn = document.getElementById('close-edit-modal');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const editForm = document.getElementById('edit-profile-form');
    
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            const user = getCurrentUserSync();
            if (user) {
                // Remplir le formulaire avec les données actuelles
                document.getElementById('edit-nom').value = user.nom || '';
                document.getElementById('edit-email').value = user.email || '';
                document.getElementById('edit-username').value = user.username || '';
                
                // Afficher la modale
                if (modal) {
                    modal.style.display = 'flex';
                }
            }
        });
    }
    
    // Fermer la modale
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Bouton Annuler
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Fermer la modale en cliquant en dehors
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Soumettre le formulaire de modification
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const user = getCurrentUserSync();
            if (!user) return;
            
            const nom = document.getElementById('edit-nom').value.trim();
            const email = document.getElementById('edit-email').value.trim();
            
            // Validation simple
            if (!nom) {
                alert('Le nom complet est requis');
                return;
            }
            
            if (!email) {
                alert('L\'adresse e-mail est requise');
                return;
            }
            
            // Validation email basique
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('L\'adresse e-mail n\'est pas valide');
                return;
            }
            
            // Mettre à jour les données utilisateur
            const updatedUser = {
                ...user,
                nom: nom,
                email: email
            };
            
            // Sauvegarder dans localStorage
            localStorage.setItem(`user_${user.username}`, JSON.stringify(updatedUser));
            
            // Mettre à jour dans IndexedDB si disponible
            if (typeof db !== 'undefined' && db) {
                const transaction = db.transaction(['users'], 'readwrite');
                const store = transaction.objectStore('users');
                store.put(updatedUser);
            }
            
            // Afficher le profil mis à jour
            displayUserInfo(updatedUser);
            
            // Fermer la modale
            if (modal) {
                modal.style.display = 'none';
            }
            
            // Message de succès
            alert('Profil mis à jour avec succès !');
        });
    }

    // Bouton changer le mot de passe
    const changePasswordBtn = document.getElementById('change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            const modal = document.getElementById('change-password-modal');
            const cpUsername = document.getElementById('cp-username');
            const user = getCurrentUserSync();
            if (modal) {
                // Pré-remplir le nom d'utilisateur si l'utilisateur est connecté
                if (user && cpUsername) {
                    cpUsername.value = user.username || '';
                    cpUsername.disabled = true;
                }
                modal.style.display = 'flex';
            }
        });

        // Gérer la soumission et les boutons de la modale
        const changeModal = document.getElementById('change-password-modal');
        if (changeModal) {
            const closeBtn = document.getElementById('close-change-password');
            const cancelBtn = document.getElementById('cancel-change-password');
            const form = document.getElementById('change-password-form');

            const hideModal = () => {
                changeModal.style.display = 'none';
                if (form) form.reset();
                const cpUsernameFld = document.getElementById('cp-username');
                if (cpUsernameFld) cpUsernameFld.disabled = false;
            };

            if (closeBtn) closeBtn.addEventListener('click', hideModal);
            if (cancelBtn) cancelBtn.addEventListener('click', hideModal);

            // Fermer en cliquant en dehors
            changeModal.addEventListener('click', function(e) {
                if (e.target === changeModal) hideModal();
            });

            if (form) {
                const cpMessageEl = document.getElementById('cp-message');

                const showError = (msg) => {
                    if (cpMessageEl) {
                        cpMessageEl.textContent = msg;
                        cpMessageEl.style.color = '#b00020';
                    } else {
                        alert(msg);
                    }
                };

                const showSuccess = (msg) => {
                    if (cpMessageEl) {
                        cpMessageEl.textContent = msg;
                        cpMessageEl.style.color = '#0a8a00';
                    } else {
                        alert(msg);
                    }
                };

                // Effacer le message à la saisie
                ['cp-username', 'cp-current', 'cp-new', 'cp-confirm'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.addEventListener('input', () => { if (cpMessageEl) cpMessageEl.textContent = ''; });
                });

                form.addEventListener('submit', async function(e) {
                    e.preventDefault();

                    const identifier = document.getElementById('cp-username').value.trim();
                    const currentPassword = document.getElementById('cp-current').value;
                    const newPassword = document.getElementById('cp-new').value;
                    const confirmPassword = document.getElementById('cp-confirm').value;

                    if (!identifier || !currentPassword || !newPassword || !confirmPassword) {
                        showError('Veuillez remplir tous les champs.');
                        return;
                    }

                    if (newPassword !== confirmPassword) {
                        showError('Le nouveau mot de passe et sa confirmation ne correspondent pas.');
                        return;
                    }

                    if (newPassword.length < 6) {
                        showError('Le mot de passe doit contenir au moins 6 caractères.');
                        return;
                    }

                    // Récupérer l'utilisateur depuis localStorage (fallback si IndexedDB non dispo)
                    const stored = localStorage.getItem(`user_${identifier}`);
                    let storedUser = stored ? JSON.parse(stored) : null;

                    // Si absent en localStorage, tenter UserDatabase (shared DB) ou IndexedDB
                    if (!storedUser) {
                        if (typeof UserDatabase !== 'undefined' && UserDatabase.getUserByUsername) {
                            const found = UserDatabase.getUserByUsername(identifier);
                            if (found) storedUser = found;
                        }
                    }

                    if (!storedUser) {
                        const dbUser = await getUserFromDB(identifier);
                        if (dbUser) storedUser = dbUser;
                    }

                    if (!storedUser) {
                        showError('Aucun compte trouvé pour cet identifiant.');
                        return;
                    }

                    // Vérifier le mot de passe actuel
                    if (!storedUser.password || storedUser.password !== currentPassword) {
                        showError('Mot de passe actuel incorrect.');
                        return;
                    }

                    // Mettre à jour le mot de passe
                    storedUser.password = newPassword;

                    // Sauvegarder dans localStorage
                    try {
                        localStorage.setItem(`user_${storedUser.username}`, JSON.stringify(storedUser));
                    } catch (err) {
                        console.error('Erreur lors de la sauvegarde en localStorage:', err);
                    }

                    // Mettre à jour UserDatabase si présent
                    if (typeof UserDatabase !== 'undefined' && UserDatabase.getUserByUsername) {
                        const result = UserDatabase.resetPassword(storedUser.username, newPassword);
                        if (!result.success) {
                            console.warn('UserDatabase.resetPassword:', result.message);
                        } else {
                            storedUser = result.user || storedUser;
                        }
                    }

                    // Mettre à jour dans IndexedDB si disponible
                    if (typeof db !== 'undefined' && db) {
                        try {
                            const transaction = db.transaction(['users'], 'readwrite');
                            const store = transaction.objectStore('users');
                            store.put(storedUser);
                        } catch (err) {
                            console.error('Erreur IndexedDB lors de la mise à jour du mot de passe:', err);
                        }
                    }

                    // Si l'utilisateur modifie son propre mot de passe et est connecté, mettre à jour l'affichage
                    const current = getCurrentUserSync();
                    if (current && current.username === storedUser.username) {
                        localStorage.setItem('currentUser', storedUser.username);
                        displayUserInfo(storedUser);
                    }

                    showSuccess('Mot de passe mis à jour avec succès.');
                    // fermer après un court délai pour que l'utilisateur voie le message
                    setTimeout(() => { hideModal(); }, 900);
                });
            }
        }
    }
}

// Initialisation avec une approche synchrone pour éviter les problèmes de timing
document.addEventListener('DOMContentLoaded', function() {
    const signupSection = document.getElementById('signup-section');
    const profileSection = document.getElementById('profile-section');
    
    const user = getCurrentUserSync();
    
    if (!user) {
        // Afficher le formulaire d'inscription
        if (signupSection) {
            signupSection.style.display = 'block';
        }
        if (profileSection) {
            profileSection.style.display = 'none';
        }
    } else {
        // Afficher le profil utilisateur
        if (signupSection) {
            signupSection.style.display = 'none';
        }
        if (profileSection) {
            profileSection.style.display = 'block';
        }
        
        displayUserInfo(user);
        setupActionButtons();

        // Essayer de récupérer les données complètes depuis la DB de manière asynchrone
        if (typeof db !== 'undefined' && db) {
            getUserFromDB(user.username).then(updatedUser => {
                if (updatedUser) {
                    displayUserInfo(updatedUser);
                }
            });
        }
    }
});

