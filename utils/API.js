/*
EXPLANATION: queries in mongoose

1. methods of the Model object (eg Model.find()) return instances of the Query object
2. instances of the Query object (Query.prototype.*) use chainable methods
3. async/await executes the query immediately and return the documents that match the query

      = SOLUTION
      . first store the query in a temporary variable (const _query)
      . chain all necessary methods in a final variable (const query)
      . await the final query only after chaining 
*/
////////////////////////////////////////////////////////////////////////

class API {
  constructor(expressQuery, mongooseQuery) {
    this.expressQuery = expressQuery;
    this.mongooseQuery = mongooseQuery;
    this.queryParams = ["sort", "fields", "page", "limit"];
  }

  filter() {
    /*
    filter: allows users to filter data
      advanced filtering: filter[logical operator] eg duration[gte]
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
    /*
    sorting: enables users to sort the results
      sort=field : ascending order
      sort=-field : descending order
      sort=field1,field2,... : multiple criteria
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
    /*
    field limiting: allow clients to choose which fields appear in the response
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
    /*
    pagination: allow page selection in data intensive APIs
      page=number : page to be sent in the response
      limit=number : limit of data in the response
      skip(number) : amount of results to be skipped before querying data
      limit(number) : maximum amount of results in the query response
      eg limit=10, page=1 1-10, page=2 11-20, page=3 21-30, ...
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

module.exports = API;
