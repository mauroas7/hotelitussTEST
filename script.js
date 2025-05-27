document.addEventListener("DOMContentLoaded", () => {
  initAOS()
  initMap()
  setupDarkMode()
  setupBackToTop()
  setupSmoothScrolling()
  setupModals()
  setupFormValidation()
  initTooltips()
  setupCounterAnimation()
  handleResponsiveNav()
  handleNavbarScroll()
  setupFieldValidation()
  setupUserSession()
  setupVerificationCode()
  setupReservationForm()
  setupMyReservations()
  setupDateConstraints()
  setupLoginForm()
  setupAdminPanel() // Nueva función para el panel de administración
  handlePaymentReturn() // Nueva función para manejar el retorno de MercadoPago

  const misReservasLink = document.getElementById("myReservationsLink")
  if (misReservasLink) {
    misReservasLink.addEventListener("click", (e) => {
      e.preventDefault()
      const bootstrap = window.bootstrap
      if (bootstrap) {
        const myReservationsModal = new bootstrap.Modal(document.getElementById("myReservationsModal"))
        myReservationsModal.show()
        loadUserReservations()
      }
    })
  }
})

// Nueva función para manejar el retorno de MercadoPago
function handlePaymentReturn() {
  const urlParams = new URLSearchParams(window.location.search)
  const paymentStatus = urlParams.get("payment")
  const reservaId = urlParams.get("reserva_id")

  if (paymentStatus && reservaId) {
    // Actualizar el estado de la reserva en el backend
    fetch("https://hotelitus.onrender.com/payment-result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment_status: paymentStatus,
        reserva_id: reservaId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Mostrar mensaje según el resultado del pago
          if (paymentStatus === "success") {
            showPaymentMessage("¡Pago exitoso! Su reserva ha sido confirmada.", "success")
          } else if (paymentStatus === "failure") {
            showPaymentMessage("El pago no pudo ser procesado. Su reserva ha sido cancelada.", "danger")
          } else if (paymentStatus === "pending") {
            showPaymentMessage("Su pago está pendiente de confirmación.", "warning")
          }
        }
      })
      .catch((error) => {
        console.error("Error al procesar resultado del pago:", error)
      })

    // Limpiar los parámetros de la URL
    window.history.replaceState({}, document.title, "/")
  }
}

function showPaymentMessage(message, type = "info") {
  // Crear un modal o alert para mostrar el resultado del pago
  const alertDiv = document.createElement("div")
  alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`
  alertDiv.style.cssText = "top: 100px; right: 20px; z-index: 9999; max-width: 400px;"
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `

  document.body.appendChild(alertDiv)

  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.parentNode.removeChild(alertDiv)
    }
  }, 5000)
}

// NUEVAS FUNCIONES PARA EL PANEL DE ADMINISTRACIÓN

function setupAdminPanel() {
  const adminLogoutBtn = document.getElementById("adminLogoutBtn")
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      localStorage.removeItem("userLoggedIn")
      localStorage.removeItem("currentUserEmail")
      localStorage.removeItem("currentUserData")
      localStorage.removeItem("isAdmin")
      window.location.reload()
    })
  }
}

function showAdminPanel() {
  console.log("🔧 Mostrando panel de administración")
  
  // Ocultar el contenido principal
  const mainContent = document.getElementById("main-content")
  const adminPanel = document.getElementById("admin-panel")
  
  if (mainContent) {
    mainContent.style.display = "none"
    console.log("✅ Contenido principal ocultado")
  }
  if (adminPanel) {
    adminPanel.style.display = "block"
    console.log("✅ Panel de administración mostrado")
  }
  
  // Cargar datos iniciales
  cargarEstadisticasAdmin()
  cargarReservasAdmin()
  
  // Actualizar nombre del administrador
  const adminUserName = document.getElementById("adminUserName")
  const currentUserData = localStorage.getItem("currentUserData")
  if (adminUserName && currentUserData) {
    try {
      const userData = JSON.parse(currentUserData)
      adminUserName.textContent = userData.nombre || "Administrador"
      console.log("✅ Nombre de administrador actualizado:", userData.nombre)
    } catch (e) {
      adminUserName.textContent = "Administrador"
      console.log("⚠️ Error al parsear datos de usuario, usando nombre por defecto")
    }
  }
}

