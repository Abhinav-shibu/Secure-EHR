import React from "react";
import "./App.css";

let CryptoJS = require('crypto-js');
const Blowfish = require('egoroof-blowfish');
const Buffer = require('buffer').Buffer;
let keySize = 256;
let iterations = 100;
const ircPrefix = "+OK *";
const IV = '00000000';

function App() {
  const [data, setData] = React.useState(null);
  const [plainText, updatePlainText] = React.useState("");
  const [pass, updatePass] = React.useState("");
  const [bcipher, updateBcipher] = React.useState("");


  function aencrypt () {

    let salt = CryptoJS.lib.WordArray.random(128/8);
    let key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize/32,
      iterations: iterations
    });
    let iv = CryptoJS.lib.WordArray.random(128/8);
    let encrypted = CryptoJS.AES.encrypt(plainText, key, { 
      iv: iv, 
      padding: CryptoJS.pad.Pkcs7, 
      mode: CryptoJS.mode.CBC    
    }); 
    updatePlainText(salt.toString()+ iv.toString() + encrypted.toString());  
    updateBcipher(salt.toString()+ iv.toString() + encrypted.toString());  


  }
  function adecrypt () {
    
    let salt = CryptoJS.enc.Hex.parse(plainText.substr(0, 32));
    let iv = CryptoJS.enc.Hex.parse(plainText.substr(32, 32));
    let encrypted = plainText.substring(64);
  
    var key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize/32,
      iterations: iterations
    });

    var decrypted = CryptoJS.AES.decrypt(encrypted, key, { 
      iv: iv, 
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
    updatePlainText(decrypted.toString(CryptoJS.enc.Utf8));
    
  }

  function bencrypt(){
    let salt = CryptoJS.enc.Hex.parse(plainText.substr(0, 32));
    var key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize/32,
      iterations: iterations
    });
    
    const blowfish = new Blowfish(key.toString(), Blowfish.MODE.CBC, Blowfish.PADDING.PKCS5);
    blowfish.setIv(IV);
    function generateIV() {
      const left = Math.random().toString(36).substring(2, 6);
      const right = Math.random().toString(36).substring(2, 6);
      return left + right;
   }
    const textToEncode = generateIV() + bcipher;
    const encodedString = Buffer.from(blowfish.encode(textToEncode)).toString('base64');
    updateBcipher(ircPrefix + encodedString);
  }

  function bdecrypt(){
    let salt = CryptoJS.enc.Hex.parse(plainText.substr(0, 32));
    var key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize/32,
      iterations: iterations
    });
    const blowfish = new Blowfish(key.toString(), Blowfish.MODE.CBC, Blowfish.PADDING.PKCS5);
    blowfish.setIv(IV);
    const cleanText = bcipher.substring(ircPrefix.length)
    const d = Buffer.from(cleanText, 'base64');
    const decoded = blowfish.decode(d, Blowfish.TYPE.UINT8_ARRAY);
    updateBcipher(Buffer.from(decoded).slice(8).toString('utf8'));
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>{!data ? "Loading..." : data}</p> 
        <input style={{'width':'700px'}} type="text" id="plaintext" className="txtAdd" value={plainText} onChange={(e)=>updatePlainText(e.target.value)} placeholder="Plaintext"></input>
        <input style={{'width':'350px'}} type="text" id="key" className="txtAdd" value={pass} onChange={(e)=>updatePass(e.target.value)} placeholder="Password"></input>
        <span><button onClick={aencrypt} type="button" id="encrbtn">AES Encrypt</button></span>
        <span><button onClick={adecrypt} type="button" id="decrybtn">AES Decrypt</button></span><br />
        
        <input style={{'width':'350px'}} type="text" id="bcipher" className="txtAdd" value={bcipher} onChange={(e)=>updateBcipher(e.target.value)} placeholder="Blowfish Input"></input>
        <span><button onClick={bencrypt} type="button" id="bencrbtn">Blowfish Encrypt</button></span>
        <span><button onClick={bdecrypt} type="button" id="bdecrbtn">Blowfish Decrypt</button></span>
      </header>
    </div>
  );
}

export default App;