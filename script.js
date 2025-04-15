// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar AOS (Animate On Scroll)
  initAOS()

  // Inicializar el mapa si existe el elemento
  initMap()

  // Configurar el modo oscuro
  setupDarkMode()

  // Configurar el botón de volver arriba
  setupBackToTop()

  // Configurar navegación suave
  setupSmoothScrolling()

  // Configurar modales
  setupModals()

  // Configurar validación de formularios
  setupFormValidation()

  // Inicializar tooltips de Bootstrap
  initTooltips()

  // Configurar animación de contadores
  setupCounterAnimation()

  // Manejar navegación responsiva
  handleResponsiveNav()

  // Detectar scroll para cambiar estilo de navbar
  handleNavbarScroll()

  // Configurar validación de campos específicos
  setupFieldValidation()

  // Gestión de sesión de usuario
  setupUserSession()
  
  // Configurar funcionalidad de código de verificación
  setupVerificationCode()
})

/**
 * Inicializa la biblioteca AOS para animaciones al hacer scroll
 */
function initAOS() {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    })
  } else {
    console.warn("AOS is not defined. Make sure it is properly imported.")
  }
}

/**
 * Inicializa el mapa de Leaflet si existe el elemento en la página
 */
function initMap() {
  // Coordenadas de Avenida Emilio Civit 367, Mendoza, Argentina
  const hotelLatitude = -32.88789
  const hotelLongitude = -68.855

  const mapElement = document.getElementById("map")
  if (mapElement) {
    try {
      if (typeof L !== "undefined") {
        const map = L.map("map").setView([hotelLatitude, hotelLongitude], 15)

        // Agregar capa de OpenStreetMap
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map)

        // Agregar un marcador para el hotel
        const hotelIcon = L.icon({
          iconUrl: "https://cdn.mapmarker.io/api/v1/pin?size=50&background=%23c8a97e&icon=fa-hotel&color=%23FFFFFF",
          iconSize: [50, 50],
          iconAnchor: [25, 50],
          popupAnchor: [0, -50],
        })

        L.marker([hotelLatitude, hotelLongitude], { icon: hotelIcon })
          .addTo(map)
          .bindPopup("<strong>Hotelituss</strong><br>Avenida Emilio Civit 367<br>Mendoza, Argentina")
          .openPopup()

        // Forzar actualización del mapa después de que se cargue completamente
        setTimeout(() => {
          map.invalidateSize()
        }, 500)
      } else {
        console.warn("Leaflet (L) is not defined. Make sure it is properly imported.")
      }
    } catch (error) {
      console.error("Error al inicializar el mapa:", error)
    }
  }
}

/**
 * Configura la funcionalidad del modo oscuro
 */
function setupDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle")

  if (darkModeToggle) {
    // Hacer visible el botón inmediatamente sin esperar ninguna condición
    darkModeToggle.style.opacity = "1"
    darkModeToggle.style.visibility = "visible"

    darkModeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode")
      const icon = this.querySelector("i")

      if (document.body.classList.contains("dark-mode")) {
        icon.classList.remove("fa-moon")
        icon.classList.add("fa-sun")
        localStorage.setItem("darkMode", "enabled")
      } else {
        icon.classList.remove("fa-sun")
        icon.classList.add("fa-moon")
        localStorage.setItem("darkMode", "disabled")
      }
    })

    // Verificar preferencia de modo oscuro guardada
    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode")
      const icon = darkModeToggle.querySelector("i")
      if (icon) {
        icon.classList.remove("fa-moon")
        icon.classList.add("fa-sun")
      }
    }
  }
}

/**
 * Configura el botón de volver arriba
 */
function setupBackToTop() {
  const backToTopButton = document.getElementById("backToTop")

  if (backToTopButton) {
    // Mostrar/ocultar botón según la posición de scroll
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("show")
      } else {
        backToTopButton.classList.remove("show")
      }
    })

    // Acción de volver arriba al hacer clic
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })

    // Verificar posición inicial
    if (window.scrollY > 300) {
      backToTopButton.classList.add("show")
    }
  }
}

