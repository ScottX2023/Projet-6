document.addEventListener('DOMContentLoaded', () => {

    // Affichage des projets en fonction des catégories 

    function displayProjects(data, category = "all") {
        const galleryContainer = document.getElementById('gallery-container');
        galleryContainer.innerHTML = '';

        if (category === "all") {
            data.forEach(project => {
                const figure = document.createElement('figure');
                const img = document.createElement('img');
                img.src = project.imageUrl;
                img.alt = project.title;
                const figcaption = document.createElement('figcaption');
                figcaption.textContent = project.title;

                figure.appendChild(img);
                figure.appendChild(figcaption);
                galleryContainer.appendChild(figure);
            });
        } else {
            const ProjectsByCategory = data.filter(project => project.category.name === category);
            ProjectsByCategory.forEach(project => {
                const figure = document.createElement('figure')
                const img = document.createElement('img')
                img.src = project.imageUrl;
                img.alt = project.title;
                const figcaption = document.createElement('figcaption')
                figcaption.textContent = project.title;

                figure.appendChild(img);
                figure.appendChild(figcaption);
                galleryContainer.appendChild(figure);
            });
        }
    }

    function ProjectByCategory(category) {
        displayProjects(data, category);
    }


    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(worksData => {
            data = worksData;
            displayProjects(data);

        })

    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => {
            const CategoriesSet = new Set(categories.map(category => category.name));
            const CategoriesArray = Array.from(CategoriesSet);
            const filterButtonsContainer = document.getElementById('filter-buttons')
            const allButton = document.createElement('button')
            allButton.textContent = 'Tous';
            filterButtonsContainer.appendChild(allButton)

            CategoriesArray.forEach(category => {
                const button = document.createElement('button');
                button.textContent = category;
                filterButtonsContainer.appendChild(button);
            });

            const filterButtons = document.querySelectorAll('#filter-buttons button');
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    console.log('click')
                    const selectedCategory = button.textContent;
                    if (selectedCategory === 'Tous') {
                        displayProjects(data);
                    } else {
                        ProjectByCategory(selectedCategory);
                    }
                });
            });






        })
























})