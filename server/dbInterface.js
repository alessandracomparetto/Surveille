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
        let stop = false;
        let sql = "SELECT title FROM survey WHERE id = ?"
        result = await new Promise((resolve, reject) => {
            db.get(sql, [surveyid], (err, row) => {
                if (err) return reject({ "error": err });
                if (row === undefined) {
                    stop = true;
                    return resolve({ error: 'Survey not found.' });
                }
                resolve(row)
            })
        })
        if (stop) return result;
        survey = result;

        sql = "SELECT Q.id as id, text, open, min, max \
                        FROM survey S, question Q \
                        WHERE S.id = Q.id_survey AND S.id = ? \
                        ORDER BY Q.id"
        result = await new Promise((resolve, reject) => {
            db.all(sql, [surveyid], (err, rows) => {
                if (err) return reject({ "error": err });
                if (rows.length == 0) {
                    stop = true;
                    return resolve({ error: 'Survey has no questions.' });
                }
                resolve(rows)
            })
        })
        if (stop) return result;

        sql = "SELECT id, text FROM  option O\
                    WHERE  O.id_question= ?"
        for (let i = 0; i < result.length; i++) {
            if (!result[i].open) {
                let opzioni = await new Promise((resolve, reject) => {
                    db.all(sql, [result[i].id], (err, rows) => {
                        if (err) return reject({ "error": err });
                        if (rows.length == 0) {
                            stop = true;
                            return resolve({ error: 'Error in loading options.' });
                        }
                        resolve(rows)
                    })
                })
                if (stop) return opzioni;
                result[i] = { ...result[i], "options": opzioni }
            }
        }
        survey = { ...survey, "questions": result }

        return survey;
    } catch (err) {
        return err.message;
    }
}

const db_getAdminSurveys = (adminid) => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT s.id, s.title, count(distinct ss.id) as num FROM survey S LEFT JOIN submission SS \
                    ON s.id = ss.id_survey where s.id_admin = ? \
                    GROUP by s.id '
        db.all(sql, [adminid], (err, rows) => {
            if (err) return reject(err);
            resolve(rows.map(x => {
                return {
                    id: x.id,
                    title: x.title,
                    num: x.num
                }
            }))
        })
    })
}

const db_addSubmission = async (submission) => {
    let sql = 'INSERT INTO submission(id_survey, user) VALUES (?, ?)'
    let lastID = await new Promise((resolve, reject) => {
        db.run(sql, [submission.survey, submission.user], function (err) {
            if (err) return reject(err);
            resolve(this.lastID);
        })
    })

    sql = 'INSERT INTO answer(id_survey, id_question, id_submission, value) VALUES (?, ?, ?, ?)'

    for (const answer of submission.answers) {
        await new Promise((resolve, reject) => {
            db.run(sql, [submission.survey, answer.id_question, lastID, answer.value], function (err) {
                if (err) return reject(err);
                resolve(this.lastID);
            })
        })
    }
    return lastID;
}

const db_getAnswers = (surveyid) => {
    return new Promise((resolve, reject) => {
        let result = [];
        let sql = 'SELECT id_question, id_submission, value, user FROM answer, submission \
         WHERE submission.id = answer.id_submission and answer.id_survey = ? '
        db.all(sql, [surveyid], (err, rows) => {
            if (err) return reject(err);
            if (rows === undefined) return resolve({ error: 'Survey not found.' });
            rows.map(x => {
                let index = result.findIndex((item) => item && item.id_submission == x.id_submission);
                if (index === -1) {
                    result.push({
                        "id_submission": x.id_submission,
                        "user": x.user,
                        values: [
                            { "id_question": x.id_question, "value": x.value }
                        ]
                    })

                }
                else {
                    result[index].values.push({ "id_question": x.id_question, "value": x.value })
                }
            })
            resolve(result);
        })
    })
}

const db_addSurvey = async (survey, adminid) => {
    let sql = 'INSERT INTO survey(title, id_admin) VALUES (?, ?)'
    let lastID = await new Promise((resolve, reject) => {
        db.run(sql, [survey.title, adminid], function (err) {
            if (err) return reject(err);
            resolve(this.lastID);
        })
    })

    for (const question of survey.questions) {
        sql = 'INSERT INTO question (id_survey, text, open, min, max) VALUES (?, ?, ?, ?, ?)'
        let questionId = await new Promise((resolve, reject) => {
            db.run(sql, [lastID, question.question, question.open, question.min, question.max], function (err) {
                if (err) return reject(err);
                resolve(this.lastID);
            })
        })
        if (!question.open) {
            sql = 'INSERT INTO option (id_question, text) VALUES (?,?)'
            for (const option of question.options) {
                await new Promise((resolve, reject) => {
                    db.run(sql, [questionId, option], function (err) {
                        if (err) return reject(err);
                        resolve(this.lastID);
                    })
                })
            }
        }
    }
    return lastID;
}

