import Listing from "../models/listModel.js";
import { errorHandler } from "../utils/error.js";

export const createList = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathroom,
      bedroom,
      furnished,
      parking,
      type,
      offer,
      imageUrls
    } = req.body;

    // Basic validation
    if (!name || !description || !address || !imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return next(errorHandler(400, 'Missing required fields'));
    }

    const list = await new Listing({
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathroom,
      bedroom,
      furnished,
      parking,
      type,
      offer,
      imageUrls,
      userRef: userId,
    });

    await list.save();
    res.status(201).json({
      success: true,
      message: "List created successfully",
      list,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteList = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if(!listing) next(errorHandler(404, "Listing not found"));
  if(req.user.id !== listing.userRef.toString()) next(errorHandler(401, "Unauthurized User"));

  try {
    const deleteListing = await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({success: true, message: "Listing deleted"});
  } catch (error) {
    next(error)
  }
}

export const editList = async (req, res, next) =>{
  const listing = await Listing.findById(req.params.id);
  if(!listing) next(errorHandler(404, "Listing not found"));
  if(req.user.id !== listing.userRef.toString()) next(errorHandler(401, "UnAuthurized"));

  try {
    const editListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json({success: true, message: "Updated Successfully"})
  } catch (error) {
    next(error);
  }
}

export const getOneList = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if(!listing) next(errorHandler(404, "Listing not found"));

    res.status(200).json({success: true, listing});
  } catch (error) {
    next(error);
  }
}

export const getListings = async (req, res, next) => {
  try {
    
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    
    let {offer} = req.query;
    if(offer === undefined || offer === 'false'){
      offer = {$in: [false, true]};
    }
    let {parking} = req.query;
    if(parking === undefined || parking === 'false'){
      parking = {$in: [false, true]};
    }
    let {furnished} = req.query;
    if(furnished === undefined || furnished === 'false'){
      furnished = {$in: [false, true]};
    }

    const { type } = req.query;
    
    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';
    
    const query = {};
    if (type && ['sell', 'rent'].includes(type)) {
      query.type = type;
    }
    query.offer = offer;
    query.furnished = furnished;
    query.parking = parking;
    query.name= {$regex: searchTerm, $options: 'i'};



    const listings = await Listing.find(query).sort({[sort]: order})
    .limit(limit).skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}