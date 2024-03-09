"use server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/database/mongo";
import { handleError } from "@/lib/utils";
import User from "@/lib/database/models/user.model";
import {
  TYPE_CREATE_USER,
  TYPE_UPDATE_USER,
  TYPE_USER_INFO,
} from "@/types/type.user";

interface UserDocument extends TYPE_CREATE_USER, TYPE_USER_INFO {}
interface UpdateUserDocument extends TYPE_UPDATE_USER, TYPE_USER_INFO {}

// CREATE a new user in the database
export async function createUser(user: UserDocument) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Create a new user document
    const newUser = await User.create(user);

    // Convert the user document to JSON and return it
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    // Handle any errors
    handleError(error);
  }
}

// READ a user from the database by user ID
export async function getUserById(userId: string) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Find a user document by its ID
    const user = await User.findOne({ userId: userId });

    // Throw an error if the user document is not found
    if (!user) throw new Error("User not found");

    // Convert the user document to JSON and return it
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    // Handle any errors
    handleError(error);
  }
}

// UPDATE a user in the database by user ID
export async function updateUser(userId: string, user: UpdateUserDocument) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Find a user document by its ID and update it
    const updatedUser = await User.findOneAndUpdate({ userId }, user, {
      new: true, // Return the updated document
    });

    // Throw an error if the user document is not found
    if (!updatedUser) throw new Error("User update failed");

    // Convert the updated user document to JSON and return it
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    // Handle any errors
    handleError(error);
  }
}

// DELETE a user from the database by user ID
export async function deleteUser(userId: string) {
  try {
    // Connect to the database
    await connectToDatabase();
    const data = { $set: { isDeleted: true } };

    //soft Delete the user document
    const deletedUser = await User.findOneAndUpdate({ userId }, data, {
      new: true, // Return the updated document
    });
    // Throw an error if the user document is not found
    if (!deletedUser) {
      throw new Error("User not found");
    }

    // Invalidate cache
    revalidatePath("/");

    // Return the deleted user document, if found, converted to JSON
    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    // Handle any errors
    handleError(error);
  }
}
