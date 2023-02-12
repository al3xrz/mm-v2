function test(req, res, next){
    console.log(req.url);
    next();
}

module.exports = {
    test,
}