'use strict';

/**
 * define value for environment
 * 
 */
var env = {
  debug: true,
  serverPath : '/home/jenkins/furnituremaker-backend/',
  devPath: '/home/jetjoker/JETDIRECTORY/myproject/furniture-maker/v2-furniture-maker',
  workSpace: () => {
    return env.debug? env.devPath : env.serverPath
  },
  pathToPublic: () => `${env.workSpace()}/public/uploads`,
  pathToResize: () => `${env.pathToPublic()}/resize`,
}

module.exports = {
  URI : 'mongodb://localhost:27017/strapi',
  dbName: 'strapi',
  pathToPublic : env.pathToPublic(),
  pathToResize : env.pathToResize(),
  uploadFileCollectionName: 'upload_file',
}

