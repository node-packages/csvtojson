/**
 * Created by ferron on 11/10/16.
 */

var Pipeline = function (name) {
  this.name = name || '';
  this.filters = [];
};

Pipeline.prototype.use = function (filter, context) {
  this.filters.push({ fn: filter, context: context });
};

Pipeline.prototype.execute = function (input, context) {
  var copy = input;

  this.filters.forEach(function (filter) {

    // additional context at run-time
    var c = filter.context || {};
    for (var cc in context) {
      c[cc] = context[cc];
    }

    filter.fn(copy, function (err, result) {
      if (err) throw Error(err);
      copy = result;
    }, c);
  });
  return copy;
};

exports.create = function (name) {
  return new Pipeline(name);
};
