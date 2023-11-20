const { Sequelize, Model, DataTypes } = require("sequelize");


const sequelize = new Sequelize(process.env.TEST_DB_URL, {
  define: {
    freezeTableName: true
  }
})
const connectDB = async () => {
  console.log('Checking database connection...');
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    await sequelize.sync({ force: false })
  } catch (e) {
    console.log('Database connection failed', e);
    process.exit(1);
  }
};

const setupTestDB = () => {
  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    const tables = Object.values(sequelize.models);
    await Promise.all(tables.map(async (model) => await model.destroy({ truncate: true })));
  });

  afterAll(async () => {
    await sequelize.close();
  });
};

module.exports = setupTestDB;
