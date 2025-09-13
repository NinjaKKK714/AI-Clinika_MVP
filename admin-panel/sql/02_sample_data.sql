-- SQL скрипт с тестовыми данными для AI-Clinika
-- Выполните после создания таблиц для заполнения базы тестовыми данными

-- Вставка тестовых клиник
INSERT INTO clinics (id, name, address, phone, email, website, description, latitude, longitude, working_hours, services, rating, image_url) VALUES
(
    uuid_generate_v4(),
    'Медицинский центр "Здоровье+"',
    'ул. Ленина, 123, Москва',
    '+7 (495) 123-45-67',
    'info@zdorovie-plus.ru',
    'https://zdorovie-plus.ru',
    'Современный медицинский центр с полным спектром услуг. Опытные врачи, новейшее оборудование.',
    55.7558,
    37.6176,
    '{"monday": "8:00-20:00", "tuesday": "8:00-20:00", "wednesday": "8:00-20:00", "thursday": "8:00-20:00", "friday": "8:00-20:00", "saturday": "9:00-18:00", "sunday": "10:00-16:00"}',
    '["терапия", "кардиология", "неврология", "эндокринология", "стоматология"]',
    4.8,
    '/images/clinic1.jpg'
),
(
    uuid_generate_v4(),
    'Клиника "Семейный доктор"',
    'пр. Мира, 456, Москва',
    '+7 (495) 234-56-78',
    'contact@family-doctor.ru',
    'https://family-doctor.ru',
    'Семейная клиника с многолетним опытом. Заботимся о здоровье всей семьи.',
    55.7619,
    37.6208,
    '{"monday": "7:00-21:00", "tuesday": "7:00-21:00", "wednesday": "7:00-21:00", "thursday": "7:00-21:00", "friday": "7:00-21:00", "saturday": "8:00-19:00", "sunday": "9:00-17:00"}',
    '["педиатрия", "гинекология", "урология", "дерматология", "офтальмология"]',
    4.6,
    '/images/clinic2.jpg'
),
(
    uuid_generate_v4(),
    'Стоматологическая клиника "Белоснежка"',
    'ул. Тверская, 789, Москва',
    '+7 (495) 345-67-89',
    'info@belosnezhka-dent.ru',
    'https://belosnezhka-dent.ru',
    'Современная стоматология с использованием новейших технологий. Безболезненное лечение.',
    55.7678,
    37.6214,
    '{"monday": "9:00-21:00", "tuesday": "9:00-21:00", "wednesday": "9:00-21:00", "thursday": "9:00-21:00", "friday": "9:00-21:00", "saturday": "10:00-18:00", "sunday": "10:00-16:00"}',
    '["терапевтическая стоматология", "хирургическая стоматология", "ортодонтия", "имплантология", "отбеливание"]',
    4.9,
    '/images/clinic3.jpg'
);

-- Получаем ID клиник для вставки специалистов
WITH clinic_ids AS (
    SELECT id, name FROM clinics
)
INSERT INTO specialists (clinic_id, first_name, last_name, middle_name, specialization, experience_years, education, phone, email, bio, services, working_hours, price_per_hour, rating, image_url)
SELECT 
    c.id,
    'Анна',
    'Петрова',
    'Сергеевна',
    'Терапевт',
    15,
    'МГМУ им. И.М. Сеченова, лечебный факультет',
    '+7 (495) 111-22-33',
    'a.petrova@zdorovie-plus.ru',
    'Опытный терапевт с 15-летним стажем. Специализируется на лечении заболеваний внутренних органов.',
    '["консультация", "диагностика", "лечение ОРВИ", "лечение хронических заболеваний"]',
    '{"monday": "9:00-18:00", "tuesday": "9:00-18:00", "wednesday": "9:00-18:00", "thursday": "9:00-18:00", "friday": "9:00-18:00", "saturday": "10:00-15:00", "sunday": "выходной"}',
    2500.00,
    4.8,
    '/images/specialist1.jpg'
