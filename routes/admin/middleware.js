const {validationResult} = require('express-validator');

module.exports = {
    handleErrors (templateFunction, dataCb)  {
        return  async (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                let formData = {};
                if(dataCb){
                    formData =  await dataCb(req);
                }
                return res.send(templateFunction({errors, ...formData}));
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