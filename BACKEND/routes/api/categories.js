const express = require("express");
const router = express.Router();
const categorie = require("../../models/Categorie");

router.post("/add", (req, res) => {
    const {  name } = req.body;
    console.log(req.body)

    if (!name  ) {
        return res.status(400).send({ status: "notok", msg: "Please enter all required data" });
    }

    categorie.findOne({ name: name })
        .then(async (Categories) => {
            if (Categories) {
                return res.status(400).send({status: "notokmail", msg: "cettz categorie existe deja"});
            }

            const newCategorie = new categorie({

                name,

            });


            await newCategorie.save();

            res.status(201).json({message: 'Categorie ajouté avec succès', categorie: newCategorie});

        })
        .catch(err => {
            return res.status(500).send({ status: "error", msg: "Internal server error" });
        });


});


// Read all
router.get("/all", async (req, res) => {
    try {
        const categories = await categorie.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).send({ status: "error", msg: "Internal server error" });
    }
});

// Read one
router.get("/:id", async (req, res) => {
    try {
        const cat = await categorie.findById(req.params.id);
        if (!cat) {
            return res.status(404).send({ status: "notok", msg: "Categorie not found" });
        }
        res.status(200).json(cat);
    } catch (err) {
        res.status(500).send({ status: "error", msg: "Internal server error" });
    }
});

// Update
router.put("/update/:id", async (req, res) => {
    try {
        const { name } = req.body;
        const updatedCat = await categorie.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );
        if (!updatedCat) {
            return res.status(404).send({ status: "notok", msg: "Categorie not found" });
        }
        res.status(200).json({ message: 'Categorie modifiée avec succès', categorie: updatedCat });
    } catch (err) {
        res.status(500).send({ status: "error", msg: "Internal server error" });
    }
});

// Delete
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedCat = await categorie.findByIdAndDelete(req.params.id);
        if (!deletedCat) {
            return res.status(404).send({ status: "notok", msg: "Categorie not found" });
        }
        res.status(200).json({ message: 'Categorie supprimée avec succès' });
    } catch (err) {
        res.status(500).send({ status: "error", msg: "Internal server error" });
    }
});


module.exports = router;