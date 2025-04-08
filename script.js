document.addEventListener("DOMContentLoaded", function () {
  // Inicializar AOS (Animate On Scroll)
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
    mirror: false,
  });

  // Navbar scroll
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Botón de volver arriba
  const backToTopButton = document.getElementById("backToTop");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  });

  backToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Modo oscuro
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;
  const isDarkMode = localStorage.getItem("darkMode") === "enabled";

  if (isDarkMode) {
    body.classList.add("dark-mode");
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  darkModeToggle.addEventListener("click", function () {
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      localStorage.setItem("darkMode", "disabled");
      darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  });

  // Inicializar mapa de Leaflet
  if (document.getElementById("map")) {
    const map = L.map("map").setView([-32.8897, -68.8458], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const hotelIcon = L.icon({
      iconUrl:
        "https://cdn.mapmarker.io/api/v1/pin?size=50&background=%23c8a97e&icon=fa-hotel&color=%23FFFFFF",
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -50],
    });

    L.marker([-32.8897, -68.8458], { icon: hotelIcon })
      .addTo(map)
      .bindPopup(
        "<b>Hotelituss</b><br>Av. Emilio Civit 367<br>Mendoza, Argentina"
      )
      .openPopup();
  }

  // Modales de login y registro
  const loginLink = document.getElementById("loginLink");
  const createUserLink = document.getElementById("createUserLink");
  const switchToLogin = document.getElementById("switchToLogin");
  const switchToCreateUser = document.getElementById("switchToCreateUser");

  if (loginLink) {
    loginLink.addEventListener("click", function (e) {
      e.preventDefault();
      const loginModal = new bootstrap.Modal(
        document.getElementById("loginModal")
      );
      loginModal.show();
    });
  }

  if (createUserLink) {
    createUserLink.addEventListener("click", function (e) {
      e.preventDefault();
      const createUserModal = new bootstrap.Modal(
        document.getElementById("createUserModal")
      );
      createUserModal.show();
    });
  }

  if (switchToLogin) {
    switchToLogin.addEventListener("click", function (e) {
      e.preventDefault();
      const createUserModal = bootstrap.Modal.getInstance(
        document.getElementById("createUserModal")
      );
      createUserModal.hide();
      setTimeout(function () {
        const loginModal = new bootstrap.Modal(
          document.getElementById("loginModal")
        );
        loginModal.show();
      }, 500);
    });
  }

  if (switchToCreateUser) {
    switchToCreateUser.addEventListener("click", function (e) {
      e.preventDefault();
      const loginModal = bootstrap.Modal.getInstance(
        document.getElementById("loginModal")
      );
      loginModal.hide();
      setTimeout(function () {
        const createUserModal = new bootstrap.Modal(
          document.getElementById("createUserModal")
        );
        createUserModal.show();
      }, 500);
    });
  }

  // Verificación de código
  const verificationInputs = document.querySelectorAll('.verification-input');
  if (verificationInputs.length > 0) {
    verificationInputs.forEach((input, index) => {
      input.addEventListener('keyup', (e) => {
        if (e.key >= 0 && e.key <= 9) {
          if (index < verificationInputs.length - 1) {
            verificationInputs[index + 1].focus();
          }
        } else if (e.key === 'Backspace') {
          if (index > 0) {
            verificationInputs[index - 1].focus();
          }
        }
      });
    });
  }

  // Reenvío de código
  const resendCodeBtn = document.getElementById('resendCode');
  const countdownEl = document.getElementById('countdown');
  
  if (resendCodeBtn) {
    resendCodeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Deshabilitar el botón
      this.classList.add('disabled');
      
      // Mostrar cuenta regresiva
      countdownEl.style.display = 'block';
      countdownEl.classList.add('counting');
      
      let seconds = 30;
      countdownEl.textContent = `Podrás reenviar el código en ${seconds} segundos`;
      
      const countdownInterval = setInterval(() => {
        seconds--;
        countdownEl.textContent = `Podrás reenviar el código en ${seconds} segundos`;
        
        if (seconds <= 0) {
          clearInterval(countdownInterval);
          resendCodeBtn.classList.remove('disabled');
          countdownEl.style.display = 'none';
          countdownEl.classList.remove('counting');
        }
      }, 1000);
      
      // Aquí iría la lógica para reenviar el código
      console.log('Código reenviado');
    });
  }

  // Formulario de verificación
  const verificationForm = document.getElementById('verificationForm');
  if (verificationForm) {
    verificationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Recoger el código
      let code = '';
      verificationInputs.forEach(input => {
        code += input.value;
      });
      
      // Aquí iría la validación del código
      if (code === '123456') { // Ejemplo de código válido
        // Redirigir o mostrar mensaje de éxito
        console.log('Código verificado correctamente');
        
        // Cerrar modal de verificación
        const verificationModal = bootstrap.Modal.getInstance(
          document.getElementById('verificationModal')
        );
        if (verificationModal) {
          verificationModal.hide();
        }
      } else {
        // Mostrar error
        document.getElementById('verification-error').style.display = 'block';
      }
    });
  }

  // Formulario de creación de usuario
  const createUserForm = document.getElementById("createUserForm");
  if (createUserForm) {
    createUserForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      // Recoger datos del formulario
      const formData = new FormData(createUserForm);
      const userData = {
        nombre: formData.get('nombre'),
        correo: formData.get('correo'),
        telefono: formData.get('telefono'),
        password: formData.get('password')
      };
      
      // Enviar datos al servidor (simulado)
      console.log('Enviando datos de usuario:', userData);
      
      // Mostrar modal de verificación
      const createUserModal = bootstrap.Modal.getInstance(
        document.getElementById('createUserModal')
      );
      createUserModal.hide();
      
      setTimeout(() => {
        const verificationModal = new bootstrap.Modal(
          document.getElementById('verificationModal')
        );
        verificationModal.show();
      }, 500);
    });
  }

  // Formulario de inicio de sesión
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      // Recoger datos del formulario
      const formData = new FormData(loginForm);
      const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
      };
      
      // Enviar datos al servidor (simulado)
      console.log('Enviando datos de inicio de sesión:', loginData);
      
      // Simulación de inicio de sesión exitoso
      const loginModal = bootstrap.Modal.getInstance(
        document.getElementById('loginModal')
      );
      loginModal.hide();
      
      // Mostrar botón de cerrar sesión y ocultar botones de login/registro
      document.getElementById('logoutBtn').style.display = 'block';
      document.getElementById('loginLink').style.display = 'none';
      document.getElementById('createUserLink').style.display = 'none';
      
      // Guardar estado de sesión
      localStorage.setItem('isLoggedIn', 'true');
    });
  }

  // Botón de cerrar sesión
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      // Ocultar botón de cerrar sesión y mostrar botones de login/registro
      this.style.display = 'none';
      document.getElementById('loginLink').style.display = 'block';
      document.getElementById('createUserLink').style.display = 'block';
      
      // Eliminar estado de sesión
      localStorage.removeItem('isLoggedIn');
    });
  }

  // Verificar si el usuario está logueado al cargar la página
  if (localStorage.getItem('isLoggedIn') === 'true') {
    document.getElementById('logoutBtn').style.display = 'block';
    document.getElementById('loginLink').style.display = 'none';
    document.getElementById('createUserLink').style.display = 'none';
  }
});
