const { Router } = require("express");
const { userLogin, tokenRefresh } = require("../middleware/auth");
const router = Router();


router.post("/signin", userLogin, async (req, res) => {
    res.json(
        {
            message: "SignIn",
            content : req.content,
            accessToken : req.accessToken,
            refreshToken : req.refreshToken
        }
    )
})

router.post("/refresh", tokenRefresh, async (req, res) => {
    res.json({
        message : "Refresh",
        content : req.content,
        accessToken : req.accessToken,
        refreshToken : req.refreshToken
    })
})

module.exports = router;