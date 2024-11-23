const db = require('../database/db');  // Import koneksi database

// Fungsi untuk mendapatkan daftar pasien
const getAllPatients = (callback) => {
    db.query('SELECT * FROM pasien', (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};

// Fungsi untuk menambahkan pasien baru
const addPatient = (patientData, callback) => {
    const { nama, spesialis, no_hp, alamat } = patientData;
    db.query('INSERT INTO pasien (nama, spesialis, no_hp, alamat) VALUES (?, ?, ?, ?)', 
        [nama, spesialis, no_hp, alamat], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result.insertId); // Mengembalikan id pasien yang baru ditambahkan
    });
};

// Fungsi untuk memperbarui data pasien
const updatePatient = (id, patientData, callback) => {
    const { nama, spesialis, no_hp, alamat } = patientData;
    db.query('UPDATE pasien SET nama = ?, spesialis = ?, no_hp = ?, alamat = ? WHERE id = ?', 
        [nama, spesialis, no_hp, alamat, id], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result.affectedRows); // Menunjukkan berapa banyak baris yang diubah
    });
};

// Fungsi untuk menghapus pasien
const deletePatient = (id, callback) => {
    db.query('DELETE FROM pasien WHERE id = ?', [id], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result.affectedRows); // Menunjukkan berapa banyak baris yang dihapus
    });
};

module.exports = { getAllPatients, addPatient, updatePatient, deletePatient };
