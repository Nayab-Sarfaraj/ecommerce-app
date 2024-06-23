const Product = require("../models/ProductSchema");
const ErrorHandler = require("../utils/errorHandler");
const ApiFeature = require("../utils/features");
const uploadOnCloudnary = require("../utils/cloudinary")
const createNewProduct = async (req, res, next) => {
  try {
    console.log("called")
    console.log(req.body)
    console.log(req.files)
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No files uploaded.");
    }

    const images = [];

    for (const file of req.files) {
      const localPath = file.path;
      console.log("The local path is " + localPath);
      const uploadedImage = await uploadOnCloudnary(localPath);
      if (!uploadedImage) return next(new ErrorHandler("File is required"));

      images.push({
        public_id: uploadedImage.public_id,
        url: uploadedImage.url
      });
    }

    console.log(images);

    // old code for uploading the single image
    // const localPath = await req.file?.path
    // console.log("the local path is " + localPath)
    // const uploadedImage = await uploadOnCloudnary(localPath)
    // if (!uploadedImage) return next(new ErrorHandler("file is required"))
    // console.log(uploadedImage)

    // console.log(req.user);
    // const images = []
    // images.push({
    //   public_id: uploadedImage.public_id,
    //   url: uploadedImage.url
    // })


    const newProduct = new Product({ ...req.body, user: req.user._id, images });
    const savedProduct = await newProduct.save();
    console.log(savedProduct);
    return res.json({
      succss: true,
      savedProduct,
    });

  } catch (error) {
    console.log(error)
    return next(new ErrorHandler(error.message, 400));
  }
};
const getAllProducts = async (req, res, next) => {
  try {
    console.log("i am being called");
    const productPerPage = 6;
    const apiFeature = new ApiFeature(Product.find(), req.query)
      .search()
      .filter()
      .pagulation(productPerPage);
    const products = await apiFeature.query;
    if (!products) return next(new ErrorHandler("Products doesnt exist", 400));

    // const count = await Product.find().count();
    return res.json({
      succss: true,
      // count,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
};
const getSingleProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return next(new ErrorHandler("Id is required", 400));
    const product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("Product not found ..", 401));
    return res.json({
      succss: true,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler("Something went wrong", 400));
  }
};
const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return next(new ErrorHandler("ID is required ", 400));
    const product = await Product.findByIdAndDelete(id);
    if (!product) return next(new ErrorHandler("Product not found ..", 401));

    return res.json({
      succss: true,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler("Something went wrong", 400));
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return next(new ErrorHandler("id is required", 400));
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!product) return next(new ErrorHandler("Product not found ..", 401));

    return res.json({
      succss: true,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler("Something went wrong", 400));
  }
};
const createProductReview = async (req, res, next) => {
  try {
    const id = req.body.id;
    const product = await Product.findById(id);
    if (!product) {
      return next(new ErrorHandler("Product doesnt exist", 401));
    }
    const { comment, rating } = req.body;
    const review = {
      comment,
      rating,
      user: req.user._id,
      name: req.user.name,
    };
    // check does user review exist
    const isExist = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
    console.log("is exist fdfdf  " + isExist);
    if (isExist) {
      // checking if the review of that user exist or not
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          rev.comment = comment;
          rev.rating = rating;
        }
      });
    } else {
      product.reviews.push(review);
    }
    product.numOfReviews = product.reviews.length;
    let sum = 0;
    product.reviews.forEach((ele) => {
      sum += ele.rating;
    });
    product.ratings = sum / product.numOfReviews;
    await product.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 404));
  }
};
const getAllReviews = async (req, res, next) => {
  try {
    const id = req.body.id;
    const product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("product not found", 404));
    return res.status(200).json({
      success: true,
      review: [...product.reviews],
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
};
const deleteReview = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const product = await Product.findById(productId);
    if (!product) return next(new ErrorHandler("product not found", 404));
    console.log(product);
    const userId = req.body.userId;
    const updatedReviewfield = product.reviews.filter(
      (ele) => ele.user.toString() !== userId.toString()
    );
    const numOfReviews = updatedReviewfield.length;

    let sum = 0;
    updatedReviewfield.forEach((ele) => (sum += ele.rating));
    var ratings = 0;
    if (sum !== 0) ratings = sum / updatedReviewfield.length;
    console.log(ratings);
    await Product.findByIdAndUpdate(
      productId,
      { reviews: updatedReviewfield, numOfReviews, ratings },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res
      .status(201)
      .json({ success: true, message: "Deleted review successfully" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
};
const getAllPrdAdmin = async (req, res, next) => {
  try {
    console.log("i am from admin");
    const products = await Product.find();
    if (!products) return next(new ErrorHandler("No product exist", 404));
    let productCount = 0;
    products.forEach((prd) => ++productCount);
    return res.status(200).json({
      success: true,
      products,
      productCount,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
};
module.exports = {
  createNewProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  createProductReview,
  getAllReviews,
  deleteReview,
  getAllPrdAdmin,
};
