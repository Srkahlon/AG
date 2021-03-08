const UserController = require("../controllers/userController.js").UserController;
const AuthController = require("../controllers/authController.js").AuthController;

module.exports = (app) => {
    var userObj = new UserController();
    var authObj = new AuthController();
    app.post("/api/register", authObj.checkHeaders,userObj.register);
    app.post("/api/login", authObj.checkHeaders,userObj.login);
    app.post("/api/getUserList", authObj.checkHeaders,authObj.verifyToken,userObj.getUserList);
};