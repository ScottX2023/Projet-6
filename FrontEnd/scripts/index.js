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
            updateLogginButton();
        })

    // Récupération des catégories depuis l'api
     
    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        
        // Création des boutons pour le filtrage des catégories

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

            // Filtrage des catégories 

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


  // Modification du bouton de connexion en fonction de l'état de connexion

  function updateLogginButton() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginButton = document.querySelector('nav ul li:nth-child(3)');
  
    if (isLoggedIn === 'true') {
      loginButton.textContent = 'logout';
      loginButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        loginButton.textContent = 'login';
        window.location.href = './login.html';
      });
      toggleLoggedInElements(true); 
    } else {
      loginButton.textContent = 'login';
      loginButton.addEventListener('click', () => {
        window.location.href = './login.html';
      });
      toggleLoggedInElements(false);
    }
  }
  
  updateLogginButton();

  // Affichage des éléments de modification si l'utilisateur est connecté

  function toggleLoggedInElements(isLoggedIn){
    const bannerModifier = document.getElementById('banner-modifier')
    const editImageContainer = document.getElementById('edit-image-container')
    const editGalleryContainer = document.getElementById('edit-gallery-container')
    
    if(isLoggedIn){
      bannerModifier.classList.remove('hidden')
      editGalleryContainer.classList.remove('hidden')
      editImageContainer.classList.remove('hidden')
    } else {
      bannerModifier.classList.add('hidden')
      editGalleryContainer.classList.add('hidden')
      editImageContainer.classList.add('hidden')
    }
  }












})