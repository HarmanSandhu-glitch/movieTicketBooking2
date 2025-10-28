import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    show: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Show',
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['booked', 'confirmed', 'cancelled', 'completed'],
        default: 'booked'
    },
    seats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seat',
        required: true,
    }],
    hall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hall',
        required: true
    }
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;