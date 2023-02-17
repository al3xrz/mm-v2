const { Sequelize, DataTypes } = require('sequelize');
const path = require('path')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve('base.sqlite')
});


const Role = sequelize.define('Roles', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    comments: {
        type: DataTypes.STRING,
        allowNull: true
    },

}, {})


const User = sequelize.define('Users', {
    login: {
        type: DataTypes.STRING,
        allowNull: false
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    name: {
        type: DataTypes.STRING,
        allowNull: true
    },

    comments: {
        type: DataTypes.STRING,
        allowNull: true
    }

},
    {

    });


Role.belongsToMany(User, {
    through: 'user_roles',
    foreignKey: 'roleId',
    otherKey: 'userId'
})

User.belongsToMany(Role, {
    through: 'user_roles',
    foreignKey: 'userId',
    otherKey: 'roleId'
})


module.exports = { Role, User, sequelize }