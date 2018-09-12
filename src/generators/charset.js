const CharsetGenerator = function(charset, length, anchor = null) {
  this._genCharset = charset;
  this._genRadix = charset.length;
  this._jumpDoubles = false;
  this._jumpTriplets = true;
  this._genIndex = this.__startIndex(length);
  this._length = length;
  
  if (!anchor) {
    this._map = [-1];
    for (var i = 0; i < length - 1; i++) {
      this._map.push(0);
    }
  } else {
    this._map = anchor;
  }
};

CharsetGenerator.prototype.__startIndex = function(length) {
  if (this._jumpDoubles) {
    let count = 1;
    for (let i = 0; i < length; i++) {
      count = count * (length - i);
    }

    return count;
  } else {
    return Math.pow(this._genRadix, length - 1);
  }
};

CharsetGenerator.prototype.getPasswordsCount = function() {
  let count = 0;
  for (var i = 0; i < this._length; i++) {
    count += ((Math.pow(this._genRadix, i) * (this._map[i] > 0 ? this._map[i] - 1 : 0)) + this._map[i]);
  }

  return count;
};

CharsetGenerator.prototype.getMaxPasswordsCount = function() {
  return Math.pow(this._genRadix, this._length);
};

CharsetGenerator.prototype.__str = function() {
  let str = '';
  for (var i in this._map) {
    str = this._genCharset.charAt(this._map[i]) + str;
  }

  return str;
};

CharsetGenerator.prototype.next = function() {
  let shift = 0;
  let end = false;

  const checkForJump = this._jumpDoubles
    ? (index, length, n) => (index < (length - 1) && this._map[index + 1] == n) ? 1 : 0
    : (this._jumpTriplets
      ? (index, length, n) => (index < (length - 2) && this._map[index + 1] == n && this._map[index + 2] == n) ? 1 : 0
      : () => 0
    );

  this._map = this._map.map((n, index) => {
    if (index === 0) {
      n += 1;
    } else if (shift) {
      n += shift;
      shift = 0;
    }

    n += checkForJump(index, this._length, n);

    if (n >= this._genRadix) {
      n = 0;
      shift = 1;
      if (index == this._length - 1) {
        end = true;
      }
    }

    return n;
  });

  return end ? false : this.__str();
};

module.exports = CharsetGenerator;
