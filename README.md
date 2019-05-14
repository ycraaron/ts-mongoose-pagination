# mongoose-paginate-ts

> Typescript pagination plugin for [Mongoose](http://mongoosejs.com)

# **Note:** This plugin will only work with Node.js >= 4.2 and Mongoose >= 4.2

## Installation

```sh
npm install mongoose-paginate-ts
```

or

```sh
yarn mongoose-paginate-ts
```

## Usage

Add plugin for a mongoose schema to inject a `paginate` method for pagination:

```ts
import { mongoosePagination } from "mongoose-paginate-ts";

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

**Return value**

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

```
--------------|----------|----------|----------|----------|-------------------|
File          |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
--------------|----------|----------|----------|----------|-------------------|
All files     |    96.43 |       70 |       80 |    96.43 |                   |
 src          |    97.73 |       75 |      100 |    97.73 |                   |
  index.ts    |    97.73 |       75 |      100 |    97.73 |               116 |
--------------|----------|----------|----------|----------|-------------------|
```

### Run tests

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

## License

[MIT](LICENSE)
