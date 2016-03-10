var mongoose = require('mongoose');
var Grid = require('gridfs-stream');

var conn = mongoose.createConnection("mongodb://localhost/gridfs");
conn.once('open', function () {
  var gfs = Grid(conn.db, mongoose.mongo);

  // all set!
  var writestream = gfs.createWriteStream();
  fs.createReadStream('/some/path').pipe(writestream);
})
