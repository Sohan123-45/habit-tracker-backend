const express=require('express');
const multer=require("multer");  
const habitsController=require('../controllers/habits.controller');
const {isAuthenticated}=require("../middlewares/auth.middleware");

const router=express.Router();
const upload=multer({storage:multer.memoryStorage()});

router.post("/",isAuthenticated,habitsController.createHabit); //create new habit
router.patch("/:id/color",isAuthenticated,habitsController.changeColor); //change color
router.post("/:id/log",isAuthenticated,upload.single("file"),habitsController.logHabit); //log habit
router.delete("/post/:postId",isAuthenticated,habitsController.deleteHabitLog); //delete habit log
router.delete("/:habitId",isAuthenticated,habitsController.deleteHabit); //deleting habit
router.patch("/nameChange/:habitId",isAuthenticated,habitsController.updateHabitName);
router.patch("/titleChange/:postId",isAuthenticated,habitsController.updatePostTitle);
router.get("/gethabits",isAuthenticated,habitsController.getHabits)
router.get("/:habitId/posts",isAuthenticated,habitsController.getHabitPosts); //get all posts or habit logs

module.exports=router;