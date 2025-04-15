// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS (Animate On Scroll)
  initAOS()

  // Initialize the map if the element exists
  initMap()

  // Configure dark mode
  setupDarkMode()

  // Configure back to top button
  setupBackToTop()

  // Configure smooth scrolling
  setupSmoothScrolling()

  // Configure modals
  setupModals()

  // Configure form validation
  setupFormValidation()

  // Initialize Bootstrap tooltips
  initTooltips()

  // Configure counter animation
  setupCounterAnimation()

  // Handle responsive navigation
  handleResponsiveNav()

  // Detect scroll to change navbar style
  handleNavbarScroll()

  // Configure validation of specific fields
  setupFieldValidation()

  // User session management
  setupUserSession()

  // Setup verification code functionality
  setupVerificationCode()
})

/**
 * Initializes the AOS library for scroll animations
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
 * Initializes the Leaflet map if the element exists on the page
 */
function initMap() {
  // Coordinates for Avenida Emilio Civit 367, Mendoza, Argentina
  const hotelLatitude = -32.88789
  const hotelLongitude = -68.855

  const mapElement = document.getElementById("map")
  if (mapElement) {
    try {
      if (typeof L !== "undefined") {
        const map = L.map("map").setView([hotelLatitude, hotelLongitude], 15)

        // Add OpenStreetMap layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map)

        // Add a marker for the hotel
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

        // Force map update after it's fully loaded
        setTimeout(() => {
          map.invalidateSize()
        }, 500)
      } else {
        console.warn("Leaflet (L) is not defined. Make sure it is properly imported.")
      }
    } catch (error) {
      console.error("Error initializing map:", error)
    }
  }
}

/**
 * Configures dark mode functionality
 */
function setupDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle")

  if (darkModeToggle) {
    // Make button immediately visible without waiting for any condition
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

    // Check saved dark mode preference
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
 * Configures back to top button
 */
function setupBackToTop() {
  const backToTopButton = document.getElementById("backToTop")

  if (backToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("show")
      } else {
        backToTopButton.classList.remove("show")
      }
    })

    // Scroll to top action on click
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })

    // Check initial position
    if (window.scrollY > 300) {
      backToTopButton.classList.add("show")
    }
  }
}

/**
 * Configures smooth scrolling for internal links
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
 * Configures login and user creation modals
 */
function setupModals() {
  // Handle opening the create user modal
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

  // Handle opening the login modal
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

  // Switch from login modal to create user modal
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
        const navbarCollapse = document.querySelector(".navbar-collapse")
        if (navbarCollapse) {
          navbarCollapse.classList.remove("show")
        }
      }
    })
  }

  // Switch from create user modal to login modal
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
 * Configures form validation
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

  // Specific validation for the user creation form
  const createUserForm = document.getElementById("createUserForm")
  if (createUserForm) {
    // Eliminar los atributos action y method para evitar el envío directo del formulario
    createUserForm.removeAttribute("action")
    createUserForm.removeAttribute("method")

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
 * Configures validation for specific fields (name and phone)
 */
function setupFieldValidation() {
  // Validation for name field (letters only)
  const nombreInput = document.getElementById("userName")
  if (nombreInput) {
    // Add validation attributes
    nombreInput.setAttribute("pattern", "[A-Za-zÁáÉéÍíÓóÚúÑñ\\s]+")
    nombreInput.setAttribute("title", "Por favor ingrese solo letras")

    // Validate as user types
    nombreInput.addEventListener("input", function () {
      // Allow letters, spaces and accented characters
      this.value = this.value.replace(/[^A-Za-zÁáÉéÍíÓóÚúÑñ\s]/g, "")
    })
  }

  // Validation for phone field (numbers only)
  const telefonoInput = document.getElementById("userTelefono")
  if (telefonoInput) {
    // Add validation attributes
    telefonoInput.setAttribute("pattern", "[0-9]+")
    telefonoInput.setAttribute("title", "Por favor ingrese solo números")

    // Validate as user types
    telefonoInput.addEventListener("input", function () {
      // Allow only numbers
      this.value = this.value.replace(/[^0-9]/g, "")
    })
  }
}

/**
 * Initializes Bootstrap tooltips
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
      console.error("Error initializing tooltips:", error)
    }
  }
}

/**
 * Configures counter animation for numbers
 */
function setupCounterAnimation() {
  // Function to animate counters
  function animateCounter(el, target) {
    let count = 0
    const speed = 2000 / target // 2 seconds to reach target
    const counter = setInterval(() => {
      count++
      el.textContent = count
      if (count >= target) {
        clearInterval(counter)
      }
    }, speed)
  }

  // Start animation when element is visible
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
    // Fallback for browsers that don't support IntersectionObserver
    document.querySelectorAll(".years").forEach((el) => {
      const targetValue = Number.parseInt(el.textContent) || 0
      if (targetValue > 0) {
        animateCounter(el, targetValue)
      }
    })
  }
}

