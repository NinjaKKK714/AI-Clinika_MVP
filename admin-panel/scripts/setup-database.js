// Скрипт для настройки базы данных PostgreSQL
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Конфигурация подключения к PostgreSQL (без указания базы данных)
const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'your_password',
    database: 'postgres' // Подключаемся к системной базе данных
};

async function setupDatabase() {
    const pool = new Pool(config);
    
    try {
        console.log('🔌 Подключение к PostgreSQL...');
        
        // Проверяем подключение
        const client = await pool.connect();
        console.log('✅ Подключение к PostgreSQL успешно');
        
        // Создаем базу данных если она не существует
        const dbName = process.env.DB_NAME || 'ai_clinika';
        console.log(`📊 Создание базы данных "${dbName}"...`);
        
        try {
            await client.query(`CREATE DATABASE ${dbName}`);
            console.log(`✅ База данных "${dbName}" создана успешно`);
        } catch (err) {
            if (err.code === '42P04') {
                console.log(`ℹ️  База данных "${dbName}" уже существует`);
            } else {
                throw err;
            }
        }
        
        client.release();
        
        // Подключаемся к созданной базе данных
        const dbConfig = { ...config, database: dbName };
        const dbPool = new Pool(dbConfig);
        const dbClient = await dbPool.connect();
        
        console.log(`🔗 Подключение к базе данных "${dbName}"...`);
        
        // Читаем и выполняем SQL скрипт создания таблиц
        const createTablesPath = path.join(__dirname, '../sql/01_create_tables.sql');
        if (fs.existsSync(createTablesPath)) {
            console.log('📋 Выполнение скрипта создания таблиц...');
            const createTablesSQL = fs.readFileSync(createTablesPath, 'utf8');
            await dbClient.query(createTablesSQL);
            console.log('✅ Таблицы созданы успешно');
        } else {
            console.log('⚠️  Файл создания таблиц не найден');
        }
        
        dbClient.release();
        await dbPool.end();
        
        console.log('🎉 Настройка базы данных завершена успешно!');
        
    } catch (error) {
        console.error('❌ Ошибка при настройке базы данных:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Запуск скрипта
if (require.main === module) {
    setupDatabase();
}

module.exports = setupDatabase;




