module.exports = {
    updateChartsData: function (filename, get_data_arg) {

        let DB = require('../models/db.model');
        let PG = require('pg');
        let copy = require('pg-copy-streams').to;
        let fs = require('fs').createWriteStream(__dirname + '/../../charts/' + filename + '.csv');

        const config = {
            user: DB.PG_USER, // name of the user account
            database: DB.PG_DATABASE, // name of the database
            password: DB.PG_PASSWORD, // password for user account
            max: 10, // max number of clients in the pool
            idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
        };

        let pool = new PG.Pool(config);
        let myClient;
        pool.connect(function (err, client, done) {
            if (err) { console.log(err); }

            myClient = client;
            let query = 'COPY (SELECT * from get_data(\''+ get_data_arg +'\')) to STDOUT with csv';
            let stream = myClient.query(copy(query), function (err, result) {
                 if (err) { console.log(err); }
                 console.log('file was updated');
             });
            let data = '';
            stream.on('data', function(chunk){
                data += chunk;
            });
            stream.on('end', function(response){
                fs.write(data);
                fs.close();
                done();
            });
            stream.on('error', function(err) {
                done();
            });
        });
    }
};