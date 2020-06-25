const express = require("express");
const app = express();
const bodyParser = require('body-parser');
var cors = require("cors");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

app.use(bodyParser.json());
app.use(cors());


app.get("/read", (req, res) => {
let db = new sqlite3.Database("./posts.db");
  const top = req.query.top
  const skip = req.query.skip
  let sql = `SELECT *, (SELECT COUNT(*) FROM posts) totalRow FROM posts LIMIT ${top} OFFSET ${skip}`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows)
  });
  db.close();
});

app.get("/read/:id", (req, res) => {
  let db = new sqlite3.Database("./posts.db");
    let sql = `SELECT * FROM posts WHERE post_id = ?`;
    const id = req.params.id
    db.get(sql, [id], (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      return row
        ? res.send(row)
        : res.send(400);
  
    });
    db.close();
  });

app.post("/create", (req, res) => {
let db = new sqlite3.Database("./posts.db");

  console.log(req.body)
  const post = req.body
  // insert one row into the langs table
  db.run(`INSERT INTO posts(title, desc, image) VALUES(?, ?, ?)`, 
  [post.title, post.desc, post.image], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  res.send({ status: 'INSERTED SUCCESS' });
  db.close();

});

  app.put('/update/:id', (req, res) => {
    let db = new sqlite3.Database("./posts.db");
    const id = req.params.id
    const { title, desc, image } = req.body
    db.run(
      `UPDATE posts SET title = ?, desc = ?, image = ? WHERE post_id = ?`,
      [title, desc, image, id], function(err) {
        if (err) {
          return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been updated with rowid ${this.lastID}`);
        res.send({ status: 'UPDATED SUCCESS' });
      });
      db.close();
  })

  app.delete('/delete/:id', (req, res) => {
    let db = new sqlite3.Database("./posts.db");
    const id = req.params.id
    db.run(
      `DELETE FROM posts WHERE post_id = ?`,
      [id], function(err) {
        if (err) {
          return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been deleted with rowid ${this.lastID}`);
        res.send({ status: 'DELETED SUCCESS' });
      });
      db.close();
  })

app.listen(8000, () => {
  console.log("Start server at port 8000.");
});
