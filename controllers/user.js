const users = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendmail2 = require('../utils/mail_link_sender')


// --------------authMiddleware-----------------

exports.authMiddleware = async (req, res, next) => {
    try {

        const authorization_header_token = req.headers.authorization;
        if (!authorization_header_token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const token = authorization_header_token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // todo : populate team with assigned questions
        const user = await users.findOne({email:decoded.email}).select("-password");
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        req.email = decoded.email;
        next();

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: "Token expired"
            });
        }

        console.log(typeof(error));
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}

// -------------- authControllers --------------

// put Team mongodb id in jwt
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "user email does not exist"
            });
        }

        // check if password is correct
        const isPasswordCorrect = bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Incorrect password"
            });
        }
    
        // generate jwt
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });


        res.status(200).send({
            msg: `user logged in`, user: {
            user_id:user._id,
            email: email,
            username: user.username,
            token: token,
            expires_in: new Date(Date.now() + 60*60*1000),
            }
          });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}

exports.signup= async (req,res)=>{
    try{
            const {username,
                email,
                password}= req.body
                const preEmail = await users.findOne({ email });
                if(preEmail){
                    res.send({message:"email allready exist"})}
                    else
                    {
                const token = jwt.sign({ password: password }, process.env.JWT_SECRET, {
                    expiresIn: `${1000*60*5}`
                });
                sendmail2(username,email,token)
                res.status(200).send({message:`mail has been send to the email Id ${email}`})
            }
            }           
        catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Something went wrong"
            });
    }
}


exports.verifySave = async(req,res)=>{

            try {

                const token= req.query.token
                const username= req.query.username
                const email= req.query.email
                console.log(req.query)
                const password = jwt.verify(token, process.env.JWT_SECRET);
                if(password){
                    bcrypt.hash(password.password, 12, async function (err, hash){ 
                        
                        const detail = { email: email, password: hash, username:username }
                        const usr = new users(detail)
                        const keetp = await usr.save();
                        console.log(keetp)
                        res.send({ msg: "email has been verified Go to the website and login through email & password" })
                    })
                }
                
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    message: "Something went wrong"
                });
            }

}



