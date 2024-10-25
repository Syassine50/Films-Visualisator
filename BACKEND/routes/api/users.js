const router = require("express").Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const Users = require("../../models/User");

router.post("/register", (req, res) => {
    const {  email, password, role  , firstname , lastname ,phone } = req.body;
    console.log(req.body)

    if (!email || !password || !firstname || !lastname || !phone) {
        return res.status(400).send({ status: "notok", msg: "Please enter all required data" });
    }

    Users.findOne({ email: email })
        .then((user) => {
            if (user) {
                return res.status(400).send({ status: "notokmail", msg: "Email already exists" });
            }

            const newUser = new Users({

                email,
                password,
                role,
                firstname,
                lastname,
                phone

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
                    return res.status(200).json({ token }) , this.email;
                }
            );
        }).catch((err) => {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        });
    });
});

// Lire tous les utilisateurs (READ)

router.get('/all', async (req, res) => {

    try {

        const users = await Users.find();
        res.status(200).json(users);

    } catch (error) {

        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error });

    }

});



// Lire un utilisateur par ID (READ)

router.get('/:id', async (req, res) => {

    const { id } = req.params;



    try {

        const user = await Users.findById(id);

        if (!user) {

            return res.status(404).json({ message: 'Utilisateur non trouvé' });

        }

        res.status(200).json(user);

    } catch (error) {

        res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error });

    }

});



// Mettre à jour un utilisateur par ID (UPDATE)

router.put('/:id', async (req, res) => {

    const { id } = req.params;

    const {  email, password, role , lastname , firstname , phone} = req.body;



    try {

        const updatedUser = await Users.findByIdAndUpdate(

            id,

            {  email, password, role , lastname , firstname , phone},

            { new: true }

        );

        if (!updatedUser) {

            return res.status(404).json({ message: 'Utilisateur non trouvé' });

        }

        res.status(200).json({ message: 'Utilisateur mis à jour avec succès', updatedUser });

    } catch (error) {

        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', error });

    }

});



// Supprimer un utilisateur par ID (DELETE)

router.delete('/:id', async (req, res) => {

    const { id } = req.params;



    try {

        const deletedUser = await Users.findByIdAndDelete(id);

        if (!deletedUser) {

            return res.status(404).json({ message: 'Utilisateur non trouvé' });

        }

        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });

    } catch (error) {

        res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error });

    }

});


module.exports = router;