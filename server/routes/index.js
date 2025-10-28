import express from 'express';
import userRoutes from './user_routes.js';
import hallRoutes from './hall_routes.js';
import showRoutes from './show_routes.js';
import seatRoutes from './seat_routes.js';
import ticketRoutes from './ticket_routes.js';
import uploadRoutes from './upload_routes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/halls', hallRoutes);
router.use('/shows', showRoutes);
router.use('/seats', seatRoutes);
router.use('/tickets', ticketRoutes);
router.use('/upload', uploadRoutes);

export default router;
