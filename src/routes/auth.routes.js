const express=require('express');
const authController=require('../controllers/auth.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const validateRegister=require("../middlewares/validateRegister.middleware");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// Rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later"
});

router.use(authLimiter);

router.post("/register",validateRegister,authController.registerUser);
router.post("/login",authController.loginUser);
router.post("/logout",isAuthenticated,authController.logoutUser);

module.exports=router;