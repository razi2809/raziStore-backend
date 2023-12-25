import BusinessModel, {
  Business,
} from "../config/dataBase/models/businessModel";

/* export function createUser(input:Partial<User>){
    return UserModel.create(input)
} */
const BusinessServices = {
  createBusiness(input: Partial<Business>) {
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
