module.exports = function() {
  var str = arguments[0],
      len = arguments.length+1,
      safe, arg;

  for (i=1; i < len; arg = arguments[i++]) {
    safe = typeof arg === 'object' ? JSON.stringify(arg) : arg;
    str = str.replace(RegExp('\\{'+(i-2)+'\\}', 'g'), safe);
  }

  return str;
};
