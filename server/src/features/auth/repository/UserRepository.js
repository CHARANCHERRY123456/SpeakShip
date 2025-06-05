import CrudRepository from './CrudRepository.js';
import User from '../schema/User.js';

class UserRepository extends CrudRepository {
  constructor() {
    super(User);
  }
  async findByUsername(username) {
    return this.model.findOne({ username });
  }
  async findByEmail(email) {
    return this.model.findOne({ email });
  }
}

export default new UserRepository();
