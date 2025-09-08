// Clinics management functions
class ClinicsManager {
    static editClinic(id) {
        const clinic = window.app.data.clinics.find(c => c.id === id);
        if (!clinic) return;
        
        const content = `
            <form id="edit-clinic-form">
                <div class="form-group">
                    <label for="edit-clinic-name">Название клиники</label>
                    <input type="text" id="edit-clinic-name" class="form-control" value="${clinic.name}" required>
                </div>
                <div class="form-group">
                    <label for="edit-clinic-address">Адрес</label>
                    <input type="text" id="edit-clinic-address" class="form-control" value="${clinic.address}" required>
                </div>
                <div class="form-group">
                    <label for="edit-clinic-phone">Телефон</label>
                    <input type="tel" id="edit-clinic-phone" class="form-control" value="${clinic.phone}" required>
                </div>
                <div class="form-group">
                    <label for="edit-clinic-specializations">Специализации (через запятую)</label>
                    <input type="text" id="edit-clinic-specializations" class="form-control" value="${clinic.specializations.join(', ')}">
                </div>
                <div class="form-group">
                    <label for="edit-clinic-hours">Часы работы</label>
                    <input type="text" id="edit-clinic-hours" class="form-control" value="${clinic.workingHours}">
                </div>
            </form>
        `;
        
        const footer = `
            <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Отмена</button>
            <button type="button" class="btn btn-primary" onclick="app.updateClinic(${id})">Обновить</button>
        `;
        
        window.app.showModal('Редактировать клинику', content, footer);
    }
    
    static updateClinic(id) {
        const clinic = window.app.data.clinics.find(c => c.id === id);
        if (!clinic) return;
        
        clinic.name = document.getElementById('edit-clinic-name').value;
        clinic.address = document.getElementById('edit-clinic-address').value;
        clinic.phone = document.getElementById('edit-clinic-phone').value;
        clinic.specializations = document.getElementById('edit-clinic-specializations').value.split(',').map(s => s.trim());
        clinic.workingHours = document.getElementById('edit-clinic-hours').value;
        
        window.app.saveData();
        window.app.closeModal();
        window.app.loadClinicsTable();
    }
}
