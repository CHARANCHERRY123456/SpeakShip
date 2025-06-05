import CrudRepository from './CrudRepository.js';
import Driver from '../schema/Driver.js';

class DriverRepository extends CrudRepository {
  constructor() {
    super(Driver);
  }
  async findByUsername(username) {
    return this.model.findOne({ username });
  }
  async findByEmail(email) {
    return this.model.findOne({ email });
  }
}

export default new DriverRepository();
