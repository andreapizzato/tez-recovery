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
  PERMUTATION: ' permutation',

  BRUTEFORCE: 'bruteforce'
};
const MATRIX = 'matrix';
const CHARSET = 'charset';
const LENGTH = 'size';
const JUMP = 'jump';
const TYPE = 'type';
const TYPES = {
  NORMAL: 'normal',
  ICO: 'ico'
};
const EMAIL = 'email';

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
  TYPE,
  TYPES,
  EMAIL,

  ANCHOR,
};
