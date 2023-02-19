const { Router } = require("express");
const router = new Router();
const {
    createUser,
    editUser,
    deleteUser,
    getUser,
    getUsers,
} = require("../controllers/user/user.controller");

router.get("/", async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(users)
    } catch (e) {
        console.log(e);
        res.status(200).json({ message: e.message });
    }
})


// {
//     "login" : "admin2",
//     "password" : "password",
//     "roles" : [{"id": 1}, {"id": 2}]
// }

router.post("/", async (req, res) => {
    try {
        await createUser(req.body);
        res.status(200).json({message : `Пользователь ${req.body.login} успешно создан`});
    } catch (e) {
        console.log(e);
        res.status(400).json({ message: e.message });
    }
})





module.exports = router;