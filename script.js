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

  // Nuevas funciones para administración
  setupLoginFormWithAdmin()
  setupLogoutWithAdmin()
  checkAdminSession()

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

// Variables globales para administración
let isAdminLoggedIn = false
let currentAdminUser = null

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

// Función para mostrar/ocultar panel de administración
function toggleAdminPanel(show) {
  const adminPanel = document.getElementById("admin-panel")
  const regularSections = document.querySelectorAll("section:not(#admin-panel)")

  if (show) {
    adminPanel.style.display = "block"
    regularSections.forEach((section) => {
      if (section.id !== "admin-panel") {
        section.style.display = "none"
      }
    })
    // Cargar datos del dashboard
    cargarEstadisticasAdmin()
    cargarReservasAdmin()
  } else {
    adminPanel.style.display = "none"
    regularSections.forEach((section) => {
      section.style.display = "block"
    })
  }
}

// Modificar la función de login existente para detectar administradores
function setupLoginFormWithAdmin() {
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

      // Usar el endpoint de admin-login que maneja tanto admins como usuarios
      fetch("https://hotelitus.onrender.com/admin-login", {
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
        .then((data) => {
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false

          if (data.success) {
            // Guardar información de sesión
            localStorage.setItem("userLoggedIn", "true")
            localStorage.setItem("usuarioLogueado", email)
            localStorage.setItem("currentUserEmail", email)
            localStorage.setItem("currentUserData", JSON.stringify(data.user))

            if (data.isAdmin) {
              // Es administrador
              localStorage.setItem("isAdmin", "true")
              isAdminLoggedIn = true
              currentAdminUser = data.user

              // Cerrar modal
              const bootstrap = window.bootstrap
              if (bootstrap) {
                const loginModal = bootstrap.Modal.getInstance(document.getElementById("loginModal"))
                if (loginModal) {
                  loginModal.hide()
                }
              }

              // Mostrar panel de administración
              toggleAdminPanel(true)
              updateAdminUI()
            } else {
              // Es usuario normal
              localStorage.setItem("isAdmin", "false")

              // Cerrar modal
              const bootstrap = window.bootstrap
              if (bootstrap) {
                const loginModal = bootstrap.Modal.getInstance(document.getElementById("loginModal"))
                if (loginModal) {
                  loginModal.hide()
                }
              }

              // Recargar la página para actualizar el estado de sesión
              window.location.reload()
            }
          } else {
            errorMsg.textContent = data.message || "Credenciales incorrectas"
            errorMsg.classList.remove("d-none")
          }
        })
        .catch((error) => {
          console.error("Error al iniciar sesión:", error)
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false
          errorMsg.textContent = "Error al conectar con el servidor. Intente nuevamente."
          errorMsg.classList.remove("d-none")
        })
    })
  }
}

// Función para actualizar la UI del administrador
function updateAdminUI() {
  const adminUserName = document.getElementById("adminUserName")
  if (adminUserName && currentAdminUser) {
    adminUserName.textContent = currentAdminUser.nombre
  }
}

// Función para cargar estadísticas del dashboard
function cargarEstadisticasAdmin() {
  const adminEmail = localStorage.getItem("currentUserEmail")

  fetch("https://hotelitus.onrender.com/admin/estadisticas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo: adminEmail }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        document.getElementById("totalUsuarios").textContent = data.estadisticas.totalUsuarios
        document.getElementById("totalReservas").textContent = data.estadisticas.totalReservas
        document.getElementById("reservasActivas").textContent = data.estadisticas.reservasActivas
        document.getElementById("ingresosMes").textContent = `$${data.estadisticas.ingresosMes.toFixed(2)}`
      }
    })
    .catch((error) => {
      console.error("Error al cargar estadísticas:", error)
    })
}

