const { CustomError, asyncHandler, QueryHelpers } = require("./lib");

const createOne = (Model) =>
  asyncHandler(async function (req, res, next) {
    const _document = await Model.create(req.body);
    res
      .status(201)
      .json({
        status: "Success",
        data: { _document },
      })
      .end();
  });

const readOne = (Model, populateOptions) =>
  asyncHandler(async function (req, res, next) {
    let _query = Model.findById(req.params.id);
    if (populateOptions) _query.populate(populateOptions);

    const _document = await _query;

    if (!_document) return next(new CustomError("Document not found", 404));

    res
      .status(200)
      .json({
        status: "success",
        data: { _document },
      })
      .end();
  });

const readAll = (Model) =>
  asyncHandler(async function (req, res, next) {
    // allow nested route
    let _filter = {};
    if (req.params.tourId) _filter = { tour: req.params.tourId };

    const query = new QueryHelpers(req.query, Model.find(_filter))
      .filter()
      .sort()
      .fields()
      .paginate();
    const _documents = await query.mongooseQuery;

    res
      .status(200)
      .json({
        status: "success",
        results: _documents.length,
        data: { _documents },
      })
      .end();
  });

const updateOne = (Model) =>
  asyncHandler(async function (req, res, next) {
    const _document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!_document) return next(new CustomError("Document not found", 404));

    res
      .status(200)
      .json({
        status: "sucess",
        data: { _document },
      })
      .end();
  });

const deleteOne = (Model) =>
  asyncHandler(async function (req, res, next) {
    const _document = await Model.findByIdAndDelete(req.params.id);

    if (!_document) return next(new CustomError("Document not found", 404));

    res
      .status(204)
      .json({
        status: "sucess",
        data: null,
      })
      .end();
  });

module.exports = { createOne, readOne, readAll, updateOne, deleteOne };
