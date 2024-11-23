require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

// Import routes for patients and doctors
const patientRoutes = require('./routes/pasienRoutes');
const doctorRoutes = require('./routes/dokterRoutes');

const db = require('./database/db');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const { isAuthenticated } = require('./middlewares/middleware.js');

app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.json());

// Setup session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Use authentication routes
app.use('/', authRoutes);

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Main and contact routes
app.get('/', isAuthenticated, (req, res) => {
    res.render('index', {
        layout: 'layouts/main-layout',
    });
});

app.get('/contact', isAuthenticated, (req, res) => {
    res.render('contact', {
        layout: 'layouts/main-layout',
    });
});

// Use routes for patients and doctors
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);

// Get all entities (patients and doctors)
app.get('/todo-view', (req, res) => {
    // Sample entities list, replace with database call if needed
    const entities = [
        { id: 1, name: 'John Doe', type: 'patient' },
        { id: 2, name: 'Dr. Smith', type: 'doctor', specialty: 'Cardiology' },
        // Other entities...
    ];
    res.render('todo', { entities: entities, layout: 'layouts/main-layout' });
});

// Add new entity (patient/doctor)
app.post('/add-entity', (req, res) => {
    const { entityType, name, specialty } = req.body;
    const newEntity = { id: Date.now(), name, type: entityType, specialty };
    // Save the entity to database or temporary array
    // entities.push(newEntity);  // Example: replace with database insert
    res.redirect('/todo-view');
});

// Edit an existing entity
app.post('/edit-entity', (req, res) => {
    const { id, name, specialty } = req.body;
    // Assuming entities is fetched from DB
    const entity = entities.find(e => e.id === parseInt(id));
    if (entity) {
        entity.name = name;
        entity.specialty = specialty;
        // Update in database or array
        res.redirect('/todo-view');
    } else {
        res.status(404).send('Entity not found');
    }
});

// Delete an entity
app.post('/delete-entity', (req, res) => {
    const { id } = req.body;
    // entities = entities.filter(e => e.id !== parseInt(id));  // Remove from array or database
    res.redirect('/todo-view');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
