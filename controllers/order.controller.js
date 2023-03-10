import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";

import createError from "../utils/createError.js";

import Stripe from "stripe";

export const intent = async (req, res, next) => {
  try {
    const stripe = new Stripe(process.env.STRIPE);

    const gig = await Gig.findById(req.params.id);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price * 100,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      buyerId: req.userId,
      sellerId: gig.userId,
      price: gig.price,
      payment_intent: paymentIntent.id,
    });

    await newOrder.save();

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};

// export const createOrder = async (req, res, next) => {
//   try {
//     const gig = await Gig.findById(req.params.gigId);
//     // all info is taken from gig and not user
//     // if (req.buyerId === gig) {
//     //   return res.status(403).send("you are seller cannot buy your own order");
//     // }
//     const newOrder = new Order({
//       gigId: gig._id,
//       img: gig.cover,
//       title: gig.title,
//       buyerId: req.userId,
//       sellerId: gig.userId,
//       price: gig.price,
//       payment_intent: "temp",
//     });

//     await newOrder.save();
//     res.status(200).send("successful");
//   } catch (error) {
//     next(error);
//   }
// };

export const getOrders = async (req, res, next) => {
  try {
    // will fetch only orders belonging to logged in user
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });
    res.status(200).send(orders);
  } catch (error) {
    next(error);
  }
};

export const confirm = async (req, res, next) => {
  try {
    // will fetch only orders belonging to logged in user
    const orders = await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );
    res.status(200).send("Order has been confirmed");
  } catch (error) {
    next(error);
  }
};
