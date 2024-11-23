const db = require('../database/db');  // Import koneksi database

// Fungsi untuk mendapatkan daftar dokter
const getAllDoctors = (callback) => {
    db.query('SELECT * FROM dokter', (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};

// Fungsi untuk menambahkan dokter baru
const addDoctor = (doctorData, callback) => {
    const { nama, spesialis, no_hp, alamat } = doctorData;
    db.query('INSERT INTO dokter (nama, spesialis, no_hp, alamat) VALUES (?, ?, ?, ?)', 
        [nama, spesialis, no_hp, alamat], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result.insertId); // Mengembalikan id dokter yang baru ditambahkan
    });
};

// Fungsi untuk memperbarui data dokter
const updateDoctor = (id, doctorData, callback) => {
    const { nama, spesialis, no_hp, alamat } = doctorData;
    db.query('UPDATE dokter SET nama = ?, spesialis = ?, no_hp = ?, alamat = ? WHERE id = ?', 
        [nama, spesialis, no_hp, alamat, id], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result.affectedRows); // Menunjukkan berapa banyak baris yang diubah
    });
};

// Fungsi untuk menghapus dokter
const deleteDoctor = (id, callback) => {
    db.query('DELETE FROM dokter WHERE id = ?', [id], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result.affectedRows); // Menunjukkan berapa banyak baris yang dihapus
    });
};

module.exports = { getAllDoctors, addDoctor, updateDoctor, deleteDoctor };
