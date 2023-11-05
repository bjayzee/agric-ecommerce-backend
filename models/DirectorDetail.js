const { sequelize, DataTypes } = require("../config/db");


const DirectorDetail = sequelize.define('DirectorDetail', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    fullname: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    identification_doc: DataTypes.STRING,
});

module.exports = DirectorDetail;