/**
 * Configura la navegación suave para enlaces internos
 */
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href")
      if (href !== "#" && document.querySelector(href)) {
        e.preventDefault()
        document.querySelector(href).scrollIntoView({
          behavior: "smooth",
        })
      }
    })
  })
}

/**
 * Configura los modales de inicio de sesión y creación de usuario
 */
function setupModals() {
  // Manejar la apertura del modal de crear usuario
  const createUserLink = document.getElementById("createUserLink")
  if (createUserLink) {
    createUserLink.addEventListener("click", (e) => {
      e.preventDefault()
      if (typeof bootstrap !== "undefined") {
        const createUserModal = new bootstrap.Modal(document.getElementById("createUserModal"))
        createUserModal.show()
      } else {
        console.warn("Bootstrap is not defined. Make sure it is properly imported.")
      }
    })
  }

  // Manejar la apertura del modal de iniciar sesión
  const loginLink = document.getElementById("loginLink")
  if (loginLink) {
    loginLink.addEventListener("click", (e) => {
      e.preventDefault()
      if (typeof bootstrap !== "undefined") {
        const loginModal = new bootstrap.Modal(document.getElementById("loginModal"))
        loginModal.show()
      } else {
        console.warn("Bootstrap is not defined. Make sure it is properly imported.")
      }
    })
  }

  // Cambiar de modal de inicio de sesión a crear usuario
  const switchToCreateUser = document.getElementById("switchToCreateUser")
  if (switchToCreateUser) {
    switchToCreateUser.addEventListener("click", (e) => {
      e.preventDefault()
      if (typeof bootstrap !== "undefined") {
        const loginModal = bootstrap.Modal.getInstance(document.getElementById("loginModal"))
        if (loginModal) {
          loginModal.hide()
          setTimeout(() => {
            const createUserModal = new bootstrap.Modal(document.getElementById("createUserModal"))
            createUserModal.show()
          }, 500)
        }
      } else {
        console.warn("Bootstrap is not defined. Make sure it is properly imported.")
      }
    })
  }

  // Cambiar de modal de crear usuario a inicio de sesión
  const switchToLogin = document.getElementById("switchToLogin")
  if (switchToLogin) {
    switchToLogin.addEventListener("click", (e) => {
      e.preventDefault()
      if (typeof bootstrap !== "undefined") {
        const createUserModal = bootstrap.Modal.getInstance(document.getElementById("createUserModal"))
        if (createUserModal) {
          createUserModal.hide()
          setTimeout(() => {
            const loginModal = new bootstrap.Modal(document.getElementById("loginModal"))
            loginModal.show()
          }, 500)
        }
      } else {
        console.warn("Bootstrap is not defined. Make sure it is properly imported.")
      }
    })
  }
}

/**
 * Configura la validación de formularios
 */
function setupFormValidation() {
  const forms = document.querySelectorAll(".needs-validation")
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add("was-validated")
      },
      false,
    )
  })

  // Validación específica para el formulario de creación de usuario
  const createUserForm = document.getElementById("createUserForm")
  if (createUserForm) {
    createUserForm.addEventListener("submit", function (event) {
      event.preventDefault()
      
      // Check if the form is valid
      if (this.checkValidity()) {
        // Get form data
        const formData = {
          nombre: document.getElementById("userName").value,
          correo: document.getElementById("userEmail").value,
          telefono: document.getElementById("userTelefono").value,
          password: document.getElementById("userPassword").value
        }
        
        // Send data to backend
        sendVerificationCode(formData)
      }
      
      this.classList.add("was-validated")
    })
  }
}

/**
 * Configura la validación de campos específicos (nombre y teléfono)
 */
function setupFieldValidation() {
  // Validación para el campo de nombre (solo letras)
  const nombreInput = document.getElementById("userName")
  if (nombreInput) {
    // Añadir atributos de validación
    nombreInput.setAttribute("pattern", "[A-Za-zÁáÉéÍíÓóÚúÑñs]+")
    nombreInput.setAttribute("title", "Por favor ingrese solo letras")

    // Validar mientras el usuario escribe
    nombreInput.addEventListener("input", function () {
      // Permitir letras, espacios y caracteres acentuados
      this.value = this.value.replace(/[^A-Za-zÁáÉéÍíÓóÚúÑñ\s]/g, "")
    })
  }

  // Validación para el campo de teléfono (solo números)
  const telefonoInput = document.getElementById("userTelefono")
  if (telefonoInput) {
    // Añadir atributos de validación
    telefonoInput.setAttribute("pattern", "[0-9]+")
    telefonoInput.setAttribute("title", "Por favor ingrese solo números")

    // Validar mientras el usuario escribe
    telefonoInput.addEventListener("input", function () {
      // Permitir solo números
      this.value = this.value.replace(/[^0-9]/g, "")
    })
  }
}

