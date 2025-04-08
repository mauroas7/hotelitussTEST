// URL base del backend
const backendBaseUrl = "https://hotelitus.onrender.com"

// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar AOS (Animate On Scroll)
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    })
  }

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

  // Configurar formulario de reserva
  setupReservationForm()

  // Configurar modal de Mis Reservas
  setupMyReservationsModal()
})

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
          password: document.getElementById("userPassword").value,
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
  const loginLink = document.getElementById("loginLink")
  const createUserLink = document.getElementById("createUserLink")
  const userProfileDropdown = document.getElementById("userProfileDropdown")

  // Detectar si viene de un login exitoso con ?logged=true
  const urlParams = new URLSearchParams(window.location.search)
  const loggedIn = urlParams.get("logged")

  if (loggedIn === "true") {
    localStorage.setItem("userLoggedIn", "true")
    // Guardar el email del usuario que se acaba de loguear
    const userEmail = localStorage.getItem("usuarioLogueado")
    if (userEmail) {
      localStorage.setItem("currentUserEmail", userEmail)
    }
    window.history.replaceState({}, document.title, "/") // Limpiar la URL
  }

  // Mostrar u ocultar elementos según estado
  const isLogged = localStorage.getItem("userLoggedIn") === "true"

  if (isLogged) {
    if (loginLink) loginLink.style.display = "none"
    if (createUserLink) createUserLink.style.display = "none"
    if (userProfileDropdown) userProfileDropdown.style.display = "block"

    // Cargar datos del usuario
    loadUserData()

    // Actualizar enlace de Mis Reservas
    const misReservasLink = document.querySelector(".dropdown-item[href='#mis-reservas']")
    if (misReservasLink) {
      misReservasLink.setAttribute("data-bs-toggle", "modal")
      misReservasLink.setAttribute("data-bs-target", "#myReservationsModal")
    }
  } else {
    if (loginLink) loginLink.style.display = "block"
    if (createUserLink) createUserLink.style.display = "block"
    if (userProfileDropdown) userProfileDropdown.style.display = "none"
  }

  // Función para cerrar sesión
  const logoutLink = document.getElementById("logoutLink")
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault()
      localStorage.removeItem("userLoggedIn")
      localStorage.removeItem("currentUserEmail")
      localStorage.removeItem("currentUserData")
      window.location.reload() // Refresca la página
    })
  }
}

/**
 * Carga los datos del usuario desde el backend
 */
function loadUserData() {
  const userEmail = localStorage.getItem("currentUserEmail") || localStorage.getItem("usuarioLogueado")

  if (!userEmail) return

  // Intentar cargar datos del localStorage primero (para no hacer peticiones innecesarias)
  const cachedUserData = localStorage.getItem("currentUserData")
  if (cachedUserData) {
    try {
      const userData = JSON.parse(cachedUserData)
      updateUserProfileUI(userData)
      return
    } catch (e) {
      console.error("Error al parsear datos de usuario en caché:", e)
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
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener datos del usuario")
      }
      return response.json()
    })
    .then((data) => {
      if (data && data.success) {
        // Guardar datos en localStorage para futuras cargas
        localStorage.setItem("currentUserData", JSON.stringify(data.user))
        updateUserProfileUI(data.user)
      }
    })
    .catch((error) => {
      console.error("Error al cargar datos del usuario:", error)
      // Si hay error, mostrar datos genéricos
      updateUserProfileUI({
        nombre: "Usuario",
        correo: userEmail,
      })
    })
}

/**
 * Actualiza la interfaz del perfil de usuario con los datos cargados
 */
function updateUserProfileUI(userData) {
  // Actualizar nombre en el botón del dropdown
  const userDisplayName = document.getElementById("userDisplayName")
  if (userDisplayName) {
    userDisplayName.textContent = userData.nombre || "Usuario"
  }

  // Actualizar datos en el menú desplegable
  const userFullName = document.getElementById("userFullName")
  if (userFullName) {
    userFullName.textContent = userData.nombre || "Usuario"
  }

  const userEmail = document.getElementById("userEmail")
  if (userEmail) {
    userEmail.textContent = userData.correo || ""
  }
}

