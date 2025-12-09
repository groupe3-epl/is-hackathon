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
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            alert('Fonctionnalité de modification du profil à venir !');
            // TODO: Implémenter la modification du profil
        });
    }

    // Bouton changer le mot de passe
    const changePasswordBtn = document.getElementById('change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            alert('Fonctionnalité de changement de mot de passe à venir !');
            // TODO: Implémenter le changement de mot de passe
        });
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

