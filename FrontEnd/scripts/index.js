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

      let galleryHTML = '';
      data.forEach(project => {
        galleryHTML += '<div class="project">';
        galleryHTML += '  <div class="project-container">';
        galleryHTML += '    <img class="modal-project-image" src="' + project.imageUrl + '" alt="' + project.title + '" data-id="' + project.id + '">';
        galleryHTML += '    <i class="fas fa-arrows-up-down-left-right"></i>';
        galleryHTML += '    <i class="fas fa-trash-can"></i>';
        galleryHTML += '  </div>';
        galleryHTML += '  <p>Éditer</p>';
        galleryHTML += '</div>';
      });
      galleryModal.innerHTML = galleryHTML;

      // Suppression des projets au click sur l'icone 

      const trashIcons = document.querySelectorAll('.fas.fa-trash-can');
      trashIcons.forEach(icon => {
        icon.addEventListener('click', (event) => {
          const projectContainer = event.target.closest('.project-container');
          const workId = projectContainer.querySelector('.modal-project-image').dataset.id;

          if (confirm("Voulez vous supprimer ce projet")) {
            deleteProject(workId);
          }
        });
      });
    })

  // Récupération des catégories depuis l'api

  fetch('http://localhost:5678/api/categories')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })

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

  function toggleLoggedInElements(isLoggedIn) {
    const bannerModifier = document.getElementById('banner-modifier')
    const editImageContainer = document.getElementById('edit-image-container')
    const editGalleryContainer = document.getElementById('edit-gallery-container')

    if (isLoggedIn) {
      bannerModifier.classList.remove('hidden')
      editGalleryContainer.classList.remove('hidden')
      editImageContainer.classList.remove('hidden')
    } else {
      bannerModifier.classList.add('hidden')
      editGalleryContainer.classList.add('hidden')
      editImageContainer.classList.add('hidden')
    }
  }

  // Ouverture et fermeture des deux modales

  const galleryModal = document.getElementById('gallery-modal');
  const editGalleryContainer = document.getElementById('edit-gallery-container');
  const modalContainer = document.getElementById('first-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const closeFirstModal = document.getElementById('first-modal-close-btn');
  const openSecondModal = document.getElementById('second-modal');
  const addImageBtn = document.getElementById('add-image-btn');
  const arrowLeft = document.getElementById('arrow-left-icon');
  const closeSecondModal = document.getElementById('second-modal-close-btn');

  editGalleryContainer.addEventListener('click', () => {
    modalContainer.classList.remove('hidden');
    modalOverlay.classList.remove('hidden');
  });

  closeFirstModal.addEventListener('click', () => {
    modalContainer.classList.add('hidden');
    modalOverlay.classList.add('hidden');
  });

  modalOverlay.addEventListener('click', (event) => {
    modalContainer.classList.add('hidden');
    modalOverlay.classList.add('hidden');
    openSecondModal.classList.add('hidden');
  });

  addImageBtn.addEventListener('click', () => {
    modalContainer.classList.add('hidden')
    openSecondModal.classList.remove('hidden')
  });

  arrowLeft.addEventListener('click', () => {
    openSecondModal.classList.add('hidden')
    modalContainer.classList.remove('hidden')
  })

  closeSecondModal.addEventListener('click', () => {
    openSecondModal.classList.add('hidden')
    modalOverlay.classList.add('hidden')
  })

  // Suppréssion d'un projet en fonction de son id 

  let token = localStorage.getItem('token');

  function deleteProject(workId) {
    console.log('Deleting project with ID:', workId);
    fetch(`http://localhost:5678/api/works/${workId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        console.log('Delete response:', response);

        if (!response.ok) {
          throw new Error('Échec suppression');
        }

        if (response.status === 204) {
          console.log('Project deleted successfully');
          fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(worksData => {
              data = worksData;
              displayProjects(data);
              let galleryHTML = '';
              data.forEach(project => {
                galleryHTML += '<div class="project">';
                galleryHTML += '  <div class="project-container">';
                galleryHTML += '    <img class="modal-project-image" src="' + project.imageUrl + '" alt="' + project.title + '" data-id="' + project.id + '">';
                galleryHTML += '    <i class="fas fa-arrows-up-down-left-right"></i>';
                galleryHTML += '    <i class="fas fa-trash-can"></i>';
                galleryHTML += '  </div>';
                galleryHTML += '  <p>Éditer</p>';
                galleryHTML += '</div>';
              });
              galleryModal.innerHTML = galleryHTML;
              attachTrashIcon();
            })
            .catch(error => console.error('Error refreshing gallery:', error));
        } else {
          return response.json();
        }
      })
      .catch(error => console.error('Delete error:', error));
  }

  function attachTrashIcon() {
    const trashIcons = document.querySelectorAll('.fas.fa-trash-can');
    trashIcons.forEach(icon => {
      icon.addEventListener('click', (event) => {
        const projectContainer = event.target.closest('.project-container');
        const workId = projectContainer.querySelector('.modal-project-image').dataset.id;
  
        if (confirm("Voulez vous supprimer ce projet")) {
          deleteProject(workId);
        }
      });
    });
  } 

})