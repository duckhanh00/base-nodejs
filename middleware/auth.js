const jwt = require('jsonwebtoken');

function authFunc() {
    return (roles) => (req, res, next) => {
        try {
            let token = req.header('jwt');
            let decoded
            try {
                decoded = jwt.verify(token, process.env.SECRET_TOKEN);
            } catch(err) {
                throw {
                    message: "Please authenticate"
                }
            }

            req.user = decoded.user

            if (roles?.length > 0) {
                if (req.user?.roles?.length > 0) {
                    let rolePermisstions = req.user.roles.filter(item => roles.includes(item.name))
                    if (rolePermisstions.length === 0) {
                        throw  {
                            message: "Not permission"
                        }
                    }
                } else {
                    throw {
                        message: "Not permission"
                    }
                }
            }

            next(); 
        } catch (error) {
            res.status(400).json({
                success: false,
                content: error
            });
        }
        
    }
}
module.exports = authFunc();
