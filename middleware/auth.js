const jwt = require('jsonwebtoken');
//Middleware pour le fonctionnement de JSONwebtoken
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId){
            throw 'User id invalide'
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({error:error|'Non identifié test'})
    }

};