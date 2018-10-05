'use strict';

/**
 * define value for environment
 * 
 */
var env = {
  debug: false,
  serverPath : '/home/jenkins/furnituremaker-backend/',
  devPath: '/home/jetjoker/JETDIRECTORY/myproject/furniture-maker/v2-furniture-maker',
  workSpace: () => {
    return env.debug? env.devPath : env.serverPath
  },
  pathToPublic: () => `${env.workSpace()}/public/uploads`,
  pathToResize: () => `${env.pathToPublic()}/resize`,
  devURI: 'mongodb://localhost:27017/strapi',
  serverURI: 'mongodb://devTeam:1@localhost:27017/furniture-maker-db',
  devDB: 'strapi',
  serverDB: 'furniture-maker-db',
  URI : () => env.debug ? env.devURI : env.serverURI,
  dbName: ()=> env.debug ? env.devDB : env.serverDB
}

module.exports = {
  URI : env.URI(),
  dbName: env.dbName(),
  pathToPublic : env.pathToPublic(),
  pathToResize : env.pathToResize(),
  uploadFileCollectionName: 'upload_file',
}

