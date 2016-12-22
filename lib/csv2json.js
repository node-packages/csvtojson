var fs = require('fs');
var Pipeline = require('./pipeline');

var pipeline = Pipeline.create('csv2json processing');
var filters = require('./filters');
var hash = require('object-hash');

module.exports = {
  toJson: function (path, options) {
    options ||
    (options = {
      filename: 'result.json',
      indent: 3,
      delimiter: ','
    });

    pipeline.use(filters.stringFilter);
    // pipeline.use(filters.numberFilter);

    if(options.filters && options.filters.booleanFilter) {
      pipeline.use(filters.booleanFilter, options.filters.booleanFilter);
    }

    var content = readFileIfExist(path);
    if (!content || typeof content !== 'string') {
      throw new Error('Invalid CSV Data');
    }
    content = content.split(/[\n\r]+/gi);
    var Columns = content.shift().split(options.delimiter),
      jsonObject = [];

    content.forEach(function (item) {
      if (item) {
        item = item.split(options.delimiter);
        var hashItem = {};
        Columns.forEach(function (c, i) {
          var field = sanitize(c);
          // exclude field from json output
          if(options.exclude.indexOf(field.toLowerCase()) == -1) {
            hashItem[field] = pipeline.execute(item[i], { field: field });
          }
        });
        if (options.uuid) {
          hashItem['_key'] = hash(hashItem);
        }
        jsonObject.push(hashItem);
      }
    });
    return saveToFile(jsonObject, options);
  }
};

var sanitize = function (value) {
  return value.replace(/("|'|\s)/g, '');
};

var readFileIfExist = function (path) {
  if (fs.statSync(path)) {
    return fs.readFileSync(path, 'utf8');
  }
  return null;
};

var saveToFile = function (data, options) {
  if (typeof data == 'object') {
    data = JSON.stringify(data, null, options.indent);
  }
  fs.writeFileSync(options.filename, data, 'utf8');
};

