const express = require("express");
var CryptoJS = require("crypto-js");
var WebSocket = require("ws");
const app = express();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var bodyParser = require("body-parser");
const MongoURI = "mongodb://localhost:27017/secureEhr";
const jwt = require("jsonwebtoken");
const JWT_SECRET = "THIS IS MEANT TO BE A SECRET!";
const PASSPORT_SECRET = "THIS IS MEANT TO BE A SECRET!";

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(MongoURI, {useNewUrlParser: true});
}

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const Patient = require("./models/patient");
const Doctor = require("./models/doctor");
const PatientDiagnosis = require("./models/patientDiagnosis");
const DoctorUser = require("./models/users/doctorUser");
const PatientUser = require("./models/users/patientUser");
const AdminUser = require("./models/users/adminUser");
const SystemKey = require("./models/key/patientSystemKey");

const { response } = require("express");


function verifyJWT(req, res, next){
  const token = req.headers["x-access-token"]?.split(' ')[1]

  if(token){
    jwt.verify(token, PASSPORT_SECRET, (err, decoded) => {
      if(err) return res.json({
        isLoggedIn: false,
        message: "Failed To Authenticate"
      })
      req.user = {};
      req.user.id = decoded.id
      req.user.username = decoded.username
      next()
    })
  } else {
    res.json({message: "Incorrect Token Given", isLoggedIn: false})
  }
}


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
      res.json("Doctor saved to database");
    })
    .catch((err) => {
      res.status(400).json("Unable to save to database");
    });
});

app.post("/addPatientDoctorLink/:docId", async (req, res) => {
  const doctor = await Doctor.findOne({ doctorId: req.params.docId });
  const { patientId } = req.body;
  const patient = {
    patientId: patientId,
    // encryptedPatientSystemKey: encryptedPatientSystemKey,
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

  res.json({ status: "ok" });
});

app.post("/linkPatientSystemKey/:docId", async(req, res) => {
  // const doctor = await Doctor.findOne({ doctorId: req.params.docId });
  const { patientId, encryptedPatientSystemKey } = req.body;
  const updateData = {
    $set: { "patientList.$.encryptedPatientSystemKey": encryptedPatientSystemKey}
  };
  const query = {doctorId: req.params.docId, "patientList.patientId": patientId }
  const result = await Doctor.updateOne(query, updateData);
  console.log(result);
})

app.post("/getPendingPatientLinkList/:dId", async (req, res) => {
  console.log(req.params.dId);
  const doctor = await Doctor.findOne({ doctorId: req.params.dId });
  const pList = [];
  for(let i=0; i<doctor.patientList.length;i++){
    if (doctor.patientList[i].encryptedPatientSystemKey === "null"){
      pList.push(doctor.patientList[i].patientId)
    }
  }
  console.log(pList);
  res.json(pList);
})

app.post("/:dId/addDiagnosis", async (req, res) => {
  const doctorId = req.params.dId;
  console.log(req.body);
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
  res.json({ status: "Doctor Account Created" });
});

app.post("/adminSignUp", async(req,res) => {
  const {username, password} = req.body;
  const hash = await bcrypt.hash(password, 12);
  let localAdmin = new AdminUser({
    username, 
    password : hash
  });
  await localAdmin.save();
})

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
      const payload = {
        id: localUser._id,
        username: localUser.username
      }
      jwt.sign(
        payload,
        JWT_SECRET,
        {expiresIn: 86400},
        (err, token) => {
          if (err){
            return res.json({message: err})
          }
          return res.json({
            message: "Success",
            token: "Bearer " + token
          });
        }
      )
    } else {
      res.send("Not Verified");
    }
  }
});

