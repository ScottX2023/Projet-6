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

  // Création des projets dynamiquement

  function createProjectElement(project) {
    const projectElement = document.createElement('div');
    projectElement.classList.add('project');
  
    const projectContainer = document.createElement('div');
    projectContainer.classList.add('project-container');
  
    const img = document.createElement('img');
    img.classList.add('modal-project-image');
    img.src = project.imageUrl;
    img.alt = project.title;
    img.dataset.id = project.id;
  
    const arrowsIcon = document.createElement('i');
    arrowsIcon.classList.add('fas', 'fa-arrows-up-down-left-right');
  
    const trashIcon = document.createElement('i');
    trashIcon.classList.add('fas', 'fa-trash-can');
  
    projectContainer.appendChild(img);
    projectContainer.appendChild(arrowsIcon);
    projectContainer.appendChild(trashIcon);
  
    const editParagraph = document.createElement('p');
    editParagraph.textContent = 'Éditer';
  
    projectElement.appendChild(projectContainer);
    projectElement.appendChild(editParagraph);
  
    return projectElement;
  }

  // Récupération des projets depuis l'api

  fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(worksData => {
      data = worksData;
      displayProjects(data);
      updateLogginButton();

      const galleryModal = document.getElementById('gallery-modal');
      data.forEach(project => {
        const projectElement = createProjectElement(project);
        galleryModal.appendChild(projectElement);
      });

      // Suppression des projets au click sur l'icone 

      function attachTrashIcons(){ 
        const galleryModal = document.getElementById('gallery-modal');

        galleryModal.addEventListener('click', (event) => {
          const trashIcon = event.target.closest('.fas.fa-trash-can');
          if (trashIcon) {
            const projectContainer = trashIcon.closest('.project-container');
            const workId = projectContainer.querySelector('.modal-project-image').dataset.id;
    
            if (confirm("Voulez vous supprimer ce projet")) {
              deleteProject(workId);
            }
          }
        });
      }

      attachTrashIcons();
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
      console.log(categories)
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
          const selectedCategory = button.textContent;
          if (selectedCategory === 'Tous') {
            displayProjects(data);
          } else {
            ProjectByCategory(selectedCategory);
          }
        });
      });

      // Récuperation des catégories pour le menu select

      const selectCategory = document.getElementById('category');
      let optionsHTML = '';
      categories.forEach(category => {
        optionsHTML += `<option value="${category.id}">${category.name}</option>`;
      });
      selectCategory.innerHTML = optionsHTML;

    })
    .catch(error => {
      console.error('Error fetching categories:', error);
    });

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
        window.location.href = './index.html';
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
    const filterBtns = document.getElementById('filter-buttons')

    if (isLoggedIn) {
      filterBtns.classList.add('hidden')
      bannerModifier.classList.remove('hidden')
      editGalleryContainer.classList.remove('hidden')
      editImageContainer.classList.remove('hidden')
    } else {
      filterBtns.classList.remove('hidden')
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
  console.log('token', token)

  function deleteProject(workId) {
    console.log('Deleting project with ID:', workId);
    fetch(`http://localhost:5678/api/works/${workId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Échec suppression');
        }

        if (response.status === 204) {
          console.log('Project deleted successfully');

          const projectElementToDelete = document.querySelector(`[data-id="${workId}"]`);
          if (projectElementToDelete) {
            projectElementToDelete.closest('.project').remove();
          }

          fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(updatedData => {
              displayProjects(updatedData); 
            })
            .catch(error => console.error('Error fetching updated data:', error));

      
        } else {
          return response.json();
        }
      })
      .catch(error => console.error('Delete error:', error));
  }

  // Affichage d'un preview de l'image a ajouter 

  function displayImage() {
    const imageInput = document.getElementById('image');
    const icon = document.querySelector('.new-project-image i');
    const label = document.querySelector('.new-project-image label');
    const paragraph = document.querySelector('.new-project-image p');
    const selectedImage = document.getElementById('selectedImage');

    if (imageInput.files.length === 0) {
      icon.classList.remove('hidden');
      label.classList.remove('hidden');
      paragraph.classList.remove('hidden');
      selectedImage.style.display = 'none';
    } else {
      icon.classList.add('hidden');
      label.classList.add('hidden');
      paragraph.classList.add('hidden');
      const selectedFile = imageInput.files[0];
      const imageUrl = URL.createObjectURL(selectedFile);
      selectedImage.src = imageUrl;
      selectedImage.style.display = 'block';
    }
  }

  // Réinitialise l'input afin d'ajouter une nouvelle image 

  function resetImageSelection() {
    const icon = document.querySelector('.new-project-image i');
    const label = document.querySelector('.new-project-image label');
    const paragraph = document.querySelector('.new-project-image p');
    const selectedImage = document.getElementById('selectedImage');
    imageInput.value = '';
    icon.classList.remove('hidden');
    label.classList.remove('hidden');
    paragraph.classList.remove('hidden');
    selectedImage.style.display = 'none';
  }

  const removeSelectedImage = document.querySelector('.new-project-image');
  removeSelectedImage.addEventListener('click', resetImageSelection);

  const imageInput = document.getElementById('image');
  imageInput.addEventListener('change', displayImage);

  // Verification du remplissage des inputs pour activer le bouton d'envoi

  function completeForm() {
    const imageInput = document.getElementById('image');
    const titleInput = document.getElementById('title');
    const categoryInput = document.getElementById('category');

    return imageInput.files[0] && titleInput.value && categoryInput.value;
  }

  const activeSubmitBtn = document.getElementById('submitBtn');
  function enableSubmitBtn() {
    activeSubmitBtn.disabled = !completeForm();
  }

  const newProjectForm = document.getElementById('new-project-form');
  newProjectForm.addEventListener('input', () => {
    enableSubmitBtn();
  });

  newProjectForm.addEventListener('submit', (event) => {
    addNewProject(event, token);
  });

  // Ajout d'un nouveau projet 

  function addNewProject(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const categoryId = document.getElementById('category').value;
    const imageInput = document.getElementById('image');
    const imageFile = imageInput.files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', imageFile, imageFile.name);
    formData.append('category', categoryId);

    fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
      .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error('Failed to add new project');
        }
        return response.json();
      })
      .then(data => {
        console.log('New project added successfully:', data);
        const galleryContainer = document.getElementById('gallery-container');
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = data.imageUrl; 
        img.alt = data.title; 
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = data.title; 
      
  
        figure.appendChild(img);
        figure.appendChild(figcaption);
        galleryContainer.appendChild(figure);

        const newProjectElement = createProjectElement(data);

        const galleryModal = document.getElementById('gallery-modal');
        galleryModal.appendChild(newProjectElement);

        const modalContainer = document.getElementById('first-modal');
        const modalOverlay = document.getElementById('modal-overlay');
        modalContainer.classList.remove('hidden');
        modalOverlay.classList.remove('hidden');
        openSecondModal.classList.add('hidden');
      })
      .catch(error => {
        console.error('Error adding new project:', error);
      });
  }



})