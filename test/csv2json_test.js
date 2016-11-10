var csv2json = require('../lib/csv2json');
var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;

describe('csv2json', function () {
  var options = {
    filename: 'result.json',
    delimiter: ';',
    filters: {
      numberFilter: {
        regex: /\d+/
      },
      booleanFilter: {
        fields: ['housing', 'loan', 'default', 'y'],
        yes: true,
        no: false
      }
    },
    uuid: true
  };

  it('convert csv2json with numeric conversion', function () {

    csv2json.toJson(path.join(__dirname, 'bank-full.csv'), options);

    var jsonout =
      JSON.parse(
        fs.readFileSync('./result.json'));

    expect(jsonout).to.deep.equal(require('./res2csv.json'));

  });


});
