import sqlite from 'sqlite3'

const db = new sqlite.Database('./data/database.sqlite')

export function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

export function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

export function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

export async function initializeDatabase() {
    await dbRun("DROP TABLE IF EXISTS customers");
    await dbRun(`
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT
        )
    `);

    const customers = [
        { "name": "Pisti", "email": "pisti@email.com" },
        { "name": "Zsolti", "email": "zsolti@email.com" },
        { "name": "Sanyi", "email": "sanyi@email.com" },
        { "name": "Feri", "email": "feri@email.com"}

      ];
      

    for (const customer of customers) {
        await dbRun(
            "INSERT INTO customers (name, email) VALUES (?, ?);",
            [customer.name, customer.email]
        );
    }
}