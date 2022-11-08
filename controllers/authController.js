const UserModel = require('../models/userModel')
const jwt = require('jsonwebtoken');



require('dotenv').config();

exports.signup = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.user.email})
        res.status(201).json({
            message: 'Signup successful',
            user: user
        });
        console.log(error.Error)
        
    } catch (error) {
        return res.status(400).json({error});
      } 
       
}

// exports.login = (req, res, { err, user, info}) => {

//     if (!user) {
//         return res.status(404).json({ message: 'Email or password is incorrect'})
//     }

//     // req.login is provided by passport
//     req.login(user, { session: false },
//         async (error) => {
//             if (error) return res.status(400).json(error)

//             const body = { _id: user._id, email: user.email };
//             //You store the id and username in the payload of the JWT. 
//             // You then sign the token with a secret or key (JWT_SECRET), and send back the token to the user.
//             // DO NOT STORE PASSWORDS IN THE JWT!
//             const token = jwt.sign({ user: body }, process.env.JWT_SECRET || 'something_secret');

//             return res.status(200).json({ token });
//         }
//     );
// }

