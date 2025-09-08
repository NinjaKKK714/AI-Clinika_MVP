// Data management utilities
class DataManager {
    static saveToFile(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    static loadFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
    
    static exportData() {
        const data = {
            clinics: window.app.data.clinics,
            specialists: window.app.data.specialists,
            exportDate: new Date().toISOString()
        };
        
        this.saveToFile(data, `ai-clinika-data-${new Date().toISOString().split('T')[0]}.json`);
    }
    
    static importData(file) {
        this.loadFromFile(file).then(data => {
            if (data.clinics && data.specialists) {
                window.app.data = data;
                window.app.saveData();
                window.app.loadPageData(window.app.currentPage);
                window.app.updateStats();
                alert('Данные успешно импортированы!');
            } else {
                alert('Неверный формат файла!');
            }
        }).catch(error => {
            alert('Ошибка при импорте данных: ' + error.message);
        });
    }
}
