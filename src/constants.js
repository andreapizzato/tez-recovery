const CONFIG = {
  APP_ID: 'tez-bf',
  BASE: {},
  OPTIONS: {
    configPath: './config.json'
  }
};

const CHARSETS = [
  "0123456789",
  "0123456789abcdefghijklmnopqrstuvwxyz",
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&'()*+,-./:;<=>?@[\]^_`{|}~",
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&'()*+,-./:;<=>?@[\]^_`{|}~"
];

const AMERICAN_CHARSET = CHARSETS[5];

const WALLET = 'wallet';
const MNEMONIC = 'mnemonic';
const MODE = 'mode';
const MODES = {
  PWSEEDS: 'pwseeds',
  BRUTEFORCE: 'bruteforce'
};
const MATRIX = 'matrix';
const CHARSET = 'charset';
const LENGTH = 'size';
const JUMP = 'jump';

const ANCHOR = 'anchor';

module.exports = {
  CONFIG,

  CHARSETS,
  AMERICAN_CHARSET,

  WALLET,
  MNEMONIC,
  MODE,
  MODES,
  MATRIX,
  CHARSET,
  LENGTH,
  JUMP,

  ANCHOR,
};
