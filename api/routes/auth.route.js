import express from 'express';
import { facebook, google, signin, signup } from '../controllers/auth.controller.js';

const router = express.Router();


router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google)
router.post('/facebook', facebook)

export default router;