function showMainContent() {
  console.log("🔧 Mostrando contenido principal")
  
  // Mostrar el contenido principal
  const mainContent = document.getElementById("main-content")
  const adminPanel = document.getElementById("admin-panel")
  
  if (mainContent) {
    mainContent.style.display = "block"
    console.log("✅ Contenido principal mostrado")
  }
  if (adminPanel) {
    adminPanel.style.display = "none"
    console.log("✅ Panel de administración ocultado")
  }
}

function cargarEstadisticasAdmin() {
  const currentUserEmail = localStorage.getItem("currentUserEmail")
  
  if (!currentUserEmail) return
  
  fetch("https://hotelitus.onrender.com/admin/estadisticas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      admin_email: currentUserEmail
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const stats = data.estadisticas
        
        document.getElementById("totalUsuarios").textContent = stats.totalUsuarios
        document.getElementById("totalReservas").textContent = stats.totalReservas
        document.getElementById("reservasActivas").textContent = stats.reservasActivas
        document.getElementById("ingresosMes").textContent = `$${stats.ingresosMes.toLocaleString()}`
      }
    })
    .catch((error) => {
      console.error("Error al cargar estadísticas:", error)
    })
}

function cargarReservasAdmin() {
  const currentUserEmail = localStorage.getItem("currentUserEmail")
  const reservasLoading = document.getElementById("reservasAdminLoading")
  const reservasContent = document.getElementById("reservasAdminContent")
  const reservasTableBody = document.getElementById("reservasAdminTableBody")
  
  if (!currentUserEmail) return
  
  // Mostrar loading
  if (reservasLoading) reservasLoading.style.display = "block"
  if (reservasContent) reservasContent.style.display = "none"
  
  fetch("https://hotelitus.onrender.com/admin/reservas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      admin_email: currentUserEmail
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (reservasLoading) reservasLoading.style.display = "none"
      
      if (data.success && reservasTableBody) {
        reservasTableBody.innerHTML = ""
        
        data.reservas.forEach((reserva) => {
          const row = document.createElement("tr")
          
          const fechaInicio = new Date(reserva.fecha_inicio).toLocaleDateString()
          const fechaFin = new Date(reserva.fecha_fin).toLocaleDateString()
          
          let estadoClass = ""
          let estadoTexto = ""
          if (reserva.estado === "confirmada") {
            estadoClass = "bg-success"
            estadoTexto = "CONFIRMADA"
          } else if (reserva.estado === "pendiente_pago") {
            estadoClass = "bg-warning text-dark"
            estadoTexto = "PENDIENTE PAGO"
          } else if (reserva.estado === "pendiente") {
            estadoClass = "bg-info"
            estadoTexto = "PENDIENTE"
          } else if (reserva.estado === "cancelada") {
            estadoClass = "bg-danger"
            estadoTexto = "CANCELADA"
          }
          
          const monto = reserva.monto_pagado || (reserva.precio_por_noche * calcularNoches(reserva.fecha_inicio, reserva.fecha_fin))
          
          row.innerHTML = `
            <td class="text-center fw-bold">#${reserva.id}</td>
            <td>
              <div class="fw-bold">${reserva.cliente_nombre}</div>
            </td>
            <td>
              <div class="small">
                <i class="fas fa-envelope me-1"></i>${reserva.cliente_correo}<br>
                <i class="fas fa-phone me-1"></i>${reserva.cliente_telefono || 'N/A'}
              </div>
            </td>
            <td>
              <span class="badge bg-secondary">${reserva.habitacion_tipo}</span>
            </td>
            <td>${fechaInicio}</td>
            <td>${fechaFin}</td>
            <td class="text-center">
              <span class="badge ${estadoClass}">${estadoTexto}</span>
            </td>
            <td class="text-end fw-bold">$${monto.toLocaleString()}</td>
            <td class="text-center">
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-primary btn-sm" onclick="verDetalleReserva(${reserva.id})" title="Ver detalles">
                  <i class="fas fa-eye"></i>
                </button>
                ${reserva.estado !== "cancelada" ? `
                  <button class="btn btn-outline-danger btn-sm" onclick="cancelarReservaAdmin(${reserva.id})" title="Cancelar">
                    <i class="fas fa-times"></i>
                  </button>
                ` : ''}
              </div>
            </td>
          `
          
          reservasTableBody.appendChild(row)
        })
        
        if (reservasContent) reservasContent.style.display = "block"
      }
    })
    .catch((error) => {
      console.error("Error al cargar reservas:", error)
      if (reservasLoading) reservasLoading.style.display = "none"
    })
}

