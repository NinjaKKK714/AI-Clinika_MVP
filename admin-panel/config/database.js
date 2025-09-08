// Database configuration for PostgreSQL (Node.js version)
module.exports = {
    // Основные настройки подключения
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'ai_clinika',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'your_password',
    
    // Настройки пула соединений
    max: 20,                     // Максимальное количество соединений в пуле
    idleTimeoutMillis: 30000,    // Таймаут неактивных соединений
    connectionTimeoutMillis: 2000, // Таймаут подключения
    
    // SSL настройки (для продакшена)
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false // Для разработки, в продакшене должно быть true
    } : false
};