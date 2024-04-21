/* eslint-disable snakecasejs/snakecasejs */
exports.base_repository = class base_repository {
    constructor({ db_connection, model }) {
      this.db_connection = db_connection;
      this.model = model;
    }
  
    /**
     * The create method create database entries.
     * @param {object} payload - To define which attributes can be set in the create method.
     * @param {object} options - If you really want to let the query restrict the model data.
     */
    async create(payload, options) {
      const instance = await this.model.create(payload, options);
      return instance && instance.toJSON();
    }
  
    /**
     * The create method create database entries.
     * @param {object} payload - To define which attributes can be set in the create method.
     * @param {object} options - If you really want to let the query restrict the model data.
     */
    async bulk_create(payload, options = {}) {
      options.validate = true;
      const instance = await this.model.bulkCreate(payload, options);
      return instance;
    }
  
    /**
     * The findOne method obtains the first entry it finds.
     * @param {object} criteria - To find records with criteria.
     * @param {array} include - To find records with association.
     * @param {boolean} paranoid - If you really want to let the query see the soft-deleted records, you can pass the paranoid: false option to the query method
     * @param {object} attributes - To exclude or include column in records.
     * @param {array} order - Specifies the order of the results. Each element should be an array consisting of two elements: the field name to sort by and the direction ('ASC' or 'DESC'). Pass an empty array if no sorting is desired.
     */
    async find_one(criteria, include = [], paranoid = true, attributes, order = []) {
      return await this.model.findOne({
        where: criteria,
        include: include,
        paranoid,
        attributes,
        order
      });
    }
  
    /**
     * The findAll method generates a standard SELECT query which will retrieve all entries from the table
     * @param {object} criteria - To find records with criteria.
     * @param {array} include - To find records with association.
     * @param {boolean} paranoid - If you really want to let the query see the soft-deleted records, you can pass the paranoid: false option to the query method
     * @param {object} attributes - To exclude or include column in records.
     */
    async find_all(criteria,include=[], paranoid = true, attributes,offset,limit) {
      return await this.model.findAll({
        where: criteria,
        include: include,
        paranoid,
        attributes,
        offset:offset,
        limit:limit
      });
    }
  
    async count_all(criteria){
      const totalCount = await this.model.count({ where: criteria });
      return totalCount;
    }
  
    /**
     * The update method update database entries.
     * @param {object} criteria - To update records with criteria.
     * @param {object} payload - To update which attributes can be set in this method.
     * @param {array} include - To update records with association.
     * @param {object} options - If you really want to let the query restrict the model data.
     */
    async update(criteria, payload, include = [], options = {}, returning = ["*"]) {
      return await this.model.update(payload, {
        where: criteria,
        include,
        returning: returning,
        ...options
      });
    }
  
    /**
     * When you call the destroy method, a soft-deletion will happen:
     * @param {object} criteria - To destroy records with criteria.
     * @param {boolean} force - If you really want a hard-deletion and your model is paranoid, you can force it using the force: true option:
     * @param {array} include - To destroy records with association.
     */
    async destroy(criteria, force = false, include, options) {
      return await this.model.destroy({
         where: criteria,
         include: include,
         force,
         options
      });
    }
  };
  