function cargarUsuariosAdmin() {
  const currentUserEmail = localStorage.getItem("currentUserEmail")
  const usuariosLoading = document.getElementById("usuariosAdminLoading")
  const usuariosContent = document.getElementById("usuariosAdminContent")
  const usuariosTableBody = document.getElementById("usuariosAdminTableBody")
  
  if (!currentUserEmail) return
  
  // Mostrar loading
  if (usuariosLoading) usuariosLoading.style.display = "block"
  if (usuariosContent) usuariosContent.style.display = "none"
  
  fetch("https://hotelitus.onrender.com/admin/huespedes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      admin_email: currentUserEmail
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (usuariosLoading) usuariosLoading.style.display = "none"
      
      if (data.success && usuariosTableBody) {
        usuariosTableBody.innerHTML = ""
        
        data.huespedes.forEach((huesped) => {
          const row = document.createElement("tr")
          
          const ultimaReserva = huesped.ultima_reserva 
            ? new Date(huesped.ultima_reserva).toLocaleDateString()
            : "Nunca"
          
          let estadoClass = ""
          if (huesped.estado === "Activo") {
            estadoClass = "bg-success"
          } else {
            estadoClass = "bg-secondary"
          }
          
          row.innerHTML = `
            <td class="text-center fw-bold">#${huesped.id}</td>
            <td>
              <div class="fw-bold">${huesped.nombre}</div>
            </td>
            <td>
              <i class="fas fa-envelope me-1"></i>${huesped.correo}
            </td>
            <td>
              <i class="fas fa-phone me-1"></i>${huesped.telefono || 'N/A'}
            </td>
            <td class="text-center">
              <span class="badge bg-primary">${huesped.total_reservas}</span>
            </td>
            <td>${ultimaReserva}</td>
            <td class="text-center">
              <span class="badge ${estadoClass}">${huesped.estado}</span>
            </td>
          `
          
          usuariosTableBody.appendChild(row)
        })
        
        if (usuariosContent) usuariosContent.style.display = "block"
      }
    })
    .catch((error) => {
      console.error("Error al cargar usuarios:", error)
      if (usuariosLoading) usuariosLoading.style.display = "none"
    })
}

function calcularNoches(fechaInicio, fechaFin) {
  const inicio = new Date(fechaInicio)
  const fin = new Date(fechaFin)
  const diferencia = fin - inicio
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24))
}

function verDetalleReserva(reservaId) {
  alert(`Ver detalles de la reserva #${reservaId}`)
  // Aquí puedes implementar un modal con más detalles
}

function cancelarReservaAdmin(reservaId) {
  if (confirm("¿Está seguro que desea cancelar esta reserva?")) {
    fetch("https://hotelitus.onrender.com/cancel-reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: reservaId }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert("Reserva cancelada con éxito")
          cargarReservasAdmin()
          cargarEstadisticasAdmin()
        } else {
          alert("Error al cancelar la reserva: " + (result.message || "Error desconocido"))
        }
      })
      .catch((error) => {
        console.error("Error al cancelar reserva:", error)
        alert("Error al cancelar la reserva. Por favor, inténtelo de nuevo.")
      })
  }
}

