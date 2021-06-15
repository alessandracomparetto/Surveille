'use strict'
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const db = new sqlite3.Database("surveys.db", (err) => {
    if (err) throw err;
});

const db_getSurveys = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT name, title, count(*) as num, S.id FROM admin A, survey S, question Q \
                    WHERE A.id = S.id_admin and S.id = Q.id_survey \
                    GROUP BY S.id"
        db.all(sql, [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows.map(x => {
                return {
                    id: x.id,
                    author: x.name,
                    title: x.title,
                    num: x.num
                }
            }))
        })
    })
}

const db_getSurvey = async (surveyid) => {
    try {
        let survey, result;
        let sql = "SELECT title FROM survey WHERE id = ?"
        result = await new Promise((resolve, reject) => {
            db.get(sql, [surveyid], (err, row) => {
                if (err) return reject(err);
                else if (row === undefined) return resolve({ error: 'Not found.' });

                resolve(row)
            })
        })

        survey =  result ;

        sql = "SELECT Q.id as id, text, open, min, max \
                        FROM survey S, question Q \
                        WHERE S.id = Q.id_survey AND S.id = ? \
                        ORDER BY Q.id"

        result = await new Promise((resolve, reject) => {
            db.all(sql, [surveyid], (err, rows) => {
                if (err) return reject(err);
                else if (rows === undefined) resolve({ error: 'Not found.' });
                resolve(rows)
            })
        })

        sql = "SELECT text FROM  option O\
                    WHERE  O.id_question= ?"
        for (let i = 0; i < result.length; i++) {
            if (!result[i].open) {
                let opzioni = await new Promise((resolve, reject) =>{
                    db.all(sql, [result[i].id], (err, rows) => {
                        if (err) return reject(err);
                        else if (rows === undefined) resolve({ error: 'Not found.' });
                        resolve(rows)
                    })
                })
                result[i]={...result[i], "options": opzioni}
            }
        }
        survey = { ...survey, "questions": result }

        return survey;
    } catch (err) {
        return err.message;
    }
}

exports.db_getSurveys = db_getSurveys;
exports.db_getSurvey = db_getSurvey;
