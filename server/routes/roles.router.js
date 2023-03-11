const { Router } = require("express");
const {
    getRoles,
    createRole,
    getRole,
    deleteRole,
    editRole
} = require("../controllers/user/role.controller");


const router = new Router();

router.get("/", async (req, res) => {
    try {
        const roles = await getRoles();
        res.status(200).json(roles);
    } catch (e) {
        return res.status(200).json({ message: e.message });
    }
})


// {
//     name : "name",
//     comments : "comments"
// }
router.post("/", async (req, res) => {
    try {
        await createRole(req.body);
        res.status(200).json({ message: `Роль ${req.body.name} успешно создана` });
    } catch (e) {
        res.status(400).json({ message: e.message })
    }
})


// {
//     id : 0,       
//     name : "name",
//     comments : "comments"
// }
router.put("/", async (req, res) => {
    try {
        await editRole(req.body);
        res.status(200).json({ message: `Роль ${req.body.name} сохранена` })
    } catch (e) {
        res.status(400).json({ message: e.message })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const role = await getRole(req.params.id);
        await deleteRole(req.params.id);
        res.status(200).json({ message: `Роль ${role.name} успешно удалена` })
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
})



module.exports = router;

