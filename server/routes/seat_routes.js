import { getSeat, getHallSeats, getSeatStatus, createSeatsForHall, getShowSeats } from "../controllers/seat_Controllers/index.js";
import express from 'express';
const router = express.Router();

router.get('/show/:showId', getShowSeats);
router.get('/hall/:hallId', getHallSeats);
router.post('/hall/:hallId/create', createSeatsForHall);
router.get('/:seatId/:showId', getSeatStatus);
router.get('/:id', getSeat);

export default router;
