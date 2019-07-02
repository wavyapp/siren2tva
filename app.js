/* global module, require */

var checkSiret = require('siret');
var config = {
  codePays: "FR",
  firmApiBase: "https://firmapi.com/api/v1/",
  firmApiSearch: "companies/",
  longCode: false
};

function isTVA(number) {
  var numero = cleanSiret(number);
  if (numero.substring(0, 2) !== config.codePays) return false;
  var keyFound = numero.substring(2, 4);
  var siren = numero.substring(4, 13);
  if (!checkSiret.isSIREN(siren)) return false;
  if (getTvaKeyFromSiren(siren) !== keyFound) return false;
  else return true;
}

function convertTva2Siren(number) {
  var numero = cleanSiret(number);
  return numero.substring(4, 13);
}

function convertSiren2Tva(number) {
  if (isNaN(number)) return false;
  var isSiret = false;
  var numero = cleanSiret(number);
  if (checkSiret.isSIREN(number)) isSiret = false;
  else if (checkSiret.isSIRET(number)) isSiret = true;
  else return false;
  if (isSiret) {
    numero = numero.substring(0, 9);
  }
  var codeP = config.codePays;
  var key = getTvaKeyFromSiren(numero);
  if (config.longCode === true) {
    return codeP + key + ' ' + numero.substring(0, 3) + ' ' + numero.substring(3, 6) + ' ' + numero.substring(6, 9);
  }
  else {
    return codeP + key + numero;
  }
}

function getTvaKeyFromSiren(number) {
  var k = (12 + (3 * (parseInt(number) % 97))) % 97;
  var key = (k < 10) ? "0" + k : "" + k;
  return key;
}


function cleanSiret(number) {
  var numero = new String(number);
  numero = numero.replace(/\s/g, '');
  return numero;
}

module.exports.siret2tva = convertSiren2Tva;
module.exports.siren2tva = convertSiren2Tva;
module.exports.tva2siren = convertTva2Siren;
module.exports.cleanSiret = cleanSiret;
module.exports.cleanSiren = cleanSiret;
module.exports.cleanTva = cleanSiret;
module.exports.check = checkSiret;
module.exports.check.isTVA = isTVA;
