const MatrixGenerator = function(matrix = [], anchor = null) {
  this._genMatrix = matrix;
  
  if (!anchor) {
    this._map = [-1];
    for (var i = 0; i < matrix.length - 1; i++) {
      this._map.push(0);
    }
  } else {
    this._map = anchor;
  }
};

MatrixGenerator.prototype.getPasswordsCount = function() {
  let count = 0;
  for (var i = 0; i < this._genMatrix.length; i++) {
    count += ((Math.pow(this._genMatrix[i].length, i) * (this._map[i] > 0 ? this._map[i] - 1 : 0)) + this._map[i]);
  }

  return count;
};

MatrixGenerator.prototype.getMaxPasswordsCount = function() {
  let count = 1;
  for (var i = 0; i < this._genMatrix.length; i++) {
    count *= this._genMatrix[i].length;
  }

  return count;
};

MatrixGenerator.prototype.__str = function() {
  let str = '';
  for (var i in this._map) {
    str += this._genMatrix[i][this._map[i]];
  }

  return str;
};

MatrixGenerator.prototype.next = function() {
  let shift = 0;
  let end = false;
  
  this._map = this._map.map((n, index) => {
    if (index === 0) {
      n += 1;
    } else if (shift) {
      n += shift;
      shift = 0;
    } else {
      return n;
    }

    if (n >= this._genMatrix[index].length) {
      n = 0;
      shift = 1;
      if (index == this._genMatrix.length - 1) {
        end = true;
      }
    }

    return n;
  });

  return end ? false : this.__str();
};

module.exports = MatrixGenerator;
