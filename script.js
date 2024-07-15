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
        ideasList.innerHTML = '';
        ideas.forEach((idea, index) => {
            const card = document.createElement('div');
            card.className = 'card mx-3 mb-3';
            card.style.width = '18rem';

            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${idea.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${idea.category}</h6>
                    <p class="card-text">${idea.description}</p>
                    <p><strong>Status:</strong> ${idea.approved ? 'Approuvée' : 'Non Approuvée'}</p>
                    ${!idea.approved && !idea.disapproved ? `<a href="#" class="btn btn-warning btn-sm" onclick="editIdea(${index})">Modifier</a>` : ''}
                    <a href="#" class="btn btn-danger btn-sm" onclick="deleteIdea(${index})">Supprimer</a>
                </div>
            `;

            // Appliquer la classe pour la bordure
            if (idea.approved) {
                card.classList.add('border', 'border-success');
            } else if (idea.disapproved) {
                card.classList.add('border', 'border-danger');
            } else {
                card.classList.add('border', 'border-danger');
            }

            ideasList.appendChild(card);
        });
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
        ideas[index].approved = true;
        ideas[index].disapproved = false; // Assurer qu'une fois approuvé, il ne peut pas être désapprouvé
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
