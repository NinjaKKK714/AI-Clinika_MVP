// Скрипт для заполнения базы данных тестовыми данными
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Конфигурация подключения к базе данных
const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'ai_clinika',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'your_password'
};

async function seedDatabase() {
    const pool = new Pool(config);
    
    try {
        console.log('🔌 Подключение к базе данных...');
        
        const client = await pool.connect();
        console.log('✅ Подключение к базе данных успешно');
        
        // Проверяем, есть ли уже данные
        const checkResult = await client.query('SELECT COUNT(*) as count FROM clinics');
        const clinicCount = parseInt(checkResult.rows[0].count);
        
        if (clinicCount > 0) {
            console.log('ℹ️  В базе данных уже есть данные. Пропускаем заполнение.');
            client.release();
            return;
        }
        
        // Читаем и выполняем SQL скрипт с тестовыми данными
        const seedDataPath = path.join(__dirname, '../sql/02_sample_data.sql');
        if (fs.existsSync(seedDataPath)) {
            console.log('🌱 Заполнение базы данных тестовыми данными...');
            const seedDataSQL = fs.readFileSync(seedDataPath, 'utf8');
            await client.query(seedDataSQL);
            console.log('✅ Тестовые данные добавлены успешно');
        } else {
            console.log('⚠️  Файл с тестовыми данными не найден');
        }
        
        // Проверяем результат
        const [clinicsResult, specialistsResult, usersResult] = await Promise.all([
            client.query('SELECT COUNT(*) as count FROM clinics'),
            client.query('SELECT COUNT(*) as count FROM specialists'),
            client.query('SELECT COUNT(*) as count FROM users')
        ]);
        
        console.log('📊 Статистика добавленных данных:');
        console.log(`   - Клиники: ${clinicsResult.rows[0].count}`);
        console.log(`   - Специалисты: ${specialistsResult.rows[0].count}`);
        console.log(`   - Пользователи: ${usersResult.rows[0].count}`);
        
        client.release();
        
        console.log('🎉 Заполнение базы данных завершено успешно!');
        
    } catch (error) {
        console.error('❌ Ошибка при заполнении базы данных:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Запуск скрипта
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;



