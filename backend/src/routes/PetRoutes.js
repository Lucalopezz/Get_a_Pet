const express = require("express");
const router = express.Router();

const PetController = require("../controllers/PetController");

const checkToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

router.post(
  "/create",
  checkToken,
  imageUpload.array("images"),
  PetController.create
);

router.get("/", PetController.getAll);
router.get("/mypets", checkToken, PetController.getAllUserPets);
router.get("/myadoptions", checkToken, PetController.getAllUserAdptions);
router.get("/:id", PetController.getPetById);
router.delete("/:id", checkToken, PetController.removePetById);
router.patch(
  "/:id",
  checkToken,
  imageUpload.array("images"),
  PetController.updatePet
);
router.patch('/schedule/:id', checkToken,PetController.schedule )
router.patch('/conclude/:id', checkToken,PetController.concludeAdoption )

module.exports = router;
