// Express.js сервер для админ-панели AI-Clinika
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const path = require('path');

// Импорт конфигурации базы данных
const dbConfig = require('../config/database');

// Создание приложения Express
const app = express();
const PORT = process.env.PORT || 3000;

// Создание пула соединений с PostgreSQL
const pool = new Pool(dbConfig);

// Middleware
app.use(helmet()); // Безопасность
app.use(cors()); // CORS для фронтенда
app.use(express.json({ limit: '10mb' })); // Парсинг JSON
app.use(express.urlencoded({ extended: true })); // Парсинг URL-encoded

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // максимум 100 запросов с одного IP
    message: 'Слишком много запросов с этого IP, попробуйте позже.'
});
app.use('/api/', limiter);

// Статические файлы
app.use(express.static(path.join(__dirname, '../public')));

// Middleware для логирования
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Middleware для обработки ошибок базы данных
const handleDatabaseError = (err, res) => {
    console.error('Database error:', err);
    
    if (err.code === '23505') { // Unique violation
        return res.status(409).json({ error: 'Запись с такими данными уже существует' });
    }
    
    if (err.code === '23503') { // Foreign key violation
        return res.status(400).json({ error: 'Нарушение связей между таблицами' });
    }
    
    if (err.code === '23502') { // Not null violation
        return res.status(400).json({ error: 'Обязательные поля не заполнены' });
    }
    
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
};

// API Routes

// Проверка подключения к базе данных
app.get('/api/health', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
        client.release();
        
        res.json({
            status: 'OK',
            database: 'connected',
            timestamp: result.rows[0].current_time,
            version: result.rows[0].pg_version
        });
    } catch (err) {
        console.error('Health check failed:', err);
        res.status(500).json({
            status: 'ERROR',
            database: 'disconnected',
            error: err.message
        });
    }
});

// Статистика
app.get('/api/stats', async (req, res) => {
    try {
        const client = await pool.connect();
        
        const [clinicsCount, specialistsCount, usersCount, requestsCount] = await Promise.all([
            client.query('SELECT COUNT(*) as count FROM clinics WHERE is_active = true'),
            client.query('SELECT COUNT(*) as count FROM specialists WHERE is_active = true'),
            client.query('SELECT COUNT(*) as count FROM users'),
            client.query('SELECT COUNT(*) as count FROM requests')
        ]);
        
        client.release();
        
        res.json({
            clinics: parseInt(clinicsCount.rows[0].count),
            specialists: parseInt(specialistsCount.rows[0].count),
            users: parseInt(usersCount.rows[0].count),
            requests: parseInt(requestsCount.rows[0].count)
        });
    } catch (err) {
        handleDatabaseError(err, res);
    }
});

// Клиники
app.get('/api/clinics', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`
            SELECT 
                c.*,
                COUNT(s.id) as specialists_count
            FROM clinics c
            LEFT JOIN specialists s ON c.id = s.clinic_id AND s.is_active = true
            WHERE c.is_active = true
            GROUP BY c.id
            ORDER BY c.name
        `);
        client.release();
        
        res.json(result.rows);
    } catch (err) {
        handleDatabaseError(err, res);
    }
});

app.get('/api/clinics/:id', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM clinics WHERE id = $1', [req.params.id]);
        client.release();
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Клиника не найдена' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        handleDatabaseError(err, res);
    }
});

app.post('/api/clinics', async (req, res) => {
    try {
        const {
            name, address, phone, email, website, description,
            latitude, longitude, working_hours, services, rating, image_url
        } = req.body;
        
        const client = await pool.connect();
        const result = await client.query(`
            INSERT INTO clinics (name, address, phone, email, website, description, 
                               latitude, longitude, working_hours, services, rating, image_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `, [name, address, phone, email, website, description, 
            latitude, longitude, working_hours, services, rating, image_url]);
        client.release();
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        handleDatabaseError(err, res);
    }
});

app.put('/api/clinics/:id', async (req, res) => {
    try {
        const {
            name, address, phone, email, website, description,
            latitude, longitude, working_hours, services, rating, image_url
        } = req.body;
        
        const client = await pool.connect();
        const result = await client.query(`
            UPDATE clinics 
            SET name = $1, address = $2, phone = $3, email = $4, website = $5, 
                description = $6, latitude = $7, longitude = $8, working_hours = $9, 
                services = $10, rating = $11, image_url = $12, updated_at = CURRENT_TIMESTAMP
            WHERE id = $13
            RETURNING *
        `, [name, address, phone, email, website, description, 
            latitude, longitude, working_hours, services, rating, image_url, req.params.id]);
        client.release();
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Клиника не найдена' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        handleDatabaseError(err, res);
    }
});

app.delete('/api/clinics/:id', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`
            UPDATE clinics 
            SET is_active = false, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `, [req.params.id]);
        client.release();
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Клиника не найдена' });
        }
        
        res.json({ message: 'Клиника успешно удалена' });
    } catch (err) {
        handleDatabaseError(err, res);
    }
});