/**
 * Inicializa los tooltips de Bootstrap
 */
function initTooltips() {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  if (tooltipTriggerList.length > 0) {
    try {
      if (typeof bootstrap !== "undefined") {
        const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))
      } else {
        console.warn("Bootstrap is not defined. Make sure it is properly imported.")
      }
    } catch (error) {
      console.error("Error al inicializar tooltips:", error)
    }
  }
}

/**
 * Configura la animación de contadores para números
 */
function setupCounterAnimation() {
  // Función para animar contadores
  function animateCounter(el, target) {
    let count = 0
    const speed = 2000 / target // 2 segundos para llegar al objetivo
    const counter = setInterval(() => {
      count++
      el.textContent = count
      if (count >= target) {
        clearInterval(counter)
      }
    }, speed)
  }

  // Iniciar animación cuando el elemento sea visible
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.classList.contains("years")) {
          const targetValue = Number.parseInt(entry.target.textContent) || 0
          if (targetValue > 0) {
            animateCounter(entry.target, targetValue)
            observer.unobserve(entry.target)
          }
        }
      })
    })

    document.querySelectorAll(".years").forEach((el) => {
      observer.observe(el)
    })
  } else {
    // Fallback para navegadores que no soportan IntersectionObserver
    document.querySelectorAll(".years").forEach((el) => {
      const targetValue = Number.parseInt(el.textContent) || 0
      if (targetValue > 0) {
        animateCounter(el, targetValue)
      }
    })
  }
}

/**
 * Maneja la navegación responsiva
 */
function handleResponsiveNav() {
  const navbarToggler = document.querySelector(".navbar-toggler")
  const navbarCollapse = document.querySelector(".navbar-collapse")

  if (navbarToggler && navbarCollapse) {
    // Cerrar menú al hacer clic en un enlace en móvil
    document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 992) {
          try {
            if (typeof bootstrap !== "undefined") {
              const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse)
              if (bsCollapse) {
                bsCollapse.hide()
              }
            } else {
              console.warn("Bootstrap is not defined. Make sure it is properly imported.")
              navbarCollapse.classList.remove("show")
            }
          } catch (error) {
            console.error("Error al cerrar el menú móvil:", error)
            // Fallback manual si bootstrap no está disponible
            navbarCollapse.classList.remove("show")
          }
        }
      })
    })
  }
}

/**
 * Detecta cuando la navbar debe cambiar de estilo al hacer scroll y actualiza el enlace activo
 */
function handleNavbarScroll() {
  const navbar = document.querySelector(".navbar")

  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled")
      } else {
        navbar.classList.remove("scrolled")
      }

      // Actualizar el enlace activo basado en la posición de scroll
      updateActiveNavLink()
    })

    // Aplicar clase inicial según la posición actual
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    }

    // Inicializar el enlace activo
    updateActiveNavLink()
  }
}

/**
 * Actualiza el enlace activo en la navegación basado en la posición de scroll
 */
function updateActiveNavLink() {
  // Obtener todas las secciones
  const sections = document.querySelectorAll("section[id], header[id]")
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link:not(.btn)")

  // Determinar qué sección está actualmente visible
  let currentSection = ""
  const scrollPosition = window.scrollY + 200 // Offset para mejor detección

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id")
    }
  })

  // Actualizar la clase activa en los enlaces de navegación
  navLinks.forEach((link) => {
    link.classList.remove("active")
    const href = link.getAttribute("href")
    if (href === `#${currentSection}`) {
      link.classList.add("active")
    }
  })

  // Si estamos al principio de la página, activar el enlace de inicio
  if (window.scrollY < 100) {
    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === "#inicio") {
        link.classList.add("active")
      }
    })
  }
}

