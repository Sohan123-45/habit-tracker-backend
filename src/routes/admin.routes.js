const express=require("express");
const {isAuthenticated}=require("../middlewares/auth.middleware");
const {authorizeRoles}=require("../middlewares/role.middleware");
const adminController=require("../controllers/admin.controller");

const router=express.Router();

router.patch("/ban/:userId",isAuthenticated,authorizeRoles("admin","owner"),adminController.banUser);
router.patch("/unban/:userId",isAuthenticated,authorizeRoles("admin","owner"),adminController.unbanUser);
router.get("/all-data/:userId",isAuthenticated,authorizeRoles("owner"),adminController.getAllData);
router.get("/all-users",isAuthenticated,authorizeRoles("admin","owner"),adminController.getUsers);
router.patch("/make-admin/:userId",isAuthenticated,authorizeRoles("owner"),adminController.makeAdmin);
router.patch("/remove-admin/:userId",isAuthenticated,authorizeRoles("owner"),adminController.removeAdmin);

module.exports=router;