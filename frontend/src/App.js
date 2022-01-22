import React from "react";
import "./App.css";

// const crypto = require('crypto');
import crypto from 'crypto-browserify';
const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b"; // set random encryption key
const IV = "5183666c72eec9e4"; // set random initialisation vector
// ENC_KEY and IV can be generated as crypto.randomBytes(32).toString('hex');

const phrase = "who let the dogs out";


function App() {
  const [data, setData] = React.useState(null);
  const [plainText, updatePlainText] = React.useState("");
  const [key, updateKey] = React.useState("");

  function encrypt () {
    let cipher = crypto.createCipheriv('aes-256-cbc',key,IV);
    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    console.log(encrypted)
    updatePlainText(encrypted);
  }
  function decrypt () {
    let decipher = crypto.createDecipheriv('aes-256-cbc', key, IV);
    let decrypted = decipher.update(plainText, 'base64', 'utf8');
    return (decrypted + decipher.final('utf8'));
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>{!data ? "Loading..." : data}</p> 
        <input type="text" id="plaintext" className="txtAdd" value={plainText} onChange={(e)=>updatePlainText(e.target.value)} placeholder="Plaintext"></input>
        <input type="text" id="plaintext" className="txtAdd" value={key} onChange={(e)=>updateKey(e.target.value)} placeholder="Key"></input>
        <button onClick={encrypt} type="button" id="encrbtn">Encrypt</button>
      </header>
    </div>
  );
}

export default App;