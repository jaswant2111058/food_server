const users = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendmail2 = require('../utils/mail_link_sender')
const { OAuth2Client } = require('google-auth-library');

// --------------authMiddleware-----------------

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};


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
        const user = await users.findOne({ email: decoded.email }).select("-password");
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

        console.log(typeof (error));
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
            user_id: user._id,
            email: email,
            username: user.username,
            token: token,
            expires_in: new Date(Date.now() + 60 * 60 * 1000),
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}

exports.signup = async (req, res) => {
    try {
        const { username,
            email,
            password } = req.body
        const preEmail = await users.findOne({ email });
        if (preEmail) {
            res.send({ message: "email allready exist" })
        }
        else {
            const token = jwt.sign({ password: password }, process.env.JWT_SECRET, {
                expiresIn: `${1000 * 60 * 5}`
            });
            sendmail2(username, email, token)
            res.status(200).send({ message: `mail has been send to the email Id ${email}` })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}


exports.verifySave = async (req, res) => {

    try {

        const token = req.query.token
        const username = req.query.username
        const email = req.query.email
        console.log(req.query)
        const password = jwt.verify(token, process.env.JWT_SECRET);
        if (password) {
            bcrypt.hash(password.password, 12, async function (err, hash) {

                const detail = { email: email, password: hash, username: username }
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

exports.googlelogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        const userDetails = await verifyGoogleToken(
            idToken,
            process.env.GOOGLE_CLIENT_ID
        );
        const user = await users.findOne({ email: userDetails.email });
        if (!user) {
            const hashedPassword = await hashPassword(userDetails.sub);
            const newUser = new users({
                email: userDetails.email,
                username: userDetails.name,
                password: hashedPassword,
            });
            const userSave = await newUser.save();
            const token = jwt.sign({ email: userDetails.email }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            });
            res.json({
                user_id: userSave._id,
                email: userSave.email,
                username: userSave.username,
                token: token,
            });
            console.log({ userSave });
            return;
        }
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        console.log({ success: true, token, username: user.username });
        res.json({
            user_id: user._id,
            email: user.email,
            username: user.username,
            token: token,
        })
    } catch (err) {
        console.log(err);
    }
};


async function verifyGoogleToken(token, CLIENT_ID) {
    try {
        const client = new OAuth2Client(CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID, // Your Google OAuth client ID
        });
        const payload = ticket.getPayload();
        return payload;
    } catch (error) {
        console.error('Error verifying Google token:', error);
        return null;
    }
}


