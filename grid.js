var mongoose = require('mongoose');
var path = require('path');
var Schema = mongoose.Schema;
var s = require('stream');
mongoose.connect('mongodb://127.0.0.1/gridfs', function() {
  console.log("connected");
});
var conn = mongoose.connection;
var prompt = require('prompt');
var fs = require('fs');

var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;


var testObj = {
  test1: 'test',
  test2: 'blah',
  test3: 'aejf',
  nested: {
    anotherobj: 'hi',
    boolean: true,
    num: 1
  }
}

var newObj = {};

conn.once('open', function () {
  var data = '';
   console.log('open');
   var gfs = Grid(conn.db);
   //read from mongod

  //  WRITING TO DATABASE
  //  var objstream = new s.Readable();
  //  objstream.push(JSON.stringify(testObj));
  //  objstream.push(null);
   //
  //  var writestream = gfs.createWriteStream({
  //      filename: 'whatwhat',
  //      metadata: {PatientID: 3}
  //  });
   //
  //  objstream.pipe(writestream);
   //
  //  writestream.on('close', function (file) {
  //      // do something with `file`
  //      console.log('file', file)
  //    });

  //READING FROM DATABASE

  //Prompt user for file name
  //  prompt.start();
  //  prompt.get(['filename'], function(err, result){
    //  var readstream = gfs.createReadStream({
    //       filename: result.filename
    //  });
     //
    //  readstream.on('error', function (err) {
    //    console.log("error: " + err);
    //  })
     //
    //  readstream.on('data', function(chunk) {
    //    data += chunk;
    //  });
     //
    //  readstream.on('end', function() {
    //    console.log("data", JSON.parse(data));
    //    newObj = JSON.parse(data);
    //    console.log(newObj.test2);
    //  });
  //  });
  //

  //Create model based on fs.files Schema, and use it to query metadata field to retrieve gridfs objects
  var Schema = mongoose.Schema;

  var Record = new Schema({
    "filename": String,
    "contentType": String,
    "length": Number,
    "chunkSize": Number,
    "uploadDate": Date,
    "aliases": String,
    "metadata": String,
    "md5": String,
  });

  var Record = mongoose.model('Record', Record, 'fs.files');

  Record.
    find({
      'metadata.PatientID': 3
    }).
    exec(function(err, data){
      var filenameArray = []
      var result = ''
      for (var i = 0; i < data.length; i++) {
        filenameArray.push(data[i].filename)
      }
      var readstream = gfs.createReadStream({
           filename: filenameArray[0]
      });

      readstream.on('error', function (err) {
        console.log("error: " + err);
      })

      readstream.on('data', function(chunk) {
        result += chunk;
      });

      readstream.on('end', function() {
        console.log("data", JSON.parse(result));
        newObj = JSON.parse(result);
        console.log(newObj.test2); // <--- will output value of test2 field, which should be 'blah'
      });
    })

});
