import express from 'express';
import { isAuth, isAdmin } from "../middlewares/authMiddleware.js";
import { 
  createHall, 
  deleteHall, 
  getAllHalls, 
  getHallById, 
  getHallShows, 
  updateHall 
} from "../controllers/hall_controllers/index.js";

const router = express.Router();

router.post('/create', isAuth, isAdmin, createHall);
router.get('/all', getAllHalls);
router.get('/:id', getHallById);
router.get('/:id/shows', getHallShows);
router.put('/:id/update', isAuth, isAdmin, updateHall);
router.delete('/:id/delete', isAuth, isAdmin, deleteHall);

export default router;