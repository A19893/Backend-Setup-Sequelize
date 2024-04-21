const { sequelize } = require("../config").db_connection;
const { base_repository } = require("./base_repository");
const { user:user_model } = require('../models')
class users_repository extends base_repository {
    constructor(payload) {
        super(payload);
    }
    
    async create_user(payload){
        const transaction = await sequelize.transaction();
        try {
            let options = {
              transaction,
            };
            const response = await this.create(payload, options);
            await transaction.commit();
            return response;
          } catch (err) {
            await transaction.rollback();
            throw err;
          }
    }

    async find_user(criteria) {
      const user = await this.find_one(criteria);
      return user;
    }

    async update_user(params, payload) {
      const transaction = await sequelize.transaction();
      const { user_id } = params;
      try {
        let options = {
            transaction,
        };
        let criteria = {
            uuid: user_id
        }
        const [updated_count, updated_rows] = await this.update(criteria, payload, [], options);
        await transaction.commit();
        return updated_rows;
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
    }
}

module.exports = {
    users_repository_obj: new users_repository({
      db_connection: sequelize,
      model: user_model,
    }),
};