/**
 * Handles responsive navigation
 */
function handleResponsiveNav() {
  const navbarToggler = document.querySelector(".navbar-toggler")
  const navbarCollapse = document.querySelector(".navbar-collapse")

  if (navbarToggler && navbarCollapse) {
    // Close menu when clicking a link on mobile
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
            console.error("Error closing mobile menu:", error)
            // Manual fallback if bootstrap is not available
            navbarCollapse.classList.remove("show")
          }
        }
      })
    })
  }
}

/**
 * Detects when the navbar should change style on scroll and updates the active link
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

      // Update active link based on scroll position
      updateActiveNavLink()
    })

    // Apply initial class based on current position
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    }

    // Initialize active link
    updateActiveNavLink()
  }
}

/**
 * Updates the active link in the navigation based on scroll position
 */
function updateActiveNavLink() {
  // Get all sections
  const sections = document.querySelectorAll("section[id], header[id]")
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link:not(.btn)")

  // Determine which section is currently visible
  let currentSection = ""
  const scrollPosition = window.scrollY + 200 // Offset for better detection

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id")
    }
  })

  // Update active class on navigation links
  navLinks.forEach((link) => {
    link.classList.remove("active")
    const href = link.getAttribute("href")
    if (href === `#${currentSection}`) {
      link.classList.add("active")
    }
  })

  // If we're at the beginning of the page, activate the home link
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
 * Configures user session management
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
 * Configures verification code input functionality
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
  console.log("Enviando datos para verificación:", userData)

  // Backend URL
  const backendBaseUrl = "https://hotelitus.onrender.com"

  // Store user data for later use
  localStorage.setItem("pendingUserData", JSON.stringify(userData))
  localStorage.setItem("pendingVerificationEmail", userData.correo)

  // Crear un objeto FormData para enviar los datos como application/json
  const xhr = new XMLHttpRequest()
  xhr.open("POST", `${backendBaseUrl}/create`, true)
  xhr.setRequestHeader("Content-Type", "application/json")

  // Mostrar indicador de carga
  const submitBtn = document.querySelector('#createUserForm button[type="submit"]')
  const originalBtnText = submitBtn ? submitBtn.innerHTML : ""
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...'
    submitBtn.disabled = true
  }

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      console.log("Status:", xhr.status)
      console.log("Response:", xhr.responseText)

      // Restaurar botón
      if (submitBtn) {
        submitBtn.innerHTML = originalBtnText
        submitBtn.disabled = false
      }

      if (xhr.status === 200) {
        try {
          const result = JSON.parse(xhr.responseText)
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
                const firstInput = document.querySelector(".verification-input")
                if (firstInput) {
                  firstInput.focus()
                }
              }, 500)
            }
          } else {
            alert("Error al enviar el código de verificación. Por favor, inténtelo de nuevo.")
          }
        } catch (e) {
          console.error("Error al parsear respuesta:", e)
          alert("Error al enviar el código de verificación. Por favor, inténtelo de nuevo.")
        }
      } else {
        alert("Error al enviar el código de verificación. Por favor, inténtelo de nuevo.")
      }
    }
  }

  xhr.onerror = () => {
    console.error("Error de red al enviar datos")
    alert("Error de conexión. Por favor, verifica tu conexión a internet e inténtalo de nuevo.")

    // Restaurar botón
    if (submitBtn) {
      submitBtn.innerHTML = originalBtnText
      submitBtn.disabled = false
    }
  }

  // Enviar los datos como JSON
  xhr.send(JSON.stringify(userData))
}

/**
 * Verifica el código ingresado por el usuario
 * @param {string} email - Correo electrónico del usuario
 * @param {string} code - Código de verificación ingresado por el usuario
 */
