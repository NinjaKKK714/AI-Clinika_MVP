// API клиент для работы с сервером
class ApiClient {
    constructor(baseUrl = 'http://localhost:3000/api') {
        this.baseUrl = baseUrl;
    }
    
    // Базовый метод для HTTP запросов
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Ошибка сервера' }));
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    
    // GET запрос
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }
    
    // POST запрос
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    // PUT запрос
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    // DELETE запрос
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
    
    // Проверка здоровья сервера
    async healthCheck() {
        return this.get('/health');
    }
    
    // Статистика
    async getStats() {
        return this.get('/stats');
    }
    
    // Клиники
    async getClinics() {
        return this.get('/clinics');
    }
    
    async getClinic(id) {
        return this.get(`/clinics/${id}`);
    }
    
    async createClinic(clinicData) {
        return this.post('/clinics', clinicData);
    }
    
    async updateClinic(id, clinicData) {
        return this.put(`/clinics/${id}`, clinicData);
    }
    
    async deleteClinic(id) {
        return this.delete(`/clinics/${id}`);
    }
    
    // Специалисты
    async getSpecialists() {
        return this.get('/specialists');
    }
    
    async getSpecialist(id) {
        return this.get(`/specialists/${id}`);
    }
    
    async createSpecialist(specialistData) {
        return this.post('/specialists', specialistData);
    }
    
    async updateSpecialist(id, specialistData) {
        return this.put(`/specialists/${id}`, specialistData);
    }
    
    async deleteSpecialist(id) {
        return this.delete(`/specialists/${id}`);
    }
    
    // Обращения
    async getRequests() {
        return this.get('/requests');
    }
    
    // Анализы
    async getAnalyses() {
        return this.get('/analyses');
    }
    
    // Пользователи
    async getUsers() {
        return this.get('/users');
    }
}

// Создаем глобальный экземпляр API клиента
window.apiClient = new ApiClient();