// FIN DE FUNCIONES DE ADMINISTRACIÓN

function initAOS() {
  const AOS = window.AOS
  if (AOS) {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    })
  }
}

function initMap() {
  const hotelLatitude = -32.88789
  const hotelLongitude = -68.855
  const mapElement = document.getElementById("map")

  if (mapElement) {
    try {
      const L = window.L
      if (L) {
        const map = L.map("map").setView([hotelLatitude, hotelLongitude], 15)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map)

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

        setTimeout(() => {
          map.invalidateSize()
        }, 500)
      }
    } catch (error) {
      console.error("Error al inicializar el mapa:", error)
    }
  }
}

function setupDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle")

  if (darkModeToggle) {
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

function setupBackToTop() {
  const backToTopButton = document.getElementById("backToTop")

  if (backToTopButton) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("show")
      } else {
        backToTopButton.classList.remove("show")
      }
    })

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })

    if (window.scrollY > 300) {
      backToTopButton.classList.add("show")
    }
  }
}

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

function setupModals() {
  const createUserLink = document.getElementById("createUserLink")
  if (createUserLink) {
    createUserLink.addEventListener("click", (e) => {
      e.preventDefault()
      const bootstrap = window.bootstrap
      if (bootstrap) {
        const createUserModal = new bootstrap.Modal(document.getElementById("createUserModal"))
        createUserModal.show()
      }
    })
  }

  const loginLink = document.getElementById("loginLink")
  if (loginLink) {
    loginLink.addEventListener("click", (e) => {
      e.preventDefault()
      const bootstrap = window.bootstrap
      if (bootstrap) {
        const loginModal = new bootstrap.Modal(document.getElementById("loginModal"))
        loginModal.show()
      }
    })
  }

  const switchToCreateUser = document.getElementById("switchToCreateUser")
  if (switchToCreateUser) {
    switchToCreateUser.addEventListener("click", (e) => {
      e.preventDefault()
      const bootstrap = window.bootstrap
      if (bootstrap) {
        const loginModal = bootstrap.Modal.getInstance(document.getElementById("loginModal"))
        if (loginModal) {
          loginModal.hide()
          setTimeout(() => {
            const createUserModal = new bootstrap.Modal(document.getElementById("createUserModal"))
            createUserModal.show()
          }, 500)
        }
      }
    })
  }

  const switchToLogin = document.getElementById("switchToLogin")
  if (switchToLogin) {
    switchToLogin.addEventListener("click", (e) => {
      e.preventDefault()
      const bootstrap = window.bootstrap
      if (bootstrap) {
        const createUserModal = bootstrap.Modal.getInstance(document.getElementById("createUserModal"))
        if (createUserModal) {
          createUserModal.hide()
          setTimeout(() => {
            const loginModal = new bootstrap.Modal(document.getElementById("loginModal"))
            loginModal.show()
          }, 500)
        }
      }
    })
  }
}

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

  const createUserForm = document.getElementById("createUserForm")
  if (createUserForm) {
    createUserForm.addEventListener("submit", function (event) {
      event.preventDefault()

      if (this.checkValidity()) {
        const formData = {
          nombre: document.getElementById("userName").value,
          correo: document.getElementById("userEmail").value,
          telefono: document.getElementById("userTelefono").value,
          password: document.getElementById("userPassword").value,
        }

        sendVerificationCode(formData)
      }

      this.classList.add("was-validated")
    })
  }
}