//AUTH
const db_getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM admin WHERE mail = ?"
        db.get(sql, [email], (err, row) => {
            if (err) reject(err);
            else if (row === undefined)
                resolve(false);
            else {
                const user = { id: row.id, email: row.mail, name: row.name };
                bcrypt.compare(password, row.hash).then(result => {
                    if (result) resolve(user);
                    else resolve(false);
                })
            }
        })
    })

}

const db_getuserById = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM admin WHERE id=?';
        db.get(sql, [id], function (err, row) {
            if (err) return reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found.' });
            else {
                resolve(
                    {
                        id: row.id,
                        email: row.email,
                        name: row.name
                    })
            }
        })
    })
}

//validation
const isValidSurvey = (val) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM survey WHERE id = ?"
        db.get(sql, [val], (err, row) => {
            if (err) return reject({ "error": err });
            else if (row === undefined) return reject('Survey not found.')
            resolve(row)
        })
    })
}

const areValidAnswers = async (answer) => {
    let sql = 'SELECT * FROM question WHERE id = ?'
    let question, options;
    question = await new Promise((resolve, reject) => {
        db.get(sql, [answer.id_question], (err, row) => {
            if (err) return reject({ "error": err });
            if (row === undefined) return reject('Question not found.');
            resolve(row)
        })
    })
    if (!question.open) {
        sql = 'SELECT text FROM option WHERE id_question = ?'
        options = await new Promise((resolve, reject) => {
            db.all(sql, [answer.id_question], (err, rows) => {
                if (err) return reject({ "error": err });
                resolve(rows.map(x => x.text));
            })
        })
        question.options = options;
        if (!question.options.includes(answer.value)) throw new Error('Invalid option')
    }
    else {
        if (!(answer.value.length <= 200)) throw new Error('Answer is too long')
    }
    return true;
}

const areValidMinMax = async (answers, id) => {
    let sql = 'SELECT * FROM question WHERE id_survey = ?'
    let questions = await new Promise((resolve, reject) => {
        db.all(sql, [id], (err, rows) => {
            if (err) return reject({ "error": err });
            resolve(rows);
        })
    })
    for (const question of questions) {
        if (question.open && question.min === 1) {
            if (answers.filter(e => e.id_question === question.id).length === 0) {
                throw new Error(`Compulsory answer not found, question: ${question.id}`)
            }
        }
        else if (!question.open) {
            let options = answers.filter(e => e.id_question === question.id)
            if (!(options.length >= question.min && options.length <= question.max)) {
                throw new Error(`Range of multiple answers not respected, question: ${question.id} `)
            }
        }
    }
    return true;
}

const isValidQuestion = async (question) => {
    if (!question.question) throw new Error('Invalid question')
    if (question.min > question.max) throw new Error('Invalid min number')
    if (question.min < 0 || question.max < 0) throw new Error('Invalid range')
    if (question.open && (question.min > 1 || question.max > 1)) throw new Error('Invalid range for open question')
    if (!question.open) {
        if (question.min > 10 || question.max > 10) throw new Error('Invalid range for multiple choice question')
        if (question.max > question.options.length) throw new Error('Invalid max and number of options')
        for (const option of question.options) {
            if (option.split(" ").join("").length === 0) throw new Error('Invalid option')
        }
    }
    return true;
}

const isValidUser = (surveyid, userid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM survey WHERE id = ? AND id_admin = ?'
        db.get(sql, [surveyid, userid], (err, row) => {
            if (err) return reject({ "error": err });
            if (row === undefined) return reject('No such survey for this users');
            resolve(row)
        })
    })

}

exports.db_getSurveys = db_getSurveys
exports.db_getSurvey = db_getSurvey
exports.db_getAdminSurveys = db_getAdminSurveys
exports.db_getAnswers = db_getAnswers
exports.db_addSubmission = db_addSubmission
exports.db_addSurvey = db_addSurvey

//auth
exports.db_getUser = db_getUser
exports.db_getuserById = db_getuserById
//custom checks
exports.isValidSurvey = isValidSurvey
exports.areValidAnswers = areValidAnswers
exports.areValidMinMax = areValidMinMax
exports.isValidQuestion = isValidQuestion
exports.isValidUser = isValidUser