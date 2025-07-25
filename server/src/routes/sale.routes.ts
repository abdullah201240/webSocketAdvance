import {getSales, addSale} from "../controllers/sale.controller";
import { updateSale, deleteSale } from "../controllers/sale.controller";
import {Router} from "express";
const router = Router();
// Route to add a new sale
router.post('/sales', addSale);
// Route to get all sales
router.get('/sales', getSales);
// Add update and delete routes
router.put('/sales/:id', updateSale);
router.delete('/sales/:id', deleteSale);
export default router;