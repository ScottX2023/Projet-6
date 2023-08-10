document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('login-form');
    
    // Envoi des identifiants de connexion

    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const userData = {
        email: formData.get('username'),
        password: formData.get('password'),
      };
  
      console.log('userData:', userData);
  
      fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
        .then((response) => {
          console.log('Response status:', response.status);
          if (!response.ok) {
            throw new Error('Invalid username or password');
          }
          return response.json();
        })
        .then((data) => {
            // Récupération du token d'identification et rediréction si token valide 
          console.log('Data from response:', data);
          localStorage.setItem('token', data.token);
          localStorage.setItem('isLoggedIn', 'true');
          window.location.href = './index.html';
        })
        .catch((error) => {
          console.error(error);
          const errorMessage = document.createElement('p');
          errorMessage.textContent = 'Invalid username or password';
          loginForm.appendChild(errorMessage);
        });
    });
  });
  