const { sequelize, DataTypes } = require("../config/db");


const Token = sequelize.define('Token', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: DataTypes.UUID,
    token: DataTypes.STRING,
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    expiredAt: {
        type: DataTypes.DATE,
        defaultValue: () => new Date(new Date().getTime() + 3600 * 1000)
    }
}, {
    timestamps: false,
});

module.exports = Token;