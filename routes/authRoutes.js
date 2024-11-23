const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database/db'); // pastikan db.js sesuai dengan konfigurasi database Anda
const router = express.Router();

// Route Signup
router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // Mengecek apakah username sudah terdaftar
    db.query('SELECT * FROM admin WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err); // Log error query
            return res.status(500).send('Error checking user');
        }
        if (results.length > 0) {
            return res.status(400).send('Username already exists');
        }

        // Hash password dan simpan ke database
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).send('Error hashing password');

            db.query('INSERT INTO admin (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
                if (err) return res.status(500).send('Error registering user');
                res.redirect('/login');
            });
        });
    });
});

// Route untuk menampilkan form signup
router.get('/signup', (req, res) => {
    res.render('signup', {
        layout: 'layouts/main-layout'
    });
});

// Route Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM admin WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);  // Log error query
            return res.status(500).send('Error checking user');
        }
        if (results.length === 0) return res.status(400).send('User not found');

        // Membandingkan password
        bcrypt.compare(password, results[0].password, (err, isMatch) => {
            if (err) return res.status(500).send('Error checking password');
            if (!isMatch) return res.status(401).send('Incorrect password');

            // Simpan userId dalam sesi setelah login berhasil
            req.session.userId = results[0].id;
            res.redirect('/'); // Arahkan ke halaman utama setelah login
        });
    });
});

// Route untuk menampilkan form login
router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'layouts/main-layout'
    });
});

// Route Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error logging out');
        res.redirect('/login'); // Arahkan ke halaman login setelah logout
    });
});
// Model atau Database (misalnya menggunakan MySQL)
let entities = []; // Array sementara, ganti dengan database Anda

// Endpoint untuk menambah pasien atau dokter
router.post('/entities', (req, res) => {
    const { name, type, specialty } = req.body;
    const newEntity = {
        id: entities.length + 1,  // ID sementara, ganti dengan ID otomatis dari DB
        name,
        type,
        specialty
    };
    entities.push(newEntity);
    res.status(201).json(newEntity);  // Kembalikan entitas yang baru ditambahkan
});

// Endpoint untuk mendapatkan semua entitas (Pasien & Dokter)
router.get('/entities', (req, res) => {
    res.status(200).json(entities);  // Kembalikan daftar entitas
});

// Endpoint untuk menghapus entitas berdasarkan ID
router.delete('/entities/:id', (req, res) => {
    const entityId = parseInt(req.params.id);
    entities = entities.filter(entity => entity.id !== entityId);
    res.status(200).send('Entity deleted');
});

// Endpoint untuk mengedit entitas
router.put('/entities/:id', (req, res) => {
    const entityId = parseInt(req.params.id);
    const { name, specialty } = req.body;
    let entity = entities.find(entity => entity.id === entityId);

    if (entity) {
        entity.name = name;
        entity.specialty = specialty;
        res.status(200).json(entity);
    } else {
        res.status(404).send('Entity not found');
    }
});

module.exports = router;