function verifyCode(email, code) {
  console.log("Verificando código:", email, code)

  // Backend URL
  const backendBaseUrl = "https://hotelitus.onrender.com"

  // Mostrar indicador de carga
  const submitBtn = document.querySelector('#verificationForm button[type="submit"]')
  const originalBtnText = submitBtn ? submitBtn.innerHTML : ""
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...'
    submitBtn.disabled = true
  }

  // Ocultar mensaje de error previo
  const errorElement = document.getElementById("verification-error")
  if (errorElement) {
    errorElement.style.display = "none"
  }

  // Usar XMLHttpRequest en lugar de fetch
  const xhr = new XMLHttpRequest()
  xhr.open("POST", `${backendBaseUrl}/verify-code`, true)
  xhr.setRequestHeader("Content-Type", "application/json")

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      console.log("Status:", xhr.status)
      console.log("Response:", xhr.responseText)

      // Restaurar botón
      if (submitBtn) {
        submitBtn.innerHTML = originalBtnText
        submitBtn.disabled = false
      }

      if (xhr.status === 200) {
        try {
          const result = JSON.parse(xhr.responseText)
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
            if (errorElement) {
              errorElement.style.display = "block"
            }
          }
        } catch (e) {
          console.error("Error al parsear respuesta:", e)
          if (errorElement) {
            errorElement.style.display = "block"
          }
        }
      } else {
        if (errorElement) {
          errorElement.style.display = "block"
        }
      }
    }
  }

  xhr.onerror = () => {
    console.error("Error de red al verificar código")
    if (errorElement) {
      errorElement.style.display = "block"
    }

    // Restaurar botón
    if (submitBtn) {
      submitBtn.innerHTML = originalBtnText
      submitBtn.disabled = false
    }
  }

  // Enviar los datos como JSON
  xhr.send(JSON.stringify({ correo: email, codigo: code }))
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

      // Usar XMLHttpRequest en lugar de fetch para mejor compatibilidad
      const xhr = new XMLHttpRequest()
      xhr.open("POST", "https://hotelitus.onrender.com/sesion", true)
      xhr.setRequestHeader("Content-Type", "application/json")
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          // Restaurar botón
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false

          console.log("Status:", xhr.status)
          console.log("Response:", xhr.responseText)

          if (xhr.status === 200) {
            // Éxito - guardar estado de sesión y redirigir
            localStorage.setItem("userLoggedIn", "true")
            localStorage.setItem("usuarioLogueado", email)
            window.location.href = window.location.origin + "/?logged=true"
          } else {
            // Mostrar mensaje de error
            if (errorMsg) {
              errorMsg.classList.remove("d-none")
              errorMsg.textContent = "Error al iniciar sesión. Por favor, verifica tus credenciales."
            }
          }
        }
      }

      xhr.onerror = () => {
        console.error("Error de red al iniciar sesión")
        submitBtn.innerHTML = originalBtnText
        submitBtn.disabled = false

        if (errorMsg) {
          errorMsg.classList.remove("d-none")
          errorMsg.textContent = "Error de conexión. Por favor, verifica tu conexión a internet."
        }
      }

      // Enviar datos como JSON
      xhr.send(JSON.stringify({ email, password }))
    })
  }
})

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

  // Usar XMLHttpRequest para obtener datos del usuario desde el backend
  const xhr = new XMLHttpRequest()
  xhr.open("POST", `${backendBaseUrl}/get-user-data`, true)
  xhr.setRequestHeader("Content-Type", "application/json")

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText)
          if (response && response.success) {
            // Guardar datos en localStorage para futuras cargas
            localStorage.setItem("currentUserData", JSON.stringify(response.user))
            updateUserProfileUI(response.user)
          }
        } catch (e) {
          console.error("Error al parsear respuesta:", e)
          // Si hay error, mostrar datos genéricos
          updateUserProfileUI({
            nombre: "Usuario",
            correo: userEmail,
          })
        }
      } else {
        console.error("Error al obtener datos del usuario:", xhr.status)
        // Si hay error, mostrar datos genéricos
        updateUserProfileUI({
          nombre: "Usuario",
          correo: userEmail,
        })
      }
    }
  }

  xhr.onerror = () => {
    console.error("Error de red al obtener datos del usuario")
    // Si hay error, mostrar datos genéricos
    updateUserProfileUI({
      nombre: "Usuario",
      correo: userEmail,
    })
  }

  // Enviar los datos como JSON
  xhr.send(JSON.stringify({ correo: userEmail }))
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
