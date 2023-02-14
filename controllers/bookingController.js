const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Tour = require("./../models/tourModel");
const { asyncHandler } = require("./../utils/lib");
////////////////////////////////////////////////////////////////////////

/** handler function to get Stripe checkout session */
exports.stripeCheckout = asyncHandler(async function (req, res, next) {
  /** get current booking tour */
  const _tour = await Tour.findById(req.params.tourId);

  /**
   * create checkout session
   * @dev client_reference_id : custom field, allow creation of new booking
   * @dev line_items : info about the product being purchased
   */
  const _session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${_tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: _tour.price * 100,
          product_data: {
            name: `${_tour.name} Tour`,
            description: _tour.summary,
            // images: [""],
          },
        },
        quantity: 1,
      },
    ],
  });

  /** send session as response */
  res
    .status(200)
    .json({
      status: "success",
      session: _session,
    })
    .end();
});
