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
  // Ocultar el contenido principal
  const mainContent = document.getElementById("main-content")
  const adminPanel = document.getElementById("admin-panel")
  
  if (mainContent) mainContent.style.display = "none"
  if (adminPanel) adminPanel.style.display = "block"
  
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
    } catch (e) {
      adminUserName.textContent = "Administrador"
    }
  }
}

function showMainContent() {
  // Mostrar el contenido principal
  const mainContent = document.getElementById("main-content")
  const adminPanel = document.getElementById("admin-panel")
  
  if (mainContent) mainContent.style.display = "block"
  if (adminPanel) adminPanel.style.display = "none"
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
