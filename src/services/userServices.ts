import UserModel, { User } from "../config/dataBase/models/userModel";

const userServices = {
  createUser(input: Partial<User>) {
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
};
export { userServices };
