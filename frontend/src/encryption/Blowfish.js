const Blowfish = require('egoroof-blowfish');
const Buffer = require('buffer').Buffer;
let CryptoJS = require('crypto-js');
let keySize = 256;
let iterations = 100;
const IV = '00000000';
const ircPrefix = "+OK *";


function blowfishEncrypt(pass, plainText){
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
    const textToEncode = generateIV() + plainText;
    const encodedString = Buffer.from(blowfish.encode(textToEncode)).toString('base64');
    return(salt.toString() + ircPrefix + encodedString);
  }

  function blowfishDecrypt(pass, text){
    const plainText = text.substring(32);
    let salt = CryptoJS.enc.Hex.parse(text.substring(0, 32));
    var key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize/32,
      iterations: iterations
    });
    const blowfish = new Blowfish(key.toString(), Blowfish.MODE.CBC, Blowfish.PADDING.PKCS5);
    blowfish.setIv(IV);
    const cleanText = plainText.substring(ircPrefix.length)
    const d = Buffer.from(cleanText, 'base64');
    const decoded = blowfish.decode(d, Blowfish.TYPE.UINT8_ARRAY);
    return(Buffer.from(decoded).slice(8).toString('utf8'));
  }

  export {blowfishEncrypt, blowfishDecrypt};
