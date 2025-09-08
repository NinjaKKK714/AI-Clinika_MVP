// Main Application JavaScript
class AdminApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.data = {
            clinics: [],
            specialists: [],
            requests: []
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadData();
        this.updateStats();
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateToPage(page);
            });
        });
        
        // Modal
        document.getElementById('modal-close').addEventListener('click', () => {
            this.closeModal();
        });
        
        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });
        
        // Add buttons
        document.getElementById('add-clinic-btn').addEventListener('click', () => {
            this.showAddClinicModal();
        });
        
        document.getElementById('add-specialist-btn').addEventListener('click', () => {
            this.showAddSpecialistModal();
        });
    }
    
    navigateToPage(page) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');
        
        // Update pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        document.getElementById(`${page}-page`).classList.add('active');
        
        this.currentPage = page;
        
        // Load page-specific data
        this.loadPageData(page);
    }
    
    loadPageData(page) {
        switch(page) {
            case 'clinics':
                this.loadClinicsTable();
                break;
            case 'specialists':
                this.loadSpecialistsTable();
                break;
            case 'dashboard':
                this.updateStats();
                break;
        }
    }
    
    loadData() {
        // Load from localStorage or initialize with sample data
        const savedData = localStorage.getItem('ai-clinika-admin-data');
        if (savedData) {
            this.data = JSON.parse(savedData);
        } else {
            this.initializeSampleData();
        }
    }
    
    saveData() {
        localStorage.setItem('ai-clinika-admin-data', JSON.stringify(this.data));
    }
    
    initializeSampleData() {
        this.data = {
            clinics: [
                {
                    id: 1,
                    name: "Медицинский центр 'Здоровье'",
                    address: "ул. Абая, 150, Алматы",
                    phone: "+7 (727) 123-45-67",
                    specializations: ["Терапия", "Кардиология", "Неврология"],
                    coordinates: { latitude: 43.2220, longitude: 76.8512 },
                    workingHours: "Пн-Пт: 8:00-20:00, Сб-Вс: 9:00-18:00",
                    rating: 4.8,
                    image: "clinic1.jpg"
                },
                {
                    id: 2,
                    name: "Стоматологическая клиника 'Белоснежка'",
                    address: "пр. Достык, 85, Алматы",
                    phone: "+7 (727) 234-56-78",
                    specializations: ["Стоматология", "Ортодонтия"],
                    coordinates: { latitude: 43.2389, longitude: 76.8897 },
                    workingHours: "Пн-Сб: 9:00-19:00, Вс: 10:00-16:00",
                    rating: 4.9,
                    image: "clinic2.jpg"
                }
            ],
            specialists: [
                {
                    id: 1,
                    name: "Др. Айгуль Нурланова",
                    specialization: "Кардиолог",
                    clinic: "Медицинский центр 'Здоровье'",
                    experience: "15 лет",
                    rating: 4.9,
                    education: "Казахский национальный медицинский университет",
                    image: "doctor1.jpg",
                    schedule: {
                        monday: "9:00-17:00",
                        tuesday: "9:00-17:00",
                        wednesday: "9:00-17:00",
                        thursday: "9:00-17:00",
                        friday: "9:00-17:00"
                    }
                },
                {
                    id: 2,
                    name: "Др. Ерлан Смагулов",
                    specialization: "Стоматолог",
                    clinic: "Стоматологическая клиника 'Белоснежка'",
                    experience: "12 лет",
                    rating: 4.8,
                    education: "Алматинский государственный медицинский институт",
                    image: "doctor2.jpg",
                    schedule: {
                        monday: "10:00-18:00",
                        tuesday: "10:00-18:00",
                        wednesday: "10:00-18:00",
                        thursday: "10:00-18:00",
                        friday: "10:00-18:00",
                        saturday: "10:00-16:00"
                    }
                }
            ],
            requests: []
        };
        
        this.saveData();
    }
    
    updateStats() {
        document.getElementById('clinics-count').textContent = this.data.clinics.length;
        document.getElementById('specialists-count').textContent = this.data.specialists.length;
        document.getElementById('requests-count').textContent = this.data.requests.length;
    }
    
    showModal(title, content, footer = '') {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        document.getElementById('modal-footer').innerHTML = footer;
        document.getElementById('modal-overlay').classList.add('active');
    }
    
    closeModal() {
        document.getElementById('modal-overlay').classList.remove('active');
    }
    
    showAddClinicModal() {
        const content = `
            <form id="clinic-form">
                <div class="form-group">
                    <label for="clinic-name">Название клиники</label>
                    <input type="text" id="clinic-name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="clinic-address">Адрес</label>
                    <input type="text" id="clinic-address" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="clinic-phone">Телефон</label>
                    <input type="tel" id="clinic-phone" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="clinic-specializations">Специализации (через запятую)</label>
                    <input type="text" id="clinic-specializations" class="form-control" placeholder="Терапия, Кардиология, Неврология">
                </div>
                <div class="form-group">
                    <label for="clinic-hours">Часы работы</label>
                    <input type="text" id="clinic-hours" class="form-control" placeholder="Пн-Пт: 8:00-20:00">
                </div>
            </form>
        `;
        
        const footer = `
            <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Отмена</button>
            <button type="button" class="btn btn-primary" onclick="app.saveClinic()">Сохранить</button>
        `;
        
        this.showModal('Добавить клинику', content, footer);
    }
    
    showAddSpecialistModal() {
        const content = `
            <form id="specialist-form">
                <div class="form-group">
                    <label for="specialist-name">Имя специалиста</label>
                    <input type="text" id="specialist-name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="specialist-specialization">Специализация</label>
                    <input type="text" id="specialist-specialization" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="specialist-clinic">Клиника</label>
                    <select id="specialist-clinic" class="form-control" required>
                        <option value="">Выберите клинику</option>
                        ${this.data.clinics.map(clinic => 
                            `<option value="${clinic.id}">${clinic.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="specialist-experience">Опыт работы</label>
                    <input type="text" id="specialist-experience" class="form-control" placeholder="10 лет">
                </div>
                <div class="form-group">
                    <label for="specialist-education">Образование</label>
                    <input type="text" id="specialist-education" class="form-control">
                </div>
            </form>
        `;
        
        const footer = `
            <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Отмена</button>
            <button type="button" class="btn btn-primary" onclick="app.saveSpecialist()">Сохранить</button>
        `;
        
        this.showModal('Добавить специалиста', content, footer);
    }
    
    
    saveClinic() {
        const form = document.getElementById('clinic-form');
        const formData = new FormData(form);
        
        const clinic = {
            id: Date.now(),
            name: document.getElementById('clinic-name').value,
            address: document.getElementById('clinic-address').value,
            phone: document.getElementById('clinic-phone').value,
            specializations: document.getElementById('clinic-specializations').value.split(',').map(s => s.trim()),
            workingHours: document.getElementById('clinic-hours').value,
            rating: 0,
            image: "clinic_default.jpg"
        };
        
        this.data.clinics.push(clinic);
        this.saveData();
        this.closeModal();
        this.loadClinicsTable();
        this.updateStats();
    }
    
    saveSpecialist() {
        const specialist = {
            id: Date.now(),
            name: document.getElementById('specialist-name').value,
            specialization: document.getElementById('specialist-specialization').value,
            clinic: this.data.clinics.find(c => c.id == document.getElementById('specialist-clinic').value)?.name || '',
            experience: document.getElementById('specialist-experience').value,
            education: document.getElementById('specialist-education').value,
            rating: 0,
            image: "doctor_default.jpg"
        };
        
        this.data.specialists.push(specialist);
        this.saveData();
        this.closeModal();
        this.loadSpecialistsTable();
        this.updateStats();
    }
    
    
    loadClinicsTable() {
        const tbody = document.getElementById('clinics-tbody');
        tbody.innerHTML = this.data.clinics.map(clinic => `
            <tr>
                <td>${clinic.id}</td>
                <td>${clinic.name}</td>
                <td>${clinic.address}</td>
                <td>${clinic.phone}</td>
                <td>${clinic.specializations.join(', ')}</td>
                <td>
                    <button class="btn btn-warning" onclick="app.editClinic(${clinic.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="app.deleteClinic(${clinic.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    loadSpecialistsTable() {
        const tbody = document.getElementById('specialists-tbody');
        tbody.innerHTML = this.data.specialists.map(specialist => `
            <tr>
                <td>${specialist.id}</td>
                <td>${specialist.name}</td>
                <td>${specialist.specialization}</td>
                <td>${specialist.clinic}</td>
                <td>${specialist.experience}</td>
                <td>${specialist.rating}</td>
                <td>
                    <button class="btn btn-warning" onclick="app.editSpecialist(${specialist.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="app.deleteSpecialist(${specialist.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    
    deleteClinic(id) {
        if (confirm('Вы уверены, что хотите удалить эту клинику?')) {
            this.data.clinics = this.data.clinics.filter(c => c.id !== id);
            this.saveData();
            this.loadClinicsTable();
            this.updateStats();
        }
    }
    
    deleteSpecialist(id) {
        if (confirm('Вы уверены, что хотите удалить этого специалиста?')) {
            this.data.specialists = this.data.specialists.filter(s => s.id !== id);
            this.saveData();
            this.loadSpecialistsTable();
            this.updateStats();
        }
    }
    
    
    editClinic(id) {
        ClinicsManager.editClinic(id);
    }
    
    updateClinic(id) {
        ClinicsManager.updateClinic(id);
    }
    
    editSpecialist(id) {
        SpecialistsManager.editSpecialist(id);
    }
    
    updateSpecialist(id) {
        SpecialistsManager.updateSpecialist(id);
    }
    
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AdminApp();
});
