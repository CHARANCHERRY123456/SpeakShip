import CrudRepository from './CrudRepository.js';
import Admin from '../schema/Admin.js';

class AdminRepository extends CrudRepository {
  constructor() {
    super(Admin);
  }
  async findByUsername(username) {
    return this.model.findOne({ username });
  }
  async findByEmail(email) {
    return this.model.findOne({ email });
  }
}

export default new AdminRepository();
