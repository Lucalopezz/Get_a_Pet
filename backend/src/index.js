const express = require("express");
const cors = require("cors");

const conn = require('./db/conn')

const app = express();

app.use(express.json());

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.use(express.static("public"));

const UserRoutes = require('./routes/UserRoutes')
const PetRoutes = require('./routes/PetRoutes')

app.use('/pets', PetRoutes)
app.use('/users', UserRoutes)

app.listen(5000);
