import { Address, Name } from "../config/dataBase/models/classes";
import UserModel, { User } from "../config/dataBase/models/userModel";
import { v4 as uuidv4 } from "uuid";
import log from "../config/utils/logger";

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
  addOrderToUser: async (userId: string, orderId: string) => {
    const user = await UserModel.findById(userId);
    user?.orders.push(orderId);
    user?.save();
  },
  addAddressToUser: async (userId: string, newAddress: Address) => {
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
    }
  },
  deleteUser(userId: string) {
    return UserModel.deleteOne({ _id: userId });
  },
  updateProfilePicture: async (userId: string, url: string) => {
    const user = await UserModel.findById(userId);
    if (user && user.image) {
      user.image.url = url;
      user.save();
    }
  },
  updateName: async (userId: string, name: Name) => {
    const user = await UserModel.findById(userId);
    if (user) {
      user.name = name;
      user.save();
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
