const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    utilisateurId: {
        type: String,
        required: true,
    },
    abonnementId: {
        type: String,
        required: true,
    },
    numeroCarte: {
        type: Number,
        required: true,
    },
    cvv: {
        type: Number,
        required: true,
    },
    nomDePropDeCarte: {
        type: String,
        required: true,
    },
    dateExpirationAbon: {
        type: Date,
        required: true,
        default: () => new Date(new Date().setMonth(new Date().getMonth() + 3)) // Current date + 3 months
    }
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
