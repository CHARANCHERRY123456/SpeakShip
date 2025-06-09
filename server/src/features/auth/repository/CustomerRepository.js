import CrudRepository from './CrudRepository.js';
import Customer from '../schema/Customer.js';

class CustomerRepository extends CrudRepository {
  constructor() {
    super(Customer);
  }
  async findByUsername(username) {
    return this.model.findOne({ username });
  }
  async findByEmail(email) {
    return this.model.findOne({ email });
  }
}

export default new CustomerRepository();
