const router = require("express").Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const Users = require("../../models/User");

router.post("/register", (req, res) => {
    const { username, email, password, role } = req.body;
    console.log(req.body)

    if (!username || !email || !password) {
        return res.status(400).send({ status: "notok", msg: "Please enter all required data" });
    }

    Users.findOne({ email: email })
        .then((user) => {
            if (user) {
                return res.status(400).send({ status: "notokmail", msg: "Email already exists" });
            }

            const newUser = new Users({
                username,
                email,
                password,
                role
            });

            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    return res.status().status().send({ status: "error", msg: "Internal server error" });
                }

                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        return res.status(500).send({ status: "error", msg: "Internal server error" });
                    }

                    newUser.password = hash;
                    newUser.save()
                        .then((user) => {
                            jwt.sign(
                                { id: user.id },
                                config.get("jwtSecret"),
                                { expiresIn: config.get("tokenExpire") },
                                (err, token) => {
                                    if (err) {
                                        return res.status(500).send({ status: "error", msg: "Internal server error" });
                                    }
                                    res.status(200).send({ status: "ok", msg: "Successfully registered", token, user });
                                }
                            );
                        })
                        .catch(err => {
                            return res.status(500).send({ status: "error", msg: "Internal server error" });
                        });
                });
            });
        })
        .catch(err => {
            return res.status(500).send({ status: "error", msg: "Internal server error" });
        });
});
// Login Backend

// @route     post
// @desc      Login user
// @access    Public
router.post("/login-user", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please provide email and password" });
    }

    Users.findOne({ email: email }).then((user) => {
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) {
                return res.status(401).json({ error: "Incorrect password" });
            }

            jwt.sign(
                { id: user.id },
                config.get("jwtSecret"),
                { expiresIn: config.get("tokenExpire") },
                (err, token) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: "Internal server error" });
                    }
                    return res.status(200).json({ token });
                }
            );
        }).catch((err) => {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        });
    });
});

module.exports = router;