function setupLoginForm() {
  const loginForm = document.getElementById("loginForm")

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const email = document.getElementById("loginEmail").value
      const password = document.getElementById("loginPassword").value
      const errorMsg = document.getElementById("loginErrorMsg")

      if (!email || !password) {
        errorMsg.textContent = "Por favor, complete todos los campos"
        errorMsg.classList.remove("d-none")
        return
      }

      const submitBtn = this.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...'
      submitBtn.disabled = true

      console.log("🔐 Intentando login con:", email)

      fetch("https://hotelitus.onrender.com/sesion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("📥 Respuesta del servidor:", result)
          
          if (result.success) {
            // Guardar datos del usuario
            localStorage.setItem("userLoggedIn", "true")
            localStorage.setItem("currentUserEmail", result.user.correo)
            localStorage.setItem("currentUserData", JSON.stringify(result.user))
            localStorage.setItem("isAdmin", result.user.isAdmin.toString())

            console.log("✅ Login exitoso")
            console.log("👤 Usuario:", result.user.nombre)
            console.log("🔑 Es admin:", result.user.isAdmin)

            // Cerrar modal
            const bootstrap = window.bootstrap
            const loginModal = bootstrap.Modal.getInstance(document.getElementById("loginModal"))
            if (loginModal) {
              loginModal.hide()
            }

            // Verificar si es administrador y mostrar la vista correspondiente
            if (result.user.isAdmin) {
              console.log("🚀 Mostrando panel de administración")
              showAdminPanel()
            } else {
              console.log("🏠 Mostrando contenido normal")
              showMainContent()
              updateUIForLoggedInUser(result.user)
            }

            // Limpiar formulario
            this.reset()
            errorMsg.classList.add("d-none")
          } else {
            console.log("❌ Error en login:", result.message)
            errorMsg.textContent = result.message || "Credenciales incorrectas"
            errorMsg.classList.remove("d-none")
          }
        })
        .catch((error) => {
          console.error("💥 Error en la solicitud:", error)
          errorMsg.textContent = "Error de conexión. Inténtelo de nuevo."
          errorMsg.classList.remove("d-none")
        })
        .finally(() => {
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false
        })
    })
  }
}

function setupUserSession() {
  console.log("🔍 Verificando sesión de usuario...")
  
  const userLoggedIn = localStorage.getItem("userLoggedIn")
  const isAdmin = localStorage.getItem("isAdmin") === "true"
  const currentUserData = localStorage.getItem("currentUserData")

  console.log("📊 Estado de sesión:")
  console.log("- userLoggedIn:", userLoggedIn)
  console.log("- isAdmin:", isAdmin)
  console.log("- currentUserData:", currentUserData)

  if (userLoggedIn === "true" && currentUserData) {
    try {
      const userData = JSON.parse(currentUserData)
      console.log("👤 Datos de usuario:", userData)
      
      if (isAdmin) {
        console.log("🔧 Usuario es administrador, mostrando panel")
        showAdminPanel()
      } else {
        console.log("🏠 Usuario normal, mostrando contenido principal")
        showMainContent()
        updateUIForLoggedInUser(userData)
      }
    } catch (error) {
      console.error("❌ Error al parsear datos de usuario:", error)
      // Limpiar datos corruptos
      localStorage.removeItem("userLoggedIn")
      localStorage.removeItem("currentUserData")
      localStorage.removeItem("isAdmin")
    }
  } else {
    console.log("🚪 No hay sesión activa, mostrando contenido principal")
    showMainContent()
  }

  // Configurar logout
  const logoutLink = document.getElementById("logoutLink")
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault()
      console.log("🚪 Cerrando sesión...")
      
      localStorage.removeItem("userLoggedIn")
      localStorage.removeItem("currentUserEmail")
      localStorage.removeItem("currentUserData")
      localStorage.removeItem("isAdmin")
      
      console.log("✅ Sesión cerrada, recargando página")
      window.location.reload()
    })
  }
}

