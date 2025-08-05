// controllers/userController.js
import User from '../models/userModel.js';
import Listing from '../models/listModel.js';
import { errorHandler } from '../utils/error.js';
import bcrypt from 'bcryptjs';

export const updateProfilePhoto = async (req, res, next) => {
  try {
    const userId = req.user.id; // must come from token middleware
    const { avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true }
    ).select('-password'); // remove password from return

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashPassword },
      { new: true }
    ).select('-password'); // remove password from return

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, 
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
        }
      },
      {new: true, runValidators: true }).select('-password');

    if(!updatedUser) next(errorHandler(401, "Something went wrong"));

    res.status(200).json({
      success: true,
      message: "Information updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

export const verifyPassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    const user = await User.findById(userId);
    if (!user) return next(errorHandler(404, "User not found"));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(errorHandler(401, "Incorrect password"));

    res.status(200).json({ success: true, message: "Password verified" });
  } catch (err) {
    next(err);
  }
};

export const getUserListing = async (req, res, next) => {
  if(req.user.id === req.params.id){
    try {
      const listings = await Listing.find({userRef: req.params.id});
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  }else{
    next(errorHandler(401, "You can only see your Listings"))
  }
}

export const getUser = async (req, res, next)=>{
  try {
    const user = await User.findById(req.params.id);
    if(!user) next(errorHandler(401, "User not found"));
    const {password: pass, ...rest} = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}