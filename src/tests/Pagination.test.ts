import mongoose from "mongoose";
import { Schema, Document, PaginateModel } from "mongoose";
import { mongoosePagination } from "..";
const ObjectId = Schema.Types.ObjectId;

// export type
type TUser = IUser & Document;
interface IUser {
  _id: string;
  name: string;
  accounts: (string | TAccount)[];
}

type TAccount = IAccount & Document;
interface IAccount {
  _id: string;
  name: string;
  user: string;
}
const userSchema = new Schema(
  {
    name: String,
    accounts: [{ type: ObjectId, ref: "Account" }]
  },
  { timestamps: true }
);
userSchema.plugin(mongoosePagination);

const User: PaginateModel<TUser> = mongoose.model("User", userSchema);
function isTUser(obj: any): obj is TUser {
  return obj && obj._id;
}

const testUser = { name: "test" };
async function prepareData() {
  await User.create(testUser);
}
async function clearData() {
  await User.collection.drop();
}
beforeAll(async () => {
  mongoose.connect("mongodb://localhost:27017/pagination-test", {
    useNewUrlParser: true
  });
  await prepareData();
});
afterAll(async done => {
  mongoose.disconnect(done);
  await clearData;
});

test("paginate", async done => {
  const result = await User.paginate({});
  console.log(result);
  expect(result.data.length).toBe(1);
  done();
});