/**
 * Configura la funcionalidad de entrada del código de verificación
 */
function setupVerificationCode() {
  const verificationInputs = document.querySelectorAll(".verification-input")

  if (verificationInputs.length > 0) {
    // Auto-focus next input when a digit is entered
    verificationInputs.forEach((input, index) => {
      input.addEventListener("input", function () {
        if (this.value.length === 1) {
          if (index < verificationInputs.length - 1) {
            verificationInputs[index + 1].focus()
          }
        }
      })

      // Handle backspace to go to previous input
      input.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" && !this.value && index > 0) {
          verificationInputs[index - 1].focus()
        }
      })
    })
  }

  // Handle verification form submission
  const verificationForm = document.getElementById("verificationForm")
  if (verificationForm) {
    verificationForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get the code from all inputs
      let code = ""
      verificationInputs.forEach((input) => {
        code += input.value
      })

      // Get the email from the stored data
      const userEmail = localStorage.getItem("pendingVerificationEmail")

      if (code.length === 6 && userEmail) {
        verifyCode(userEmail, code)
      } else {
        document.getElementById("verification-error").style.display = "block"
      }
    })
  }

  // Handle resend code button
  const resendCodeBtn = document.getElementById("resendCode")
  if (resendCodeBtn) {
    resendCodeBtn.addEventListener("click", function (e) {
      e.preventDefault()

      // Get the stored user data
      const userData = JSON.parse(localStorage.getItem("pendingUserData"))

      if (userData) {
        // Disable the button and show countdown
        this.style.pointerEvents = "none"
        this.style.opacity = "0.5"

        const countdownEl = document.getElementById("countdown")
        countdownEl.style.display = "block"

        let seconds = 60
        countdownEl.textContent = `Podrás solicitar un nuevo código en ${seconds} segundos`

        const countdownInterval = setInterval(() => {
          seconds--
          countdownEl.textContent = `Podrás solicitar un nuevo código en ${seconds} segundos`

          if (seconds <= 0) {
            clearInterval(countdownInterval)
            this.style.pointerEvents = "auto"
            this.style.opacity = "1"
            countdownEl.style.display = "none"
          }
        }, 1000)

        // Resend the verification code
        sendVerificationCode(userData)
      }
    })
  }
}

/**
 * Envía el código de verificación al correo electrónico del usuario
 * @param {Object} userData - Datos del usuario incluyendo nombre, correo, teléfono y contraseña
 */
function sendVerificationCode(userData) {
  // Store user data for later use
  localStorage.setItem("pendingUserData", JSON.stringify(userData))
  localStorage.setItem("pendingVerificationEmail", userData.correo)

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
          const createUserModal = bootstrap.Modal.getInstance(document.getElementById("createUserModal"))
          if (createUserModal) {
            createUserModal.hide()
          }

          // Show verification modal
          setTimeout(() => {
            const verificationModal = new bootstrap.Modal(document.getElementById("verificationModal"))
            verificationModal.show()

            // Focus on first input
            document.querySelector(".verification-input").focus()
          }, 500)
        }
      } else {
        alert("Error al enviar el código de verificación. Por favor, inténtelo de nuevo.")
      }
    })
    .catch((error) => {
      console.error("Error al enviar datos:", error)
      alert("Error al enviar el código de verificación. Por favor, inténtelo de nuevo.")
    })
}

/**
 * Verifica el código ingresado por el usuario
 * @param {string} email - Correo electrónico del usuario
 * @param {string} code - Código de verificación ingresado por el usuario
 */
function verifyCode(email, code) {
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
          const verificationModal = bootstrap.Modal.getInstance(document.getElementById("verificationModal"))
          if (verificationModal) {
            verificationModal.hide()
          }
        }

        // Clear stored data
        localStorage.removeItem("pendingUserData")
        localStorage.removeItem("pendingVerificationEmail")

        // Show success message and redirect to login
        alert("¡Cuenta creada con éxito! Ahora puede iniciar sesión.")

        // Show login modal
        setTimeout(() => {
          if (typeof bootstrap !== "undefined") {
            const loginModal = new bootstrap.Modal(document.getElementById("loginModal"))
            loginModal.show()
          }
        }, 500)
      } else {
        // Show error message
        document.getElementById("verification-error").style.display = "block"
      }
    })
    .catch((error) => {
      console.error("Error al verificar código:", error)
      document.getElementById("verification-error").style.display = "block"
    })
}

