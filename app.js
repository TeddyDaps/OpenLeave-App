// Περιμένουμε να φορτώσει η σελίδα
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('leave-form');
    const requestsList = document.getElementById('requests-list');

    // Φόρτωση αιτήσεων από την τοπική μνήμη του browser
    let requests = JSON.parse(localStorage.getItem('openleave_requests')) || [];

    // Συνάρτηση για να εμφανίζουμε τις αιτήσεις
    function renderRequests() {
        requestsList.innerHTML = '';
        if (requests.length === 0) {
            requestsList.innerHTML = '<p>Δεν υπάρχουν εκκρεμείς αιτήσεις.</p>';
            return;
        }

        requests.forEach((req, index) => {
            const card = document.createElement('div');
            card.className = 'request-card';
            card.innerHTML = `
                <p><strong>Όνομα:</strong> ${req.name}</p>
                <p><strong>Διάρκεια:</strong> ${req.startDate} έως ${req.endDate}</p>
                <p><strong>Λόγος:</strong> ${req.reason}</p>
                <p><strong>Κατάσταση:</strong> <span class="status">${req.status}</span></p>
                ${req.status === 'Εκκρεμεί' ? `
                    <button class="action-btn" onclick="updateStatus(${index}, 'Εγκρίθηκε')">Έγκριση</button>
                    <button class="action-btn reject-btn" onclick="updateStatus(${index}, 'Απορρίφθηκε')">Απόρριψη</button>
                ` : ''}
            `;
            requestsList.appendChild(card);
        });
    }

    // Όταν υποβάλλεται η φόρμα
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Σταματάμε το refresh της σελίδας
        
        const newRequest = {
            name: document.getElementById('emp-name').value,
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value,
            reason: document.getElementById('reason').value,
            status: 'Εκκρεμεί'
        };

        requests.push(newRequest);
        localStorage.setItem('openleave_requests', JSON.stringify(requests)); // Αποθήκευση
        form.reset(); // Καθαρισμός φόρμας
        renderRequests(); // Ανανέωση λίστας
    });

    // Συνάρτηση για αλλαγή κατάστασης (Έγκριση/Απόρριψη)
    window.updateStatus = function(index, newStatus) {
        requests[index].status = newStatus;
        localStorage.setItem('openleave_requests', JSON.stringify(requests));
        renderRequests();
    };

    // Αρχική εμφάνιση
    renderRequests();
});
