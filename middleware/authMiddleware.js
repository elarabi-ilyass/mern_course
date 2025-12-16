const jwt = require('jsonwebtoken');
require('dotenv').config();
// Exporte le middleware pour qu'il puisse être utilisé dans d'autres fichiers
authMiddleware = (req, res, next) => {
    
    // Récupère le header d'autorisation de la requête HTTP
    // Format attendu: "Bearer <token_jwt>"
    const authHeader = req.headers.authorization;
    
    // Vérifie si le header d'autorisation existe ET commence par "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Si non, retourne une erreur 401 (Non autorisé)
        return res.status(401).json({ message: 'No token provided' });
    }

    // Extrait le token JWT du header
    // Le header est divisé en tableau: ["Bearer", "<token_jwt>"]
    // On prend le deuxième élément [1] qui est le token lui-même
    const token = authHeader.split(' ')[1];
    
    try {
        // Vérifie et décode le token JWT en utilisant la clé secrète
        // jwt.verify() vérifie:
        // 1. Si le token est valide (signature correcte)
        // 2. Si le token n'a pas expiré
        // 3. Retourne les données décodées (payload)
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secure_jwt_secret_key_here_make_it_long');
        
        // Ajoute les données utilisateur décodées à l'objet req (requête)
        // Pour qu'elles soient accessibles dans les routes suivantes
        // Exemple: req.user = { userId: '123', email: 'user@example.com' }
        req.user = decoded;
        
        // Passe au middleware suivant ou à la route
        next();
        
    } catch (err) {
        // Si une erreur se produit pendant la vérification du token:
        // - Token expiré
        // - Signature invalide
        // - Token malformé
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { authMiddleware }; // ← Export comme objet