FROM clinic_ids c WHERE c.name = 'Медицинский центр "Здоровье+"'

UNION ALL

SELECT 
    c.id,
    'Михаил',
    'Иванов',
    'Александрович',
    'Кардиолог',
    20,
    'РНИМУ им. Н.И. Пирогова, лечебный факультет',
    '+7 (495) 222-33-44',
    'm.ivanov@zdorovie-plus.ru',
    'Ведущий кардиолог с 20-летним опытом. Специализируется на лечении сердечно-сосудистых заболеваний.',
    '["консультация", "ЭКГ", "УЗИ сердца", "холтер-мониторинг", "лечение гипертонии"]',
    '{"monday": "8:00-17:00", "tuesday": "8:00-17:00", "wednesday": "8:00-17:00", "thursday": "8:00-17:00", "friday": "8:00-17:00", "saturday": "9:00-14:00", "sunday": "выходной"}',
    3500.00,
    4.9,
    '/images/specialist2.jpg'
FROM clinic_ids c WHERE c.name = 'Медицинский центр "Здоровье+"'

UNION ALL

SELECT 
    c.id,
    'Елена',
    'Сидорова',
    'Владимировна',
    'Педиатр',
    12,
    'МГМУ им. И.М. Сеченова, педиатрический факультет',
    '+7 (495) 333-44-55',
    'e.sidorova@family-doctor.ru',
    'Детский врач с большим опытом работы. Любит детей и умеет найти подход к каждому маленькому пациенту.',
    '["консультация", "вакцинация", "лечение детских заболеваний", "профилактические осмотры"]',
    '{"monday": "8:00-19:00", "tuesday": "8:00-19:00", "wednesday": "8:00-19:00", "thursday": "8:00-19:00", "friday": "8:00-19:00", "saturday": "9:00-16:00", "sunday": "10:00-15:00"}',
    2000.00,
    4.7,
    '/images/specialist3.jpg'
FROM clinic_ids c WHERE c.name = 'Клиника "Семейный доктор"'

UNION ALL

SELECT 
    c.id,
    'Дмитрий',
    'Козлов',
    'Игоревич',
    'Стоматолог-терапевт',
    8,
    'МГМСУ им. А.И. Евдокимова, стоматологический факультет',
    '+7 (495) 444-55-66',
    'd.kozlov@belosnezhka-dent.ru',
    'Молодой, но очень талантливый стоматолог. Специализируется на эстетической стоматологии.',
    '["лечение кариеса", "эндодонтия", "реставрация зубов", "отбеливание", "профилактика"]',
    '{"monday": "10:00-20:00", "tuesday": "10:00-20:00", "wednesday": "10:00-20:00", "thursday": "10:00-20:00", "friday": "10:00-20:00", "saturday": "11:00-17:00", "sunday": "11:00-15:00"}',
    3000.00,
    4.8,
    '/images/specialist4.jpg'
FROM clinic_ids c WHERE c.name = 'Стоматологическая клиника "Белоснежка"'

UNION ALL

SELECT 
    c.id,
    'Ольга',
    'Морозова',
    'Петровна',
    'Стоматолог-хирург',
    18,
    'МГМСУ им. А.И. Евдокимова, стоматологический факультет',
    '+7 (495) 555-66-77',
    'o.morozova@belosnezhka-dent.ru',
    'Опытный хирург-стоматолог. Выполняет сложные операции по имплантации и удалению зубов.',
    '["удаление зубов", "имплантация", "костная пластика", "синус-лифтинг", "хирургическое лечение"]',
    '{"monday": "9:00-18:00", "tuesday": "9:00-18:00", "wednesday": "9:00-18:00", "thursday": "9:00-18:00", "friday": "9:00-18:00", "saturday": "10:00-16:00", "sunday": "выходной"}',
    5000.00,
    4.9,
    '/images/specialist5.jpg'
