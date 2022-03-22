const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const Patient = require("./models/patient");
const Doctor = require("./models/doctor");
const PatientDiagnosis = require("./models/patientDiagnosis");
const DoctorUser = require("./models/users/doctorUser");
const PatientUser = require("./models/users/patientUser");
const AdminUser = require("./models/users/adminUser");

const { response } = require("express");

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://localhost:27017/secureEhr");
}

app.post("/addPatient", (req, res) => {
  const patient = new Patient(req.body);
  patient
    .save()
    .then((item) => {
      res.send("Patient saved to database");
    })
    .catch((err) => {
      res.status(400).send("Unable to save to database");
    });
});

app.post("/addDoctor", (req, res) => {
  const doctor = new Doctor(req.body);
  doctor
    .save()
    .then((item) => {
      res.send("Doctor saved to database");
    })
    .catch((err) => {
      res.status(400).send("Unable to save to database");
    });
});

app.post("/addPatientDoctorLink/:docId", async (req, res) => {
  const doctor = await Doctor.findOne({ doctorId: req.params.docId });
  const patient = await Patient.findOne({ patientId: req.body.pId });

  const responseDoctor = await Doctor.updateOne(
    {
      doctorId: req.params.docId,
    },
    {
      $push: {
        patientList: patient,
      },
    }
  );

  console.log(responseDoctor);

  const responsePatient = await Patient.updateOne(
    {
      patientId: req.body.pId,
    },
    {
      $push: {
        doctorList: doctor,
      },
    }
  );

  console.log(responsePatient);
  res.json({ status: "ok" });
});

app.post("/:dId/addDiagnosis", async (req, res) => {
  const doctorId = req.params.dId;
  const date = new Date();
  const localDiagnosis = new PatientDiagnosis({
    ...req.body,
    doctorId: doctorId,
    consultationDate: date.getDate(),
  });
  await localDiagnosis.save();
  res.json({ status: "ok" });
});

app.post("/signUp", async (req, res) => {
  const { user, username, password } = req.body;
  const hash = await bcrypt.hash(password, 12);
  let localUser = {};
  if (user === "doctor") {
    localUser = new DoctorUser({
      username: username,
      password: hash,
    });
  } else if (user === "patient") {
    localUser = new PatientUser({
      username: username,
      password: hash,
    });
  }
  await localUser.save();
  res.json({ status: "Doctor Account Created" });
});

app.post("/login", async (req, res) => {
  const { user, username, password } = req.body;
  let localUser = {};
  if (user === "doctor") {
    localUser = await DoctorUser.findOne({ username });
  } else if (user === "patient") {
    localUser = await PatientUser.findOne({ username });
  }
  if (localUser === null) {
    res.send("No Such User");
  } else {
    const validPassword = await bcrypt.compare(password, localUser.password);
    if (validPassword) {
      res.send("Verified");
    } else {
      res.send("Not Verified");
    }
  }
});

app.get("/getDoctor", async (req, res) => {
  const doctorList = await Doctor.find({});
  res.json(doctorList);
});

app.get("/:dId&:pId", async (req, res) => {
  const patientDiagnostics = await PatientDiagnosis.findOne({
    patientId: req.params.pId,
    doctorId: req.params.dId,
  });
  res.json(patientDiagnostics);
});

app.get("/:dId", async (req, res) => {
  const patientList = (await Doctor.findOne({ doctorId: req.params.dId }))
    .patientList;
  const localPatientList = [];

  for (const patientId of patientList) {
    const localPatient = await Patient.findById(patientId);
    localPatientList.push({
      patientId: localPatient.patientId,
      name: localPatient.name,
    });
  }
  res.json(localPatientList);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
