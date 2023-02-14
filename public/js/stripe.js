import axios from "axios";
import { displayAlert } from "./alerts";

const STRIPE_PUBLIC_KEY =
  "pk_test_51Ma5CEBHs992axk3TZRbQT8c9GlZdaUmOcqddVETkxI6uFNiYekoLQEUQhWlSMr3pUrxJyQZDSCUB87DJKZVGmlx00nsjiix6m";
const stripe = Stripe(STRIPE_PUBLIC_KEY);

const { asyncHandler } = require("./../../utils/lib");
////////////////////////////////////////////////////////////////////////////////////////////////

export const requestBooking = asyncHandler(async function (tourId) {
  try {
    /** get stripe session from server API */
    const _session = await axios(
      `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`
    );
    await stripe.redirectToCheckout({ sessionId: _session.data.session.id });

    /** process customer payment */
  } catch (err) {
    displayAlert("error", err);
  }
});
