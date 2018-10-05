'use strict';

// Retrieve
var MongoClient = require('mongodb').MongoClient;
var settings = require('./valueSettings');
var recordsWithApiKey = [];
var assert = require('assert');
var deleteTool = require('./delete');
//Connect to the db
MongoClient.connect(settings.URI, function(err, client) {
  if(err) {
    console.dir(err);
  }
  var dbName = client.db(settings.dbName);
  get_all_file_uploaded(client,dbName);
  //db.close()
});

function get_all_file_uploaded (client,dbName) { 
  var uploadFileCollection = dbName.collection(settings.uploadFileCollectionName);
  var result = uploadFileCollection.find({}); // query all file uploaded
  result.toArray((err,docs)=> {
    docs.forEach(aRecord => {
      if (JSON.stringify(aRecord.related) == '[]') {
        aRecord.related = [{kind : 'noRelated'}];
        let nameFileInPublic = aRecord.hash + aRecord.ext;
        let nameFolderInResize = aRecord.name.replace(/.jpg|.png|.mtl|.obj/g,'')
        deleteTool.deleteOnDisk(nameFileInPublic,nameFolderInResize);
        //console.log("############changed")
      }
      try {
        // handle data to store in recordsWithApiKey
        let kind = aRecord.related[0]['kind'];
        let propertyOfRecord = recordsWithApiKey[kind];
        if (typeof propertyOfRecord === 'undefined') {
          recordsWithApiKey[kind] = [aRecord];
        } else {
          recordsWithApiKey[kind].push(aRecord)
        }
      } catch (error) {
        throw new Error('Has a error occour at converting data',error)
      }
    });
    client.close();
    //console.log(recordsWithApiKey);
    /**
     * delete file in recordsWithApiKey
     */
    //mainAction(recordsWithApiKey,uploadFileCollection);
  });
}

// function check_record_exists(listRecordWithId,_id) {
//   assert.equal(typeof listRecordWithId, 'object');
//   return listRecordWithId.indexOf(_id) < 0 ? false : true
// }

// function query_all_collection(collectionName,allIdOfUploadFile) {
//   var resultIdQueryAll = []; // it is store all id in use of collection that is not upload_file collection
//   MongoClient.connect(settings.URI, (err,db) => {
//     // declare varible to store all records id
//     if(err) throw new Error('get db at querying collection, step was failed',err);
//     //set db name and collection name
//     let dbStrapi = db.db(settings.dbName);
//     let collection = dbStrapi.collection(collectionName);
//     // query all record in collection
//     let resultQueryAll = collection.find({});
//     // get data of records to store in resultIdQueryAll
//     resultQueryAll.toArray((err,docs) => {
//       resultIdQueryAll = docs.map(record => record.id ? record.id : null);
//       resultIdQueryAll = resultIdQueryAll.filter(record => record !== null);// pass a parameter that store all item's id of a collection
//       // filter the to id delete in all id parameter
//       let idToDelete = [];
//       let idsOfCollection  = recordsWithApiKey[collectionName];
//       let anyCollection = db.collection(collectionName);
//       for (let i in idsOfCollection){
//         let queryResult =  await anyCollection.findOne({id: idsOfCollection[i]});
//         queryResult.then(record => {
//           let _idOfRecord = record.related[0].ref
//           if (resultIdQueryAll.indexOf(_idOfRecord) < 0) {
//             idToDelete.push(record.id)
//           }
//         })
//       }
//       deleteOnMongo(idToDelete);
//     })
//   })
//   //console.log(resultIdQueryAll);
// }

function deleteOnMongo(_ids) {
  return MongoClient.connect(settings.URI,(err, client) => {
    let db = client.db(settings.dbName);
    assert.notEqual(typeof db, 'undefiend')
    let collection = db.collection(settings.uploadFileCollectionName) 
    //console.log(collection);    
    assert.notEqual(typeof collection, 'undefined');

    _ids.map(_id => collection.deleteOne({
      'id': _id 
    }))

    client.close();
  })
}
//query_all_collection('design')

function mainAction(listRecords,collection) {
  let keys = Object.keys(listRecords);
  for (let i in keys) {
    let propertyName = keys[i];
    switch (propertyName) {
      case 'noRelated':
        let noRelated = listRecords[propertyName];
        noRelated = noRelated.map(record => record.id);
        //console.log(noRelated);
        deleteOnMongo(noRelated);
        break;
      default:
        //let _ids = listRecords[propertyName];
        //query_all_collection()
        //deleteOnMongo
    }
  }
}

function filterIdToDelete(_idsUsing, _allId) {
  return _allId.filter(_id => _idsUsing.indexOf(_id) < 0)
}
//listRecords()
//ref = 5b82e07a93e1f450d139e980