function updateUIForLoggedInUser(userData) {
  console.log("🎨 Actualizando UI para usuario logueado:", userData.nombre)
  
  // Ocultar botones de login y crear usuario
  const loginLink = document.getElementById("loginLink")
  const createUserLink = document.getElementById("createUserLink")
  const userProfileDropdown = document.getElementById("userProfileDropdown")

  if (loginLink) loginLink.style.display = "none"
  if (createUserLink) createUserLink.style.display = "none"
  if (userProfileDropdown) userProfileDropdown.style.display = "block"

  // Actualizar información del usuario en el dropdown
  const userDisplayName = document.getElementById("userDisplayName")
  const userFullName = document.getElementById("userFullName")
  const userEmail = document.getElementById("userEmail")
  const userInitials = document.getElementById("userInitials")

  if (userDisplayName) userDisplayName.textContent = userData.nombre
  if (userFullName) userFullName.textContent = userData.nombre
  if (userEmail) userEmail.textContent = userData.correo
  if (userInitials) {
    const initials = userData.nombre
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2)
    userInitials.textContent = initials
  }

  console.log("✅ UI actualizada para usuario:", userData.nombre)
}

function initTooltips() {
  // Inicializar tooltips si Bootstrap está disponible
  const bootstrap = window.bootstrap
  if (bootstrap && bootstrap.Tooltip) {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
  }
}

function setupCounterAnimation() {
  // Animación de contadores (si tienes elementos con números)
  const counters = document.querySelectorAll(".counter")
  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"))
    const increment = target / 200

    const updateCounter = () => {
      const current = parseInt(counter.innerText)
      if (current < target) {
        counter.innerText = Math.ceil(current + increment)
        setTimeout(updateCounter, 1)
      } else {
        counter.innerText = target
      }
    }

    updateCounter()
  })
}

function handleResponsiveNav() {
  // Manejar navegación responsive
  const navbarToggler = document.querySelector(".navbar-toggler")
  const navbarCollapse = document.querySelector(".navbar-collapse")

  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener("click", () => {
      navbarCollapse.classList.toggle("show")
    })

    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navbarCollapse.classList.remove("show")
      })
    })
  }
}

function handleNavbarScroll() {
  // Cambiar apariencia del navbar al hacer scroll
  const navbar = document.querySelector(".navbar")
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled")
      } else {
        navbar.classList.remove("scrolled")
      }
    })
  }
}

function setupFieldValidation() {
  // Validación en tiempo real para campos específicos
  const nameField = document.getElementById("userName")
  const phoneField = document.getElementById("userTelefono")

  if (nameField) {
    nameField.addEventListener("input", function () {
      this.value = this.value.replace(/[^A-Za-zÁáÉéÍíÓóÚúÑñ\s]/g, "")
    })
  }

  if (phoneField) {
    phoneField.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9]/g, "")
    })
  }
}

function setupVerificationCode() {
  const verificationInputs = document.querySelectorAll(".verification-input")

  verificationInputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      if (this.value.length === 1 && index < verificationInputs.length - 1) {
        verificationInputs[index + 1].focus()
      }
    })

    input.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && this.value === "" && index > 0) {
        verificationInputs[index - 1].focus()
      }
    })
  })

  const verificationForm = document.getElementById("verificationForm")
  if (verificationForm) {
    verificationForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const code = Array.from(verificationInputs)
        .map((input) => input.value)
        .join("")

      if (code.length === 6) {
        verifyCode(code)
      }
    })
  }
}

function sendVerificationCode(userData) {
  fetch("https://hotelitus.onrender.com/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        // Guardar datos temporalmente
        localStorage.setItem("tempUserData", JSON.stringify(userData))

        // Cerrar modal de crear usuario y abrir modal de verificación
        const bootstrap = window.bootstrap
        const createUserModal = bootstrap.Modal.getInstance(document.getElementById("createUserModal"))
        if (createUserModal) {
          createUserModal.hide()
          setTimeout(() => {
            const verificationModal = new bootstrap.Modal(document.getElementById("verificationModal"))
            verificationModal.show()
          }, 500)
        }
      } else {
        alert("Error: " + (result.message || "No se pudo enviar el código"))
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Error al enviar código de verificación")
    })
}