// Специалисты
app.get('/api/specialists', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`
            SELECT 
                s.*,
                c.name as clinic_name
            FROM specialists s
            LEFT JOIN clinics c ON s.clinic_id = c.id
            WHERE s.is_active = true
            ORDER BY s.last_name, s.first_name
        `);
        client.release();
        
        res.json(result.rows);
    } catch (err) {
        handleDatabaseError(err, res);
    }
});

app.get('/api/specialists/:id', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`
            SELECT 
                s.*,
                c.name as clinic_name
            FROM specialists s
            LEFT JOIN clinics c ON s.clinic_id = c.id
            WHERE s.id = $1
        `, [req.params.id]);
        client.release();
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Специалист не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        handleDatabaseError(err, res);
    }
});

app.post('/api/specialists', async (req, res) => {
    try {
        const {
            clinic_id, first_name, last_name, middle_name, specialization,
            experience_years, education, phone, email, bio, services,
            working_hours, price_per_hour, rating, image_url
        } = req.body;
        
        const client = await pool.connect();
        const result = await client.query(`
            INSERT INTO specialists (clinic_id, first_name, last_name, middle_name, specialization,
                                   experience_years, education, phone, email, bio, services,
                                   working_hours, price_per_hour, rating, image_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING *
        `, [clinic_id, first_name, last_name, middle_name, specialization,
            experience_years, education, phone, email, bio, services,
            working_hours, price_per_hour, rating, image_url]);
        client.release();
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        handleDatabaseError(err, res);
    }
});

app.put('/api/specialists/:id', async (req, res) => {
    try {
        const {
            clinic_id, first_name, last_name, middle_name, specialization,
            experience_years, education, phone, email, bio, services,
            working_hours, price_per_hour, rating, image_url
        } = req.body;
        
        const client = await pool.connect();
        const result = await client.query(`
            UPDATE specialists 
            SET clinic_id = $1, first_name = $2, last_name = $3, middle_name = $4, 
                specialization = $5, experience_years = $6, education = $7, phone = $8, 
                email = $9, bio = $10, services = $11, working_hours = $12, 
                price_per_hour = $13, rating = $14, image_url = $15, updated_at = CURRENT_TIMESTAMP
            WHERE id = $16
            RETURNING *
        `, [clinic_id, first_name, last_name, middle_name, specialization,
            experience_years, education, phone, email, bio, services,
            working_hours, price_per_hour, rating, image_url, req.params.id]);
        client.release();
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Специалист не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        handleDatabaseError(err, res);
    }
});

app.delete('/api/specialists/:id', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`
            UPDATE specialists 
            SET is_active = false, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `, [req.params.id]);
        client.release();
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Специалист не найден' });
        }
        
        res.json({ message: 'Специалист успешно удален' });
    } catch (err) {
        handleDatabaseError(err, res);
    }
});

// Обращения
app.get('/api/requests', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`
            SELECT 
                r.*,
                u.first_name as user_first_name,
                u.last_name as user_last_name,
                u.phone as user_phone,
                s.first_name as specialist_first_name,
                s.last_name as specialist_last_name,
                s.specialization,
                c.name as clinic_name
            FROM requests r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN specialists s ON r.specialist_id = s.id
            LEFT JOIN clinics c ON r.clinic_id = c.id
            ORDER BY r.created_at DESC
        `);
        client.release();
        
        res.json(result.rows);
    } catch (err) {
        handleDatabaseError(err, res);
    }
});

// Анализы
app.get('/api/analyses', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`
            SELECT 
                a.*,
                u.first_name as user_first_name,
                u.last_name as user_last_name,
                s.first_name as specialist_first_name,
                s.last_name as specialist_last_name,
                c.name as clinic_name
            FROM analyses a
            LEFT JOIN users u ON a.user_id = u.id
            LEFT JOIN specialists s ON a.specialist_id = s.id
            LEFT JOIN clinics c ON a.clinic_id = c.id
            ORDER BY a.created_at DESC
        `);
        client.release();
        
        res.json(result.rows);
    } catch (err) {
        handleDatabaseError(err, res);
    }
});

// Пользователи
app.get('/api/users', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`
            SELECT 
                u.*,
                COUNT(r.id) as requests_count
            FROM users u
            LEFT JOIN requests r ON u.id = r.user_id
            GROUP BY u.id
            ORDER BY u.created_at DESC
        `);
        client.release();
        
        res.json(result.rows);
    } catch (err) {
        handleDatabaseError(err, res);
    }
});

// Обработка 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Получен сигнал SIGINT. Закрытие сервера...');
    await pool.end();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Получен сигнал SIGTERM. Закрытие сервера...');
    await pool.end();
    process.exit(0);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`API доступно по адресу: http://localhost:${PORT}/api`);
    console.log(`Админ-панель доступна по адресу: http://localhost:${PORT}`);
});

module.exports = app;
