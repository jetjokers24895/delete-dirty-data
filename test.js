settings = require('./valueSettings');
del = require('del');
path = '/home/jetjoker/JETDIRECTORY/myproject/furniture-maker/v2-furniture-maker/public/uploads/resize/joO9u1l'
rs = del.sync(`${path}`,{force:true})
