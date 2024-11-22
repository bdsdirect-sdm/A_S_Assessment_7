import { Router } from 'express';
import { sendmail } from '../controller/userController';

const router = Router();

router.post("/checkout", sendmail);

export default router;