const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Auth Endpoints
app.post('/auth/register', (req, res) => {
    const { nama, email, password } = req.body;
    const query = 'INSERT INTO users (nama, email, password) VALUES (?, ?, ?)';
    db.query(query, [nama, email, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
            }
            return res.status(500).json({ success: false, message: 'Register gagal' });
        }
        res.status(201).json({ success: true, message: 'Register berhasil' });
    });
});

app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Login gagal' });
        if (results.length > 0) {
            const user = results[0];
            // In a real app, use JWT. Here we just return a success/dummy token
            res.json({ success: true, token: 'dummy_token_' + user.id, message: 'Login berhasil' });
        } else {
            res.status(401).json({ success: false, message: 'Email atau password salah' });
        }
    });
});

// Inventaris Endpoints
app.get('/inventaris', (req, res) => {
    const query = 'SELECT * FROM inventaris ORDER BY id DESC';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json([]);
        // Map database fields to JSON format expected by app if needed
        // App expects: id, nama, harga, jumlah, tanggal_masuk
        // DB has: id, nama, harga, jumlah, tanggal_masuk (snake_case matches)
        res.json(results);
    });
});

app.post('/inventaris', (req, res) => {
    const { nama, harga, jumlah, tanggal_masuk } = req.body;
    const query = 'INSERT INTO inventaris (nama, harga, jumlah, tanggal_masuk) VALUES (?, ?, ?, ?)';
    db.query(query, [nama, harga, jumlah, tanggal_masuk], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Gagal menambah inventaris' });
        res.status(201).json({ success: true, message: 'Inventaris berhasil ditambahkan' });
    });
});

app.put('/inventaris/:id', (req, res) => {
    const { id } = req.params;
    const { nama, harga, jumlah, tanggal_masuk } = req.body;
    const query = 'UPDATE inventaris SET nama = ?, harga = ?, jumlah = ?, tanggal_masuk = ? WHERE id = ?';
    db.query(query, [nama, harga, jumlah, tanggal_masuk, id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Gagal update inventaris' });
        res.json({ success: true, message: 'Inventaris berhasil diperbarui' });
    });
});

app.delete('/inventaris/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM inventaris WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Gagal menghapus inventaris' });
        res.json({ success: true, message: 'Inventaris berhasil dihapus' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
