import express from 'express';
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import {
  generateTicket,
  getAllTickets,
  getUserTickets,
  updateTicketStatus
} from "../controllers/ticket_controllers/index.js";

const router = express.Router();

// Static routes first
router.post('/generate', isAuth, generateTicket);
router.get('/all', isAuth, isAdmin, getAllTickets);

// Dynamic routes after
router.get('/user/:userId', isAuth, getUserTickets);
router.put('/:id/update-status', isAuth, updateTicketStatus);

export default router;