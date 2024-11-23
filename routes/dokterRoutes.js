const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Connecting to the database

// Endpoint untuk mendapatkan semua dokter
router.get('/', (req, res) => {
    db.query('SELECT * FROM dokter', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });
});

// Endpoint untuk mendapatkan dokter berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM dokter WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Dokter tidak ditemukan');
        res.json(results[0]);
    });
});

// Endpoint untuk menambahkan dokter baru
router.post('/', (req, res) => {
    const { nama, spesialis, no_hp, alamat } = req.body;

    // Validasi input
    if (!nama || !spesialis || !no_hp || !alamat) {
        return res.status(400).send('Semua kolom harus diisi');
    }

    db.query('INSERT INTO dokter (nama, spesialis, no_hp, alamat) VALUES (?, ?, ?, ?)', 
    [nama, spesialis, no_hp, alamat], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        const newDokter = { id: results.insertId, nama, spesialis, no_hp, alamat };
        res.status(201).json(newDokter);
    });
});

// Endpoint untuk memperbarui data dokter
router.put('/:id', (req, res) => {
    const { nama, spesialis, no_hp, alamat } = req.body;

    // Validasi input
    if (!nama || !spesialis || !no_hp || !alamat) {
        return res.status(400).send('Semua kolom harus diisi');
    }

    db.query('UPDATE dokter SET nama = ?, spesialis = ?, no_hp = ?, alamat = ? WHERE id = ?', 
    [nama, spesialis, no_hp, alamat, req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Dokter tidak ditemukan');
        res.json({ id: req.params.id, nama, spesialis, no_hp, alamat });
    });
});

// Endpoint untuk menghapus dokter
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM dokter WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Dokter tidak ditemukan');
        res.status(204).send();
    });
});

module.exports = router;
