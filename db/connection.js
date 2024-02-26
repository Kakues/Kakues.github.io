require ('dotenv').config()
const Sequelize = require ('sequelize');

const sequelize = new Sequelize({
    dileact: 'sqlite',
    storage: './db/app.db',
    dialect: 'sqlite',
});

module.exports = sequelize