/**
 * Base de données simulée pour la gestion des utilisateurs
 * Utilise localStorage pour persister les données
 */

const UserDatabase = {
    // Clé de stockage dans localStorage
    STORAGE_KEY: 'users_database',
    
    /**
     * Initialiser la base de données avec des utilisateurs par défaut (optionnel)
     */
    init: () => {
        if (!localStorage.getItem(UserDatabase.STORAGE_KEY)) {
            const defaultUsers = [
                {
                    id: '1',
                    username: 'admin',
                    email: 'admin@secureone.com',
                    nom: 'Administrateur',
                    password: 'admin123',
                    role: 'admin',
                    picture: 'https://i.pravatar.cc/150?img=1',
                    createdAt: new Date().toISOString(),
                    lastLogin: null,
                    isActive: true
                },
                {
                    id: '2',
                    username: 'demo',
                    email: 'demo@secureone.com',
                    nom: 'Utilisateur Démo',
                    password: 'demo123',
                    role: 'user',
                    picture: 'https://i.pravatar.cc/150?img=12',
                    createdAt: new Date().toISOString(),
                    lastLogin: null,
                    isActive: true
                }
            ];
            localStorage.setItem(UserDatabase.STORAGE_KEY, JSON.stringify(defaultUsers));
            console.log('Base de données initialisée avec des utilisateurs par défaut');
        }
    },

    /**
     * Récupérer tous les utilisateurs
     * @returns {Array} Liste de tous les utilisateurs
     */
    getAllUsers: () => {
        const users = localStorage.getItem(UserDatabase.STORAGE_KEY);
        return users ? JSON.parse(users) : [];
    },

    /**
     * Récupérer un utilisateur par son ID
     * @param {string} id - ID de l'utilisateur
     * @returns {Object|null} Utilisateur trouvé ou null
     */
    getUserById: (id) => {
        const users = UserDatabase.getAllUsers();
        return users.find(u => u.id === id) || null;
    },

    /**
     * Récupérer un utilisateur par son nom d'utilisateur
     * @param {string} username - Nom d'utilisateur
     * @returns {Object|null} Utilisateur trouvé ou null
     */
    getUserByUsername: (username) => {
        const users = UserDatabase.getAllUsers();
        return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
    },

    /**
     * Récupérer un utilisateur par son email
     * @param {string} email - Email de l'utilisateur
     * @returns {Object|null} Utilisateur trouvé ou null
     */
    getUserByEmail: (email) => {
        const users = UserDatabase.getAllUsers();
        return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    },

    /**
     * Vérifier si un nom d'utilisateur existe déjà
     * @param {string} username - Nom d'utilisateur à vérifier
     * @returns {boolean} True si le nom d'utilisateur existe
     */
    usernameExists: (username) => {
        return UserDatabase.getUserByUsername(username) !== null;
    },

    /**
     * Vérifier si un email existe déjà
     * @param {string} email - Email à vérifier
     * @returns {boolean} True si l'email existe
     */
    emailExists: (email) => {
        return UserDatabase.getUserByEmail(email) !== null;
    },

    /**
     * Ajouter un nouvel utilisateur
     * @param {Object} userData - Données de l'utilisateur
     * @returns {Object} Résultat de l'opération {success: boolean, message: string, user: Object|null}
     */
    addUser: (userData) => {
        const users = UserDatabase.getAllUsers();

        // Vérifier si le nom d'utilisateur existe déjà
        if (UserDatabase.usernameExists(userData.username)) {
            return {
                success: false,
                message: 'Ce nom d\'utilisateur est déjà pris',
                field: 'username'
            };
        }

        // Vérifier si l'email existe déjà
        if (UserDatabase.emailExists(userData.email)) {
            return {
                success: false,
                message: 'Cet email est déjà utilisé',
                field: 'email'
            };
        }

        // Créer le nouvel utilisateur
        const newUser = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            username: userData.username.trim(),
            email: userData.email.trim().toLowerCase(),
            nom: userData.nom || userData.name || userData.username,
            password: userData.password, // En production, hash le mot de passe !
            role: userData.role || 'user',
            picture: userData.picture || `https://i.pravatar.cc/150?u=${userData.username}`,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            isActive: true,
            provider: userData.provider || null, // Pour les connexions sociales
            ...userData // Permet d'ajouter d'autres champs personnalisés
        };

        users.push(newUser);
        localStorage.setItem(UserDatabase.STORAGE_KEY, JSON.stringify(users));

        console.log('Nouvel utilisateur ajouté:', newUser.username);
        return {
            success: true,
            message: 'Utilisateur créé avec succès',
            user: newUser
        };
    },

    /**
     * Authentifier un utilisateur (vérifier username/email + password)
     * @param {string} identifier - Nom d'utilisateur ou email
     * @param {string} password - Mot de passe
     * @returns {Object|null} Utilisateur authentifié ou null
     */
    authenticate: (identifier, password) => {
        const users = UserDatabase.getAllUsers();
        
        // Chercher par nom d'utilisateur ou email
        const user = users.find(u => 
            (u.username.toLowerCase() === identifier.toLowerCase() || 
             u.email.toLowerCase() === identifier.toLowerCase()) &&
            u.password === password &&
            u.isActive === true
        );

        if (user) {
            // Mettre à jour la date de dernière connexion
            user.lastLogin = new Date().toISOString();
            UserDatabase.updateUser(user.id, { lastLogin: user.lastLogin });
            
            console.log('Authentification réussie pour:', user.username);
            return user;
        }

        console.log('Échec d\'authentification pour:', identifier);
        return null;
    },

    /**
     * Mettre à jour un utilisateur
     * @param {string} id - ID de l'utilisateur
     * @param {Object} updates - Champs à mettre à jour
     * @returns {Object} Résultat de l'opération
     */
    updateUser: (id, updates) => {
        const users = UserDatabase.getAllUsers();
        const userIndex = users.findIndex(u => u.id === id);

        if (userIndex === -1) {
            return {
                success: false,
                message: 'Utilisateur non trouvé'
            };
        }

        // Mettre à jour les champs
        users[userIndex] = {
            ...users[userIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(UserDatabase.STORAGE_KEY, JSON.stringify(users));
        console.log('Utilisateur mis à jour:', users[userIndex].username);
        
        return {
            success: true,
            message: 'Utilisateur mis à jour avec succès',
            user: users[userIndex]
        };
    },

    /**
     * Supprimer un utilisateur
     * @param {string} id - ID de l'utilisateur
     * @returns {Object} Résultat de l'opération
     */
    deleteUser: (id) => {
        const users = UserDatabase.getAllUsers();
        const userIndex = users.findIndex(u => u.id === id);

        if (userIndex === -1) {
            return {
                success: false,
                message: 'Utilisateur non trouvé'
            };
        }

        const deletedUser = users.splice(userIndex, 1)[0];
        localStorage.setItem(UserDatabase.STORAGE_KEY, JSON.stringify(users));
        
        console.log('Utilisateur supprimé:', deletedUser.username);
        return {
            success: true,
            message: 'Utilisateur supprimé avec succès',
            user: deletedUser
        };
    },

    /**
     * Désactiver/Activer un utilisateur
     * @param {string} id - ID de l'utilisateur
     * @param {boolean} isActive - État actif/inactif
     * @returns {Object} Résultat de l'opération
     */
    setUserActive: (id, isActive) => {
        return UserDatabase.updateUser(id, { isActive });
    },

    /**
     * Récupérer les statistiques de la base de données
     * @returns {Object} Statistiques
     */
    getStats: () => {
        const users = UserDatabase.getAllUsers();
        return {
            total: users.length,
            active: users.filter(u => u.isActive).length,
            inactive: users.filter(u => !u.isActive).length,
            admins: users.filter(u => u.role === 'admin').length,
            regularUsers: users.filter(u => u.role === 'user').length,
            socialUsers: users.filter(u => u.provider !== null).length
        };
    },

    /**
     * Rechercher des utilisateurs
     * @param {string} query - Terme de recherche
     * @returns {Array} Liste des utilisateurs correspondants
     */
    searchUsers: (query) => {
        const users = UserDatabase.getAllUsers();
        const lowerQuery = query.toLowerCase();
        
        return users.filter(u => 
            u.username.toLowerCase().includes(lowerQuery) ||
            u.email.toLowerCase().includes(lowerQuery) ||
            (u.nom && u.nom.toLowerCase().includes(lowerQuery))
        );
    },

    /**
     * Exporter la base de données (pour sauvegarde)
     * @returns {string} JSON de tous les utilisateurs
     */
    export: () => {
        return JSON.stringify(UserDatabase.getAllUsers(), null, 2);
    },

    /**
     * Importer une base de données (pour restauration)
     * @param {string} jsonData - JSON des utilisateurs
     * @returns {Object} Résultat de l'opération
     */
    import: (jsonData) => {
        try {
            const users = JSON.parse(jsonData);
            if (Array.isArray(users)) {
                localStorage.setItem(UserDatabase.STORAGE_KEY, JSON.stringify(users));
                console.log('Base de données importée avec succès');
                return {
                    success: true,
                    message: 'Base de données importée avec succès',
                    count: users.length
                };
            }
            throw new Error('Format invalide');
        } catch (error) {
            console.error('Erreur lors de l\'import:', error);
            return {
                success: false,
                message: 'Erreur lors de l\'import: ' + error.message
            };
        }
    },

    /**
     * Vider la base de données (ATTENTION: destructif!)
     * @returns {Object} Résultat de l'opération
     */
    clear: () => {
        localStorage.removeItem(UserDatabase.STORAGE_KEY);
        console.log('Base de données vidée');
        return {
            success: true,
            message: 'Base de données vidée avec succès'
        };
    },

    /**
     * Réinitialiser le mot de passe d'un utilisateur
     * @param {string} identifier - Nom d'utilisateur ou email
     * @param {string} newPassword - Nouveau mot de passe
     * @returns {Object} Résultat de l'opération {success: boolean, message: string, user: Object|null}
     */
    resetPassword: (identifier, newPassword) => {
        const users = UserDatabase.getAllUsers();
        
        // Chercher l'utilisateur par nom d'utilisateur ou email
        const user = users.find(u => 
            u.username.toLowerCase() === identifier.toLowerCase() || 
            u.email.toLowerCase() === identifier.toLowerCase()
        );

        if (!user) {
            return {
                success: false,
                message: 'Aucun compte trouvé avec ces informations',
                user: null
            };
        }

        if (!user.isActive) {
            return {
                success: false,
                message: 'Ce compte est désactivé',
                user: null
            };
        }

        // Mettre à jour le mot de passe
        const result = UserDatabase.updateUser(user.id, { password: newPassword });
        
        if (result.success) {
            console.log('Mot de passe réinitialisé pour:', user.username);
            return {
                success: true,
                message: 'Mot de passe réinitialisé avec succès',
                user: result.user
            };
        }

        return result;
    }
};

// Initialiser la base de données au chargement
UserDatabase.init();

// Exporter pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UserDatabase };
}

