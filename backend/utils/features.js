class ApiFeature {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const input = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...input });
    return this;
  }
  filter() {
    // task one is to filter the other things from the key word and then use the category keyword
    const queryCopy = { ...this.queryStr };
    const rejectedKeyword = ["keyword", "page", "limit"];
    rejectedKeyword.forEach((key) => {
      delete queryCopy[key];
    });
    let queryCopyStr = JSON.stringify(queryCopy);
    queryCopyStr = queryCopyStr.replace("gt", "$gt");
    queryCopyStr = queryCopyStr.replace("lt", "$lt");
    // i have commented this cuz it automatically adds $ to it
    // queryCopyStr=queryCopyStr.replace("lte","$lte");
    // queryCopyStr=queryCopyStr.replace("gte","$gte");
    queryCopyStr = queryCopyStr.replace("in", "$in");
    queryCopyStr = queryCopyStr.replace("eq", "$eq");
    console.log(queryCopyStr);
    this.query = this.query.find(JSON.parse(queryCopyStr));
    return this;

    // task two is to figure out the input of the query
  }
  pagulation(productPerPage) {
    // finding out what is the current page
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = (currentPage - 1) * productPerPage;
    this.query = this.query.find().limit(productPerPage).skip(skip);

    return this;
  }
}
module.exports = ApiFeature;
