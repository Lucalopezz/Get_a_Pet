const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
        res.status(422).json({
          message: "A senha e a confirmação de senha não são iguais!",
        });
        break;

      default:
        const userExist = await User.findOne({ email: email });
        if (userExist) {
          res.status(422).json({
            message: "E-mail já cadastrado!",
          });
          return;
        }
        //password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({
          name,
          email,
          phone,
          password: passwordHash,
        });
        try {
          const newUser = await user.save();
          await createUserToken(newUser, req, res);
        } catch (error) {
          res.status(500).json({ message: "Erro!" });
          console.log(error);
        }
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    switch (true) {
      case !email:
        res.status(422).json({ message: "O e-mail é obrigatório!" });
        break;

      case !password:
        res.status(422).json({ message: "A senha é obrigatória!" });
        break;

      default:
        const user = await User.findOne({ email: email });
        if (!user) {
          res.status(422).json({
            message: "Usuário não existe!",
          });
        }
        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
          res.status(422).json({
            message: "Senha incorreta!",
          });
          return;
        }

        await createUserToken(user, req, res);
    }
  }

  static async checkUser(req, res) {
    let currentUser;

    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, "nossosecret");
      currentUser = await User.findById(decoded.id); // pega o token do createUserToken, que passei por parametro

      currentUser.password = undefined;

    } else {
      currentUser = null;
    }
    res.status(200).send(currentUser);
  }
};
