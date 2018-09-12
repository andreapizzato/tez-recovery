const Optimizer = function(str){
  this.str = str;
};

Optimizer.prototype.getCharset = function(){
  if(!this.str || this.str == ''){
    throw new Error('Unable to optimize a charset without a valid, non-empty string.');
  }

  let charset = '';

  const map = {};
  for(let i=0; i<this.str.length; i++){
    const c = this.str.charAt(i);

    if(c != ' '){
      map[c] = map[c] ? (map[c] + 1) : 1;
    }
  }

  const list = [];
  for(let c in map){
    list.push({
      char: c,
      count: map[c]
    });
  }

  list.sort((a, b) => (a.count < b.count) ? 1 : (a.count > b.count ? -1 : 0));

  charset = list.map((item) => item.char).join('');

  return charset;
};

module.exports = Optimizer;