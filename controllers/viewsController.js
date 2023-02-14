const Tour = require("./../models/tourModel");
const User = require("./../models/userModel");
const Booking = require("./../models/bookingModel");
const { CustomError, asyncHandler } = require("./../utils/lib");
////////////////////////////////////////////////////////////////////////

exports.login = function (req, res) {
  res.status(200).render("login", { title: "Log in" });
};

exports.userAccount = function (req, res) {
  res.status(200).render("account", { title: "Your account" });
};

exports.overview = asyncHandler(async function (req, res, next) {
  const tours = await Tour.find();

  res.status(200).render("overview", { title: "All tours", tours });
});

exports.tour = asyncHandler(async function (req, res, next) {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!tour) return next(new CustomError("No tour found with that name", 404));

  res.status(200).render("tour", { title: `${tour.name} Tour`, tour });
});

exports.scheduledTours = asyncHandler(async function (req, res, next) {
  const _bookings = await Booking.find({ user: req.user.id });
  const _tourIds = _bookings.map((el) => el.tour);
  const _tours = await Tour.find({ _id: { $in: _tourIds } });

  res.status(200).render("overview", {
    title: "My tours",
    tours: _tours,
  });
});
