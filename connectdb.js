'use strict';

// Retrieve
var MongoClient = require('mongodb').MongoClient;
var settings = require('./valueSettings');
var recordsWithApiKey = []
// Connect to the db
MongoClient.connect(settings.URI, function(err, db) {
  if(err) {
    console.dir(err);
  }
  var dbName = db.db('strapi');
  var uploadFile = dbName.collection('upload_file');
  var rs = uploadFile.find({}).limit(3);
  rs.toArray((err,docs)=>{
    docs.forEach(data => {
      if (JSON.stringify(data.related) == '[]') {
        data.related = [{kind : 'noRelated'}];
        console.log("############changed")

      }
      try {
        let kind = data.related[0]['kind'];
        let propertyOfRecord = recordsWithApiKey[kind];
        if (typeof propertyOfRecord === 'undefined') {
          recordsWithApiKey[kind] = [data];
        } else {
          recordsWithApiKey[kind].push(data)
        }
      } catch (error) {
        throw new Error('Has a error occour at converting data',error)
      }
    });
    console.log(docs)
    console.log(recordsWithApiKey)
  });
});