// Función para cargar reservas en el panel de administración
function cargarReservasAdmin() {
  const adminEmail = localStorage.getItem("currentUserEmail")
  const loadingDiv = document.getElementById("reservasAdminLoading")
  const contentDiv = document.getElementById("reservasAdminContent")
  const tableBody = document.getElementById("reservasAdminTableBody")

  loadingDiv.style.display = "block"
  contentDiv.style.display = "none"

  fetch("https://hotelitus.onrender.com/admin/reservas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo: adminEmail }),
  })
    .then((response) => response.json())
    .then((data) => {
      loadingDiv.style.display = "none"
      contentDiv.style.display = "block"

      if (data.success) {
        tableBody.innerHTML = ""

        data.reservas.forEach((reserva) => {
          const fechaInicio = new Date(reserva.fecha_inicio).toLocaleDateString()
          const fechaFin = new Date(reserva.fecha_fin).toLocaleDateString()
          const dias = Math.ceil((new Date(reserva.fecha_fin) - new Date(reserva.fecha_inicio)) / (1000 * 60 * 60 * 24))
          const total = (reserva.precio_por_noche * dias).toFixed(2)

          let estadoClass = ""
          if (reserva.estado === "confirmada") estadoClass = "bg-success"
          else if (reserva.estado === "pendiente") estadoClass = "bg-warning"
          else if (reserva.estado === "cancelada") estadoClass = "bg-danger"

          const row = document.createElement("tr")
          row.innerHTML = `
                        <td>${reserva.id}</td>
                        <td>
                            <strong>${reserva.usuario_nombre}</strong>
                        </td>
                        <td>
                            <small>
                                <i class="fas fa-envelope me-1"></i>${reserva.usuario_correo}<br>
                                <i class="fas fa-phone me-1"></i>${reserva.usuario_telefono || "N/A"}
                            </small>
                        </td>
                        <td>
                            ${reserva.habitacion_tipo} #${reserva.habitacion_numero}<br>
                            <small class="text-muted">$${reserva.precio_por_noche}/noche</small>
                        </td>
                        <td>${fechaInicio}</td>
                        <td>${fechaFin}</td>
                        <td>
                            <span class="badge ${estadoClass}">${reserva.estado.toUpperCase()}</span>
                        </td>
                        <td><strong>$${total}</strong></td>
                        <td>
                            <div class="btn-group btn-group-sm">
                                ${
                                  reserva.estado === "pendiente"
                                    ? `<button class="btn btn-success btn-sm" onclick="actualizarEstadoReserva(${reserva.id}, 'confirmada')">
                                        <i class="fas fa-check"></i>
                                    </button>`
                                    : ""
                                }
                                ${
                                  reserva.estado !== "cancelada"
                                    ? `<button class="btn btn-danger btn-sm" onclick="actualizarEstadoReserva(${reserva.id}, 'cancelada')">
                                        <i class="fas fa-times"></i>
                                    </button>`
                                    : ""
                                }
                            </div>
                        </td>
                    `
          tableBody.appendChild(row)
        })
      }
    })
    .catch((error) => {
      console.error("Error al cargar reservas:", error)
      loadingDiv.style.display = "none"
    })
}

// Función para cargar usuarios en el panel de administración
function cargarUsuariosAdmin() {
  const adminEmail = localStorage.getItem("currentUserEmail")
  const loadingDiv = document.getElementById("usuariosAdminLoading")
  const contentDiv = document.getElementById("usuariosAdminContent")
  const tableBody = document.getElementById("usuariosAdminTableBody")

  loadingDiv.style.display = "block"
  contentDiv.style.display = "none"

  fetch("https://hotelitus.onrender.com/admin/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo: adminEmail }),
  })
    .then((response) => response.json())
    .then((data) => {
      loadingDiv.style.display = "none"
      contentDiv.style.display = "block"

      if (data.success) {
        tableBody.innerHTML = ""

        data.usuarios.forEach((usuario) => {
          const ultimaReserva = usuario.ultima_reserva ? new Date(usuario.ultima_reserva).toLocaleDateString() : "Nunca"

          const estadoCliente = usuario.total_reservas > 0 ? "Activo" : "Nuevo"
          const estadoClass = usuario.total_reservas > 0 ? "bg-success" : "bg-secondary"

          const row = document.createElement("tr")
          row.innerHTML = `
                        <td>${usuario.id}</td>
                        <td>
                            <strong>${usuario.nombre}</strong>
                        </td>
                        <td>
                            <i class="fas fa-envelope me-1"></i>${usuario.correo}
                        </td>
                        <td>
                            <i class="fas fa-phone me-1"></i>${usuario.telefono || "N/A"}
                        </td>
                        <td>
                            <span class="badge bg-primary">${usuario.total_reservas}</span>
                        </td>
                        <td>${ultimaReserva}</td>
                        <td>
                            <span class="badge ${estadoClass}">${estadoCliente}</span>
                        </td>
                    `
          tableBody.appendChild(row)
        })
      }
    })
    .catch((error) => {
      console.error("Error al cargar usuarios:", error)
      loadingDiv.style.display = "none"
    })
}

