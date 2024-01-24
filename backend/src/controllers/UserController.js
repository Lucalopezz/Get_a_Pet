const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
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

  static async getUserById(req, res) {
    const id = req.params.id;

    try {
      const user = await User.findById(id).select("-password");
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado!" });
        return;
      }
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async editUser(req, res) {
    const id = req.param.id;
    const token = getToken(req);

    const user = await getUserByToken(token);

    const { name, email, phone, password, confirmpassword } = req.body;

    let image = "";

    // validations
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório!" });
      return;
    }

    user.name = name;

    if (!email) {
      res.status(422).json({ message: "O e-mail é obrigatório!" });
      return;
    }

    // check if user exists
    const userExists = await User.findOne({ email: email });

    if (user.email !== email && userExists) {
      res.status(422).json({ message: "Por favor, utilize outro e-mail!" });
      return;
    }

    user.email = email;

    if (image) {
      const imageName = req.file.filename;
      user.image = imageName;
    }

    if (!phone) {
      res.status(422).json({ message: "O telefone é obrigatório!" });
      return;
    }

    user.phone = phone;

    // check if password match
    if (password != confirmpassword) {
      res.status(422).json({ error: "As senhas não conferem." });

      // change password
    } else if (password == confirmpassword && password != null) {
      // creating password
      const salt = await bcrypt.genSalt(12);
      const reqPassword = req.body.password;

      const passwordHash = await bcrypt.hash(reqPassword, salt);

      user.password = passwordHash;
    }
    try {
      await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true } // atualização do dado
      );
      res.status(200).json({ message: "Usuário atualizado com sucesso!" });
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor" });
      console.log(error);
      return;
    }
  }
};
