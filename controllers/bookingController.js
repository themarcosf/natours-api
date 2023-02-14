const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Tour = require("./../models/tourModel");
const Booking = require("./../models/bookingModel");
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
   *
   * @dev security issue on "success_url": check createBookingStripe() below
   */
  const _session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    // prettier-ignore
    success_url: 
      `${req.protocol}://${req.get("host")}/?tour=${_tour.id}&user=${req.user.id}&price=${_tour.price}`,
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

/**
 * @dev create a new booking once payment is completed
 *      - node_env=prod : access Session Object once purchase is completed using Stripe Webhooks
 *      - node_env=dev : hackish, temporary, not secure solution
 *            use GET query strings to put data on "success_url"
 *            security issue: anyone with URL could book a tour without having to pay
 */
exports.createBookingStripe = asyncHandler(async function (req, res, next) {
  const { tour, user, price } = req.query;
  if (!tour || !user || !price) return next();
  await Booking.create({ tour, user, price });

  /** security feature : redirect to root removing query strings */
  res.redirect(req.originalUrl.split("?")[0]);
});
