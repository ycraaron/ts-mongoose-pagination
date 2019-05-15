import mongoose from "mongoose";
import { Schema, Document, PaginateModel } from "mongoose";
import { mongoosePagination } from "../mongoose-pagination/pagination";
const ObjectId = Schema.Types.ObjectId;

export type TUser = IUser & Document;
interface IUser {
  _id: string;
  username: string;
  accounts: (string | TAccount)[];
}

export type TAccount = IAccount & Document;
interface IAccount {
  _id: string;
  accountName: string;
  user: string | TUser;
}

const userSchema = new Schema({
  username: String,
  accounts: [{ type: ObjectId, ref: "Account" }]
});
const accountSchema = new Schema({
  accountName: String,
  user: { type: ObjectId, ref: "User" }
});

userSchema.plugin(mongoosePagination);
accountSchema.plugin(mongoosePagination);

export const User: PaginateModel<TUser> = mongoose.model("User", userSchema);
export const Account: PaginateModel<TAccount> = mongoose.model(
  "Account",
  accountSchema
);
export function isTUser(obj: any): obj is TUser {
  return obj && obj._id;
}