// Función para actualizar estado de reserva
function actualizarEstadoReserva(reservaId, nuevoEstado) {
  const adminEmail = localStorage.getItem("currentUserEmail")

  if (!confirm(`¿Está seguro que desea ${nuevoEstado === "confirmada" ? "confirmar" : "cancelar"} esta reserva?`)) {
    return
  }

  fetch("https://hotelitus.onrender.com/admin/actualizar-reserva", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      correo: adminEmail,
      reservaId: reservaId,
      nuevoEstado: nuevoEstado,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Estado de reserva actualizado correctamente")
        cargarReservasAdmin() // Recargar la tabla
        cargarEstadisticasAdmin() // Actualizar estadísticas
      } else {
        alert("Error al actualizar la reserva: " + data.message)
      }
    })
    .catch((error) => {
      console.error("Error al actualizar reserva:", error)
      alert("Error al actualizar la reserva")
    })
}

// Modificar la función de logout para manejar administradores
function setupLogoutWithAdmin() {
  const logoutLink = document.getElementById("logoutLink")
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault()

      // Limpiar datos de sesión
      localStorage.removeItem("userLoggedIn")
      localStorage.removeItem("currentUserEmail")
      localStorage.removeItem("currentUserData")
      localStorage.removeItem("isAdmin")

      // Resetear variables globales
      isAdminLoggedIn = false
      currentAdminUser = null

      // Mostrar secciones normales y ocultar panel de admin
      toggleAdminPanel(false)

      // Recargar la página
      window.location.reload()
    })
  }
}

// Función para verificar si el usuario es admin al cargar la página
function checkAdminSession() {
  const isAdmin = localStorage.getItem("isAdmin") === "true"
  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true"

  if (isLoggedIn && isAdmin) {
    const userData = localStorage.getItem("currentUserData")
    if (userData) {
      try {
        currentAdminUser = JSON.parse(userData)
        isAdminLoggedIn = true
        toggleAdminPanel(true)
        updateAdminUI()
      } catch (e) {
        console.error("Error al parsear datos de admin:", e)
      }
    }
  }
}