/**
 * Configura la gestión de sesión de usuario
 */
function setupUserSession() {
  const loginLink = document.getElementById("loginLink");
  const createUserLink = document.getElementById("createUserLink");
  const userProfileDropdown = document.getElementById("userProfileDropdown");
  
  // Detectar si viene de un login exitoso con ?logged=true
  const urlParams = new URLSearchParams(window.location.search);
  const loggedIn = urlParams.get("logged");

  if (loggedIn === "true") {
    localStorage.setItem("userLoggedIn", "true");
    // Guardar el email del usuario que se acaba de loguear
    const userEmail = localStorage.getItem("usuarioLogueado");
    if (userEmail) {
      localStorage.setItem("currentUserEmail", userEmail);
    }
    window.history.replaceState({}, document.title, "/"); // Limpiar la URL
  }

  // Mostrar u ocultar elementos según estado
  const isLogged = localStorage.getItem("userLoggedIn") === "true";

  if (isLogged) {
    if (loginLink) loginLink.style.display = "none";
    if (createUserLink) createUserLink.style.display = "none";
    if (userProfileDropdown) userProfileDropdown.style.display = "block";
    
    // Cargar datos del usuario
    loadUserData();
  } else {
    if (loginLink) loginLink.style.display = "block";
    if (createUserLink) createUserLink.style.display = "block";
    if (userProfileDropdown) userProfileDropdown.style.display = "none";
  }

  // Función para cerrar sesión
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("userLoggedIn");
      localStorage.removeItem("currentUserEmail");
      localStorage.removeItem("currentUserData");
      window.location.reload(); // Refresca la página
    });
  }
}

/**
 * Carga los datos del usuario desde el backend
 */
