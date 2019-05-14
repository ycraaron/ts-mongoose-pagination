import mongoose from "mongoose";
import { User, Account, TUser } from "./fixtures";

const dummmUserName = "Ann0316";
const dummyAccountName1 = "dummyAccount1";
const dummyAccountName2 = "dummyAccount2";
const dummyAccountName3 = "dummyAccount3";
const dummyAccountName4 = "dummyAccount4";
const dummyAccountName5 = "dummyAccount5";
const dummyAccountName6 = "dummyAccount6";
const dummyAccountName7 = "dummyAccount7";
const dummyAccountName8 = "dummyAccount8";
const dummyAccountName9 = "dummyAccount9";
const dummyAccountName10 = "dummyAccount10";
const dummyAccountName11 = "dummyAccount11";
const testUser = { username: dummmUserName };
const testAccounts = [
  {
    accountName: dummyAccountName1
  },
  {
    accountName: dummyAccountName2
  },
  {
    accountName: dummyAccountName3
  },
  {
    accountName: dummyAccountName4
  },
  {
    accountName: dummyAccountName5
  },
  {
    accountName: dummyAccountName6
  },
  {
    accountName: dummyAccountName7
  },
  {
    accountName: dummyAccountName8
  },
  {
    accountName: dummyAccountName9
  },
  {
    accountName: dummyAccountName10
  },
  {
    accountName: dummyAccountName11
  }
];

async function prepareData() {
  await User.create(testUser);
  await Account.create(testAccounts);
  const account = await Account.findOne({ accountName: dummyAccountName1 });
  const user = await User.findOne();
  user.accounts.push(account._id);
  account.user = user._id;
  await user.save();
  await account.save();
}
async function clearData() {
  await User.collection.drop();
  await Account.collection.drop();
}

beforeAll(async () => {
  mongoose.connect("mongodb://localhost:27017/pagination-test", {
    useNewUrlParser: true
  });
  await prepareData();
});
afterAll(async done => {
  await clearData();
  mongoose.disconnect(done);
});

test("paginate with page undefined", async done => {
  // no pagination, return all docs
  const accounts = await Account.paginate({});
  expect(accounts.data.length).toBe(11);
  expect(accounts.pagination).toEqual({
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
    perPage: 10
  });
  done();
});

test("paginate with page specified and default perPage", async done => {
  // 10 perpage
  const accounts = await Account.paginate({}, { page: 1 });
  expect(accounts.data.length).toBe(10);
  done();
});

test("paginate with page specified and customized perPage", async done => {
  // 5 perPage
  const accounts = await Account.paginate({}, { page: 1, perPage: 5 });
  expect(accounts.data.length).toBe(5);
  done();
});

test("paginate with page more than actual pages", async done => {
  // 11 docs, 5 perpage, 1 doc in last page
  const accounts = await Account.paginate({}, { page: 100, perPage: 5 });
  expect(accounts.data.length).toBe(1);
  done();
});

test("paginate with previous page and next page", async done => {
  // 10 perpage
  const accounts = await Account.paginate({}, { page: 2, perPage: 5 });
  expect(accounts.data.length).toBe(5);
  expect(accounts.pagination).toEqual({
    hasPrevPage: true,
    hasNextPage: true,
    prevPage: 1,
    nextPage: 3,
    perPage: 5,
    page: 2,
    totalPages: 3
  });
  done();
});

test("paginate with populate", async done => {
  const accounts = await Account.paginate(
    {},
    { page: 1, perPage: 5, populate: "user" }
  );
  expect(accounts.data.length).toBe(5);
  expect((accounts.data[0].user as TUser).username).toBe(dummmUserName);
  done();
});

test("paginate with collation", async done => {
  const accounts = await Account.paginate(
    {},
    {
      page: 1,
      perPage: 5,
      populate: "user",
      collation: { locale: "en_US", strength: 1 }
    }
  );
  expect(accounts.data.length).toBe(5);
  expect((accounts.data[0].user as TUser).username).toBe(dummmUserName);
  done();
});