function showReservationMessage(message, type = "danger") {
  const messagesDiv = document.getElementById("reservationMessages")
  if (messagesDiv) {
    messagesDiv.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `

    // Hacer scroll al mensaje
    messagesDiv.scrollIntoView({ behavior: "smooth", block: "center" })
  }
}

function setupReservationForm() {
  const reservationForm = document.getElementById("reservationForm")

  if (reservationForm) {
    reservationForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const isLoggedIn = localStorage.getItem("userLoggedIn") === "true"

      if (!isLoggedIn) {
        document.getElementById("loginRequiredAlert").classList.remove("d-none")
        return
      }

      const checkIn = document.getElementById("checkIn").value
      const checkOut = document.getElementById("checkOut").value
      const roomType = document.getElementById("roomType").value
      const guests = document.getElementById("guests").value
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const specialRequests = document.getElementById("specialRequests").value

      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (checkInDate < today) {
        showReservationMessage("La fecha de entrada no puede ser anterior a hoy")
        return
      }

      if (checkInDate >= checkOutDate) {
        showReservationMessage("La fecha de salida debe ser posterior a la fecha de entrada")
        return
      }

      if ((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24) > 30) {
        showReservationMessage("La reserva no puede ser por más de 30 días")
        return
      }

      // Obtener el ID de usuario del localStorage si está disponible
      let userId = null
      const userDataStr = localStorage.getItem("currentUserData")

      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr)
          if (userData && userData.id) {
            userId = userData.id
            console.log("ID de usuario encontrado en localStorage:", userId)
          }
        } catch (e) {
          console.error("Error al parsear datos de usuario:", e)
        }
      }

      // Si no se encontró el ID, usar el correo electrónico
      let userEmail = email
      if (!userEmail) {
        userEmail = localStorage.getItem("currentUserEmail") || localStorage.getItem("usuarioLogueado")
        console.log("Usando correo electrónico para identificar al usuario:", userEmail)
      }

      if (!userId && !userEmail) {
        showReservationMessage("Error: No se pudo identificar al usuario. Por favor, inicie sesión nuevamente.")
        return
      }

      const submitBtn = document.querySelector('#reservationForm button[type="submit"]')
      const originalBtnText = submitBtn.innerHTML

      const reservationData = {
        usuario_id: userId,
        habitacion_id: getRoomIdByType(roomType),
        fecha_inicio: checkIn,
        fecha_fin: checkOut,
        estado: "pendiente",
        nombre: name,
        correo: userEmail,
        huespedes: guests,
        solicitudes_especiales: specialRequests,
      }

      console.log("Datos completos de la reserva a enviar:", JSON.stringify(reservationData, null, 2))

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...'
      submitBtn.disabled = true

      // Enviar directamente la reserva (el backend ya maneja la verificación de disponibilidad)
      fetch("https://hotelitus.onrender.com/reservar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      })
        .then((response) => {
          console.log("Respuesta del servidor:", response.status)
          return response.json().then((data) => {
            if (!response.ok) {
              throw new Error(data.message || `Error al crear la reserva (${response.status})`)
            }
            return data
          })
        })
        .then((result) => {
          console.log("Resultado exitoso:", result)
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false

          showReservationMessage("¡Reserva creada con éxito! Gracias por elegir Hotelituss.", "success")

          document.getElementById("reservationForm").reset()

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
          console.error("Error detallado al crear reserva:", error)

          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false

          // Mensajes de error más específicos
          if (error.message.includes("no está disponible")) {
            showReservationMessage(
              "La habitación seleccionada no está disponible para las fechas indicadas. Por favor, seleccione otras fechas o tipo de habitación.",
            )
          } else if (error.message.includes("usuario")) {
            showReservationMessage("Error con la identificación del usuario. Por favor, inicie sesión nuevamente.")
          } else {
            showReservationMessage("Error al crear la reserva: " + error.message)
          }
        })
    })
  }

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

function getRoomIdByType(type) {
  const roomTypes = {
    individual: 1,
    doble: 2,
    suite: 3,
  }

  // Asegurarse de que el tipo existe y convertirlo a minúsculas
  const roomType = type ? type.toLowerCase() : ""

  // Verificar si el tipo existe en nuestro objeto
  if (roomTypes.hasOwnProperty(roomType)) {
    console.log(`Tipo de habitación seleccionada: ${roomType}, ID: ${roomTypes[roomType]}`)
    return roomTypes[roomType]
  } else {
    console.warn(`Tipo de habitación desconocido: ${roomType}, usando ID por defecto: 1`)
    return 1 // Valor por defecto
  }
}

function setupMyReservations() {
  const myReservationsModal = document.getElementById("myReservationsModal")

  if (myReservationsModal) {
    myReservationsModal.addEventListener("show.bs.modal", () => {
      loadUserReservations()
    })
  }
}

function loadUserReservations() {
  const reservationsLoading = document.getElementById("reservationsLoading")
  const noReservationsMessage = document.getElementById("noReservationsMessage")
  const reservationsList = document.getElementById("reservationsList")
  const reservationsTableBody = document.getElementById("reservationsTableBody")

  if (!reservationsLoading || !noReservationsMessage || !reservationsList || !reservationsTableBody) {
    console.error("Elementos del modal de reservas no encontrados")
    return
  }

  reservationsLoading.classList.remove("d-none")
  noReservationsMessage.classList.add("d-none")
  reservationsList.classList.add("d-none")

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
    reservationsLoading.classList.add("d-none")
    noReservationsMessage.classList.remove("d-none")
    return
  }

  const payload = {}
  if (userId) {
    payload.usuario_id = userId
  } else {
    payload.correo = userEmail
  }

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
      reservationsLoading.classList.add("d-none")

      if (data.reservas && data.reservas.length > 0) {
        reservationsList.classList.remove("d-none")
        reservationsTableBody.innerHTML = ""

        data.reservas.forEach((reserva) => {
          const row = document.createElement("tr")

          const fechaInicio = new Date(reserva.fecha_inicio).toLocaleDateString()
          const fechaFin = new Date(reserva.fecha_fin).toLocaleDateString()

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

        document.querySelectorAll(".cancel-reservation").forEach((btn) => {
          btn.addEventListener("click", function () {
            const reservaId = this.getAttribute("data-id")
            if (confirm("¿Está seguro que desea cancelar esta reserva?")) {
              cancelReservation(reservaId)
            }
          })
        })
      } else {
        noReservationsMessage.classList.remove("d-none")
      }
    })
    .catch((error) => {
      console.error("Error al cargar reservas:", error)
      reservationsLoading.classList.add("d-none")
      noReservationsMessage.classList.remove("d-none")
      noReservationsMessage.querySelector("h5").textContent = "Error al cargar reservas"
      noReservationsMessage.querySelector("p").textContent =
        "Ha ocurrido un error. Por favor, inténtelo de nuevo más tarde."
    })
}

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
        loadUserReservations()
      } else {
        alert("Error al cancelar la reserva: " + (result.message || "Error desconocido"))
      }
    })
    .catch((error) => {
      console.error("Error al cancelar reserva:", error)
      alert("Error al cancelar la reserva")
    })
}

function getTipoHabitacion(habitacionId) {
  const tipos = {
    1: "Individual",
    2: "Doble",
    3: "Suite",
  }
  return tipos[habitacionId] || "Desconocido"
}

function initTooltips() {
  const bootstrap = window.bootstrap
  if (bootstrap && bootstrap.Tooltip) {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))
  }
}

function setupCounterAnimation() {
  const counters = document.querySelectorAll(".counter")
  const observerOptions = {
    threshold: 0.7,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target
        const target = Number.parseInt(counter.getAttribute("data-target"))
        const increment = target / 100

        let current = 0
        const timer = setInterval(() => {
          current += increment
          counter.textContent = Math.floor(current)

          if (current >= target) {
            counter.textContent = target
            clearInterval(timer)
          }
        }, 20)

        observer.unobserve(counter)
      }
    })
  }, observerOptions)

  counters.forEach((counter) => {
    observer.observe(counter)
  })
}

function handleResponsiveNav() {
  const navbarToggler = document.querySelector(".navbar-toggler")
  const navbarCollapse = document.querySelector(".navbar-collapse")

  if (navbarToggler && navbarCollapse) {
    document.addEventListener("click", (e) => {
      if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
        const bsCollapse = window.bootstrap?.Collapse?.getInstance(navbarCollapse)
        if (bsCollapse) {
          bsCollapse.hide()
        }
      }
    })
  }
}

function handleNavbarScroll() {
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
  const nameField = document.getElementById("userName")
  if (nameField) {
    nameField.addEventListener("input", function () {
      this.value = this.value.replace(/[^A-Za-zÁáÉéÍíÓóÚúÑñ\s]/g, "")
    })
  }

  const phoneField = document.getElementById("userTelefono")
  if (phoneField) {
    phoneField.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9]/g, "")
    })
  }
}

function setupUserSession() {
  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true"
  const userEmail = localStorage.getItem("currentUserEmail")

  if (isLoggedIn && userEmail) {
    updateUIForLoggedInUser(userEmail)
  }
}

function updateUIForLoggedInUser(email) {
  const loginLink = document.getElementById("loginLink")
  const createUserLink = document.getElementById("createUserLink")
  const userProfileDropdown = document.getElementById("userProfileDropdown")

  if (loginLink) loginLink.style.display = "none"
  if (createUserLink) createUserLink.style.display = "none"
  if (userProfileDropdown) userProfileDropdown.style.display = "block"

  fetch("https://hotelitus.onrender.com/get-user-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo: email }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const user = data.user
        const userInitials = document.getElementById("userInitials")
        const userDisplayName = document.getElementById("userDisplayName")
        const userFullName = document.getElementById("userFullName")
        const userEmailElement = document.getElementById("userEmail")

        if (userInitials) {
          userInitials.textContent = user.nombre.charAt(0).toUpperCase()
        }
        if (userDisplayName) {
          userDisplayName.textContent = user.nombre.split(" ")[0]
        }
        if (userFullName) {
          userFullName.textContent = user.nombre
        }
        if (userEmailElement) {
          userEmailElement.textContent = user.correo
        }

        localStorage.setItem("currentUserData", JSON.stringify(user))
      }
    })
    .catch((error) => {
      console.error("Error al obtener datos del usuario:", error)
    })
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
    verificationForm.addEventListener("submit", (e) => {
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
  const submitBtn = document.querySelector('#createUserForm button[type="submit"]')
  const originalBtnText = submitBtn.innerHTML

  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...'
  submitBtn.disabled = true

  fetch("https://hotelitus.onrender.com/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => response.json())
    .then((data) => {
      submitBtn.innerHTML = originalBtnText
      submitBtn.disabled = false

      if (data.success) {
        localStorage.setItem("pendingUserData", JSON.stringify(userData))

        const bootstrap = window.bootstrap
        if (bootstrap) {
          const createUserModal = bootstrap.Modal.getInstance(document.getElementById("createUserModal"))
          if (createUserModal) {
            createUserModal.hide()
          }

          setTimeout(() => {
            const verificationModal = new bootstrap.Modal(document.getElementById("verificationModal"))
            verificationModal.show()
          }, 500)
        }
      } else {
        alert("Error al enviar código de verificación: " + (data.message || "Error desconocido"))
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      submitBtn.innerHTML = originalBtnText
      submitBtn.disabled = false
      alert("Error al conectar con el servidor")
    })
}

function verifyCode(code) {
  const userData = JSON.parse(localStorage.getItem("pendingUserData"))
  const submitBtn = document.querySelector('#verificationForm button[type="submit"]')
  const originalBtnText = submitBtn.innerHTML
  const errorDiv = document.getElementById("verification-error")

  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...'
  submitBtn.disabled = true

  fetch("https://hotelitus.onrender.com/verify-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      correo: userData.correo,
      codigo: code,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      submitBtn.innerHTML = originalBtnText
      submitBtn.disabled = false

      if (data.success) {
        localStorage.removeItem("pendingUserData")

        const bootstrap = window.bootstrap
        if (bootstrap) {
          const verificationModal = bootstrap.Modal.getInstance(document.getElementById("verificationModal"))
          if (verificationModal) {
            verificationModal.hide()
          }
        }

        alert("¡Usuario creado exitosamente! Ya puedes iniciar sesión.")

        setTimeout(() => {
          const loginModal = new bootstrap.Modal(document.getElementById("loginModal"))
          loginModal.show()
        }, 1000)
      } else {
        errorDiv.style.display = "block"
        errorDiv.textContent = data.message || "Código incorrecto"

        document.querySelectorAll(".verification-input").forEach((input) => {
          input.value = ""
        })
        document.querySelector(".verification-input").focus()
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      submitBtn.innerHTML = originalBtnText
      submitBtn.disabled = false
      errorDiv.style.display = "block"
      errorDiv.textContent = "Error al verificar el código"
    })
}

function setupDateConstraints() {
  const checkInInput = document.getElementById("checkIn")
  const checkOutInput = document.getElementById("checkOut")

  if (checkInInput && checkOutInput) {
    const today = new Date().toISOString().split("T")[0]
    checkInInput.min = today

    checkInInput.addEventListener("change", function () {
      const checkInDate = new Date(this.value)
      const nextDay = new Date(checkInDate)
      nextDay.setDate(nextDay.getDate() + 1)

      checkOutInput.min = nextDay.toISOString().split("T")[0]

      if (checkOutInput.value && new Date(checkOutInput.value) <= checkInDate) {
        checkOutInput.value = ""
      }
    })
  }
}