FROM clinic_ids c WHERE c.name = 'Стоматологическая клиника "Белоснежка"';

-- Вставка тестовых пользователей
INSERT INTO users (phone, email, first_name, last_name, middle_name, birth_date, gender, is_verified) VALUES
('+7 (495) 123-45-67', 'user1@example.com', 'Иван', 'Петров', 'Сергеевич', '1985-03-15', 'male', true),
('+7 (495) 234-56-78', 'user2@example.com', 'Мария', 'Иванова', 'Александровна', '1990-07-22', 'female', true),
('+7 (495) 345-67-89', 'user3@example.com', 'Алексей', 'Сидоров', 'Владимирович', '1988-11-08', 'male', false),
('+7 (495) 456-78-90', 'user4@example.com', 'Елена', 'Козлова', 'Игоревна', '1992-05-14', 'female', true),
('+7 (495) 567-89-01', 'user5@example.com', 'Дмитрий', 'Морозов', 'Петрович', '1987-09-30', 'male', true);

-- Вставка тестовых обращений
WITH user_specialist_data AS (
    SELECT 
        u.id as user_id,
        s.id as specialist_id,
        s.clinic_id
    FROM users u
    CROSS JOIN specialists s
    LIMIT 10
)
INSERT INTO requests (user_id, specialist_id, clinic_id, request_type, title, description, status, priority, scheduled_date)
SELECT 
    usd.user_id,
    usd.specialist_id,
    usd.clinic_id,
    CASE (random() * 3)::int
        WHEN 0 THEN 'consultation'
        WHEN 1 THEN 'appointment'
        ELSE 'emergency'
    END,
    CASE (random() * 4)::int
        WHEN 0 THEN 'Консультация по результатам анализов'
        WHEN 1 THEN 'Запись на прием'
        WHEN 2 THEN 'Срочная консультация'
        ELSE 'Плановый осмотр'
    END,
    'Описание обращения пациента. Требуется консультация специалиста.',
    CASE (random() * 4)::int
        WHEN 0 THEN 'pending'
        WHEN 1 THEN 'accepted'
        WHEN 2 THEN 'completed'
        ELSE 'rejected'
    END,
    CASE (random() * 3)::int
        WHEN 0 THEN 'low'
        WHEN 1 THEN 'normal'
        ELSE 'high'
    END,
    CURRENT_TIMESTAMP + (random() * interval '30 days')
FROM user_specialist_data usd;

-- Вставка тестовых анализов
WITH user_clinic_data AS (
    SELECT 
        u.id as user_id,
        c.id as clinic_id,
        s.id as specialist_id
    FROM users u
    CROSS JOIN clinics c
    CROSS JOIN specialists s
    LIMIT 15
)
INSERT INTO analyses (user_id, clinic_id, specialist_id, name, type, description, status, test_date, result_date)
SELECT 
    ucd.user_id,
    ucd.clinic_id,
    ucd.specialist_id,
    CASE (random() * 5)::int
        WHEN 0 THEN 'Общий анализ крови'
        WHEN 1 THEN 'Биохимический анализ крови'
        WHEN 2 THEN 'Общий анализ мочи'
        WHEN 3 THEN 'Рентген грудной клетки'
        ELSE 'УЗИ брюшной полости'
    END,
    CASE (random() * 5)::int
        WHEN 0 THEN 'blood'
        WHEN 1 THEN 'blood'
        WHEN 2 THEN 'urine'
        WHEN 3 THEN 'xray'
        ELSE 'ultrasound'
    END,
    'Описание анализа. Стандартное исследование для диагностики.',
    CASE (random() * 3)::int
        WHEN 0 THEN 'pending'
        WHEN 1 THEN 'in_progress'
        ELSE 'completed'
    END,
    CURRENT_DATE - (random() * 30)::int,
    CASE 
        WHEN (random() * 3)::int > 0 THEN CURRENT_DATE - (random() * 15)::int
        ELSE NULL
    END
FROM user_clinic_data ucd;




