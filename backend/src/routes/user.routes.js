import { Router} from "express"
import { getAllUsers, getUser, updateUser, deleteUser, updateUsersStreak, createUser, resetUserpassword,  analytics } from "../controllers/user.controller.js"
import {protectRoute, roleCheck} from "../middlewares/auth.middleware.js"
import { uploadSingle } from "../middlewares/multer.middleware.js"



const router = Router()

//User management
//actions that can be performed by the user and admin
//get user by id
router.route("/:id").get(protectRoute, getUser)
//update user by their id
router.route("/:id").put(protectRoute, uploadSingle("avatar"), updateUser)

//update users streaks
router.route("/:id/streaks").get(protectRoute, updateUsersStreak)
router.route("/:id/streaks").put(protectRoute, updateUsersStreak)

// admin actions
//create user
router.route("/").post(protectRoute, roleCheck, uploadSingle("avatar"), createUser)
router.route("/:id/resetpassword").post(protectRoute, roleCheck, uploadSingle("avatar"), resetUserpassword)
//delete user by id
router.route("/:id").delete(protectRoute, roleCheck, deleteUser)
//get all the users
router.route("/").get(protectRoute, roleCheck, getAllUsers)
//get users stats
router.route("/admin/statistics").get(protectRoute, roleCheck, analytics)
export default router;


