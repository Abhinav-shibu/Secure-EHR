const CryptoJS = require('crypto-js');
const keySize = 256;
const iterations = 100;

function aesEncrypt (pass, plainText) {

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
    return (salt.toString()+ iv.toString() + encrypted.toString());  


  }
  function aesDecrypt (pass, plainText) {
    
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
    return(decrypted.toString(CryptoJS.enc.Utf8));
    
  }

  export {aesEncrypt, aesDecrypt};