import {
  IPagination,
  IPaginateResult,
  IPaginateOptions,
  IPaginateDefaultOptions,
  Schema,
  PaginateModel,
  DocumentQuery
} from "mongoose";

const defaultOptions: IPaginateDefaultOptions = {
  lean: false,
  perPage: 10,
  projection: "",
  select: ""
};

function genMongooseQuery(
  model: PaginateModel<any>,
  conditions: object,
  options: IPaginateOptions & IPaginateDefaultOptions,
  countDocs: number
): DocumentQuery<any, any> {
  let {
    collation,
    lean,
    perPage,
    populate,
    projection,
    select,
    sort,
    page
  } = options;

  const query = model
    .find(conditions, projection)
    .select(select)
    .sort(sort)
    .lean(lean);
  if (typeof collation !== "undefined") {
    if (Object.keys(collation).length > 0) {
      query.collation(collation);
    }
  }

  if (typeof populate !== "undefined") {
    query.populate(populate);
  }

  const totalPages = Math.ceil(countDocs / perPage) || 1;

  // page === 'undefined' <=> no pagination
  if (typeof page !== "undefined") {
    if (page > totalPages) {
      page = totalPages;
    }
    let skip = (page - 1) * (perPage as number);
    query.skip(skip).limit(perPage);
  }
  return query;
}

function genPagination(
  options: IPaginateOptions & IPaginateDefaultOptions,
  count: number
) {
  let { perPage, page } = options;
  const pagination: IPagination = {
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
    perPage: perPage
  };
  if (typeof page !== "undefined") {
    const totalPages = Math.ceil(count / perPage) || 1;
    pagination.totalPages = totalPages;
    pagination.page = page;
    if (page > totalPages) {
      page = totalPages;
    }
    if (page > 1) {
      pagination.hasPrevPage = true;
      pagination.prevPage = page - 1;
    }
    if (page < totalPages) {
      pagination.hasNextPage = true;
      pagination.nextPage = page + 1;
    }
  }
  return pagination;
}

async function paginate(
  this: PaginateModel<any>,
  conditions: object,
  options: IPaginateOptions & IPaginateDefaultOptions,
  callback: Function
) {
  const isCallbackSpecified = typeof callback === "function";

  try {
    options = {
      ...defaultOptions,
      ...options
    };

    conditions = conditions || {};
    const count = await this.countDocuments(conditions).exec();
    const mongooseQuery = genMongooseQuery(this, conditions, options, count);
    const docs = await mongooseQuery.exec();
    const result: IPaginateResult<any> = {
      data: docs,
      pagination: genPagination(options, count)
    };
    return isCallbackSpecified ? callback(null, result) : result;
  } catch (err) {
    return isCallbackSpecified ? callback(err) : err;
  }
}

export function mongoosePagination(schema: Schema) {
  schema.statics.paginate = paginate;
}
