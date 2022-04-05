const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  host: "localhost",
  dialect: "mysql",
  database: "orm_demo",
  username: "root",
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

global.sequelize = sequelize;
module.exports = connectDB;
