const sqlite3 = require('sqlite3').verbose();
const [ROLE, RING, CATEGORY] = require('./constants');

console.log('Started init of sqllite database')
// open a database connection
let db = new sqlite3.Database('./techradar.db');


// creating users table and filling it with sample data
let createUserTable=`
CREATE TABLE user (
    user_id INTEGER PRIMARY KEY,
    display TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    role INTEGER NOT NULL
);
`;

let sampleDataUser=`
    INSERT INTO user (user_id, display, email, role, password)
    VALUES (1,'John Doe', 'john@doe.com',${ROLE.Admin}, '123');
`

db.exec(createUserTable, (err) => {
    if(err){
        console.warn("Error while creating user table", err)
    }else{
        db.exec(sampleDataUser, (err) =>{
            if(err){
                console.warn("Error while inserting sample user", err)
            }
        })
    }
})



// creating tech table and filling it with sample data
let createTechTable=`
CREATE TABLE tech (
    tech_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category NUMBER NOT NULL,
    ring NUMBER,
    description TEXT NOT NULL,
    description_decision TEXT,
    save_date DATE NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES user (user_id)
);
`;

let sampleDataTech=`
    INSERT INTO tech (name, category, ring, description, save_date, user_id)
    VALUES ('AWS', ${CATEGORY.Platforms},${RING.Adopt},'Amazon cloud serice', '${new Date().toISOString()}', 1);
    INSERT INTO tech (name, category, ring, description, save_date, user_id)
    VALUES ('C#', ${CATEGORY.Languages},${RING.Assess},'Developed by Microsoft for .NET Framework','${new Date().toISOString()}', 1);
    INSERT INTO tech (name, category, ring, description, save_date, user_id)
    VALUES ('Scrum', ${CATEGORY.Techniques},${RING.Hold},'Agile Methodology approach', '${new Date().toISOString()}', 1);
`

db.exec(createTechTable, (err) => {
    if(err){
        console.warn("Error while creating tech table", err)
    }else{
    db.exec(sampleDataTech, (err) =>{
        if(err){
            console.warn("Error while inserting sample tech", err)
        }
    })
}
})
