import { Schema, model, models, Document } from "mongoose";
import { TYPE_CREATE_USER, TYPE_USER_INFO } from "@/types/type.user";

// Define the properties of a user document
interface UserDocument extends TYPE_CREATE_USER, Document, TYPE_USER_INFO {
  planId: string;
  creditBalance: number;
  isDeleted: boolean;
}

const NEXT_PUBLIC_FREE_CREDITS =
  parseInt(process.env.NEXT_PUBLIC_FREE_CREDITS!!) || 0;
// Define the schema for the user document
const UserSchema = new Schema<UserDocument>({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  lastSignInAt: {
    type: Number,
  },
  createdAt: {
    type: Number,
  },
  updatedAt: {
    type: Number,
  },
  planId: {
    type: String,
    default: "free",
  },
  creditBalance: {
    type: Number,
    default: NEXT_PUBLIC_FREE_CREDITS,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Define the model for the user document
const User = models?.User || model<UserDocument>("User", UserSchema);

export default User;
