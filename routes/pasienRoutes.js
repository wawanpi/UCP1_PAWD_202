const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Connecting to the database

// Endpoint untuk mendapatkan semua pasien
router.get('/', (req, res) => {
    db.query('SELECT * FROM pasien', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });
});

// Endpoint untuk mendapatkan pasien berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM pasien WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Pasien tidak ditemukan');
        res.json(results[0]);
    });
});

// Endpoint untuk menambahkan pasien baru
router.post('/', (req, res) => {
    const { nama, no_hp, alamat } = req.body;

    // Validasi input
    if (!nama || !no_hp || !alamat) {
        return res.status(400).send('Semua kolom harus diisi');
    }

    db.query('INSERT INTO pasien (nama, no_hp, alamat) VALUES (?, ?, ?)', 
    [nama, no_hp, alamat], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        const newPasien = { id: results.insertId, nama, no_hp, alamat };
        res.status(201).json(newPasien);
    });
});

// Endpoint untuk memperbarui data pasien
router.put('/:id', (req, res) => {
    const { nama, no_hp, alamat } = req.body;

    // Validasi input
    if (!nama || !no_hp || !alamat) {
        return res.status(400).send('Semua kolom harus diisi');
    }

    db.query('UPDATE pasien SET nama = ?, no_hp = ?, alamat = ? WHERE id = ?', 
    [nama, no_hp, alamat, req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Pasien tidak ditemukan');
        res.json({ id: req.params.id, nama, no_hp, alamat });
    });
});

// Endpoint untuk menghapus pasien
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM pasien WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Pasien tidak ditemukan');
        res.status(204).send();
    });
});



module.exports = router;
