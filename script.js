document.addEventListener('DOMContentLoaded', () => {
    const ideaForm = document.getElementById('ideaForm');
    const ideaTitle = document.getElementById('ideaTitle');
    const ideaCategory = document.getElementById('ideaCategory');
    const ideaDescription = document.getElementById('ideaDescription');
    const message = document.getElementById('message');
    const ideasList = document.getElementById('ideasList');
    let ideas = JSON.parse(localStorage.getItem('ideas')) || [];

    function displayMessage(msg, isError = true) {
        message.textContent = msg;
        message.className = isError ? 'text-danger' : 'text-success';
        setTimeout(() => {
            message.textContent = '';
        }, 2000);
    }

    function displayIdeas() {
        ideasList.innerHTML = ideas.map((idea, index) => `
            <div class="idea border rounded p-3 mb-3 ${idea.approved ? 'approved' : 'disapproved'}">
                <h3>${idea.title}</h3>
                <p><strong>Catégorie:</strong> ${idea.category}</p>
                <p>${idea.description}</p>
                <p><strong>Status:</strong> ${idea.approved ? 'Approuvée' : 'Non Approuvée'}</p>
                ${!idea.approved && !idea.disapproved ? `<button class="btn btn-warning btn-sm" onclick="editIdea(${index})">Modifier</button>` : ''}
                <button class="btn btn-success btn-sm" onclick="toggleApproval(${index})">${idea.approved ? 'Désapprouver' : 'Approuver'}</button>
                <button class="btn btn-danger btn-sm" onclick="deleteIdea(${index})">Supprimer</button>
            </div>
        `).join('');
    }

    function resetForm() {
        ideaTitle.value = '';
        ideaCategory.value = '';
        ideaDescription.value = '';
    }

    function validateTitle(title) {
        if (title.length < 3 || title.length > 50) {
            displayMessage('Le titre doit comporter entre 3 et 50 caractères');
            return false;
        }
        if (!/^[a-zA-Z\s]+$/.test(title)) {
            displayMessage('Le titre ne doit contenir que des lettres et des espaces');
            return false;
        }
        return true;
    }

    function validateCategory(category) {
        if (!/^[a-zA-Z\s]+$/.test(category)) {
            displayMessage('La catégorie ne doit contenir que des lettres et des espaces');
            return false;
        }
        return true;
    }

    function validateDescription(description) {
        if (description.length < 10 || description.length > 300) {
            displayMessage('La description doit comporter entre 10 et 300 caractères');
            return false;
        }
        if (!/^[a-zA-Z\s]+$/.test(description)) {
            displayMessage('La description ne doit contenir que des lettres et des espaces');
            return false;
        }
        return true;
    }

    ideaForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = ideaTitle.value.trim();
        const category = ideaCategory.value.trim();
        const description = ideaDescription.value.trim();

        if (!validateTitle(title) || !validateCategory(category) || !validateDescription(description)) {
            return;
        }

        // Si les données sont valides
        ideas.push({ title, category, description, approved: false, disapproved: false });
        localStorage.setItem('ideas', JSON.stringify(ideas));
        displayMessage('Idée ajoutée avec succès', false);
        resetForm();
        displayIdeas();
    });

    window.editIdea = (index) => {
        const idea = ideas[index];
        ideaTitle.value = idea.title;
        ideaCategory.value = idea.category;
        ideaDescription.value = idea.description;
        ideas.splice(index, 1);
        localStorage.setItem('ideas', JSON.stringify(ideas));
        displayIdeas();
    };

    window.toggleApproval = (index) => {
        if (ideas[index].approved || ideas[index].disapproved) return;
        ideas[index].approved = !ideas[index].approved;
        ideas[index].disapproved = !ideas[index].approved; // If approved, disapproved should be false, and vice versa
        localStorage.setItem('ideas', JSON.stringify(ideas));
        displayIdeas();
    };

    window.deleteIdea = (index) => {
        ideas.splice(index, 1);
        localStorage.setItem('ideas', JSON.stringify(ideas));
        displayIdeas();
    };

    displayIdeas();
});
