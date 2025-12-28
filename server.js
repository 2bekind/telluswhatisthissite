const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Путь к файлу с данными пользователей
const dataFile = path.join(__dirname, 'users_data.json');

// Функция для чтения данных
function readData() {
    try {
        if (fs.existsSync(dataFile)) {
            return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        }
    } catch (err) {
        console.error('Error reading data:', err);
    }
    return {};
}

// Функция для сохранения данных
function saveData(data) {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error saving data:', err);
    }
}

// GET - получить данные пользователя
app.get('/api/user/:userId', (req, res) => {
    const userId = req.params.userId;
    const users = readData();
    
    if (users[userId]) {
        res.json({ success: true, data: users[userId] });
    } else {
        res.json({ success: false, message: 'User not found' });
    }
});

// POST - сохранить данные пользователя
app.post('/api/user/:userId', (req, res) => {
    const userId = req.params.userId;
    const userData = req.body;
    const users = readData();
    
    users[userId] = {
        ...users[userId],
        ...userData,
        lastUpdated: new Date().toISOString()
    };
    
    saveData(users);
    res.json({ success: true, data: users[userId] });
});

// PUT - обновить данные пользователя (мерж с существующими)
app.put('/api/user/:userId', (req, res) => {
    const userId = req.params.userId;
    const userData = req.body;
    const users = readData();
    
    if (!users[userId]) {
        users[userId] = {};
    }
    
    users[userId] = {
        ...users[userId],
        ...userData,
        lastUpdated: new Date().toISOString()
    };
    
    saveData(users);
    res.json({ success: true, data: users[userId] });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Статические файлы
app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
