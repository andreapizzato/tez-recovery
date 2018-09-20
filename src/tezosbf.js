const { eztz } = require('../lib/eztz.cli');

const {
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
  ANCHOR
} = require('./constants');

const propsToCheck = {
  [MODES.PWSEEDS]: [WALLET, TYPE, MNEMONIC, MATRIX],
  [MODES.BRUTEFORCE]: [WALLET, TYPE, MNEMONIC, CHARSET, LENGTH, JUMP]
};

const TezosBF = function(config) {
  const props = propsToCheck[config[MODE]] || null;
  
  this.isValid = true;

  if(props){
    for(var k in props){
      if(typeof config[props[k]] == 'undefined'){
        this.isValid = false;
        break;
      } else {
        this[props[k]] = config[props[k]];
      }
    }

    this[MODE] = config[MODE];
    this[ANCHOR] = config[ANCHOR] || null;
    this[EMAIL] = config[EMAIL] || null;

    if(this[TYPE] == TYPES.ICO && !this[EMAIL]){
      this.isValid = false;
    }
  } else {
    this.isValid = false;
  }

  if(this.isValid){
    this.__constructGenerator();
  }

  this.onTick = null;
  this.onSuccess = null;
  this.onFail = null;
};

TezosBF.prototype.__constructGenerator = function(){
  const anchor = this[ANCHOR];

  if(this.mode == MODES.PWSEEDS){
    var MatrixGenerator = require('./generators/matrix');

    this.generator = new MatrixGenerator(this[MATRIX], anchor);
    this.totalPasswordsCount = this.generator.getMaxPasswordsCount();
  } else {
    var CharsetGenerator = require('./generators/charset');

    this.generator = new CharsetGenerator(this[CHARSET], this[LENGTH], anchor, { jump: this[JUMP] });
    this.totalPasswordsCount = this.generator.getMaxPasswordsCount();
  }
};

TezosBF.prototype.__checkPassword = function(password, cb) {
  const keys = eztz.crypto.generateKeys(this.mnemonic, password);

  if (keys.pkh && keys.pkh == this.wallet) {
    if(typeof this.onTick === 'function'){
      this.onTick(this.generator.getPasswordsCount(), this.generator._map);
    }

    if(typeof this.onSuccess === 'function'){
      this.onSuccess(password);
    }
  } else {
    cb();
  }
};

TezosBF.prototype.__checkNextPassword = function() {
  const password = (this[EMAIL] || "") + this.generator.next();

  if (password === false) {
    if(typeof this.onTick === 'function'){
      this.onTick(this.totalPasswordsCount, this.generator._map);
    }

    if(typeof this.onFail === 'function'){
      this.onFail();
    }

    return;
  }

  this.keep = this.keep || 0;

  this.__checkPassword(password, () => {
    ++this.keep;
    if (this.keep % 100 == 0) {
      this.keep = 0;

      if(typeof this.onTick === 'function'){
        this.onTick(this.generator.getPasswordsCount(), this.generator._map);
      }
    }

    const _this = this;
    setTimeout(function(){
      _this.__checkNextPassword();
    }, 0);
  });
};

TezosBF.prototype.find = function(){
  this.__checkNextPassword();
};

module.exports = TezosBF;
