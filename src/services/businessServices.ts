import BusinessModel, {
  Business,
} from "../config/dataBase/models/businessModel";
import { v4 as uuidv4 } from "uuid";

/* export function createUser(input:Partial<User>){
    return UserModel.create(input)
} */
const BusinessServices = {
  createBusiness(input: Partial<Business>) {
    if (input.address) {
      input.address = {
        city: input.address.city,
        street: input.address.street,
        buildingNumber: input.address.buildingNumber,
        addressName: "default",
        state: "isreal",
        id: uuidv4(),
      };
    } else {
      input.address = {
        state: "Israel",
        id: uuidv4(),
        street: "Bograsov",
        city: "Tel-aviv",
        buildingNumber: 1,
        addressName: "default",
      };
    }
    return BusinessModel.create(input);
  },
  findBusinessById(id: string) {
    return BusinessModel.findById(id);
  },
  addCategoriesAndProducttoBusiness: async (
    id: string,
    categories: Array<string>,
    productId: string
  ) => {
    const business = await BusinessModel.findById(id);
    business?.products.push(productId);
    if (business && business.categories) {
      categories.forEach((category) => {
        if (!business.categories.includes(category)) {
          business.categories.push(category);
        }
      });
      await business.save();
    }
  },
  addOrderToBuisness: async (businessId: string, orderId: string) => {
    const business = await BusinessModel.findById(businessId);
    business?.orders.push(orderId);
    business?.save();
  },
};
export { BusinessServices };
