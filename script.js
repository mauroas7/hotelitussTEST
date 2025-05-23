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

  // Nuevas funciones
  setupReservationForm()
  setupMyReservations()

  // Modificar el enlace "Mis reservas" en el menú desplegable
  const misReservasLink = document.getElementById("myReservationsLink")
  if (misReservasLink) {
    misReservasLink.addEventListener("click", (e) => {
      e.preventDefault()
      const bootstrap = window.bootstrap // Declare the bootstrap variable
      if (bootstrap) {
        const myReservationsModal = new bootstrap.Modal(document.getElementById("myReservationsModal"))
        myReservationsModal.show()

        // Cargar reservas del usuario
        loadUserReservations()
      } else {
        console.warn("Bootstrap is not defined. Make sure it is properly imported.")
      }
    })
  }
})

/**
 * Inicializa la biblioteca AOS para animaciones al hacer scroll
 */
function initAOS() {
  const AOS = window.AOS // Declare the AOS variable
  if (AOS) {
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
      const L = window.L // Declare the L variable
      if (L) {
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
      const bootstrap = window.bootstrap // Declare the bootstrap variable
      if (bootstrap) {
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
      const bootstrap = window.bootstrap // Declare the bootstrap variable
      if (bootstrap) {
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
      const bootstrap = window.bootstrap // Declare the bootstrap variable
      if (bootstrap) {
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
      const bootstrap = window.bootstrap // Declare the bootstrap variable
      if (bootstrap) {
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

// Configurar el formulario de reservas
function setupReservationForm() {
  const reservationForm = document.getElementById("reservationForm")

  if (reservationForm) {
    reservationForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Verificar si el usuario está logueado
      const isLoggedIn = localStorage.getItem("userLoggedIn") === "true"

      if (!isLoggedIn) {
        // Mostrar alerta de login requerido
        document.getElementById("loginRequiredAlert").classList.remove("d-none")
        return
      }

      // Obtener datos del formulario
      const checkIn = document.getElementById("checkIn").value
      const checkOut = document.getElementById("checkOut").value
      const roomType = document.getElementById("roomType").value
      const guests = document.getElementById("guests").value
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const specialRequests = document.getElementById("specialRequests").value

      // Validar fechas
      if (new Date(checkIn) >= new Date(checkOut)) {
        alert("La fecha de salida debe ser posterior a la fecha de entrada")
        return
      }

      // Obtener el ID del usuario desde localStorage
      let userId = null
      const userDataStr = localStorage.getItem("currentUserData")

      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr)
          if (userData.id) {
            userId = userData.id
          }
        } catch (e) {
          console.error("Error al parsear datos de usuario:", e)
        }
      }

      // Si no hay ID, usar el correo como identificador
      if (!userId) {
        const userEmail = localStorage.getItem("currentUserEmail") || localStorage.getItem("usuarioLogueado")
        if (!userEmail) {
          alert("Error: No se pudo identificar al usuario")
          return
        }
      }

      // Mostrar indicador de carga
      const submitBtn = document.querySelector('#reservationForm button[type="submit"]')
      const originalBtnText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...'
      submitBtn.disabled = true

      // Crear objeto con datos de la reserva
      const reservationData = {
        usuario_id: userId,
        habitacion_id: getRoomIdByType(roomType),
        fecha_inicio: checkIn,
        fecha_fin: checkOut,
        estado: "pendiente",
        // Datos adicionales para el backend
        nombre: name,
        correo: email,
        huespedes: guests,
        solicitudes_especiales: specialRequests,
      }

      // Enviar datos al servidor
      fetch("https://hotelitus.onrender.com/reservar", {
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
          // Restaurar botón
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false

          // Mostrar mensaje de éxito
          alert("¡Reserva creada con éxito!")

          // Limpiar formulario
          document.getElementById("reservationForm").reset()

          // Pre-llenar con datos del usuario nuevamente
          if (userDataStr) {
            try {
              const userData = JSON.parse(userDataStr)
              if (document.getElementById("name")) {
                document.getElementById("name").value = userData.nombre || ""
              }
              if (document.getElementById("email")) {
                document.getElementById("email").value = userData.correo || ""
              }
            } catch (e) {
              console.error("Error al parsear datos de usuario:", e)
            }
          }
        })
        .catch((error) => {
          console.error("Error al crear reserva:", error)

          // Restaurar botón
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false

          // Mostrar mensaje de error
          alert("Error al crear la reserva. Por favor, inténtelo de nuevo.")
        })
    })
  }

  // Evento para el enlace de login desde la alerta de reserva
  const loginFromReservation = document.getElementById("loginFromReservation")
  if (loginFromReservation) {
    loginFromReservation.addEventListener("click", (e) => {
      e.preventDefault()
      const bootstrap = window.bootstrap // Declare the bootstrap variable
      if (bootstrap) {
        const loginModal = new bootstrap.Modal(document.getElementById("loginModal"))
        loginModal.show()
      }
    })
  }

  // Pre-llenar el formulario con datos del usuario si está logueado
  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true"
  if (isLoggedIn) {
    const userDataStr = localStorage.getItem("currentUserData")
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr)
        if (document.getElementById("name")) {
          document.getElementById("name").value = userData.nombre || ""
        }
        if (document.getElementById("email")) {
          document.getElementById("email").value = userData.correo || ""
        }
      } catch (e) {
        console.error("Error al parsear datos de usuario:", e)
      }
    }
  }
}

