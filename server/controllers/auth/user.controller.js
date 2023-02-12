const { User, Role, sequelize } = require("../models/User.model");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

async function getRoles(user) {
  console.log("user", user);
  const roles = await user.getRoles();
  return roles.map((role) => {
    return {
      id: role.id,
      name: role.name,
      comments: role.comments,
    };
  });
}

// {
//     "id" : 1,
//     "login" : "admin2",
//     "password" : "password",
//     "roles" : [{"id": 1}, {"id": 2}]
// }

async function createUser(user) {
  if (
    user.login == "" ||
    user.login == null ||
    user.password == "" ||
    user.password == null
  ) {
    throw { message: "Не заполнены обязательные поля" };
  }
  await sequelize.sync();
  const hashPassword = await bcrypt.hash(`${user.password}`, 10);
  const candidate = {
    login: user.login,
    password: hashPassword,
    name: user.name,
    comments: user.comments,
  };

  const currentUsers = await User.findAll({
    where: {
      login: user.login,
    },
  });

  if (currentUsers.length !== 0) {
    throw { message: `Пользователь ${candidate.login} уже зарегистрирован` };
  } else {
    try {
      const newRecord = await User.create(candidate);
      for (let i = 0; i < user.roles.length; i++) {
        const role = await Role.findByPk(user.roles[i].id);
        newRecord.addRole(role);
      }
      // return newRecord
    } catch (e) {
      console.log(e);
      throw { message: "Ошибка регистрации нового пользователя" };
    }
  }
}

async function editUser(user) {
  console.log("user", user);
  console.log(user.login);
  if (user.login == "" || user.login == null) {
    throw { message: "Не заполнены обязательные поля" };
  }

  const candidate = {
    login: user.login,
    name: user.name,
    comments: user.comments,
  };

  if (user.password !== "" && user.password !== null) {
    const hashPassword = await bcrypt.hash(`${user.password}`, 10);
    candidate.password = hashPassword;
  }

  const test = await User.findAll({
    where: {
      login: user.login,
      id: {
        [Op.ne]: user.id,
      },
    },
  });

  if (test.length !== 0) {
    throw {
      message: `Пользователь с логином ${user.login} уже зарегистрирован`,
    };
  } else {
    try {
      await User.update(candidate, {
        where: { id: user.id },
      });
      const u = await User.findByPk(user.id);

      if (user.roles) {
        await u.removeRoles(await u.getRoles());
        for (let i = 0; i < user.roles.length; i++) {
          console.log(user.roles[i]);
          const role = await Role.findByPk(user.roles[i].id);
          u.addRole(role);
        }
      }
    } catch (e) {
      console.log(e);
      throw { message: `Ошибка редактирования данных пользователя.` };
    }
  }
}

async function deleteUser(id) {
  try {
    await User.destroy({
      where: {
        id: id,
      },
    });
  } catch (e) {
    console.log(e);
    throw { message: `Ошибка удаления пользователя` };
  }
}

async function getUser(id) {
  const user = await User.findByPk(id);
  console.log("user", user);
  if (user === null) {
    throw { message: "Пользователь не найден" };
  } else {
    return {
      id: user.id,
      login: user.login,
      name: user.name,
      comments: user.comments,
      roles: await getRoles(user),
    };
  }
}

async function getUsers() {
  const users = await User.findAll();
  let res = [];
  for (let i = 0; i < users.length; i++) {
    res.push({
      id: users[i].id,
      login: users[i].login,
      name: users[i].name,
      comments: users[i].comments,
      roles: await getRoles(users[i]),
    });
  }
  console.log(res);
  if (users === null) {
    throw { message: "Пользователи не найден" };
  } else {
    return res;
  }
}

async function getUserByLogin(login) {
  const user = await User.findOne({
    where: { login: login },
  });
  if (!user) {
    throw { message: "Пользователь не найден" };
  }
  return user;
}

module.exports = {
  getRoles,
  createUser,
  editUser,
  deleteUser,
  getUser,
  getUsers,
  getUserByLogin,
};
