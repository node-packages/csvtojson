/**
 * Created by ferron on 11/9/16.
 */


var csvjson = require('./lib/csv2json');
var options = {
  filename: 'result.json',
  delimiter: ';'
};

csvjson.toJson('./bank-full.csv', options);
