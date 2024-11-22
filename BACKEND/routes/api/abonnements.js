const express = require("express");
const router = express.Router();
const abonnement = require("../../models/Abonnements");

router.post("/add", (req, res) => {
    const {  name , duree , prix } = req.body;
    console.log(req.body)

    if (!name || !duree || !prix ) {
        return res.status(400).send({ status: "notok", msg: "Please enter all required data" });
    }

    abonnement.findOne({ name: name })
        .then(async (abonnements) => {
            if (abonnements) {
                return res.status(400).send({status: "notokmail", msg: "cet abbonements existe deja"});
            }

            const newAbonn = new abonnement({

                name,
                duree,
                prix,

            });


            await newAbonn.save();

            res.status(201).json({message: 'abonnements ajouté avec succès', abonnement: newAbonn});

        })
        .catch(err => {
            return res.status(500).send({ status: "error", msg: "Internal server error" });
        });



});


// Read all
router.get("/all", async (req, res) => {
    try {
        const abonnements = await abonnement.find();
        res.status(200).json(abonnements);
    } catch (err) {
        res.status(500).send({ status: "error", msg: "Internal server error" });
    }
});

// Read one
router.get("/:id", async (req, res) => {
    try {
        const abonn = await abonnement.findById(req.params.id);
        if (!abonn) {
            return res.status(404).send({ status: "notok", msg: "Abonnement not found" });
        }
        res.status(200).json(abonn);
    } catch (err) {
        res.status(500).send({ status: "error", msg: "Internal server error" });
    }
});

// Update
router.put("/update/:id", async (req, res) => {
    try {
        const { name, duree, prix } = req.body;
        const updatedAbonn = await abonnement.findByIdAndUpdate(
            req.params.id,
            { name, duree, prix },
            { new: true }
        );
        if (!updatedAbonn) {
            return res.status(404).send({ status: "notok", msg: "Abonnement not found" });
        }
        res.status(200).json({ message: 'Abonnement modifié avec succès', abonnement: updatedAbonn });
    } catch (err) {
        res.status(500).send({ status: "error", msg: "Internal server error" });
    }
});

// Delete
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedAbonn = await abonnement.findByIdAndDelete(req.params.id);
        if (!deletedAbonn) {
            return res.status(404).send({ status: "notok", msg: "Abonnement not found" });
        }
        res.status(200).json({ message: 'Abonnement supprimé avec succès' });
    } catch (err) {
        res.status(500).send({ status: "error", msg: "Internal server error" });
    }
});




module.exports = router;