function loadUserData() {
  const userEmail = localStorage.getItem("currentUserEmail") || localStorage.getItem("usuarioLogueado");
  
  if (!userEmail) return;
  
  // Intentar cargar datos del localStorage primero (para no hacer peticiones innecesarias)
  const cachedUserData = localStorage.getItem("currentUserData");
  if (cachedUserData) {
    try {
      const userData = JSON.parse(cachedUserData);
      updateUserProfileUI(userData);
      return;
    } catch (e) {
      console.error("Error al parsear datos de usuario en caché:", e);
    }
  }
  
  // Si no hay datos en caché o hay error, cargar desde el backend
  fetch(`${backendBaseUrl}/get-user-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo: userEmail }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al obtener datos del usuario");
      }
      return response.json();
    })
    .then(data => {
      if (data && data.success) {
        // Guardar datos en localStorage para futuras cargas
        localStorage.setItem("currentUserData", JSON.stringify(data.user));
        updateUserProfileUI(data.user);
      }
    })
    .catch(error => {
      console.error("Error al cargar datos del usuario:", error);
      // Si hay error, mostrar datos genéricos
      updateUserProfileUI({
        nombre: "Usuario",
        correo: userEmail
      });
    });
}

/**
 * Actualiza la interfaz del perfil de usuario con los datos cargados
 */
function updateUserProfileUI(userData) {
  // Actualizar nombre en el botón del dropdown
  const userDisplayName = document.getElementById("userDisplayName");
  if (userDisplayName) {
    userDisplayName.textContent = userData.nombre || "Usuario";
  }
  
  // Actualizar datos en el menú desplegable
  const userFullName = document.getElementById("userFullName");
  if (userFullName) {
    userFullName.textContent = userData.nombre || "Usuario";
  }
  
  const userEmail = document.getElementById("userEmail");
  if (userEmail) {
    userEmail.textContent = userData.correo || "";
  }
}

/**
 * Configura la funcionalidad de entrada del código de verificación
 */
function setupVerificationCode() {
  const verificationInputs = document.querySelectorAll('.verification-input');
  
  if (verificationInputs.length > 0) {
    // Auto-focus next input when a digit is entered
    verificationInputs.forEach((input, index) => {
      input.addEventListener('input', function() {
        if (this.value.length === 1) {
          if (index < verificationInputs.length - 1) {
            verificationInputs[index + 1].focus();
          }
        }
      });
      
      // Handle backspace to go to previous input
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && !this.value && index > 0) {
          verificationInputs[index - 1].focus();
        }
      });
    });
  }
  
  // Handle verification form submission
  const verificationForm = document.getElementById('verificationForm');
  if (verificationForm) {
    verificationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get the code from all inputs
      let code = '';
      verificationInputs.forEach(input => {
        code += input.value;
      });
      
      // Get the email from the stored data
      const userEmail = localStorage.getItem('pendingVerificationEmail');
      
      if (code.length === 6 && userEmail) {
        verifyCode(userEmail, code);
      } else {
        document.getElementById('verification-error').style.display = 'block';
      }
    });
  }
  
  // Handle resend code button
  const resendCodeBtn = document.getElementById('resendCode');
  if (resendCodeBtn) {
    resendCodeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the stored user data
      const userData = JSON.parse(localStorage.getItem('pendingUserData'));
      
      if (userData) {
        // Disable the button and show countdown
        this.style.pointerEvents = 'none';
        this.style.opacity = '0.5';
        
        const countdownEl = document.getElementById('countdown');
        countdownEl.style.display = 'block';
        
        let seconds = 60;
        countdownEl.textContent = `Podrás solicitar un nuevo código en ${seconds} segundos`;
        
        const countdownInterval = setInterval(() => {
          seconds--;
          countdownEl.textContent = `Podrás solicitar un nuevo código en ${seconds} segundos`;
          
          if (seconds <= 0) {
            clearInterval(countdownInterval);
            this.style.pointerEvents = 'auto';
            this.style.opacity = '1';
            countdownEl.style.display = 'none';
          }
        }, 1000);
        
        // Resend the verification code
        sendVerificationCode(userData);
      }
    });
  }
}

/**
 * Envía el código de verificación al correo electrónico del usuario
 * @param {Object} userData - Datos del usuario incluyendo nombre, correo, teléfono y contraseña
 */
function sendVerificationCode(userData) {
  // Backend URL
  const backendBaseUrl = "https://hotelitus.onrender.com";
  
  // Store user data for later use
  localStorage.setItem('pendingUserData', JSON.stringify(userData));
  localStorage.setItem('pendingVerificationEmail', userData.correo);
  
  // Send request to backend
  fetch(`${backendBaseUrl}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        // Show verification modal
        if (typeof bootstrap !== "undefined") {
          // Hide create user modal if it's open
          const createUserModal = bootstrap.Modal.getInstance(document.getElementById("createUserModal"));
          if (createUserModal) {
            createUserModal.hide();
          }
          
          // Show verification modal
          setTimeout(() => {
            const verificationModal = new bootstrap.Modal(document.getElementById("verificationModal"));
            verificationModal.show();
            
            // Focus on first input
            document.querySelector('.verification-input').focus();
          }, 500);
        }
      } else {
        alert("Error al enviar el código de verificación. Por favor, inténtelo de nuevo.");
      }
    })
    .catch((error) => {
      console.error("Error al enviar datos:", error);
      alert("Error al enviar el código de verificación. Por favor, inténtelo de nuevo.");
    });
}

/**
 * Verifica el código ingresado por el usuario
 * @param {string} email - Correo electrónico del usuario
 * @param {string} code - Código de verificación ingresado por el usuario
 */
function verifyCode(email, code) {
  // Backend URL
  const backendBaseUrl = "https://hotelitus.onrender.com";
  
  // Send verification request
  fetch(`${backendBaseUrl}/verify-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo: email, codigo: code }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        // Hide verification modal
        if (typeof bootstrap !== "undefined") {
          const verificationModal = bootstrap.Modal.getInstance(document.getElementById("verificationModal"));
          if (verificationModal) {
            verificationModal.hide();
          }
        }
        
        // Clear stored data
        localStorage.removeItem('pendingUserData');
        localStorage.removeItem('pendingVerificationEmail');
        
        // Show success message and redirect to login
        alert("¡Cuenta creada con éxito! Ahora puede iniciar sesión.");
        
        // Show login modal
        setTimeout(() => {
          if (typeof bootstrap !== "undefined") {
            const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
            loginModal.show();
          }
        }, 500);
      } else {
        // Show error message
        document.getElementById('verification-error').style.display = 'block';
      }
    })
    .catch((error) => {
      console.error("Error al verificar código:", error);
      document.getElementById('verification-error').style.display = 'block';
    });
}

// URL base del backend en Render
const backendBaseUrl = "https://hotelitus.onrender.com"

// Función para crear una nueva reserva (POST)
function createReserva(data) {
  fetch(`${backendBaseUrl}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("✅ Reserva creada:", result)
      alert("Reserva creada con éxito.")
    })
    .catch((error) => {
      console.error("❌ Error al crear la reserva:", error)
      alert("Error al crear la reserva.")
    })
}

