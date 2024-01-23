const User = require("../models/User");

module.exports = class UserController {
  static async register(req, res) {
    const { name, email, phone, password, confirmpassword } = req.body;

    switch (true) {
      case !name:
        res.status(422).json({ message: "O nome é obrigatório!" });
        break;
      case !email:
        res.status(422).json({ message: "O e-mail é obrigatório!" });
        break;
      case !phone:
        res.status(422).json({ message: "O telefone é obrigatório!" });
        break;

      case !password:
        res.status(422).json({ message: "A senha é obrigatória!" });
        break;

      case !confirmpassword:
        res
          .status(422)
          .json({ message: "A confirmação de senha é obrigatória!" });
        break;

      case password !== confirmpassword:
        res
          .status(422)
          .json({
            message: "A senha e a confirmação de senha não são iguais!",
          });
        break;

      default:
        const userExist = await User.findOne({ email: email });
        if (userExist) {
          res
            .status(422)
            .json({
              message: "E-mail já cadastrado!",
            });
        }

        
    }
  }
};