// Función para obtener el ID de habitación según el tipo
function getRoomIdByType(type) {
  // Mapeo de tipos de habitación a IDs
  // Estos IDs deben coincidir con los de la base de datos
  const roomTypes = {
    individual: 1,
    doble: 2,
    suite: 3,
  }

  return roomTypes[type] || 1 // Devolver 1 (individual) por defecto
}

// Función para cargar las reservas del usuario
function setupMyReservations() {
  // Configurar el modal de mis reservas
  const myReservationsModal = document.getElementById("myReservationsModal")

  if (myReservationsModal) {
    myReservationsModal.addEventListener("show.bs.modal", () => {
      loadUserReservations()
    })
  }
}

// Cargar las reservas del usuario
function loadUserReservations() {
  const reservationsLoading = document.getElementById("reservationsLoading")
  const noReservationsMessage = document.getElementById("noReservationsMessage")
  const reservationsList = document.getElementById("reservationsList")
  const reservationsTableBody = document.getElementById("reservationsTableBody")

  if (!reservationsLoading || !noReservationsMessage || !reservationsList || !reservationsTableBody) {
    console.error("Elementos del modal de reservas no encontrados")
    return
  }

  // Mostrar cargando, ocultar otros elementos
  reservationsLoading.classList.remove("d-none")
  noReservationsMessage.classList.add("d-none")
  reservationsList.classList.add("d-none")

  // Obtener ID o correo del usuario
  let userId = null
  let userEmail = null

  const userDataStr = localStorage.getItem("currentUserData")
  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr)
      if (userData.id) {
        userId = userData.id
      }
      if (userData.correo) {
        userEmail = userData.correo
      }
    } catch (e) {
      console.error("Error al parsear datos de usuario en caché:", e)
    }
  }

  if (!userId && !userEmail) {
    userEmail = localStorage.getItem("currentUserEmail") || localStorage.getItem("usuarioLogueado")
  }

  if (!userId && !userEmail) {
    // No hay identificación de usuario
    reservationsLoading.classList.add("d-none")
    noReservationsMessage.classList.remove("d-none")
    return
  }

  // Crear payload para la petición
  const payload = {}
  if (userId) {
    payload.usuario_id = userId
  } else {
    payload.correo = userEmail
  }

  // Obtener reservas del usuario
  fetch("https://hotelitus.onrender.com/user-reservations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener reservas")
      }
      return response.json()
    })
    .then((data) => {
      // Ocultar cargando
      reservationsLoading.classList.add("d-none")

      if (data.reservas && data.reservas.length > 0) {
        // Mostrar lista de reservas
        reservationsList.classList.remove("d-none")

        // Limpiar tabla
        reservationsTableBody.innerHTML = ""

        // Llenar tabla con reservas
        data.reservas.forEach((reserva) => {
          const row = document.createElement("tr")

          // Formatear fechas
          const fechaInicio = new Date(reserva.fecha_inicio).toLocaleDateString()
          const fechaFin = new Date(reserva.fecha_fin).toLocaleDateString()

          // Determinar clase de estado
          let estadoClass = ""
          if (reserva.estado === "confirmada") estadoClass = "bg-success"
          else if (reserva.estado === "pendiente") estadoClass = "bg-warning"
          else if (reserva.estado === "cancelada") estadoClass = "bg-danger"

          row.innerHTML = `
            <td>${fechaInicio}</td>
            <td>${fechaFin}</td>
            <td>${getTipoHabitacion(reserva.habitacion_id)}</td>
            <td>${reserva.huespedes || "-"}</td>
            <td><span class="badge ${estadoClass}">${reserva.estado.toUpperCase()}</span></td>
            <td>
              ${
                reserva.estado !== "cancelada"
                  ? `<button class="btn btn-sm btn-outline-danger cancel-reservation" data-id="${reserva.id}">
                  <i class="fas fa-times-circle"></i> Cancelar
                </button>`
                  : "-"
              }
            </td>
          `

          reservationsTableBody.appendChild(row)
        })

        // Agregar eventos a los botones de cancelar
        document.querySelectorAll(".cancel-reservation").forEach((btn) => {
          btn.addEventListener("click", function () {
            const reservaId = this.getAttribute("data-id")
            if (confirm("¿Está seguro que desea cancelar esta reserva?")) {
              cancelReservation(reservaId)
            }
          })
        })
      } else {
        // Mostrar mensaje de no reservas
        noReservationsMessage.classList.remove("d-none")
      }
    })
    .catch((error) => {
      console.error("Error al cargar reservas:", error)

      // Ocultar cargando
      reservationsLoading.classList.add("d-none")

      // Mostrar mensaje de no reservas (como fallback)
      noReservationsMessage.classList.remove("d-none")
      noReservationsMessage.querySelector("h5").textContent = "Error al cargar reservas"
      noReservationsMessage.querySelector("p").textContent =
        "Ha ocurrido un error. Por favor, inténtelo de nuevo más tarde."
    })
}