// Función para obtener todas las reservas (GET)
function getReservas() {
  fetch(`${backendBaseUrl}/select`)
    .then((response) => response.json())
    .then((data) => {
      console.log("📋 Reservas obtenidas:", data)
      // TODO: mostrar los datos en una tabla o lista en el DOM
    })
    .catch((error) => {
      console.error("❌ Error al obtener reservas:", error)
      alert("Error al obtener reservas.")
    })
}

// Función para actualizar una reserva (GET con query params)
function updateReserva(id, nuevoNombre) {
  fetch(`${backendBaseUrl}/update?id=${id}&nombre=${nuevoNombre}`)
    .then((response) => response.json())
    .then((result) => {
      console.log("🔄 Reserva actualizada:", result)
      alert("Reserva actualizada correctamente.")
    })
    .catch((error) => {
      console.error("❌ Error al actualizar reserva:", error)
      alert("Error al actualizar la reserva.")
    })
}

// Función para eliminar una reserva (GET con query param)
function deleteReserva(id) {
  fetch(`${backendBaseUrl}/delete?id=${id}`)
    .then((response) => response.json())
    .then((result) => {
      console.log("🗑️ Reserva eliminada:", result)
      alert("Reserva eliminada correctamente.")
    })
    .catch((error) => {
      console.error("❌ Error al eliminar reserva:", error)
      alert("Error al eliminar la reserva.")
    })
}

// Implementación mejorada del inicio de sesión con manejo de errores
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Mostrar indicador de carga
      const submitBtn = this.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...'
      submitBtn.disabled = true

      // Ocultar mensajes de error previos
      const errorMsg = document.getElementById("loginErrorMsg")
      if (errorMsg) {
        errorMsg.classList.add("d-none")
      }

      // Obtener datos del formulario
      const email = document.getElementById("loginEmail").value
      const password = document.getElementById("loginPassword").value

      // Usar fetch para enviar los datos al backend
      fetch(`${backendBaseUrl}/sesion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`)
          }
          return response.json()
        })
        .then(data => {
          // Éxito - guardar estado de sesión y email del usuario
          localStorage.setItem("userLoggedIn", "true")
          localStorage.setItem("usuarioLogueado", email)
          localStorage.setItem("currentUserEmail", email)
          
          // Mantener al usuario en la misma página con parámetro logged=true
          window.location.href = window.location.origin + "/?logged=true"
        })
        .catch(error => {
          console.error("Error en inicio de sesión:", error)
          
          // Mostrar mensaje de error
          if (errorMsg) {
            errorMsg.classList.remove("d-none")
            errorMsg.textContent = "Error al iniciar sesión. Por favor, verifica tus credenciales."
          }
          
          // Restaurar botón
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false
        })
    })
  }
})

/**
 * Configura el sistema de gestión de reservas
 */
