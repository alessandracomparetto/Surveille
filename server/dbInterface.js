'use strict'
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const db = new sqlite3.Database("surveys.db", (err) => {
    if (err) throw err;
});

const db_getSurveys = () =>{
    return new Promise((resolve, reject) =>{
        const sql = "SELECT name, title, count(*) as num FROM admin A, survey S, question Q \
                    WHERE A.id = S.id_admin and S.id = Q.id_survey \
                    GROUP BY S.id"
        db.all(sql, [], (err, rows)=>{
            if(err) return reject(err);
            resolve(rows.map(x =>{
                return {
                    name : x.name,
                    title : x.title,
                    num : x.num
                }
            }))
        })
    })
}

exports.db_getSurveys = db_getSurveys;