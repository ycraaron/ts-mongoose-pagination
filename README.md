# ts-mongoose-pagination

[![npm version](https://img.shields.io/npm/v/ts-mongoose-pagination.svg)](https://www.npmjs.com/package/ts-mongoose-pagination.svg)
[![Dependency Status](https://david-dm.org/ycraaron/ts-mongoose-pagination.svg)](https://david-dm.org/ycraaron/ts-mongoose-pagination.svg)
[![devDependency Status](https://david-dm.org/ycraaron/ts-mongoose-pagination/dev-status.svg)](https://david-dm.org/ycraaron/ts-mongoose-pagination/dev-status.svg)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/aravindnc/mongoose-paginate-v2/issues)
[![Downloads](https://img.shields.io/npm/dm/ts-mongoose-pagination.svg)](https://img.shields.io/npm/dm/ts-mongoose-pagination.svg)
[![HitCount](http://hits.dwyl.io/aravindnc/ts-mongoose-pagination.svg)](http://hits.dwyl.io/ycraaron/ts-mongoose-pagination)

> Typescript pagination plugin for [Mongoose](http://mongoosejs.com)

## Coverage (97.62%)

```bash
---------------------|----------|----------|----------|----------|-------------------|
File                 |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
---------------------|----------|----------|----------|----------|-------------------|
All files            |     96.3 |       70 |       80 |     96.3 |                   |
 mongoose-pagination |    97.62 |       75 |      100 |    97.62 |                   |
  pagination.ts      |    97.62 |       75 |      100 |    97.62 |               116 |
---------------------|----------|----------|----------|----------|-------------------|
```

[![NPM](https://nodei.co/npm/ts-mongoose-pagination.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/ts-mongoose-pagination)

## Installation

```sh
npm install ts-mongoose-pagination
```

or

```sh
yarn add ts-mongoose-pagination
```

## Usage

Add plugin for a mongoose schema to inject a `paginate` method for pagination:

```ts
import { mongoosePagination } from "ts-mongoose-pagination";

const userSchema = new Schema({
  username: String,
  accounts: [{ type: ObjectId, ref: "Account" }]
});
userSchema.plugin(mongoosePagination);
const User: PaginateModel<TUser> = mongoose.model("User", userSchema);

//User.paginate()
```

### Model.paginate([query conditions], [options], [callback])

#### **Parameters**

- `[query]` {Object} - Query conditions. [Documentation](https://docs.mongodb.com/manual/tutorial/query-documents/)
- `[options]` {Object}
  - `[select]` {Object | String} - Fields to return (by default returns all fields). [Documentation](http://mongoosejs.com/docs/api.html#query_Query-select)
  - `[sort]` {Object | String} - Sort order. [Documentation](http://mongoosejs.com/docs/api.html#query_Query-sort)
  - `[populate]` {Object | String} - Paths which should be populated with other documents. [Documentation](http://mongoosejs.com/docs/api.html#query_Query-populate)
  - `[lean=false]` {Boolean} - Should return plain javascript objects instead of Mongoose documents [Documentation](http://mongoosejs.com/docs/api.html#query_Query-lean)
  - `[page=1]` {Number}, **if undefined, will return all docs without pagination**
  - `[perPage=10]` {Number}, number of docs per page, default is 10
- `[callback(err, result)]` - If specified the callback is called once pagination results are retrieved or when an error has occurred

#### Return value

Promise fulfilled with an IPaginateResult:

```ts
interface IPaginateResult<T> {
  data: T[];
  pagination: IPagination;
}

interface IPagination {
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
  perPage: number;
  page?: number | null;
  totalPages?: number;
}
```

## Tests

### Coverage

```bash
--------------|----------|----------|----------|----------|-------------------|
File          |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
--------------|----------|----------|----------|----------|-------------------|
All files     |    96.43 |       70 |       80 |    96.43 |                   |
 src          |    97.73 |       75 |      100 |    97.73 |                   |
  index.ts    |    97.73 |       75 |      100 |    97.73 |               116 |
--------------|----------|----------|----------|----------|-------------------|
```

### Run tests

1. Set up local mongo db
2. Run:

```sh
yarn
yarn test
```

### Examples

Detailed examples could be found in `Pagination.test.ts`

#### Paginate with

```ts
await Model.paginate({})
});
```

#### More advanced example

```ts
var conditions = {};
var options = {
  select: "title date author",
  sort: { date: -1 },
  populate: "account",
  lean: true,
  perPage: 5
};

User.paginate(conditions, options).then(result => {
  // ...
});
```

## Explaination for some choices made

1. Why remove the offset in the options?
   Think about the scenario when we use offset and limit(refer to the implementation in [mongoose-paginate](https://github.com/edwardhotchkiss/mongoose-paginate/blob/d06a7d43ac2c404ef522e7cdc52d3de5eebd52e3/index.js#L29))

   ```ts
   User.paginate(conditions, {offset:50, limit: 10}).then(result => {
   // ...
   ```

   why not just use:

   ```ts
   User.find(conditions, { offset: 50, limit: 10 }).then(result => {
     // ...
   });
   ```

## Acknowledgement

Thanks for the insparation from the following mongoose pagination js implementation.
[mongoose-paginate](https://github.com/edwardhotchkiss/mongoose-paginate)
[mongoose-paginate-v2](https://www.npmjs.com/package/mongoose-paginate-v2)

## License

[MIT](LICENSE)