function setupReservationSystem() {
  const reservationForm = document.getElementById("reservationForm");
  const loginRequiredAlert = document.getElementById("loginRequiredAlert");
  const loginFromReservation = document.getElementById("loginFromReservation");
  const myReservationsLink = document.getElementById("myReservationsLink");
  
  // Verificar si el usuario está logueado al cargar el formulario de reservas
  if (reservationForm) {
    const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
    
    // Mostrar alerta si no está logueado
    if (!isLoggedIn && loginRequiredAlert) {
      loginRequiredAlert.classList.remove("d-none");
    }
    
    // Manejar envío del formulario de reservas
    reservationForm.addEventListener("submit", function(e) {
      e.preventDefault();
      
      // Verificar si el usuario está logueado
      if (localStorage.getItem("userLoggedIn") !== "true") {
        loginRequiredAlert.classList.remove("d-none");
        // Hacer scroll a la alerta
        loginRequiredAlert.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      
      // Obtener datos del formulario
      const formData = {
        checkIn: document.getElementById("checkIn").value,
        checkOut: document.getElementById("checkOut").value,
        roomType: document.getElementById("roomType").value,
        guests: document.getElementById("guests").value,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        specialRequests: document.getElementById("specialRequests").value,
        userId: localStorage.getItem("currentUserEmail")
      };
      
      // Validar datos
      if (!formData.checkIn || !formData.checkOut || !formData.roomType || !formData.guests) {
        alert("Por favor, complete todos los campos obligatorios.");
        return;
      }
      
      // Enviar reserva al backend
      submitReservation(formData);
    });
  }
  
  // Configurar enlace para iniciar sesión desde la alerta de reserva
  if (loginFromReservation) {
    loginFromReservation.addEventListener("click", function(e) {
      e.preventDefault();
      
      if (typeof bootstrap !== "undefined") {
        const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
        loginModal.show();
      }
    });
  }
  
  // Configurar enlace para ver mis reservas
  if (myReservationsLink) {
    myReservationsLink.addEventListener("click", function(e) {
      e.preventDefault();
      
      if (typeof bootstrap !== "undefined") {
        const myReservationsModal = new bootstrap.Modal(document.getElementById("myReservationsModal"));
        myReservationsModal.show();
        
        // Cargar las reservas del usuario
        loadUserReservations();
      }
    });
  }
}

/**
 * Envía una reserva al backend
 * @param {Object} reservationData - Datos de la reserva
 */
function submitReservation(reservationData) {
  // Mostrar indicador de carga
  const submitBtn = document.querySelector("#reservationForm button[type='submit']");
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
  submitBtn.disabled = true;
  
  // Preparar datos para el backend
  const backendData = {
    fecha_inicio: reservationData.checkIn,
    fecha_fin: reservationData.checkOut,
    habitacion_tipo: getRoomTypeId(reservationData.roomType),
    huespedes: reservationData.guests,
    solicitudes_especiales: reservationData.specialRequests || "",
    correo: localStorage.getItem("currentUserEmail"),
    estado: "confirmada"
  };
  
  // Enviar al backend
  fetch(`${backendBaseUrl}/crear-reserva`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(backendData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      // Éxito
      alert("¡Reserva realizada con éxito!");
      
      // Limpiar formulario
      document.getElementById("reservationForm").reset();
      
      // Restaurar botón
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    })
    .catch(error => {
      console.error("Error al realizar la reserva:", error);
      alert("Error al realizar la reserva. Por favor, inténtelo de nuevo.");
      
      // Restaurar botón
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    });
}

/**
 * Obtiene el ID del tipo de habitación según su valor en el select
 * @param {string} roomType - Valor del select de tipo de habitación
 * @returns {number} - ID del tipo de habitación
 */
function getRoomTypeId(roomType) {
  const roomTypes = {
    "individual": 1,
    "doble": 2,
    "suite": 3
  };
  
  return roomTypes[roomType] || 1;
}

/**
 * Carga las reservas del usuario actual
 */
function loadUserReservations() {
  const userEmail = localStorage.getItem("currentUserEmail");
  
  if (!userEmail) {
    console.error("No hay usuario logueado");
    return;
  }
  
  // Mostrar indicador de carga
  document.getElementById("reservationsLoading").classList.remove("d-none");
  document.getElementById("noReservationsMessage").classList.add("d-none");
  document.getElementById("reservationsList").classList.add("d-none");
  
  // Obtener reservas del backend
  fetch(`${backendBaseUrl}/mis-reservas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo: userEmail }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      // Ocultar indicador de carga
      document.getElementById("reservationsLoading").classList.add("d-none");
      
      if (data.reservas && data.reservas.length > 0) {
        // Mostrar lista de reservas
        document.getElementById("reservationsList").classList.remove("d-none");
        
        // Llenar tabla con reservas
        renderReservations(data.reservas);
      } else {
        // Mostrar mensaje de no reservas
        document.getElementById("noReservationsMessage").classList.remove("d-none");
      }
    })
    .catch(error => {
      console.error("Error al cargar reservas:", error);
      
      // Ocultar indicador de carga
      document.getElementById("reservationsLoading").classList.add("d-none");
      
      // Mostrar mensaje de error
      document.getElementById("noReservationsMessage").classList.remove("d-none");
      document.getElementById("noReservationsMessage").innerHTML = `
        <div class="service-icon mb-3 text-danger">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <h5>Error al cargar las reservas</h5>
        <p>Ha ocurrido un problema al intentar cargar tus reservas. Por favor, inténtalo de nuevo más tarde.</p>
      `;
    });
}

/**
 * Renderiza las reservas en la tabla
 * @param {Array} reservas - Array de objetos de reserva
 */
function renderReservations(reservas) {
  const tableBody = document.getElementById("reservationsTableBody");
  tableBody.innerHTML = "";
  
  // Mapeo de tipos de habitación
  const roomTypeNames = {
    1: "Habitación Individual",
    2: "Habitación Doble",
    3: "Suite Ejecutiva"
  };
  
  // Mapeo de estados
  const statusClasses = {
    "confirmada": "bg-success",
    "pendiente": "bg-warning",
    "cancelada": "bg-danger"
  };
  
  reservas.forEach(reserva => {
    // Formatear fechas
    const fechaInicio = new Date(reserva.fecha_inicio).toLocaleDateString('es-ES');
    const fechaFin = new Date(reserva.fecha_fin).toLocaleDateString('es-ES');
    
    // Crear fila
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${fechaInicio}</td>
      <td>${fechaFin}</td>
      <td>${roomTypeNames[reserva.habitacion_id] || "Habitación"}</td>
      <td>${reserva.huespedes || "1"}</td>
      <td><span class="badge ${statusClasses[reserva.estado] || "bg-secondary"}">${reserva.estado || "pendiente"}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-primary view-reservation" data-id="${reserva.id}">
          <i class="fas fa-eye"></i>
        </button>
        ${reserva.estado !== "cancelada" ? `
          <button class="btn btn-sm btn-outline-danger cancel-reservation" data-id="${reserva.id}">
            <i class="fas fa-times"></i>
          </button>
        ` : ''}
      </td>
    `;
    
    tableBody.appendChild(row);
  });
  
  // Configurar botones de acción
  setupReservationActions();
}

