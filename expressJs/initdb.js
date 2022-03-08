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
    email TEXT NOT NULL UNIQUE,
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
    public INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES user (user_id)
);
`;

let sampleDataTech=`
    INSERT INTO tech (name, category, ring, description, save_date, user_id, public)
    VALUES ('AWS', ${CATEGORY.Platforms},${RING.Adopt},'Amazon cloud serice', '${new Date().toISOString()}', 1,0);
    INSERT INTO tech (name, category, ring, description, save_date, user_id, public)
    VALUES ('C#', ${CATEGORY.Languages},${RING.Assess},'Developed by Microsoft for .NET Framework','${new Date().toISOString()}', 1,0);
    INSERT INTO tech (name, category, ring, description, save_date, user_id, public)
    VALUES ('Scrum', ${CATEGORY.Techniques},${RING.Hold},'Agile Methodology approach', '${new Date().toISOString()}', 1,0);
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


// creating history table and filling it with sample data
let createHistoryTable=`
CREATE TABLE history (
    history_id INTEGER PRIMARY KEY,
    text TEXT NOT NULL,
    user_id INTEGER NOT NULL,    
    tech_id INTEGER NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES user (user_id),    
    FOREIGN KEY (user_id)
        REFERENCES user (user_id)
);
`;


db.exec(createHistoryTable, (err) => {
    if(err){
        console.warn("Error while creating tech table", err)
    }
})