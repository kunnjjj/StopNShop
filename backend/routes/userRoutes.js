import express from 'express'
import { authUser,getUserProfile,registerUser,getUserById,updateUserProfile,getUsers,deleteUser, updateUser} from '../controllers/userController.js'
const router=express.Router();
import {protect,admin} from '../middleware/authMiddleware.js'

router.route('/').post(registerUser).get(protect,admin,getUsers)
router.post('/login',authUser)
router.route('/profile')
.get(protect,getUserProfile)
.put(protect,updateUserProfile)
router.route('/:id').delete(protect,admin,deleteUser).get(protect,admin,getUserById).put(protect,admin,updateUser)

export default router