// Función para cancelar una reserva
function cancelReservation(reservaId) {
  fetch("https://hotelitus.onrender.com/cancel-reservation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: reservaId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al cancelar la reserva")
      }
      return response.json()
    })
    .then((result) => {
      if (result.success) {
        alert("Reserva cancelada con éxito")
        // Recargar reservas
        loadUserReservations()
      } else {
        alert("Error al cancelar la reserva: " + (result.message || "Error desconocido"))
      }
    })
    .catch((error) => {
      console.error("Error al cancelar reserva:", error)
      alert("Error al cancelar la reserva. Por favor, inténtelo de nuevo.")
    })
}

// Función auxiliar para obtener el nombre del tipo de habitación según ID
function getTipoHabitacion(id) {
  // Mapeo de IDs a nombres de tipos de habitación
  const tiposHabitacion = {
    1: "Habitación Individual",
    2: "Habitación Doble",
    3: "Suite Ejecutiva",
  }

  return tiposHabitacion[id] || `Habitación ${id}`
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
      const bootstrap = window.bootstrap // Declare the bootstrap variable
      if (bootstrap) {
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
            const bootstrap = window.bootstrap // Declare the bootstrap variable
            if (bootstrap) {
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
  fetch("https://hotelitus.onrender.com/get-user-data", {
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
  // Backend URL
  const backendBaseUrl = "https://hotelitus.onrender.com"

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
        const bootstrap = window.bootstrap // Declare the bootstrap variable
        if (bootstrap) {
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
  // Backend URL
  const backendBaseUrl = "https://hotelitus.onrender.com"

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
        const bootstrap = window.bootstrap // Declare the bootstrap variable
        if (bootstrap) {
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
          const bootstrap = window.bootstrap // Declare the bootstrap variable
          if (bootstrap) {
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
      fetch("https://hotelitus.onrender.com/sesion", {
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
          // Guardar el objeto de usuario completo, no solo el email
          localStorage.setItem("userLoggedIn", "true")
          localStorage.setItem("usuarioLogueado", email)

          // Guardar el objeto de usuario completo si está disponible
          if (data.user) {
            localStorage.setItem("currentUserData", JSON.stringify(data.user))
          }

          // Mantener al usuario en la misma página con parámetro logged=true
          window.location.href = window.location.origin + "/?logged=true"
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
})
