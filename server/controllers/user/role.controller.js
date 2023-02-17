const { Role, sequelize } = require('../../models/User.model');
const { Op } = require("sequelize");


async function editRole(role) {
    console.log('role', role)
    if (role.name == '') {
        throw { message: 'Не заполнены обязательные поля' }
    }

    const candidate = {
        name: role.name,
        comments: role.comments
    }


    const test = await Role.findAll({
        where: {
            name: role.name,
            id: {
                [Op.ne]: role.id
            }
        }
    })

    if (test.length !== 0) {
        throw { message: `Роль и именем ${role.name} уже зарегистрирована` }
    } else {
        try {
            await Role.update(
                candidate,
                {
                    where: { id: role.id }
                }
            )
            const u = await Role.findByPk(role.id)
        } catch (e) {
            console.log(e)
            throw { message: `Ошибка редактирования данных пользователя.` }
        }
    }
}



async function getRoleByName(name) {
    const role = await Role.findOne({
        where: { name: name }
    })
    if (!role) {
        throw { message: 'Роль не найдена' }
    }
    return role
}


async function deleteRole(id) {
    try {
        await Role.destroy({
            where: {
                id: id
            }
        })
    } catch (e) {
        console.log(e)
        throw { message: `Ошибка удаления роли` }
    }
}


async function getRole(id) {
    await sequelize.sync()
    const role = await Role.findByPk(id)
    console.log('role', role)
    if (role === null) {
        throw { message: 'Роль не найдена' }
    } else {
        return {
            id: role.id,
            name: role.name,
            comments: role.comments,
        }
    }
}



async function getRoles() {
    await sequelize.sync()
    try {
        const res = await Role.findAll()
        return res
    } catch (e) {
        console.log(e)
        throw { message: "Ошибка получения списка ролей" }
    }
}


async function createRole(role) {

    console.log(role)
    if (role.name == '' || role.name == null) {
        throw { message: 'Не заполнены обязательные поля' }
    }
    
    if (!role.comments) {
        role.comments = "";
    }

    await sequelize.sync()

    const currentRoles = await Role.findAll({
        where: {
            name: role.name
        }
    })

    if (currentRoles.length !== 0) {
        throw { message: `Роль ${role.name} уже зарегистрирована` }
    } else {
        try {
            let newRecord = await Role.create(role)
            return newRecord
        } catch (e) {
            console.log(e)
            throw { message: 'Ошибка регистрации новой роли' }
        }
    }
}


module.exports = {
    getRoles,
    createRole,
    getRole,
    deleteRole,
    editRole
}



