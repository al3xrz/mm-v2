const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUserByLogin, getRoles } = require("../controllers/user/user.controller");

const refreshList = {}


async function tokenRefresh(req, res, next) {
    const postData = req.body;
    console.log("postdata", postData);
    if (postData.refreshToken && postData.refreshToken in refreshList) {
        const decoded = jwt.verify(
            postData.refreshToken,
            process.env.REFRESH_WEB_TOKEN
        );

        const accessToken = generateAccessToken(
            {
                _id: decoded.id,
                name: decoded.name,
                login: decoded.login,
                roles: decoded.roles
            }
        );

        const refreshToken = generateRefreshToken(
            {
                _id: decoded.id,
                name: decoded.name,
                login: decoded.login,
                roles: decoded.roles
            }
        );

        req.content = {
            _id: decoded.id,
            login: decoded.login,
            roles: decoded.roles
        }

        req.accessToken = accessToken;
        req.refreshToken = refreshToken;

        addToList(refreshToken, accessToken)
        console.log(refreshList)
    } else {
        return res.status(401).json({message : "Невалидный ACCESS_TOKEN"});
    }
    next();
}


async function verifyToken(req, res, next) {
    const accessToken = req.headers["authorization"];
    if (!accessToken) {
        return res.status(403).json({ message: "Отсутствует ACCESS_TOKEN" })
    }
    console.log(accessToken);
    try {
        console.log(process.env.ACCESS_WEB_TOKEN);
        const decoded = jwt.verify(accessToken, process.env.ACCESS_WEB_TOKEN);
        console.log(decoded);
        req.decoded = decoded;
    } catch (e) {
        return res.status(401).send("Невалидный ACCESS_TOKEN");
    }
    return next();
}


async function userLogin(req, res, next) {
    let user = await getUserByLogin(req.body.login)
    if (!user) {
        res.status(400).json({ message: "Пользователь не найден" })
    }
    const passwordIsValid = bcrypt.compareSync(`${req.body.password}`, user.password)
    if (!passwordIsValid) {
        res.status(401).json({ message: "Неверный пароль" })

    }

    user.roles = (await getRoles(user)).map(role => role.name)

    console.log(user);

    const accessToken = generateAccessToken(user);
    req.accessToken = accessToken;
    const refreshToken = generateRefreshToken(user);
    req.refreshToken = refreshToken;
    req.content = {
        _id: user.id,
        login: user.login,
        roles: user.roles
    }

    addToList(refreshToken, accessToken);
    return next();
}



function generateAccessToken(user) {
    const payload = {
        _id: user.id,
        name: user.name,
        login: user.login,
        roles: user.roles
    }

    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_WEB_TOKEN,
        {
            expiresIn: "1m"
        }
    );

    return accessToken;
}

function generateRefreshToken(user) {
    const payload = {
        _id: user.id,
        name: user.name,
        login: user.login,
        roles: user.roles
    }
    const refreshToken = jwt.sign(
        payload,
        process.env.REFRESH_WEB_TOKEN,
        {
            expiresIn: "30d"
        }
    );

    return refreshToken;

}

function addToList(refreshToken, accessToken) {
    refreshList[refreshToken] = {
        status: 'loggedin',
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
}



module.exports = {
    userLogin,
    verifyToken,
    tokenRefresh

}