// Implementación mejorada del inicio de sesión con manejo de errores
function setupLoginForm() {
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
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`)
          }
          return response.json()
        })
        .then((data) => {
          // Éxito - guardar estado de sesión y email del usuario
          localStorage.setItem("userLoggedIn", "true")
          localStorage.setItem("usuarioLogueado", email)
          localStorage.setItem("currentUserEmail", email)

          // Redirigir a la página principal con parámetro logged=true
          window.location.href = "/?logged=true"
        })
        .catch((error) => {
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
}

// Función para obtener el nombre del tipo de habitación
function getRoomTypeName(roomTypeId) {
  switch (Number.parseInt(roomTypeId)) {
    case 1:
      return "Habitación Individual"
    case 2:
      return "Habitación Doble"
    case 3:
      return "Suite Ejecutiva"
    default:
      return "Habitación"
  }
}

// Función para obtener el precio de la habitación
function getRoomPrice(roomTypeId) {
  switch (Number.parseInt(roomTypeId)) {
    case 1:
      return 120
    case 2:
      return 180
    case 3:
      return 280
    default:
      return 0
  }
}

// Función para formatear fecha
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString("es-ES", options)
}

// Función para capitalizar la primera letra
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Función para manejar el formulario de reserva
function setupReservationForm() {
  const reservationForm = document.querySelector(".reservation-form")

  if (reservationForm) {
    reservationForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Check if user is logged in
      const isLoggedIn = localStorage.getItem("userLoggedIn") === "true"

      if (!isLoggedIn) {
        // Show login modal if user is not logged in
        if (typeof bootstrap !== "undefined") {
          const loginModal = new bootstrap.Modal(document.getElementById("loginModal"))
          loginModal.show()

          // Add message to login modal
          const loginModalContent = document.querySelector("#loginModal .modal-body")
          const loginMessage = document.createElement("div")
          loginMessage.className = "alert alert-info mb-3"
          loginMessage.innerHTML = "Debes iniciar sesión para realizar una reserva."

          // Insert at the beginning of modal body
          loginModalContent.insertBefore(loginMessage, loginModalContent.firstChild)
        }
        return
      }

      // Get form data
      const checkIn = document.getElementById("checkIn").value
      const checkOut = document.getElementById("checkOut").value
      const roomTypeSelect = document.getElementById("roomType")
      const roomType = roomTypeSelect.value
      const guests = document.getElementById("guests").value
      const specialRequests = document.getElementById("specialRequests").value

      // Map room type to ID
      let habitacionTipo = 1
      if (roomType === "individual") habitacionTipo = 1
      if (roomType === "doble") habitacionTipo = 2
      if (roomType === "suite") habitacionTipo = 3

      // Get user data from localStorage
      const userEmail = localStorage.getItem("currentUserEmail") || localStorage.getItem("usuarioLogueado")
      let userName = "Usuario"

      // Try to get user name from localStorage
      const cachedUserData = localStorage.getItem("currentUserData")
      if (cachedUserData) {
        try {
          const userData = JSON.parse(cachedUserData)
          userName = userData.nombre || "Usuario"
        } catch (e) {
          console.error("Error parsing user data:", e)
        }
      }

      // Create reservation data
      const reservationData = {
        nombre: userName,
        correo: userEmail,
        fecha_inicio: checkIn,
        fecha_fin: checkOut,
        habitacion_tipo: habitacionTipo,
        huespedes: guests,
        solicitudes_especiales: specialRequests,
        estado: "confirmada",
      }

      // Show loading spinner
      const submitBtn = document.querySelector(".reservation-form button[type='submit']")
      const originalBtnText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...'
      submitBtn.disabled = true

      // Send reservation to server
      fetch(`${backendBaseUrl}/reservar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al crear la reserva")
          }
          return response.json()
        })
        .then((result) => {
          // Show success message
          showReservationConfirmation(reservationData)

          // Reset form
          reservationForm.reset()
        })
        .catch((error) => {
          console.error("Error al crear la reserva:", error)
          alert("Ha ocurrido un error al crear la reserva. Por favor, inténtalo de nuevo.")
        })
        .finally(() => {
          // Restore button
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false
        })
    })
  }
}

