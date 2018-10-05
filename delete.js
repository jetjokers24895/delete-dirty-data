'use strict';

var fs = require('fs');
var settings = require('./valueSettings');
var path = './';
var del = require('del');

module.exports = {
  deleteOnDisk : function (fileName,folderName) {
      // delete at public/upload
      this.deleteInPublic(fileName);
      // delete at public/upload/resize
      this.deleteInResize(folderName);
    },

    //file name is hash+ext of file
  deleteInPublic: function (fileName) {
      fs.readdir(settings.pathToPublic,function(err, items) {
        if (err) throw new Error('can not read dir')
        if (items.indexOf(fileName) >= 0) {
          let pathToDelete = `${settings.pathToPublic}/${fileName}`
          fs.unlinkSync(pathToDelete)
        }
      })
    },

    //folderName is name of file
    deleteInResize: function (folderName) {
      fs.readdir(settings.pathToResize,function(err, items) {
        if (err) throw new Error('can not read dir')
        if (items.indexOf(folderName) >= 0) {
          let pathToDelete = `${settings.pathToResize}/${folderName}`
          del.sync(pathToDelete,{force:true})
        }
      })
    }
}