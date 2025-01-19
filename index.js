import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const app = express();
const port = 3000;

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "book_notes",
  password: "japanfuture",
  port: 5432
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    try {
        const sortOption = req.query.sort;
        let sortQuery = "";

        switch (sortOption) {
            case "title":
                sortQuery = "ORDER BY b.book_name ASC";
                break;
            case "newest":
                sortQuery = "ORDER BY b.date_read DESC";
                break;
            case "best":
                sortQuery = "ORDER BY b.rating DESC"
                break;
            default:
                sortQuery = "ORDER BY b.book_name ASC";
                break;
        }

        const result = await pool.query(
            `SELECT b.id, b.book_name, b.author_name, b.date_read::TEXT, b.rating, b.opinion, b.amazon_link, i.key, i.value
            FROM books b
            JOIN identifiers i
            ON b.id = i.book_id
            ${sortQuery}`
        );
        
        res.render("index.ejs", { books: result.rows });
    } catch (err) {
        console.log("Error fetching data:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/add", async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        
        const result = await client.query(`
            INSERT INTO books (book_name, author_name, date_read, rating, opinion, amazon_link)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id`,
            [req.body.book_name, req.body.author_name, req.body.date_read, req.body.rating, req.body.opinion, req.body.amazon_link]
        );

        const newBookID = result.rows[0].id;

        await client.query(`
            INSERT INTO identifiers (book_id, key, value, size)
            VALUES ($1, $2, $3, $4)`,
            [newBookID, req.body.key, req.body.value, "L"]
        );

        const paragraphs = req.body.paragraphs.filter(paragraph => paragraph.trim() !== "");
        for (let paragraph of paragraphs) {
            await client.query(`
                INSERT INTO notes (book_id, paragraph)
                VALUES ($1, $2)`,
                [newBookID, paragraph]
            );
        }

        await client.query("COMMIT");
        res.redirect("/");
    } catch (err) {
        await client.query("ROLLBACK");
        console.log("Error adding data:", err);
        res.status(500).send("Internal Server Error");
    } finally {
        client.release();
    }
});

app.get("/book/:id", async (req, res) => {
    try {
        const bookID = req.params.id;

        const book = await pool.query(
            `SELECT b.book_name, b.author_name, i.key, i.value, i.size
            FROM books b
            JOIN identifiers i ON b.id = i.book_id
            WHERE b.id = $1`, [bookID]
        );

        const notes = await pool.query(
            `SELECT * FROM notes WHERE book_id = $1 ORDER BY id`, [bookID]
        );

        const data = book.rows[0];
        const pic = `https://covers.openlibrary.org/b/${data.key}/${data.value}-${data.size}.jpg`;

        res.render("book_notes.ejs", {
            book: book.rows[0],
            notes: notes.rows,
            picture: pic,
            id: bookID
        });
    } catch (err) {
        console.log("Error fetching data:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/book/:id/edit", async (req, res) => {
    try {
        const bookID = req.params.id;

        const book = await pool.query(
            `SELECT b.id, b.book_name, b.author_name, b.date_read::TEXT, b.rating, b.opinion, b.amazon_link, i.key, i.value
            FROM books b
            JOIN identifiers i
            ON b.id = i.book_id
            WHERE b.id = $1`, [bookID]
        );

        const notes = await pool.query(
            `SELECT * FROM notes WHERE book_id = $1`, [bookID]
        );

        res.render("edit.ejs", {
            book: book.rows[0],
            notes: notes.rows,
        });
    } catch (err) {
        console.log("Error fetching data:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/book/:id/edit", async (req, res) => {
    const client = await pool.connect();
    try {
        const bookID = req.params.id;
        const paragraphs = req.body.paragraphs;
        const ids = req.body.ids;

        await client.query("BEGIN");

        await client.query(
            `UPDATE books
            SET book_name = $1, author_name = $2, date_read = $3, rating = $4, opinion = $5, amazon_link = $6
            WHERE id = $7`,
            [req.body.book_name, req.body.author_name, req.body.date_read, req.body.rating, req.body.opinion, req.body.amazon_link, bookID]
        );

        await client.query(
            `UPDATE identifiers
            SET key = $1, value = $2
            WHERE book_id = $3`,
            [req.body.key, req.body.value, bookID]
        );

        for (let i = 0; i < paragraphs.length; i++) {
            const paragraph = paragraphs[i];
            const id = ids[i];

            await client.query(
                `UPDATE notes
                SET paragraph = $1
                WHERE id = $2`,
                [paragraph, id]
            );
        }

        await client.query("COMMIT");
        res.redirect("/");
    } catch (err) {
        await client.query("ROLLBACK");
        console.log("Error updating data:", err);
        res.status(500).send("Internal Server Error");
    } finally {
        client.release();
    }
});

app.post("/book/:id/delete", async (req, res) => {
    const client = await pool.connect();
    try {
        const bookID = req.params.id;

        await client.query("BEGIN");

        await client.query(`DELETE FROM notes WHERE book_id = $1`, [bookID]);

        await client.query(`DELETE FROM identifiers WHERE book_id = $1`, [bookID]);

        await client.query(`DELETE FROM books WHERE id = $1`, [bookID]);

        await client.query("COMMIT");
        res.redirect("/");
    } catch (err) {
        await client.query("ROLLBACK");
        console.log("Error deleting data:", err);
        res.status(500).send("Internal Server Error");
    } finally {
        client.release();
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });