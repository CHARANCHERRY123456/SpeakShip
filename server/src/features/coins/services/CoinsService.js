// src/features/coins/services/CoinsService.js
import CoinsRepository from '../repository/CoinsRepository.js';

class CoinsService {
  async addCoins(customerId, amount = 1) {
    return CoinsRepository.incrementCoins(customerId, amount);
  }

  async removeCoins(customerId, amount = 1) {
    return CoinsRepository.decrementCoins(customerId, amount);
  }

  async getBalance(customerId) {
    return CoinsRepository.getCoins(customerId);
  }
}

export default new CoinsService();