app.post("/adminLogin", async (req, res) => {
  const { username, password } = req.body;
  let localUser = await AdminUser.findOne({ username });
  if (localUser === null) {
    res.send("No Such User");
  } else {
    const validPassword = await bcrypt.compare(password, localUser.password);
    if (validPassword) {
      const payload = {
        id: localUser._id,
        username: localUser.username
      }
      jwt.sign(
        payload,
        JWT_SECRET,
        {expiresIn: 86400},
        (err, token) => {
          if (err){
            return res.json({message: err})
          }
          return res.json({
            message: "Success",
            token: "Bearer " + token
          });
        }
      )
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
    userSystemKey = localDoctor.patientList;
  }

  res.json(userSystemKey);
});

// app.get("/getNameFromId", async (req, res) => {
//   let name = null;
//   if (req.body.doctorId === undefined){
//     const localPatient = await Patient.findOne({
//       patientId: req.body.patientId,
//     });
//     name = localPatient.pati
//   }
//   else if (req.body.patientId === undefined){
    
//   }
// });

app.get("/getDoctor", async (req, res) => {
  const doctorList = await Doctor.find({});
  res.json(doctorList);
});

app.post("/getPatientDiagnostics", async (req, res) => {
  let patientDiagnosis = null;
  if (req.body.doctorId === undefined) {
    patientDiagnosis = await PatientDiagnosis.find({
      patientId: req.body.patientId,
    });
  } else {
    patientDiagnosis = await PatientDiagnosis.find({
      doctorId: req.body.doctorId,
    });
  }
  res.json(patientDiagnosis);
});

app.get("/getPatients/:dId", async (req, res) => {
  const patientList = (await Doctor.findOne({ doctorId: req.params.dId }))
    .patientList;
  const localPatientList = [];

  for (const patient of patientList) {
    const localPatient = await PatientDiagnosis.findOne({
      patientId: patient.patientId,
      doctorId: req.params.dId,
    });
    localPatientList.push({
      patientId: localPatient.patientId,
      encryptedPatientSystemKey: patient.encryptedPatientSystemKey,
      consultationDate: localPatient.consultationDate,
      symptoms: localPatient.symptoms,
      diagnosticResults: localPatient.diagnosticResults,
    });
  }
  res.json(localPatientList);
});

app.post("/check", async (req, res) => {
  let user = "";
  if (req.body.user === "patient") {
    user = await PatientUser.findOne({ username: req.body.username });
  } else {
    user = await DoctorUser.findOne({ username: req.body.username });
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (validPassword) {
    res.json("True");
  } else {
    res.json("False");
  }
});

app.delete("/logout", (req, res) => {
  req.session.destroy((err) => {
    //delete session data from store, using sessionID in cookie
    if (err) throw err;
    res.clearCookie("session-id"); // clears cookie containing expired sessionID
    res.send("Logged out successfully");
  });
});

app.get("/getUsername", verifyJWT, (req, res) => {
  res.json({isLoggedIn: true, username: req.user.username})
})

app.get("/getPatientList", (req, res) => {
  const doctorId = req.doctorID;
  console.log(doctorId);
})
//blockchain

var p2p_port = process.env.P2P_PORT || 6001;
var initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class Block {
  constructor(index, previousHash, timestamp, data, hash) {
      this.index = index;
      this.previousHash = previousHash.toString();
      this.timestamp = timestamp;
      this.data = data;
      this.hash = hash.toString();
  }
}

var sockets = [];
var MessageType = {
  QUERY_LATEST: 0,
  QUERY_ALL: 1,
  RESPONSE_BLOCKCHAIN: 2
};

var getGenesisBlock = () => {
  return new Block(0, "0", 1465154705, "my genesis block!!", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
};

const blockchain = [getGenesisBlock()];


app.get('/blocks', (req, res) => res.send(JSON.stringify(blockchain)));

    app.post('/mineBlock', (req, res) => {
        console.log("mineblock");
        var newBlock = generateNextBlock(req.body);
        addBlock(newBlock);
        broadcast(responseLatestMsg());
        console.log('block added: ' + JSON.stringify(newBlock));
        console.log(newBlock.index + "kjkjhkjh");
        res.json(newBlock.index);
    });
    app.get('/peers', (req, res) => {
        res.send(sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    app.post('/addPeer', (req, res) => {
        connectToPeers([req.body.peer]);
        res.send();
    });
    app.post("/compareHash", (req, res) => {
      const bId = req.body.blockchainId;
      delete req.body.blockchainId;
      console.log(req.body);
      for(let i=0; i<blockchain.length;i++){
        if(bId===blockchain[i].index){
          console.log(CryptoJS.SHA256(req.body).toString());
          console.log(blockchain[i].data);
          if(CryptoJS.SHA256(req.body.patientId+req.body.consultationDate+req.body.symptoms+req.body.diagnosticResults).toString()===blockchain[i].data){
            res.json("Success");
          }
          else{
            res.json("Failure");
          }
        }
      }
    });
    var initP2PServer = () => {
      var server = new WebSocket.Server({port: p2p_port});
      server.on('connection', ws => initConnection(ws));
      console.log('listening websocket p2p port on: ' + p2p_port);
  
  };
  
  var initConnection = (ws) => {
      sockets.push(ws);
      initMessageHandler(ws);
      initErrorHandler(ws);
      write(ws, queryChainLengthMsg());
  };
  
  var initMessageHandler = (ws) => {
      ws.on('message', (data) => {
          var message = JSON.parse(data);
          console.log('Received message' + JSON.stringify(message));
          switch (message.type) {
              case MessageType.QUERY_LATEST:
                  write(ws, responseLatestMsg());
                  break;
              case MessageType.QUERY_ALL:
                  write(ws, responseChainMsg());
                  break;
              case MessageType.RESPONSE_BLOCKCHAIN:
                  handleBlockchainResponse(message);
                  break;
          }
      });
  };
  
  var initErrorHandler = (ws) => {
      var closeConnection = (ws) => {
          console.log('connection failed to peer: ' + ws.url);
          sockets.splice(sockets.indexOf(ws), 1);
      };
      ws.on('close', () => closeConnection(ws));
      ws.on('error', () => closeConnection(ws));
  };
  
  
  var generateNextBlock = (blockData) => {
      var previousBlock = getLatestBlock();
      var nextIndex = previousBlock.index + 1;
      var nextTimestamp = new Date().getTime() / 1000;
      const data = CryptoJS.SHA256(blockData.patientId+blockData.consultationDate+blockData.symptoms+blockData.diagnosticResults).toString();
      console.log(CryptoJS.SHA256(blockData).toString()+" + test + " + CryptoJS.SHA256(blockData).toString());
      var nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, data);
      return new Block(nextIndex, previousBlock.hash, nextTimestamp, data, nextHash);
  };
  
  
  var calculateHashForBlock = (block) => {
      console.log(block);
      return calculateHash(block.index, block.previousHash, block.timestamp, block.data);
  };
  
  var calculateHash = (index, previousHash, timestamp, data) => {
      return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
  };
  
  var addBlock = (newBlock) => {
      if (isValidNewBlock(newBlock, getLatestBlock())) {
          blockchain.push(newBlock);
      }
  };
  
  var isValidNewBlock = (newBlock, previousBlock) => {
      if (previousBlock.index + 1 !== newBlock.index) {
          console.log('invalid index');
          return false;
      } else if (previousBlock.hash !== newBlock.previousHash) {
          console.log('invalid previoushash');
          return false;
      } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
          console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
          console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
          return false;
      }
      return true;
  };
  
  var connectToPeers = (newPeers) => {
      newPeers.forEach((peer) => {
          var ws = new WebSocket(peer);
          ws.on('open', () => initConnection(ws));
          ws.on('error', () => {
              console.log('connection failed')
          });
      });
  };
  
  var handleBlockchainResponse = (message) => {
      var receivedBlocks = JSON.parse(message.data).sort((b1, b2) => (b1.index - b2.index));
      var latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
      var latestBlockHeld = getLatestBlock();
      if (latestBlockReceived.index > latestBlockHeld.index) {
          console.log('blockchain possibly behind. We got: ' + latestBlockHeld.index + ' Peer got: ' + latestBlockReceived.index);
          if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
              console.log("We can append the received block to our chain");
              blockchain.push(latestBlockReceived);
              broadcast(responseLatestMsg());
          } else if (receivedBlocks.length === 1) {
              console.log("We have to query the chain from our peer");
              broadcast(queryAllMsg());
          } else {
              console.log("Received blockchain is longer than current blockchain");
              replaceChain(receivedBlocks);
          }
      } else {
          console.log('received blockchain is not longer than current blockchain. Do nothing');
      }
  };
  
  var replaceChain = (newBlocks) => {
      if (isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
          console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
          blockchain = newBlocks;
          broadcast(responseLatestMsg());
      } else {
          console.log('Received blockchain invalid');
      }
  };
  
  var isValidChain = (blockchainToValidate) => {
      if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(getGenesisBlock())) {
          return false;
      }
      var tempBlocks = [blockchainToValidate[0]];
      for (var i = 1; i < blockchainToValidate.length; i++) {
          if (isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
              tempBlocks.push(blockchainToValidate[i]);
          } else {
              return false;
          }
      }
      return true;
  };
  
  var getLatestBlock = () => blockchain[blockchain.length - 1];
  var queryChainLengthMsg = () => ({'type': MessageType.QUERY_LATEST});
  var queryAllMsg = () => ({'type': MessageType.QUERY_ALL});
  var responseChainMsg = () =>({
      'type': MessageType.RESPONSE_BLOCKCHAIN, 'data': JSON.stringify(blockchain)
  });
  var responseLatestMsg = () => ({
      'type': MessageType.RESPONSE_BLOCKCHAIN,
      'data': JSON.stringify([getLatestBlock()])
  });
  
  var write = (ws, message) => ws.send(JSON.stringify(message));
  var broadcast = (message) => sockets.forEach(socket => write(socket, message));
  
  connectToPeers(initialPeers);
  initP2PServer();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


