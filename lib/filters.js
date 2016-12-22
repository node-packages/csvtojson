var exports = module.exports = {};


var safeParseInt = function (num) {
  try {
    return parseInt(num, 10);
  } catch (e) {
    return num;
  }
};

exports.stringFilter = function (input, next) {
  return next(null, input && input.toString().replace(/("|'|\s)/g, ''));
};

exports.numberFilter = function (input, next) {

  if (/\d+/.test(input)) {
    return next(null, safeParseInt(input));
  }

  // continue to next filter
  next(null, input);
};

exports.booleanFilter = function (input, next, context) {

  if (context.fields.indexOf(context.field) >= 0) {
    return next(null, context[input]);
  }

  // continue to next filter
  next(null, input);
};

