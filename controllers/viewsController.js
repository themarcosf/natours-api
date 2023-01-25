const Tour = require("./../models/tourModel");
const { asyncHandler } = require("./../utils/lib");

exports.overview = asyncHandler(async function (req, res, next) {
  const tours = await Tour.find();

  res.status(200).render("overview", { title: "All tours", tours });
});

exports.tour = asyncHandler(async function (req, res, next) {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  res.status(200).render("tour", { title: `${tour.name} Tour`, tour });
});
