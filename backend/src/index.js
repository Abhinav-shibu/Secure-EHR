const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const session = require('express-session');

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "notagoodsecret" }));
const Patient = require("./models/patient");
const Doctor = require("./models/doctor");
const PatientDiagnosis = require("./models/patientDiagnosis");
const DoctorUser = require("./models/users/doctorUser");
const PatientUser = require("./models/users/patientUser");
const AdminUser = require("./models/users/adminUser");
const SystemKey = require("./models/key/systemKey");

const { response } = require("express");

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://localhost:27017/secureEhr");
}

app.post("/testData", (req, res) => {
  console.log(req.body);
  res.json({ hello: "hello" });
});

app.post("/getSystemKey", async (req, res) => {
  const patient = await SystemKey.findOne({ patientId: req.body.patientId });
  res.json(patient.systemKey);
});

app.post("/addPatient", async (req, res) => {
  const patient = new Patient(req.body);
  const patientSystemKey = new SystemKey(req.body);
  await patient.save();
  await patientSystemKey.save();
  res.send("Success");
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
  const { patientId, encryptedPatientSystemKey } = req.body;
  const patient = {
    patientId: patientId,
    encryptedPatientSystemKey: encryptedPatientSystemKey,
  };
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
      patientId: req.body.patientId,
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
  const localDiagnosis = new PatientDiagnosis({
    ...req.body,
    doctorId: doctorId,
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
  req.session.user_id = user._id;
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
      req.session.user_id = user._id;
      res.send("Verified");
    } else {
      res.send("Not Verified");
    }
  }
});

app.post("/getSystemKeyFromUser", async (req, res) => {
  let userSystemKey = null;
  if (req.body.doctorId === undefined) {
    const localPatient = await Patient.findOne({
      patientId: req.body.patientId,
    });
    userSystemKey = localPatient.encryptedPatientSystemKey;
  } else {
    const localDoctor = await Doctor.findOne({ doctorId: req.body.doctorId });
    localDoctor.patientList.forEach((element) => {
      if (element.patientId === req.body.patientId) {
        userSystemKey = element.encryptedPatientSystemKey;
      }
    });
  }

  res.json(userSystemKey);
});
app.get("/getDoctor", async (req, res) => {
  const doctorList = await Doctor.find({});
  res.json(doctorList);
});

app.get("/getPatientDiagnostics/:dId&:pId", async (req, res) => {
  if(!require.session.user_id) {
  const patientDiagnostics = await PatientDiagnosis.findOne({
    patientId: req.params.pId,
    doctorId: req.params.dId,
  });
  res.json(patientDiagnostics);}
  else{
    res.redirect('/login');
  }
});

app.get("/getPatients/:dId", async (req, res) => {
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
