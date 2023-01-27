const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

/**
 * EXPLANATION: queries in mongoose
 *
 * 1. methods of the Model object (eg Model.find()) return instances of the Query object
 * 2. instances of the Query object (Query.prototype.*) use chainable methods
 * 3. async/await executes the query immediately and return the documents that match the query
 *
 *       = SOLUTION
 *       . first store the query in a temporary variable (const _query)
 *       . chain all necessary methods in a final variable (const query)
 *       . await the final query only after chaining
 */
class QueryHelpers {
  constructor(expressQuery, mongooseQuery) {
    this.expressQuery = expressQuery;
    this.mongooseQuery = mongooseQuery;
    this.queryParams = ["sort", "fields", "page", "limit"];
  }

  filter() {
    /**
     * filter: allows users to filter data
     * advanced filtering: filter[logical operator] eg duration[gte]
     */
    const _query = JSON.parse(
      JSON.stringify({ ...this.expressQuery }).replace(
        /\b(gt|gte|lt|lte)\b/g,
        (match) => `$${match}`
      )
    );
    this.queryParams.forEach((el) => delete _query[el]);
    this.mongooseQuery.find(_query);

    return this;
  }

  sort() {
    /**
     * sorting: enables users to sort the results
     *   sort=field : ascending order
     *   sort=-field : descending order
     *   sort=field1,field2,... : multiple criteria
     */
    if (this.expressQuery.sort) {
      const sortBy = this.expressQuery.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }

    return this;
  }

  fields() {
    /**
     * field limiting: allow clients to choose which fields appear in the response
     */
    if (this.expressQuery.fields) {
      const fields = this.expressQuery.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }

    return this;
  }

  paginate() {
    /**
     * pagination: allow page selection in data intensive APIs
     *   page=number : page to be sent in the response
     *   limit=number : limit of data in the response
     *   skip(number) : amount of results to be skipped before querying data
     *   limit(number) : maximum amount of results in the query response
     *   eg limit=10, page=1 1-10, page=2 11-20, page=3 21-30, ...
     */
    if (this.expressQuery.page || this.expressQuery.limit) {
      const _page = Number(this.expressQuery.page) || 1;
      const _limit = Number(this.expressQuery.limit) || 10;
      const _skip = _limit * (_page - 1);
      this.mongooseQuery = this.mongooseQuery.skip(_skip).limit(_limit);
    }

    return this;
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @property isOperational : distinguish operational error from other unknown errors
 *
 * Error.captureStackTrace : creates the stack property on Error instance
 * @param this : target object
 * @param this.constructor : error class
 */
class CustomError extends Error {
  constructor(msg, statusCode) {
    super(msg);
    this.statusCode = statusCode;
    this.status = String(this.statusCode).startsWith(4) ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////

/** handles uncaught (sync) exceptions and (async) rejections */
const terminate = function (err, server) {
  console.log(err.name, err.message);
  if (server) server.close();
  process.exit(-1);
};
//////////////////////////////////////////////////////////////////////////////////////////////////

const filterData = function (data, ...filters) {
  const _filteredData = {};
  Object.keys(data).forEach((el) => {
    if (filters.includes(el)) _filteredData[el] = data[el];
  });
  return _filteredData;
};
//////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * wrapper function to catch errors in async functions
 *
 * @param {function} fn
 * @returns void
 */
const asyncHandler = function (fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
};
//////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @notice this function is used throughout application to handle emails
 *
 * @param options : destination address, email subject, context, etc
 *
 * @dev nodemailer provides well-known email services (eg gmail) pre-configured
 * @dev activate in gmail account: "less secure app" option
 * @dev mailtrap.io: staging and dev environment for email testing and validation
 */
const emailHandler = async function (options) {
  // create transporter (smtp server)
  const _gmailTransporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const _mailTrapTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // define email options
  const _options = {
    from: "Natours Co. <customers@natours.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // send email using nodemailer
  await _mailTrapTransporter.sendMail(_options);
};
//////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @param {mongoDB _id} userId
 * @returns token
 */
const jwtTokenGenerator = function (userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
//////////////////////////////////////////////////////////////////////////////////////////////////

const setupResponse = function (_user, _statusCode, _res) {
  const _token = jwtTokenGenerator(_user._id);
  const _options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") _options.secure = true;

  _res.cookie("jwt", _token, _options);

  return _res
    .status(_statusCode)
    .json({
      status: "success",
      token: _token,
      data: {
        name: _user.name,
        email: _user.email,
      },
    })
    .end();
};
//////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
  QueryHelpers,
  CustomError,
  asyncHandler,
  emailHandler,
  filterData,
  jwtTokenGenerator,
  setupResponse,
  terminate,
};