// Función para mostrar confirmación de reserva
function showReservationConfirmation(data) {
  // Create modal for confirmation
  const modalHTML = `
    <div class="modal fade" id="reservationConfirmationModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">¡Reserva Confirmada!</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <div class="confirmation-icon mb-4">
              <i class="fas fa-check-circle text-success" style="font-size: 4rem;"></i>
            </div>
            <h4>Gracias por tu reserva</h4>
            <p>Hemos recibido tu solicitud de reserva correctamente.</p>
            <div class="reservation-details mt-4 text-start">
              <p><strong>Fecha de entrada:</strong> ${formatDate(data.fecha_inicio)}</p>
              <p><strong>Fecha de salida:</strong> ${formatDate(data.fecha_fin)}</p>
              <p><strong>Tipo de habitación:</strong> ${getRoomTypeName(data.habitacion_tipo)}</p>
              <p><strong>Número de huéspedes:</strong> ${data.huespedes}</p>
            </div>
            <p class="mt-4">Puedes ver los detalles de tu reserva en la sección "Mis reservas" de tu perfil.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <a href="#" id="viewReservationsBtn" class="btn btn-primary">Ver mis reservas</a>
          </div>
        </div>
      </div>
    </div>
  `

  // Add modal to body
  const modalContainer = document.createElement("div")
  modalContainer.innerHTML = modalHTML
  document.body.appendChild(modalContainer)

  // Show modal
  const confirmationModal = new bootstrap.Modal(document.getElementById("reservationConfirmationModal"))
  confirmationModal.show()

  // Add event listener to "View Reservations" button
  document.getElementById("viewReservationsBtn").addEventListener("click", (e) => {
    e.preventDefault()
    confirmationModal.hide()

    // Open My Reservations modal
    setTimeout(() => {
      const myReservationsModal = new bootstrap.Modal(document.getElementById("myReservationsModal"))
      myReservationsModal.show()
      loadUserReservations()
    }, 500)
  })
}

// Configurar el modal de Mis Reservas
function setupMyReservationsModal() {
  // Add event listener to load reservations when modal is shown
  const reservationsModalElement = document.getElementById("myReservationsModal")
  if (reservationsModalElement) {
    reservationsModalElement.addEventListener("show.bs.modal", loadUserReservations)

    // Add event listener to retry button
    const retryButton = document.getElementById("retryLoadReservations")
    if (retryButton) {
      retryButton.addEventListener("click", loadUserReservations)
    }
  }
}

