// src/features/coins/repository/CoinsRepository.js
import Customer from '../../auth/schema/Customer.js';

class CoinsRepository {
  async incrementCoins(customerId, amount) {
    return Customer.findByIdAndUpdate(
      customerId,
      { $inc: { coins: amount } },
      { new: true }
    );
  }

  async decrementCoins(customerId, amount) {
    return Customer.findByIdAndUpdate(
      customerId,
      { $inc: { coins: -amount } },
      { new: true }
    );
  }

  async getCoins(customerId) {
    const customer = await Customer.findById(customerId);
    return customer?.coins ?? 0;
  }
}

export default new CoinsRepository();
