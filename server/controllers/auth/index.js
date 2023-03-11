const { getUserByLogin, getRoles } = require('./user.controller')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function signin(login, password) {

    try {
        const user = await getUserByLogin(login)
        console.log('user', user)
        if (!user) {
            throw new Error({ message: 'Пользователь не найден' })
        }
        const passwordIsValid = bcrypt.compareSync(`${password}`, password)
        if (!passwordIsValid) {
            throw new Error({ message: 'Неверный пароль' })

        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 })

        const currentRoles = await getRoles(user)
        // console.log('roles', currentRoles)
        const roles = currentRoles.map(role => {
            return `ROLE_${role.name.toUpperCase()}`
        })


        return ({
            id: user.id,
            login: user.login,
            roles: roles,
            accessToken: token
        })
    } catch (e) {
        throw new Error({ message: e.message })
    }

}

module.exports = {
    signin
}