// Función para cargar las reservas del usuario
function loadUserReservations() {
  // Show loading state
  document.getElementById("reservationsLoading").style.display = "block"
  document.getElementById("reservationsEmpty").style.display = "none"
  document.getElementById("reservationsError").style.display = "none"
  document.getElementById("reservationsContainer").style.display = "none"

  // Get user email
  const userEmail = localStorage.getItem("currentUserEmail") || localStorage.getItem("usuarioLogueado")

  if (!userEmail) {
    showReservationsError()
    return
  }

  // Fetch user reservations
  fetch(`${backendBaseUrl}/mis-reservas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo: userEmail }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al cargar las reservas")
      }
      return response.json()
    })
    .then((data) => {
      if (data.success && data.reservas && data.reservas.length > 0) {
        displayReservations(data.reservas)
      } else {
        showEmptyReservations()
      }
    })
    .catch((error) => {
      console.error("Error al cargar las reservas:", error)
      showReservationsError()
    })
}

// Función para mostrar las reservas en la tabla
function displayReservations(reservas) {
  const tableBody = document.getElementById("reservationsTableBody")
  tableBody.innerHTML = ""

  reservas.forEach((reserva) => {
    const row = document.createElement("tr")

    // Format dates
    const fechaInicio = new Date(reserva.fecha_inicio).toLocaleDateString("es-ES")
    const fechaFin = new Date(reserva.fecha_fin).toLocaleDateString("es-ES")

    // Get status class
    let statusClass = "bg-secondary"
    if (reserva.estado === "confirmada") statusClass = "bg-success"
    if (reserva.estado === "pendiente") statusClass = "bg-warning"
    if (reserva.estado === "cancelada") statusClass = "bg-danger"

    row.innerHTML = `
      <td>${reserva.id}</td>
      <td>${getRoomTypeName(reserva.habitacion_id)}</td>
      <td>${fechaInicio}</td>
      <td>${fechaFin}</td>
      <td><span class="badge ${statusClass}">${capitalizeFirstLetter(reserva.estado)}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-primary view-reservation" data-id="${reserva.id}">
          <i class="fas fa-eye"></i>
        </button>
        ${
          reserva.estado !== "cancelada"
            ? `
          <button class="btn btn-sm btn-outline-danger cancel-reservation" data-id="${reserva.id}">
            <i class="fas fa-times"></i>
          </button>
        `
            : ""
        }
      </td>
    `

    tableBody.appendChild(row)
  })

  // Add event listeners to buttons
  document.querySelectorAll(".view-reservation").forEach((button) => {
    button.addEventListener("click", function () {
      const reservationId = this.getAttribute("data-id")
      viewReservationDetails(reservationId, reservas)
    })
  })

  document.querySelectorAll(".cancel-reservation").forEach((button) => {
    button.addEventListener("click", function () {
      const reservationId = this.getAttribute("data-id")
      cancelReservation(reservationId)
    })
  })

  // Show reservations container
  document.getElementById("reservationsLoading").style.display = "none"
  document.getElementById("reservationsContainer").style.display = "block"
}

// Función para mostrar estado vacío de reservas
function showEmptyReservations() {
  document.getElementById("reservationsLoading").style.display = "none"
  document.getElementById("reservationsEmpty").style.display = "block"
}

// Función para mostrar error al cargar reservas
function showReservationsError() {
  document.getElementById("reservationsLoading").style.display = "none"
  document.getElementById("reservationsError").style.display = "block"
}

// Función para ver detalles de una reserva
function viewReservationDetails(id, reservas) {
  // Find the reservation
  const reserva = reservas.find((r) => r.id.toString() === id.toString())

  if (!reserva) return

  // Format dates
  const fechaInicio = new Date(reserva.fecha_inicio).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const fechaFin = new Date(reserva.fecha_fin).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Calculate number of nights
  const start = new Date(reserva.fecha_inicio)
  const end = new Date(reserva.fecha_fin)
  const nights = Math.round((end - start) / (1000 * 60 * 60 * 24))

  // Get status class
  function getStatusClass(status) {
    switch (status) {
      case "confirmada":
        return "bg-success"
      case "pendiente":
        return "bg-warning"
      case "cancelada":
        return "bg-danger"
      default:
        return "bg-secondary"
    }
  }

  // Create modal
  const detailsModalHTML = `
    <div class="modal fade" id="reservationDetailsModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalles de la Reserva</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="reservation-detail-header mb-4 pb-3 border-bottom">
              <div class="d-flex justify-content-between align-items-center">
                <h4>${getRoomTypeName(reserva.habitacion_id)}</h4>
                <span class="badge ${getStatusClass(reserva.estado)}">${capitalizeFirstLetter(reserva.estado)}</span>
              </div>
              <p class="text-muted mb-0">Reserva #${reserva.id}</p>
            </div>
            
            <div class="row mb-4">
              <div class="col-md-6">
                <h6><i class="fas fa-calendar-check me-2 text-primary"></i>Llegada</h6>
                <p>${fechaInicio}</p>
              </div>
              <div class="col-md-6">
                <h6><i class="fas fa-calendar-times me-2 text-primary"></i>Salida</h6>
                <p>${fechaFin}</p>
              </div>
            </div>
            
            <div class="row mb-4">
              <div class="col-md-6">
                <h6><i class="fas fa-moon me-2 text-primary"></i>Duración</h6>
                <p>${nights} noche${nights !== 1 ? "s" : ""}</p>
              </div>
              <div class="col-md-6">
                <h6><i class="fas fa-user-friends me-2 text-primary"></i>Huéspedes</h6>
                <p>${reserva.huespedes || 2} persona${(reserva.huespedes || 2) !== 1 ? "s" : ""}</p>
              </div>
            </div>
            
            ${
              reserva.solicitudes_especiales
                ? `
              <div class="mb-4">
                <h6><i class="fas fa-comment-alt me-2 text-primary"></i>Solicitudes especiales</h6>
                <p>${reserva.solicitudes_especiales}</p>
              </div>
            `
                : ""
            }
            
            <div class="alert alert-info">
              <i class="fas fa-info-circle me-2"></i>
              Para cualquier cambio en tu reserva, por favor contacta con recepción.
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            ${
              reserva.estado !== "cancelada"
                ? `
              <button type="button" class="btn btn-danger" id="cancelReservationBtn" data-id="${reserva.id}">
                <i class="fas fa-times me-2"></i>Cancelar reserva
              </button>
            `
                : ""
            }
          </div>
        </div>
      </div>
    </div>
  `

  // Add modal to body
  const detailsModalContainer = document.createElement("div")
  detailsModalContainer.innerHTML = detailsModalHTML
  document.body.appendChild(detailsModalContainer)

  // Hide the current modal
  const currentModal = bootstrap.Modal.getInstance(document.getElementById("myReservationsModal"))
  currentModal.hide()

  // Show details modal
  const detailsModal = new bootstrap.Modal(document.getElementById("reservationDetailsModal"))
  detailsModal.show()

  // Add event listener to cancel button
  const cancelBtn = document.getElementById("cancelReservationBtn")
  if (cancelBtn) {
    cancelBtn.addEventListener("click", function () {
      const reservationId = this.getAttribute("data-id")
      detailsModal.hide()

      // Show confirmation dialog
      if (confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
        cancelReservation(reservationId, () => {
          // Reopen the reservations modal and refresh
          const myReservationsModal = new bootstrap.Modal(document.getElementById("myReservationsModal"))
          myReservationsModal.show()
          loadUserReservations()
        })
      } else {
        // Reopen the reservations modal
        const myReservationsModal = new bootstrap.Modal(document.getElementById("myReservationsModal"))
        myReservationsModal.show()
      }
    })
  }

  // Add event listener to close button to reopen the reservations modal
  document.querySelector("#reservationDetailsModal .btn-secondary").addEventListener("click", () => {
    // Reopen the reservations modal
    const myReservationsModal = new bootstrap.Modal(document.getElementById("myReservationsModal"))
    myReservationsModal.show()
  })

  // Remove the modal from DOM when hidden
  document.getElementById("reservationDetailsModal").addEventListener("hidden.bs.modal", function () {
    this.remove()
  })
}

// Función para cancelar una reserva
function cancelReservation(id, callback) {
  fetch(`${backendBaseUrl}/cancelar-reserva`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al cancelar la reserva")
      }
      return response.json()
    })
    .then((data) => {
      if (data.success) {
        alert("Reserva cancelada correctamente")
        if (typeof callback === "function") {
          callback()
        } else {
          loadUserReservations()
        }
      } else {
        alert("No se pudo cancelar la reserva. Por favor, inténtalo de nuevo.")
      }
    })
    .catch((error) => {
      console.error("Error al cancelar la reserva:", error)
      alert("Error al cancelar la reserva. Por favor, inténtalo de nuevo.")
    })
}

document.addEventListener("DOMContentLoaded", () => {
  // Configurar formulario de reserva
  setupReservationForm()

  // Configurar modal de Mis Reservas
  setupMyReservationsModal()
})
