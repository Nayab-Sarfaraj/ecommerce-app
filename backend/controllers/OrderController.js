const Order = require("../models/OrderSchema");
const Products = require("../models/ProductSchema");
const error = require("../middleware/error");

const creatrOrder = async (req, res, next) => {
  try {
    console.log(req.user);
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      orderStatusmentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
    const order = await Order({
      shippingInfo,
      orderItems,
      paymentInfo,
      orderStatusmentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      user: req.user._id,
      paidAt: Date.now(),
    });
    // console.log(newOrder);
    const savedOrder = await order.save();
    console.log(savedOrder);
    return res.json({
      success: true,
      savedOrder,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
};

const getSingleOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return next(new ErrorHandler("Invalid order id", 401));
    const order = await Order.findById(id).populate("user", "name email");
    console.log(order);
    if (!order) return next(new ErrorHandler("order not found", 400));
    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id);
    console.log(order);
    if (!order) return next(new ErrorHandler("Order not found", 404));
    if (order.orderStatus === "delivered") {
      return next(new ErrorHandler("order has already been delivered", 401));
    }
    order.orderItems.forEach((order) => {
      updateStock(order.product, order.quantity);
    });
    order.orderStatus = req.body.status;
    await order.save({ validateBeforeSave: false });
    return res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};
const updateStock = async (id, quantity) => {
  console.log(id);
  console.log(quantity);
  const product = await Products.findById(id.toString());
  console.log(product);
  product.Stock -= quantity;
  await product.save({ validateBeforeSave: false });
};
const deleteOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder)
      return next(new ErrorHandler("Order does not exist", 404));
    return res.json({ success: true, deletedOrder });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};
const getAllOrders = async (req, res, next) => {
  try {
    const order = await Order.find();
    if (!order) return next(new ErrorHandler("Order not found", 404));
    let totalAmount = 0;
    let orderCount = 0;
    order.map((ord) => {
      totalAmount += ord.shippingPrice + ord.taxPrice + ord.itemsPrice;
      ++orderCount;
    });
    return res
      .status(200)
      .json({ success: true, order, totalAmount, orderCount });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};
const getLoggedInUserOrder = async (req, res, next) => {
  try {
    console.log(req.user);
    const order = await Order.find({ user: req.user._id });
    console.log(order);
    if (!order) return next(new ErrorHandler("Order not found", 404));
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.log("here");
    console.log(error);
    return next(new ErrorHandler(error.message, 401));
  }
};
module.exports = {
  creatrOrder,
  getSingleOrder,
  updateStatus,
  deleteOrder,
  getAllOrders,
  getLoggedInUserOrder,
};
