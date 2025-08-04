// src/features/coins/repository/CoinsRepository.js
import Customer from '../../auth/schema/Customer.js';

class CoinsRepository {
  async incrementCoins(customerId, amount) {
    console.log(`[INCREMENT] Customer ID: ${customerId}, Amount: ${amount}`);
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      { $inc: { coins: amount } },
      { new: true }
    );
    console.log(`[INCREMENT] Updated Coins: ${updatedCustomer?.coins}`);
    return updatedCustomer;
  }

  async decrementCoins(customerId, amount) {
    console.log(`[DECREMENT] Customer ID: ${customerId}, Amount: ${amount}`);
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      { $inc: { coins: -amount } },
      { new: true }
    );
    console.log(`[DECREMENT] Updated Coins: ${updatedCustomer?.coins}`);
    return updatedCustomer;
  }

  async getCoins(customerId) {
    console.log(`[GET COINS] Customer ID: ${customerId}`);
    const customer = await Customer.findById(customerId);
    const coins = customer?.coins ?? 0;
    console.log(`[GET COINS] Current Coins: ${coins}`);
    return coins;
  }
}

export default new CoinsRepository();
