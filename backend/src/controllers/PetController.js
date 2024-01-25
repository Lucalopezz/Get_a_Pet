const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const Pet = require("../models/Pet");

const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class PetController {
  static async create(req, res) {
    const { name, age, weight, color } = req.body;

    const images = req.files;
    console.log(images);
    const available = true; //when create a pet, he is available

    // images upload

    //validations
    switch (true) {
      case !name:
        res.status(422).json({ message: "O nome é obrigatório!" });
        break;
      case !age:
        res.status(422).json({ message: "A idade é obrigatória!" });
        break;
      case !weight:
        res.status(422).json({ message: "O peso é obrigatório!" });
        break;
      case !color:
        res.status(422).json({ message: "A cor é obrigatória!" });
        break;
      case images.length === 0:
        res.status(422).json({ message: "A imagem é obrigatória!" });
        break;

      default:
        break;
    }
    //pet owner
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pet = new Pet({
      name,
      age,
      weight,
      color,
      available,
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone,
      },
    });

    images.map((image) => {
      pet.images.push(image.filename);
    });

    try {
      const newPet = await pet.save();
      res.status(201).json({ message: "Pet cadastrado com sucesso!", newPet });
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor" });
      console.log(error);
      return;
    }
  }

  static async getAll(req, res) {
    const pets = await Pet.find().sort("-createdAt");

    res.status(200).json({ pets: pets });
  }

  static async getAllUserPets(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "user._id": user._id }).sort("-createdAt"); //subdocument querry

    res.status(200).json({
      pets,
    });
  }

  static async getAllUserAdptions(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "adopter._id": user._id }).sort("-createdAt");

    res.status(200).json({
      pets,
    });
  }

  static async getPetById(req, res) {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "Pet não encontrado" });
      return;
    }

    const pet = await Pet.findById(id);

    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado" });
      return;
    }

    res.status(200).json({ pet });
  }
};