/**
 * Configura las acciones para los botones de la tabla de reservas
 */
function setupReservationActions() {
  // Botones para ver detalles
  document.querySelectorAll(".view-reservation").forEach(button => {
    button.addEventListener("click", function() {
      const reservationId = this.getAttribute("data-id");
      alert(`Ver detalles de la reserva ${reservationId}`);
      // Aquí se podría implementar un modal con los detalles completos
    });
  });
  
  // Botones para cancelar reserva
  document.querySelectorAll(".cancel-reservation").forEach(button => {
    button.addEventListener("click", function() {
      const reservationId = this.getAttribute("data-id");
      
      if (confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
        cancelReservation(reservationId);
      }
    });
  });
}

/**
 * Cancela una reserva
 * @param {string} reservationId - ID de la reserva a cancelar
 */
function cancelReservation(reservationId) {
  fetch(`${backendBaseUrl}/cancelar-reserva`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: reservationId }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        alert("Reserva cancelada con éxito");
        // Recargar las reservas
        loadUserReservations();
      } else {
        alert("No se pudo cancelar la reserva");
      }
    })
    .catch(error => {
      console.error("Error al cancelar la reserva:", error);
      alert("Error al cancelar la reserva. Por favor, inténtelo de nuevo.");
    });
}

// Añadir la inicialización del sistema de reservas al DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Mantener las inicializaciones existentes
  initAOS();
  initMap();
  setupDarkMode();
  setupBackToTop();
  setupSmoothScrolling();
  setupModals();
  setupFormValidation();
  initTooltips();
  setupCounterAnimation();
  handleResponsiveNav();
  handleNavbarScroll();
  setupFieldValidation();
  setupUserSession();
  setupVerificationCode();
  
  // Añadir la inicialización del sistema de reservas
  setupReservationSystem();
});
