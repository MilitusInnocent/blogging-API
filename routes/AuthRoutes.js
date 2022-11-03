const express = require('express')
const passport = require('passport');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');


const router = express.Router();


const AuthController = require('../controllers/authController');


router.post('/signup', passport.authenticate('signup', { session: false }), AuthController.signup)


// authRouter.post('/signup', signup)

// router.post('/login', async (req, res, next) => passport.authenticate('login', (err, user, info) => {
//     AuthController.login(req, res, { err, user, info})
// })(req, res, next))


router.post('/login',  async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            const email = req.body.email
            const user = await UserModel.findOne({ email });
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(404).json({ message: 'Email or password is incorrect'})
            }

            req.login(user, { session: false },
                async (error) => {
                    if (error) return next(error);

                    const body = { _id: user._id, email: user.email };
                
                    const token = jwt.sign({ user: body }, process.env.JWT_SECRET || 'something_secret', {expiresIn: '1h'},);

                    return res.json({ token });
                }
            );
        } catch (error) {
            return next(error);
        }
    }
    )(req, res, next);
})


// module.exports = authRouter;
module.exports = router
 