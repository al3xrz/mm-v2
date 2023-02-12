const { getUserByLogin, getRoles } = require('./user.controller')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const signin = async (req, res) => {
    
    try {
        const user = await getUserByLogin(req.body.login)
    console.log('user', user)
    if (!user) {
        res.status(404).json({ message: 'Пользователь не найден' })
        return
    }
    const passwordIsValid = bcrypt.compareSync(`${req.body.password}`, user.password)
    if (!passwordIsValid) {
        res.status(401).json({ message: 'Неверный пароль' })
        return
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 })


    const currentRoles = await getRoles(user)
    
    // console.log('roles', currentRoles)
    const roles = currentRoles.map(role => {
        return `ROLE_${role.name.toUpperCase()}`
    })


    res.status(200).json({
        id: user.id,
        login: user.login,
        roles: roles,
        accessToken: token
    })
    } catch(e){
        res.status(404).json({ message: e.message })        
    }
    
}


module.exports = {
    signin
}


