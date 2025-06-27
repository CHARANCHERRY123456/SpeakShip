// src/features/auth/repository/OtpRepository.js
import CrudRepository from './CrudRepository.js';
import Otp from '../schema/Otp.js';

class OtpRepository extends CrudRepository {
    constructor() {
        super(Otp);
    }

    async findByEmail(email) {
        return this.model.findOne({ email });
    }

    async deleteByEmail(email) {
        return this.model.deleteOne({ email });
    }
}

export default new OtpRepository();