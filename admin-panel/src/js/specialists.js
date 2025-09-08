// Specialists management functions
class SpecialistsManager {
    static editSpecialist(id) {
        const specialist = window.app.data.specialists.find(s => s.id === id);
        if (!specialist) return;
        
        const content = `
            <form id="edit-specialist-form">
                <div class="form-group">
                    <label for="edit-specialist-name">Имя специалиста</label>
                    <input type="text" id="edit-specialist-name" class="form-control" value="${specialist.name}" required>
                </div>
                <div class="form-group">
                    <label for="edit-specialist-specialization">Специализация</label>
                    <input type="text" id="edit-specialist-specialization" class="form-control" value="${specialist.specialization}" required>
                </div>
                <div class="form-group">
                    <label for="edit-specialist-clinic">Клиника</label>
                    <select id="edit-specialist-clinic" class="form-control" required>
                        <option value="">Выберите клинику</option>
                        ${window.app.data.clinics.map(clinic => 
                            `<option value="${clinic.id}" ${clinic.name === specialist.clinic ? 'selected' : ''}>${clinic.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-specialist-experience">Опыт работы</label>
                    <input type="text" id="edit-specialist-experience" class="form-control" value="${specialist.experience}">
                </div>
                <div class="form-group">
                    <label for="edit-specialist-education">Образование</label>
                    <input type="text" id="edit-specialist-education" class="form-control" value="${specialist.education || ''}">
                </div>
            </form>
        `;
        
        const footer = `
            <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Отмена</button>
            <button type="button" class="btn btn-primary" onclick="app.updateSpecialist(${id})">Обновить</button>
        `;
        
        window.app.showModal('Редактировать специалиста', content, footer);
    }
    
    static updateSpecialist(id) {
        const specialist = window.app.data.specialists.find(s => s.id === id);
        if (!specialist) return;
        
        specialist.name = document.getElementById('edit-specialist-name').value;
        specialist.specialization = document.getElementById('edit-specialist-specialization').value;
        specialist.clinic = window.app.data.clinics.find(c => c.id == document.getElementById('edit-specialist-clinic').value)?.name || '';
        specialist.experience = document.getElementById('edit-specialist-experience').value;
        specialist.education = document.getElementById('edit-specialist-education').value;
        
        window.app.saveData();
        window.app.closeModal();
        window.app.loadSpecialistsTable();
    }
}