function verifyCode(code) {
  const tempUserData = JSON.parse(localStorage.getItem("tempUserData"))

  if (!tempUserData) {
    alert("Error: Datos de usuario no encontrados")
    return
  }

  fetch("https://hotelitus.onrender.com/verify-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      correo: tempUserData.correo,
      codigo: code,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        // Limpiar datos temporales
        localStorage.removeItem("tempUserData")

        // Cerrar modal de verificación
        const bootstrap = window.bootstrap
        const verificationModal = bootstrap.Modal.getInstance(document.getElementById("verificationModal"))
        if (verificationModal) {
          verificationModal.hide()
        }

        // Mostrar mensaje de éxito
        alert("¡Usuario creado exitosamente! Ahora puedes iniciar sesión.")

        // Abrir modal de login
        setTimeout(() => {
          const loginModal = new bootstrap.Modal(document.getElementById("loginModal"))
          loginModal.show()
        }, 500)
      } else {
        document.getElementById("verification-error").style.display = "block"
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Error al verificar código")
    })
}

function setupReservationForm() {
  const reservationForm = document.getElementById("reservationForm")

  if (reservationForm) {
    reservationForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const userLoggedIn = localStorage.getItem("userLoggedIn")
      const loginRequiredAlert = document.getElementById("loginRequiredAlert")

      if (userLoggedIn !== "true") {
        loginRequiredAlert.classList.remove("d-none")
        return
      }

      loginRequiredAlert.classList.add("d-none")

      // Obtener datos del formulario
      const formData = {
        checkIn: document.getElementById("checkIn").value,
        checkOut: document.getElementById("checkOut").value,
        roomType: document.getElementById("roomType").value,
        guests: document.getElementById("guests").value,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        specialRequests: document.getElementById("specialRequests").value,
      }

      // Validar fechas
      const today = new Date()
      const checkInDate = new Date(formData.checkIn)
      const checkOutDate = new Date(formData.checkOut)

      if (checkInDate < today) {
        alert("La fecha de entrada no puede ser anterior a hoy")
        return
      }

      if (checkOutDate <= checkInDate) {
        alert("La fecha de salida debe ser posterior a la fecha de entrada")
        return
      }

      // Mapear tipo de habitación a ID
      const roomTypeMap = {
        individual: 1,
        doble: 2,
        suite: 3,
      }

      const habitacionId = roomTypeMap[formData.roomType]
      if (!habitacionId) {
        alert("Por favor seleccione un tipo de habitación válido")
        return
      }

      // Obtener datos del usuario actual
      const currentUserData = JSON.parse(localStorage.getItem("currentUserData"))

      const reservationData = {
        usuario_id: currentUserData.id,
        habitacion_id: habitacionId,
        fecha_inicio: formData.checkIn,
        fecha_fin: formData.checkOut,
        nombre: formData.name,
        correo: formData.email,
        huespedes: formData.guests,
        solicitudes_especiales: formData.specialRequests,
      }

      // Deshabilitar botón y mostrar loading
      const submitBtn = this.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...'
      submitBtn.disabled = true

      // Enviar reserva
      fetch("https://hotelitus.onrender.com/reservar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            // Redirigir a MercadoPago
            window.location.href = result.payment_url
          } else {
            alert("Error al crear reserva: " + (result.message || "Error desconocido"))
          }
        })
        .catch((error) => {
          console.error("Error:", error)
          alert("Error al procesar la reserva. Por favor, inténtelo de nuevo.")
        })
        .finally(() => {
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false
        })
    })
  }

  // Configurar enlace de login desde reserva
  const loginFromReservation = document.getElementById("loginFromReservation")
  if (loginFromReservation) {
    loginFromReservation.addEventListener("click", (e) => {
      e.preventDefault()
      const bootstrap = window.bootstrap
      if (bootstrap) {
        const loginModal = new bootstrap.Modal(document.getElementById("loginModal"))
        loginModal.show()
      }
    })
  }
}

function setupMyReservations() {
  // Esta función se llama cuando se abre el modal de reservas
}

