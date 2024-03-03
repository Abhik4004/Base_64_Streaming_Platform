import pg from "pg";
import fs from "fs";
import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Forum',
    password: 'Rij_Abhi@2004',
    port: 5432
});
db.connect();

async function storeBase64File(fileName) {
    try {
        const base64data = fs.readFileSync(fileName, 'utf8');
        const binaryData = Buffer.from(base64data, 'base64');
        await db.query('INSERT INTO files (name, content) VALUES ($1, $2)', [fileName, binaryData]);
        console.log('Base64 file stored successfully');
    } catch (error) {
        console.error('Error storing base64 file:', error);
    }
}

// storeBase64File('./recorded_video (6).txt');


async function retrieveAndStoreFile(fileName) {
    try {
        const result = await db.query('SELECT content FROM files WHERE id = $1', [fileName]);
        if (result.rows.length > 0) {
            const binaryData = result.rows[0].content;
            fs.writeFileSync(fileName, binaryData);
            console.log('\nFile retrieved and stored successfully');
        } else {
            console.log('File not found');
        }
    } catch (error) {
        console.error('Error retrieving file:', error);
    }
}

// retrieveAndStoreFile('');

app.get("/", (req, res) => {
    res.redirect("/index.ejs");
});

app.get("/index.ejs", (req, res) => {
    res.render("index.ejs");
})

app.get("/stream.ejs", (req, res) => {
    res.render("stream.ejs");
});

app.listen(3000, () => {
    console.log("Running...");
});



