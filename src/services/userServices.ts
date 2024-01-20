import { Address, Name } from "../config/dataBase/models/classes";
import UserModel, { User } from "../config/dataBase/models/userModel";
import { v4 as uuidv4 } from "uuid";
import log from "../config/utils/logger";
import { myError } from "../errors/errorType";

const userServices = {
  createUser(input: Partial<User>) {
    if (input.address) {
      input.address = input.address.map((address) => ({
        ...address,
        state: "Israel",
        id: uuidv4(),
        addressName: "user-default",
      }));
    } else {
      input.address = [
        {
          state: "Israel",
          id: uuidv4(),
          street: "Bograsov",
          city: "Tel-aviv",
          buildingNumber: 1,
          addressName: "user-default",
        },
      ];
    }
    return UserModel.create(input);
  },
  findUserById(id: string) {
    return UserModel.findById(id);
  },
  findUserByEmail(email: string) {
    return UserModel.findOne({ email });
  },
  getUsers() {
    return UserModel.find();
  },
  resetPassword: async (
    email: string,
    passwordResetCode: string,
    password: string
  ) => {
    try {
      const user = await userServices.findUserByEmail(email);
      if (
        !user ||
        !user.passwordResetCode ||
        user.passwordResetCode !== passwordResetCode
      ) {
        throw new myError("could not reset password", 400);
      }
      user.passwordResetCode = null;
      user.password = password;
      await user.save();
    } catch (error) {
      // Handle or throw the error as per your error handling strategy
      throw error;
    }
  },
  addOrderToUser: async (userId: string, orderId: string) => {
    const user = await UserModel.findById(userId);
    user?.orders.push(orderId);
    user?.save();
  },
  addAddressToUser: async (userId: string, newAddress: Address) => {
    try {
      const user = await UserModel.findById(userId);
      if (user) {
        for (let userAddress of user.address) {
          if (userAddress.addressName === newAddress.addressName) {
            return "address exist";
          }
        }
        newAddress.state = "Israel";
        newAddress.id = uuidv4();
        user.address.push(newAddress);
        await user.save();
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      // Handle or throw the error as per your error handling strategy
      throw error;
    }
  },
  deleteUser(userId: string) {
    return UserModel.deleteOne({ _id: userId });
  },
  updateProfilePicture: async (userId: string, url: string) => {
    try {
      const user = await UserModel.findById(userId);
      if (user && user.image) {
        user.image.url = url;
        user.save();
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      // Handle or throw the error as per your error handling strategy
      throw error;
    }
  },
  updateName: async (userId: string, name: Name) => {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      user.name = name;
      user.save();
    } catch (error) {
      // Handle or throw the error as per your error handling strategy
      throw error;
    }
  },
  updateEmail: async (userId: string, email: string) => {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { email },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error("User not found");
      }
      return updatedUser;
    } catch (error) {
      // Handle or throw the error as per your error handling strategy
      throw error;
    }
  },
  updatePhone: async (userId: string, phoneNumber: string) => {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { phoneNumber },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error("User not found");
      }
      return updatedUser;
    } catch (error) {
      // Handle or throw the error as per your error handling strategy
      throw error;
    }
  },
};
export { userServices };