function loadUserReservations() {
  const currentUserData = JSON.parse(localStorage.getItem("currentUserData"))
  const reservationsLoading = document.getElementById("reservationsLoading")
  const noReservationsMessage = document.getElementById("noReservationsMessage")
  const reservationsList = document.getElementById("reservationsList")
  const reservationsTableBody = document.getElementById("reservationsTableBody")

  if (!currentUserData) {
    console.error("No hay datos de usuario")
    return
  }

  // Mostrar loading
  reservationsLoading.classList.remove("d-none")
  noReservationsMessage.classList.add("d-none")
  reservationsList.classList.add("d-none")

  fetch("https://hotelitus.onrender.com/user-reservations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usuario_id: currentUserData.id,
      correo: currentUserData.correo,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      reservationsLoading.classList.add("d-none")

      if (result.success && result.reservas.length > 0) {
        // Mostrar reservas
        reservationsTableBody.innerHTML = ""

        result.reservas.forEach((reserva) => {
          const row = document.createElement("tr")

          const fechaInicio = new Date(reserva.fecha_inicio).toLocaleDateString()
          const fechaFin = new Date(reserva.fecha_fin).toLocaleDateString()

          let estadoBadge = ""
          if (reserva.estado === "confirmada") {
            estadoBadge = '<span class="badge bg-success">Confirmada</span>'
          } else if (reserva.estado === "pendiente_pago") {
            estadoBadge = '<span class="badge bg-warning text-dark">Pendiente Pago</span>'
          } else if (reserva.estado === "pendiente") {
            estadoBadge = '<span class="badge bg-info">Pendiente</span>'
          } else if (reserva.estado === "cancelada") {
            estadoBadge = '<span class="badge bg-danger">Cancelada</span>'
          }

          row.innerHTML = `
            <td>${fechaInicio}</td>
            <td>${fechaFin}</td>
            <td>${reserva.habitacion_tipo}</td>
            <td>1</td>
            <td>${estadoBadge}</td>
            <td>
              ${
                reserva.estado === "confirmada" || reserva.estado === "pendiente"
                  ? `<button class="btn btn-sm btn-outline-danger" onclick="cancelReservation(${reserva.id})">Cancelar</button>`
                  : "-"
              }
            </td>
          `

          reservationsTableBody.appendChild(row)
        })

        reservationsList.classList.remove("d-none")
      } else {
        // No hay reservas
        noReservationsMessage.classList.remove("d-none")
      }
    })
    .catch((error) => {
      console.error("Error al cargar reservas:", error)
      reservationsLoading.classList.add("d-none")
      alert("Error al cargar las reservas")
    })
}

function cancelReservation(reservationId) {
  if (confirm("¿Está seguro que desea cancelar esta reserva?")) {
    fetch("https://hotelitus.onrender.com/cancel-reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: reservationId }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert("Reserva cancelada con éxito")
          loadUserReservations() // Recargar la lista
        } else {
          alert("Error al cancelar la reserva: " + (result.message || "Error desconocido"))
        }
      })
      .catch((error) => {
        console.error("Error al cancelar reserva:", error)
        alert("Error al cancelar la reserva. Por favor, inténtelo de nuevo.")
      })
  }
}

function setupDateConstraints() {
  const checkInInput = document.getElementById("checkIn")
  const checkOutInput = document.getElementById("checkOut")

  if (checkInInput && checkOutInput) {
    // Establecer fecha mínima como hoy
    const today = new Date().toISOString().split("T")[0]
    checkInInput.min = today
    checkOutInput.min = today

    // Cuando cambia la fecha de entrada, actualizar la fecha mínima de salida
    checkInInput.addEventListener("change", function () {
      const checkInDate = new Date(this.value)
      checkInDate.setDate(checkInDate.getDate() + 1) // Mínimo 1 día después
      checkOutInput.min = checkInDate.toISOString().split("T")[0]

      // Si la fecha de salida es anterior a la nueva fecha mínima, limpiarla
      if (checkOutInput.value && new Date(checkOutInput.value) <= new Date(this.value)) {
        checkOutInput.value = ""
      }
    })
  }
}
