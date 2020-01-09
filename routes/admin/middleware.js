const {validationResult} = require('express-validator');

module.exports = {
    handleErrors (templateFunction)  {
        return (res, req, next) => {
            const errors = validationResult(req);

            if(!errors.isEmpty) {
                return res.send(templateFunction({errors}, req));
            }

            next();
        };
    },
    requireAuth(req,res,next) {
        if(!req.session.userId) {
            return res.redirect('/');
        }
        next();
    },
    // authentication guard
    guardIfSignedIn(req, res, next){
        if (req.session.userId) {
            return res.redirect('/');
        }
        next();
    }

};