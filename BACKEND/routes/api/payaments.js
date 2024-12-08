const express = require("express");
const router = express.Router();
const Payment = require("../../models/Payement");

router.post("/add", (req, res) => {
    const {utilisateurId, abonnementId, numeroCarte, cvv, nomDePropDeCarte , months} = req.body;

    if (!utilisateurId || !abonnementId || !numeroCarte || !cvv || !nomDePropDeCarte || !months) {
        return res.status(400).send({status: "notok", msg: "Please enter all required data"});
    }

    const newPayment = new Payment({
        utilisateurId,
        abonnementId,
        numeroCarte,
        cvv,
        nomDePropDeCarte,
        dateExpirationAbon: new Date(new Date().setMonth(new Date().getMonth() + months)) // Set to 3 months from now
    });

    newPayment.save()
        .then(payment => {
            res.status(201).json({message: 'Payment added successfully', payment});
        })
        .catch(err => {
            res.status(500).send({status: "error", msg: "Internal server error"});
        });

});
router.get("/all", async (req, res) => {
    try {
        const payments = await Payment.find();
        res.status(200).json(payments);
    } catch (err) {
        res.status(500).send({status: "error", msg: "Internal server error"});
    }
});
// Read one
router.get("/:id", async (req, res) => {
    try {
        async function findPayments() {
            try {
                const findResult = await Payment.find({
                    utilisateurId: req.params.id
                });

                for (const doc of findResult) {
                    const dateNow = new Date();
                    if (doc.dateExpirationAbon >= dateNow) {
                        return true; // Active subscription found
                    }
                }

                return false; // No active subscription found
            } catch (error) {
                console.error("Erreur lors de la recherche des paiements :", error);
                return false; // Return false in case of error
            }
        }

        const hasActiveSubscription = await findPayments();
        console.log(hasActiveSubscription);
        const payment = await Payment.find({
            utilisateurId: req.params.id
        });
        const result ={
            hasActiveSubscription,
            payment
        }



        if (!payment) {
            return res.status(404).send({status: "notok", msg: "Payment not found"});
        }
        if(hasActiveSubscription){
            res.status(200).json(result);

        }
    } catch (err) {
        res.status(500).send({status: "error", msg: "Internal server error"});
    }
});

// Get payments by user
router.get("/user/:utilisateurId", async (req, res) => {
    try {
        const payments = await Payment.find({utilisateurId: req.params.utilisateurId});
        res.status(200).json(payments);
    } catch (err) {
        res.status(500).send({status: "error", msg: "Internal server error"});
    }
});

// Update
router.put("/update/:id", async (req, res) => {
    try {
        const {utilisateurId, abonnementId, numeroCarte, cvv, nomDePropDeCarte} = req.body;

        const updatedPayment = await Payment.findByIdAndUpdate(
            req.params.id,
            {
                utilisateurId,
                abonnementId,
                numeroCarte,
                cvv,
                nomDePropDeCarte,
                dateExpirationAbon: new Date(new Date().setMonth(new Date().getMonth() + 3))
            },
            {new: true}
        );

        if (!updatedPayment) {
            return res.status(404).send({status: "notok", msg: "Payment not found"});
        }
        res.status(200).json({message: 'Payment updated successfully', payment: updatedPayment});
    } catch (err) {
        res.status(500).send({status: "error", msg: "Internal server error"});
    }
});

// Delete
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
        if (!deletedPayment) {
            return res.status(404).send({status: "notok", msg: "Payment not found"});
        }
        res.status(200).json({message: 'Payment deleted successfully'});
    } catch (err) {
        res.status(500).send({status: "error", msg: "Internal server error"});
    }
});
module.exports = router;
