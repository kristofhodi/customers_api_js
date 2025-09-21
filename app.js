import express from 'express'
import { initializeDatabase, dbAll, dbGet, dbRun } from './util/database.js'

const app = express()
app.use(express.json())
app.use(express.static('public'));

app.get('/customers', async (req, res) => {
    const customers = await dbAll("SELECT * FROM customers");
    res.status(200).json(customers);
});

app.get('/customers/:id', async (req, res) => {
    const id = req.params.id;
    const customer = await dbGet("SELECT * FROM customers WHERE id = ?;", [id]);
    if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
});

app.post('/customers', async (req, res) => {
    const { name, email} = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: "Missing data" });
    }
    const result = await dbRun(
        "INSERT INTO customers (name, email) VALUES (?, ?);",
        [name, email]
    );
    res.status(201).json({ id: result.lastID, name, email});
});

app.put('/customers/:id', async (req, res) => {
    const id = req.params.id;
    const customer = await dbGet("SELECT * FROM customers WHERE id = ?;", [id]);
    if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
    }

    const { name, email} = req.body;
    if (!name || !email ) {
        return res.status(400).json({ message: "Missing data" });
    }

    await dbRun(
        "UPDATE customers SET name = ?, email = ? WHERE id = ?;",
        [name, email, id]
    );

    res.status(200).json({ id: +id, name, email});
});

app.delete('/customers/:id', async (req, res) => {
    const id = req.params.id;
    const customer = await dbGet("SELECT * FROM customers WHERE id = ?;", [id]);
    if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
    }

    await dbRun("DELETE FROM customers WHERE id = ?;", [id]);
    res.status(200).json({ message: "Delete successful" });
});

app.use((err, req, res, next) => {
    res.status(500).json({ message: `Error: ${err.message}` });
});

async function startServer() {
    await initializeDatabase();
    app.listen(3000, () => {
        console.log('Server runs on http://localhost:3000');
    });
}

startServer();