// Variables globales
let currentUser = null
let currentScreen = "login"
let reservas = JSON.parse(localStorage.getItem("reservas")) || []
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    email: "admin@hotelituss.com",
    role: "admin",
    created: new Date().toISOString(),
    status: "active",
  },
  {
    id: 2,
    username: "manager",
    password: "manager123",
    email: "manager@hotelituss.com",
    role: "manager",
    created: new Date().toISOString(),
    status: "active",
  },
]
let huespedes = JSON.parse(localStorage.getItem("huespedes")) || []

// Variables globales y configuración inicial
let isAdminMode = false
let reservations = JSON.parse(localStorage.getItem("hotelReservations")) || []
let users = JSON.parse(localStorage.getItem("hotelUsers")) || []
const adminUsers = JSON.parse(localStorage.getItem("hotelAdminUsers")) || [
  {
    id: 1,
    username: "admin",
    email: "admin@hotelituss.com",
    password: "admin123",
    role: "admin",
    status: "activo",
    created: new Date().toISOString(),
  },
  {
    id: 2,
    username: "manager",
    email: "manager@hotelituss.com",
    password: "manager456",
    role: "manager",
    status: "activo",
    created: new Date().toISOString(),
  },
]

// Configuración de precios
const roomPrices = {
  individual: 120,
  doble: 180,
  suite: 280,
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
})

// Inicialización cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
  checkUserSession()
})

// Función de inicialización principal
function initializeApp() {
  // Inicializar AOS (Animate On Scroll)
  AOS.init({
    duration: 1000,
    once: true,
  })

  // Configurar fechas mínimas en formularios
  setMinDates()

  // Inicializar mapa
  initializeMap()

  // Configurar botones de navegación
  setupScrollButtons()
}

function setupEventListeners() {
  // Formularios de login
  document.getElementById("userLoginForm").addEventListener("submit", handleUserLogin)
  document.getElementById("adminLoginForm").addEventListener("submit", handleAdminLogin)
  document.getElementById("userRegisterForm").addEventListener("submit", handleUserRegister)

  // Formulario de reservas
  document.getElementById("reservaForm").addEventListener("submit", handleReserva)

  // Formulario de configuración
  document.getElementById("configForm").addEventListener("submit", handleConfigSave)

  // Búsquedas en tablas
  document.getElementById("searchReservas").addEventListener("input", filterReservas)
  document.getElementById("searchHuespedes").addEventListener("input", filterHuespedes)
  document.getElementById("searchUsuarios").addEventListener("input", filterUsuarios)
}

// Configurar event listeners
function setupEventListeners() {
  // Formularios
  document.getElementById("createUserForm").addEventListener("submit", handleCreateUser)
  document.getElementById("loginForm").addEventListener("submit", handleLogin)
  document.getElementById("reservationForm").addEventListener("submit", handleReservation)
  document.getElementById("configForm").addEventListener("submit", handleConfigSave)

  // Enlaces de navegación
  document.getElementById("loginLink").addEventListener("click", showLoginModal)
  document.getElementById("createUserLink").addEventListener("click", showCreateUserModal)
  document.getElementById("myReservationsLink").addEventListener("click", showMyReservations)
  document.getElementById("logoutLink").addEventListener("click", handleLogout)
  document.getElementById("showAdminPanel").addEventListener("click", showAdminPanel)

  // Switches entre modales
  document.getElementById("switchToLogin").addEventListener("click", switchToLogin)
  document.getElementById("switchToCreateUser").addEventListener("click", switchToCreateUser)
  document.getElementById("loginFromReservation").addEventListener("click", showLoginModal)

  // Búsquedas en admin
  document.getElementById("searchReservas").addEventListener("input", filterReservations)
  document.getElementById("searchUsuarios").addEventListener("input", filterUsers)

  // Navegación suave
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Verificar sesión de usuario
function checkUserSession() {
  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    updateUserInterface()

    // Si es admin, verificar si debe mostrar el panel
    if (currentUser.role === "admin" || currentUser.role === "manager") {
      const showAdmin = localStorage.getItem("showAdminPanel")
      if (showAdmin === "true") {
        showAdminPanel()
      }
    }
  }
}

// Actualizar interfaz de usuario
function updateUserInterface() {
  if (currentUser) {
    // Ocultar botones de login/registro
    document.getElementById("loginLink").style.display = "none"
    document.getElementById("createUserLink").style.display = "none"

    // Mostrar perfil de usuario
    document.getElementById("userProfileDropdown").style.display = "block"
    document.getElementById("userDisplayName").textContent = currentUser.nombre || currentUser.username
    document.getElementById("userFullName").textContent = currentUser.nombre || currentUser.username
    document.getElementById("userEmail").textContent = currentUser.correo || currentUser.email

    // Mostrar iniciales en avatar
    const initials = (currentUser.nombre || currentUser.username)
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    document.getElementById("userInitials").textContent = initials

    // Mostrar enlace de admin si es necesario
    if (currentUser.role === "admin" || currentUser.role === "manager") {
      document.getElementById("adminPanelLink").style.display = "block"
    }

    // Pre-llenar formulario de reservas
    document.getElementById("name").value = currentUser.nombre || ""
    document.getElementById("email").value = currentUser.correo || currentUser.email || ""
  } else {
    // Mostrar botones de login/registro
    document.getElementById("loginLink").style.display = "block"
    document.getElementById("createUserLink").style.display = "block"

    // Ocultar perfil de usuario
    document.getElementById("userProfileDropdown").style.display = "none"
    document.getElementById("adminPanelLink").style.display = "none"
  }
}

// Funciones de autenticación
function switchTab(tab) {
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))
  document.querySelectorAll(".login-form").forEach((form) => form.classList.remove("active"))

  event.target.classList.add("active")
  document.getElementById(tab + "Login").classList.add("active")
}

function showRegister() {
  document.querySelectorAll(".login-form").forEach((form) => (form.style.display = "none"))
  document.getElementById("registerForm").style.display = "block"
}

function showLogin() {
  document.querySelectorAll(".login-form").forEach((form) => (form.style.display = "none"))
  document.getElementById("userLogin").style.display = "block"
}

function handleUserLogin(e) {
  e.preventDefault()
  const username = document.getElementById("userUsername").value
  const password = document.getElementById("userPassword").value

  const user = usuarios.find((u) => u.username === username && u.password === password && u.role === "user")

  if (user) {
    currentUser = user
    localStorage.setItem("currentUser", JSON.stringify(user))
    showScreen("user")
    showMessage("Bienvenido " + user.username, "success")
  } else {
    showMessage("Credenciales incorrectas", "error")
  }
}

function handleAdminLogin(e) {
  e.preventDefault()
  const username = document.getElementById("adminUsername").value
  const password = document.getElementById("adminPassword").value

  const admin = usuarios.find(
    (u) => u.username === username && u.password === password && (u.role === "admin" || u.role === "manager"),
  )

  if (admin) {
    currentUser = admin
    localStorage.setItem("currentUser", JSON.stringify(admin))
    showScreen("admin")
    loadDashboardStats()
    showMessage("Bienvenido al panel de administración", "success")
  } else {
    showMessage("Credenciales de administrador incorrectas", "error")
  }
}

function handleUserRegister(e) {
  e.preventDefault()
  const username = document.getElementById("regUsername").value
  const email = document.getElementById("regEmail").value
  const password = document.getElementById("regPassword").value
  const confirmPassword = document.getElementById("regConfirmPassword").value

  // Validaciones
  if (password !== confirmPassword) {
    showMessage("Las contraseñas no coinciden", "error")
    return
  }

  if (usuarios.find((u) => u.username === username)) {
    showMessage("El usuario ya existe", "error")
    return
  }

  if (usuarios.find((u) => u.email === email)) {
    showMessage("El email ya está registrado", "error")
    return
  }

  // Crear nuevo usuario
  const newUser = {
    id: usuarios.length + 1,
    username: username,
    email: email,
    password: password,
    role: "user",
    created: new Date().toISOString(),
    status: "active",
  }

  usuarios.push(newUser)
  localStorage.setItem("usuarios", JSON.stringify(usuarios))

  showMessage("Usuario registrado exitosamente", "success")
  showLogin()

  // Limpiar formulario
  document.getElementById("userRegisterForm").reset()
}

function logout() {
  currentUser = null
  localStorage.removeItem("currentUser")
  showScreen("login")
  showMessage("Sesión cerrada", "success")
}

// Configurar fechas mínimas
function setMinDates() {
  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]

  document.getElementById("checkIn").min = today
  document.getElementById("checkOut").min = tomorrow

  document.getElementById("checkIn").addEventListener("change", function () {
    const checkInDate = new Date(this.value)
    const minCheckOut = new Date(checkInDate.getTime() + 86400000).toISOString().split("T")[0]
    document.getElementById("checkOut").min = minCheckOut
  })
}

// Inicializar mapa
function initializeMap() {
  if (typeof L !== "undefined") {
    const map = L.map("map").setView([-32.8908, -68.8272], 15)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map)

    L.marker([-32.8908, -68.8272]).addTo(map).bindPopup("Hotelituss<br>Av. Emilio Civit 367, Mendoza").openPopup()
  }
}

// Configurar botones de scroll
function setupScrollButtons() {
  const backToTopBtn = document.getElementById("backToTop")
  const darkModeBtn = document.getElementById("darkModeToggle")

  // Botón volver arriba
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.style.display = "block"
    } else {
      backToTopBtn.style.display = "none"
    }
  })

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Modo oscuro
  darkModeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode")
    const icon = this.querySelector("i")
    if (document.body.classList.contains("dark-mode")) {
      icon.className = "fas fa-sun"
      localStorage.setItem("darkMode", "true")
    } else {
      icon.className = "fas fa-moon"
      localStorage.setItem("darkMode", "false")
    }
  })

  // Cargar preferencia de modo oscuro
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode")
    darkModeBtn.querySelector("i").className = "fas fa-sun"
  }
}

// Funciones de autenticación
function showLoginModal() {
  const modal = new bootstrap.Modal(document.getElementById("loginModal"))
  modal.show()
}

function showCreateUserModal() {
  const modal = new bootstrap.Modal(document.getElementById("createUserModal"))
  modal.show()
}

function switchToLogin() {
  bootstrap.Modal.getInstance(document.getElementById("createUserModal")).hide()
  setTimeout(() => showLoginModal(), 300)
}

function switchToCreateUser() {
  bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide()
  setTimeout(() => showCreateUserModal(), 300)
}

// Manejar creación de usuario
function handleCreateUser(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const userData = {
    id: users.length + 1,
    nombre: formData.get("nombre"),
    correo: formData.get("correo"),
    telefono: formData.get("telefono"),
    password: formData.get("password"),
    role: "user",
    status: "activo",
    created: new Date().toISOString(),
    reservations: [],
  }

  // Validar que el email no exista
  if (users.find((user) => user.correo === userData.correo)) {
    showAlert("El correo electrónico ya está registrado", "danger")
    return
  }

  // Validar que el teléfono no exista
  if (users.find((user) => user.telefono === userData.telefono)) {
    showAlert("El teléfono ya está registrado", "danger")
    return
  }

  // Agregar usuario
  users.push(userData)
  localStorage.setItem("hotelUsers", JSON.stringify(users))

  // Cerrar modal y mostrar mensaje
  bootstrap.Modal.getInstance(document.getElementById("createUserModal")).hide()
  showAlert("Usuario creado exitosamente. Ahora puedes iniciar sesión.", "success")

  // Limpiar formulario
  e.target.reset()
}

// Manejar login
function handleLogin(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const email = formData.get("email")
  const password = formData.get("password")

  // Buscar en usuarios normales
  let user = users.find((u) => u.correo === email && u.password === password)

  // Si no se encuentra, buscar en administradores
  if (!user) {
    user = adminUsers.find((u) => u.email === email && u.password === password)
  }

  if (user && user.status === "activo") {
    currentUser = user
    localStorage.setItem("currentUser", JSON.stringify(user))

    // Cerrar modal
    bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide()

    // Actualizar interfaz
    updateUserInterface()

    // Mostrar mensaje de bienvenida
    showAlert(`¡Bienvenido ${user.nombre || user.username}!`, "success")

    // Limpiar formulario
    e.target.reset()
    document.getElementById("loginErrorMsg").classList.add("d-none")
  } else {
    document.getElementById("loginErrorMsg").classList.remove("d-none")
  }
}

// Manejar logout
function handleLogout() {
  currentUser = null
  isAdminMode = false
  localStorage.removeItem("currentUser")
  localStorage.removeItem("showAdminPanel")

  // Actualizar interfaz
  updateUserInterface()

  // Ocultar panel de admin si está visible
  document.getElementById("admin-panel").style.display = "none"

  // Mostrar secciones principales
  document.querySelectorAll("section:not(#admin-panel)").forEach((section) => {
    section.style.display = "block"
  })

  showAlert("Sesión cerrada exitosamente", "info")
}

// Funciones de navegación
function showScreen(screen) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"))
  document.getElementById(screen + "Screen").classList.add("active")
  currentScreen = screen
}

function showSection(section) {
  document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"))
  document.getElementById(section).classList.add("active")

  if (section === "reservas") {
    loadUserReservas()
  }
}

function showAdminSection(section) {
  document.querySelectorAll(".admin-section").forEach((s) => s.classList.remove("active"))
  document.querySelectorAll(".admin-nav-btn").forEach((btn) => btn.classList.remove("active"))

  document.getElementById(section).classList.add("active")
  event.target.classList.add("active")

  // Cargar datos específicos de la sección
  switch (section) {
    case "dashboard":
      loadDashboardStats()
      break
    case "reservas-admin":
      loadReservasTable()
      break
    case "huespedes-admin":
      loadHuespedesTable()
      break
    case "usuarios-admin":
      loadUsuariosTable()
      break
  }
}

// Manejar reservas
function handleReservation(e) {
  e.preventDefault()

  if (!currentUser) {
    document.getElementById("loginRequiredAlert").classList.remove("d-none")
    return
  }

  document.getElementById("loginRequiredAlert").classList.add("d-none")

  const formData = new FormData(e.target)
  const reservationData = {
    id: reservations.length + 1,
    userId: currentUser.id,
    guestName: formData.get("name") || currentUser.nombre,
    guestEmail: formData.get("email") || currentUser.correo,
    checkIn: document.getElementById("checkIn").value,
    checkOut: document.getElementById("checkOut").value,
    roomType: document.getElementById("roomType").value,
    guests: Number.parseInt(document.getElementById("guests").value),
    specialRequests: document.getElementById("specialRequests").value,
    status: "confirmada",
    total: calculateTotal(
      document.getElementById("roomType").value,
      document.getElementById("checkIn").value,
      document.getElementById("checkOut").value,
    ),
    created: new Date().toISOString(),
  }

  // Validar fechas
  const checkIn = new Date(reservationData.checkIn)
  const checkOut = new Date(reservationData.checkOut)

  if (checkIn >= checkOut) {
    showAlert("La fecha de salida debe ser posterior a la fecha de entrada", "danger")
    return
  }

  if (checkIn < new Date()) {
    showAlert("La fecha de entrada no puede ser anterior a hoy", "danger")
    return
  }

  // Agregar reserva
  reservations.push(reservationData)
  localStorage.setItem("hotelReservations", JSON.stringify(reservations))

  // Actualizar contador de reservas del usuario
  const userIndex = users.findIndex((u) => u.id === currentUser.id)
  if (userIndex !== -1) {
    if (!users[userIndex].reservations) {
      users[userIndex].reservations = []
    }
    users[userIndex].reservations.push(reservationData.id)
    users[userIndex].lastReservation = new Date().toISOString()
    localStorage.setItem("hotelUsers", JSON.stringify(users))
  }

  // Mostrar mensaje de éxito
  showAlert(`¡Reserva confirmada! ID de reserva: ${reservationData.id}`, "success")

  // Limpiar formulario
  e.target.reset()
  setMinDates()
}

// Calcular total de reserva
function calculateTotal(roomType, checkIn, checkOut) {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  const pricePerNight = roomPrices[roomType] || 0
  return nights * pricePerNight
}

// Mostrar mis reservas
function showMyReservations() {
  if (!currentUser) {
    showLoginModal()
    return
  }

  const modal = new bootstrap.Modal(document.getElementById("myReservationsModal"))
  modal.show()

  // Mostrar loading
  document.getElementById("reservationsLoading").style.display = "block"
  document.getElementById("noReservationsMessage").classList.add("d-none")
  document.getElementById("reservationsList").classList.add("d-none")

  // Simular carga
  setTimeout(() => {
    const userReservations = reservations.filter((r) => r.userId === currentUser.id)

    document.getElementById("reservationsLoading").style.display = "none"

    if (userReservations.length === 0) {
      document.getElementById("noReservationsMessage").classList.remove("d-none")
    } else {
      document.getElementById("reservationsList").classList.remove("d-none")
      loadUserReservationsTable(userReservations)
    }
  }, 1000)
}

// Cargar tabla de reservas del usuario
function loadUserReservationsTable(userReservations) {
  const tbody = document.getElementById("reservationsTableBody")
  tbody.innerHTML = ""

  userReservations.forEach((reservation) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${formatDate(reservation.checkIn)}</td>
            <td>${formatDate(reservation.checkOut)}</td>
            <td>${getRoomTypeName(reservation.roomType)}</td>
            <td>${reservation.guests}</td>
            <td><span class="badge bg-${getStatusColor(reservation.status)}">${reservation.status}</span></td>
            <td>
                ${
                  reservation.status === "confirmada"
                    ? `<button class="btn btn-sm btn-outline-danger" onclick="cancelReservation(${reservation.id})">
                        <i class="fas fa-times me-1"></i>Cancelar
                    </button>`
                    : '<span class="text-muted">-</span>'
                }
            </td>
        `
    tbody.appendChild(row)
  })
}

// Cancelar reserva
function cancelReservation(reservationId) {
  if (confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
    const reservationIndex = reservations.findIndex((r) => r.id === reservationId)
    if (reservationIndex !== -1) {
      reservations[reservationIndex].status = "cancelada"
      localStorage.setItem("hotelReservations", JSON.stringify(reservations))

      // Recargar tabla
      const userReservations = reservations.filter((r) => r.userId === currentUser.id)
      loadUserReservationsTable(userReservations)

      showAlert("Reserva cancelada exitosamente", "info")
    }
  }
}

// Funciones de reservas
function handleReserva(e) {
  e.preventDefault()

  if (!currentUser) {
    showMessage("Debe iniciar sesión para hacer una reserva", "error")
    return
  }

  const fechaEntrada = document.getElementById("fechaEntrada").value
  const fechaSalida = document.getElementById("fechaSalida").value
  const tipoHabitacion = document.getElementById("tipoHabitacion").value
  const huespedes = document.getElementById("huespedes").value

  // Validar fechas
  if (new Date(fechaEntrada) >= new Date(fechaSalida)) {
    showMessage("La fecha de salida debe ser posterior a la de entrada", "error")
    return
  }

  if (new Date(fechaEntrada) < new Date()) {
    showMessage("La fecha de entrada no puede ser anterior a hoy", "error")
    return
  }

  const nuevaReserva = {
    id: reservas.length + 1,
    usuario: currentUser.username,
    fechaEntrada: fechaEntrada,
    fechaSalida: fechaSalida,
    tipoHabitacion: tipoHabitacion,
    huespedes: Number.parseInt(huespedes),
    estado: "confirmada",
    fechaCreacion: new Date().toISOString(),
  }

  reservas.push(nuevaReserva)
  localStorage.setItem("reservas", JSON.stringify(reservas))

  showMessage("Reserva realizada exitosamente", "success")
  document.getElementById("reservaForm").reset()
  loadUserReservas()
}

function loadUserReservas() {
  if (!currentUser) return

  const userReservas = reservas.filter((r) => r.usuario === currentUser.username)
  const container = document.getElementById("listaReservas")

  if (userReservas.length === 0) {
    container.innerHTML = "<p>No tienes reservas actualmente.</p>"
    return
  }

  container.innerHTML = userReservas
    .map(
      (reserva) => `
        <div class="reserva-item">
            <h4>Reserva #${reserva.id}</h4>
            <p><strong>Fechas:</strong> ${reserva.fechaEntrada} - ${reserva.fechaSalida}</p>
            <p><strong>Habitación:</strong> ${reserva.tipoHabitacion}</p>
            <p><strong>Huéspedes:</strong> ${reserva.huespedes}</p>
            <p><strong>Estado:</strong> ${reserva.estado}</p>
            <button onclick="cancelarReserva(${reserva.id})" class="btn-danger">Cancelar</button>
        </div>
    `,
    )
    .join("")
}

function cancelarReserva(id) {
  if (confirm("¿Está seguro de que desea cancelar esta reserva?")) {
    const index = reservas.findIndex((r) => r.id === id)
    if (index !== -1) {
      reservas[index].estado = "cancelada"
      localStorage.setItem("reservas", JSON.stringify(reservas))
      loadUserReservas()
      showMessage("Reserva cancelada", "success")
    }
  }
}

// Funciones del panel de administración
function showAdminPanel() {
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "manager")) {
    showAlert("No tienes permisos para acceder al panel de administración", "danger")
    return
  }

  isAdminMode = true
  localStorage.setItem("showAdminPanel", "true")

  // Ocultar todas las secciones principales
  document.querySelectorAll("section:not(#admin-panel)").forEach((section) => {
    section.style.display = "none"
  })

  // Mostrar panel de admin
  document.getElementById("admin-panel").style.display = "block"
  document.getElementById("adminUserName").textContent = currentUser.nombre || currentUser.username

  // Cargar datos del dashboard
  loadAdminDashboard()
  cargarReservasAdmin()
  cargarUsuariosAdmin()
  cargarAdminUsers()
}

function volverAlSitio() {
  isAdminMode = false
  localStorage.removeItem("showAdminPanel")

  // Mostrar todas las secciones principales
  document.querySelectorAll("section:not(#admin-panel)").forEach((section) => {
    section.style.display = "block"
  })

  // Ocultar panel de admin
  document.getElementById("admin-panel").style.display = "none"

  // Scroll al inicio
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function loadDashboardStats() {
  document.getElementById("totalReservas").textContent = reservas.length
  document.getElementById("totalHuespedes").textContent = huespedes.length

  const reservasActivas = reservas.filter((r) => r.estado === "confirmada").length
  const ocupacion = Math.round((reservasActivas / 50) * 100) // Asumiendo 50 habitaciones
  document.getElementById("ocupacionActual").textContent = ocupacion + "%"

  const ingresosMes = reservas.reduce((total, reserva) => {
    const tarifas = { simple: 100, doble: 150, suite: 250 }
    return total + (tarifas[reserva.tipoHabitacion] || 0)
  }, 0)
  document.getElementById("ingresosMes").textContent = "$" + ingresosMes
}

function loadAdminDashboard() {
  // Estadísticas básicas
  document.getElementById("totalUsuarios").textContent = users.length
  document.getElementById("totalReservas").textContent = reservations.length

  const activeReservations = reservations.filter((r) => r.status === "confirmada").length
  document.getElementById("reservasActivas").textContent = activeReservations

  const monthlyIncome = reservations
    .filter((r) => {
      const reservationDate = new Date(r.created)
      const currentMonth = new Date().getMonth()
      return reservationDate.getMonth() === currentMonth && r.status === "confirmada"
    })
    .reduce((total, r) => total + r.total, 0)

  document.getElementById("ingresosMes").textContent = `$${monthlyIncome.toLocaleString()}`

  // Estadísticas detalladas
  const today = new Date().toISOString().split("T")[0]
  const todayReservations = reservations.filter((r) => r.checkIn === today).length
  const todayCheckIns = reservations.filter((r) => r.checkIn === today && r.status === "confirmada").length
  const todayCheckOuts = reservations.filter((r) => r.checkOut === today && r.status === "confirmada").length

  document.getElementById("ocupacionHoy").textContent = `${Math.round((activeReservations / 50) * 100)}%`
  document.getElementById("reservasHoy").textContent = todayReservations
  document.getElementById("checkInsHoy").textContent = todayCheckIns
  document.getElementById("checkOutsHoy").textContent = todayCheckOuts
}

function loadReservasTable() {
  const tbody = document.querySelector("#tablaReservas tbody")
  tbody.innerHTML = reservas
    .map(
      (reserva) => `
        <tr>
            <td>${reserva.id}</td>
            <td>${reserva.usuario}</td>
            <td>${reserva.fechaEntrada}</td>
            <td>${reserva.fechaSalida}</td>
            <td>${reserva.tipoHabitacion}</td>
            <td>${reserva.huespedes}</td>
            <td><span class="status ${reserva.estado}">${reserva.estado}</span></td>
            <td>
                <button onclick="editarReserva(${reserva.id})" class="btn-edit">Editar</button>
                <button onclick="eliminarReserva(${reserva.id})" class="btn-delete">Eliminar</button>
            </td>
        </tr>
    `,
    )
    .join("")
}

function cargarReservasAdmin() {
  document.getElementById("reservasAdminLoading").style.display = "block"
  document.getElementById("reservasAdminContent").style.display = "none"

  setTimeout(() => {
    const tbody = document.getElementById("reservasAdminTableBody")
    tbody.innerHTML = ""

    reservations.forEach((reservation) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${reservation.id}</td>
                <td>${reservation.guestName}</td>
                <td>${reservation.guestEmail}</td>
                <td>${getRoomTypeName(reservation.roomType)}</td>
                <td>${formatDate(reservation.checkIn)}</td>
                <td>${formatDate(reservation.checkOut)}</td>
                <td>${reservation.guests}</td>
                <td><span class="badge bg-${getStatusColor(reservation.status)}">${reservation.status}</span></td>
                <td>$${reservation.total.toLocaleString()}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="editReservation(${reservation.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteReservation(${reservation.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `
      tbody.appendChild(row)
    })

    document.getElementById("reservasAdminLoading").style.display = "none"
    document.getElementById("reservasAdminContent").style.display = "block"
  }, 500)
}

function loadHuespedesTable() {
  const tbody = document.querySelector("#tablaHuespedes tbody")
  tbody.innerHTML = huespedes
    .map(
      (huesped) => `
        <tr>
            <td>${huesped.id}</td>
            <td>${huesped.nombre}</td>
            <td>${huesped.email}</td>
            <td>${huesped.telefono}</td>
            <td>${new Date(huesped.fechaRegistro).toLocaleDateString()}</td>
            <td>${huesped.reservas || 0}</td>
            <td>
                <button onclick="editarHuesped(${huesped.id})" class="btn-edit">Editar</button>
                <button onclick="eliminarHuesped(${huesped.id})" class="btn-delete">Eliminar</button>
            </td>
        </tr>
    `,
    )
    .join("")
}

function loadUsuariosTable() {
  const tbody = document.querySelector("#tablaUsuarios tbody")
  tbody.innerHTML = usuarios
    .map(
      (usuario) => `
        <tr>
            <td>${usuario.id}</td>
            <td>${usuario.username}</td>
            <td>${usuario.email}</td>
            <td><span class="role ${usuario.role}">${usuario.role}</span></td>
            <td>${new Date(usuario.created).toLocaleDateString()}</td>
            <td><span class="status ${usuario.status}">${usuario.status}</span></td>
            <td>
                <button onclick="editarUsuario(${usuario.id})" class="btn-edit">Editar</button>
                <button onclick="eliminarUsuario(${usuario.id})" class="btn-delete">Eliminar</button>
            </td>
        </tr>
    `,
    )
    .join("")
}

function cargarUsuariosAdmin() {
  document.getElementById("usuariosAdminLoading").style.display = "block"
  document.getElementById("usuariosAdminContent").style.display = "none"

  setTimeout(() => {
    const tbody = document.getElementById("usuariosAdminTableBody")
    tbody.innerHTML = ""

    users.forEach((user) => {
      const userReservations = reservations.filter((r) => r.userId === user.id)
      const lastReservation =
        userReservations.length > 0 ? Math.max(...userReservations.map((r) => new Date(r.created))) : null

      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.nombre}</td>
                <td>${user.correo}</td>
                <td>${user.telefono}</td>
                <td>${formatDate(user.created)}</td>
                <td>${userReservations.length}</td>
                <td>${lastReservation ? formatDate(new Date(lastReservation).toISOString()) : "Nunca"}</td>
                <td><span class="badge bg-${user.status === "activo" ? "success" : "secondary"}">${user.status}</span></td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="editGuest(${user.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteGuest(${user.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `
      tbody.appendChild(row)
    })

    document.getElementById("usuariosAdminLoading").style.display = "none"
    document.getElementById("usuariosAdminContent").style.display = "block"
  }, 500)
}

function cargarAdminUsers() {
  const tbody = document.getElementById("adminUsersTableBody")
  tbody.innerHTML = ""

  adminUsers.forEach((admin) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${admin.username}</td>
            <td><span class="badge bg-${admin.role === "admin" ? "danger" : "warning"}">${admin.role}</span></td>
            <td><span class="badge bg-${admin.status === "activo" ? "success" : "secondary"}">${admin.status}</span></td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="editAdmin(${admin.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${
                      admin.id !== currentUser.id
                        ? `<button class="btn btn-outline-danger" onclick="deleteAdmin(${admin.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>`
                        : ""
                    }
                </div>
            </td>
        `
    tbody.appendChild(row)
  })
}

// Funciones de filtrado
function filterReservas() {
  const search = document.getElementById("searchReservas").value.toLowerCase()
  const rows = document.querySelectorAll("#tablaReservas tbody tr")

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase()
    row.style.display = text.includes(search) ? "" : "none"
  })
}

function filterHuespedes() {
  const search = document.getElementById("searchHuespedes").value.toLowerCase()
  const rows = document.querySelectorAll("#tablaHuespedes tbody tr")

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase()
    row.style.display = text.includes(search) ? "" : "none"
  })
}

function filterUsuarios() {
  const search = document.getElementById("searchUsuarios").value.toLowerCase()
  const rows = document.querySelectorAll("#tablaUsuarios tbody tr")

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase()
    row.style.display = text.includes(search) ? "" : "none"
  })
}

// Funciones de edición y eliminación
function editReservation(id) {
  const reservation = reservations.find((r) => r.id === id)
  if (!reservation) return

  // Llenar modal con datos
  document.getElementById("editReservationId").value = reservation.id
  document.getElementById("editCheckIn").value = reservation.checkIn
  document.getElementById("editCheckOut").value = reservation.checkOut
  document.getElementById("editRoomType").value = reservation.roomType
  document.getElementById("editGuests").value = reservation.guests
  document.getElementById("editReservationStatus").value = reservation.status
  document.getElementById("editSpecialRequests").value = reservation.specialRequests || ""

  const modal = new bootstrap.Modal(document.getElementById("editReservationModal"))
  modal.show()
}

function guardarCambiosReserva() {
  const id = Number.parseInt(document.getElementById("editReservationId").value)
  const reservationIndex = reservations.findIndex((r) => r.id === id)

  if (reservationIndex !== -1) {
    reservations[reservationIndex] = {
      ...reservations[reservationIndex],
      checkIn: document.getElementById("editCheckIn").value,
      checkOut: document.getElementById("editCheckOut").value,
      roomType: document.getElementById("editRoomType").value,
      guests: Number.parseInt(document.getElementById("editGuests").value),
      status: document.getElementById("editReservationStatus").value,
      specialRequests: document.getElementById("editSpecialRequests").value,
      total: calculateTotal(
        document.getElementById("editRoomType").value,
        document.getElementById("editCheckIn").value,
        document.getElementById("editCheckOut").value,
      ),
    }

    localStorage.setItem("hotelReservations", JSON.stringify(reservations))

    bootstrap.Modal.getInstance(document.getElementById("editReservationModal")).hide()
    cargarReservasAdmin()
    loadAdminDashboard()
    showAlert("Reserva actualizada exitosamente", "success")
  }
}

function deleteReservation(id) {
  if (confirm("¿Estás seguro de que deseas eliminar esta reserva?")) {
    reservations = reservations.filter((r) => r.id !== id)
    localStorage.setItem("hotelReservations", JSON.stringify(reservations))
    cargarReservasAdmin()
    loadAdminDashboard()
    showAlert("Reserva eliminada exitosamente", "info")
  }
}

function editGuest(id) {
  const user = users.find((u) => u.id === id)
  if (!user) return

  document.getElementById("editGuestId").value = user.id
  document.getElementById("editGuestName").value = user.nombre
  document.getElementById("editGuestEmail").value = user.correo
  document.getElementById("editGuestPhone").value = user.telefono
  document.getElementById("editGuestStatus").value = user.status

  const modal = new bootstrap.Modal(document.getElementById("editGuestModal"))
  modal.show()
}

function guardarCambiosHuesped() {
  const id = Number.parseInt(document.getElementById("editGuestId").value)
  const userIndex = users.findIndex((u) => u.id === id)

  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      nombre: document.getElementById("editGuestName").value,
      correo: document.getElementById("editGuestEmail").value,
      telefono: document.getElementById("editGuestPhone").value,
      status: document.getElementById("editGuestStatus").value,
    }

    localStorage.setItem("hotelUsers", JSON.stringify(users))

    bootstrap.Modal.getInstance(document.getElementById("editGuestModal")).hide()
    cargarUsuariosAdmin()
    showAlert("Huésped actualizado exitosamente", "success")
  }
}

function deleteGuest(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este huésped?")) {
    users = users.filter((u) => u.id !== id)
    localStorage.setItem("hotelUsers", JSON.stringify(users))
    cargarUsuariosAdmin()
    loadAdminDashboard()
    showAlert("Huésped eliminado exitosamente", "info")
  }
}

function crearNuevoHuesped() {
  document.getElementById("editGuestModalLabel").textContent = "Crear Nuevo Huésped"
  document.getElementById("editGuestId").value = ""
  document.getElementById("editGuestForm").reset()

  const modal = new bootstrap.Modal(document.getElementById("editGuestModal"))
  modal.show()
}

function crearNuevoAdmin() {
  const username = prompt("Nombre de usuario:")
  const email = prompt("Email:")
  const password = prompt("Contraseña:")
  const role = confirm("¿Es administrador? (Cancelar para Manager)") ? "admin" : "manager"

  if (username && email && password) {
    const newAdmin = {
      id: adminUsers.length + 1,
      username: username,
      email: email,
      password: password,
      role: role,
      status: "activo",
      created: new Date().toISOString(),
    }

    adminUsers.push(newAdmin)
    localStorage.setItem("hotelAdminUsers", JSON.stringify(adminUsers))
    cargarAdminUsers()
    showAlert("Administrador creado exitosamente", "success")
  }
}

// Funciones CRUD
function editarReserva(id) {
  const reserva = reservas.find((r) => r.id === id)
  if (!reserva) return

  const modalBody = document.getElementById("modalBody")
  modalBody.innerHTML = `
        <h3>Editar Reserva #${id}</h3>
        <form id="editReservaForm">
            <label>Fecha Entrada:</label>
            <input type="date" id="editFechaEntrada" value="${reserva.fechaEntrada}" required>
            
            <label>Fecha Salida:</label>
            <input type="date" id="editFechaSalida" value="${reserva.fechaSalida}" required>
            
            <label>Tipo Habitación:</label>
            <select id="editTipoHabitacion" required>
                <option value="simple" ${reserva.tipoHabitacion === "simple" ? "selected" : ""}>Simple</option>
                <option value="doble" ${reserva.tipoHabitacion === "doble" ? "selected" : ""}>Doble</option>
                <option value="suite" ${reserva.tipoHabitacion === "suite" ? "selected" : ""}>Suite</option>
            </select>
            
            <label>Huéspedes:</label>
            <input type="number" id="editHuespedes" value="${reserva.huespedes}" min="1" max="4" required>
            
            <label>Estado:</label>
            <select id="editEstado" required>
                <option value="confirmada" ${reserva.estado === "confirmada" ? "selected" : ""}>Confirmada</option>
                <option value="cancelada" ${reserva.estado === "cancelada" ? "selected" : ""}>Cancelada</option>
                <option value="completada" ${reserva.estado === "completada" ? "selected" : ""}>Completada</option>
            </select>
            
            <button type="submit">Guardar Cambios</button>
            <button type="button" onclick="closeModal()">Cancelar</button>
        </form>
    `

  document.getElementById("editReservaForm").addEventListener("submit", (e) => {
    e.preventDefault()

    const index = reservas.findIndex((r) => r.id === id)
    reservas[index] = {
      ...reservas[index],
      fechaEntrada: document.getElementById("editFechaEntrada").value,
      fechaSalida: document.getElementById("editFechaSalida").value,
      tipoHabitacion: document.getElementById("editTipoHabitacion").value,
      huespedes: Number.parseInt(document.getElementById("editHuespedes").value),
      estado: document.getElementById("editEstado").value,
    }

    localStorage.setItem("reservas", JSON.stringify(reservas))
    loadReservasTable()
    closeModal()
    showMessage("Reserva actualizada exitosamente", "success")
  })

  showModal()
}

function eliminarReserva(id) {
  if (confirm("¿Está seguro de que desea eliminar esta reserva?")) {
    reservas = reservas.filter((r) => r.id !== id)
    localStorage.setItem("reservas", JSON.stringify(reservas))
    loadReservasTable()
    loadDashboardStats()
    showMessage("Reserva eliminada", "success")
  }
}

function agregarHuesped() {
  const modalBody = document.getElementById("modalBody")
  modalBody.innerHTML = `
        <h3>Agregar Nuevo Huésped</h3>
        <form id="addHuespedForm">
            <label>Nombre Completo:</label>
            <input type="text" id="addNombre" required>
            
            <label>Email:</label>
            <input type="email" id="addEmail" required>
            
            <label>Teléfono:</label>
            <input type="tel" id="addTelefono" required>
            
            <label>Documento:</label>
            <input type="text" id="addDocumento" required>
            
            <button type="submit">Agregar Huésped</button>
            <button type="button" onclick="closeModal()">Cancelar</button>
        </form>
    `

  document.getElementById("addHuespedForm").addEventListener("submit", (e) => {
    e.preventDefault()

    const nuevoHuesped = {
      id: huespedes.length + 1,
      nombre: document.getElementById("addNombre").value,
      email: document.getElementById("addEmail").value,
      telefono: document.getElementById("addTelefono").value,
      documento: document.getElementById("addDocumento").value,
      fechaRegistro: new Date().toISOString(),
      reservas: 0,
    }

    huespedes.push(nuevoHuesped)
    localStorage.setItem("huespedes", JSON.stringify(huespedes))
    loadHuespedesTable()
    closeModal()
    showMessage("Huésped agregado exitosamente", "success")
  })

  showModal()
}

function editarHuesped(id) {
  const huesped = huespedes.find((h) => h.id === id)
  if (!huesped) return

  const modalBody = document.getElementById("modalBody")
  modalBody.innerHTML = `
        <h3>Editar Huésped #${id}</h3>
        <form id="editHuespedForm">
            <label>Nombre Completo:</label>
            <input type="text" id="editNombre" value="${huesped.nombre}" required>
            
            <label>Email:</label>
            <input type="email" id="editEmail" value="${huesped.email}" required>
            
            <label>Teléfono:</label>
            <input type="tel" id="editTelefono" value="${huesped.telefono}" required>
            
            <button type="submit">Guardar Cambios</button>
            <button type="button" onclick="closeModal()">Cancelar</button>
        </form>
    `

  document.getElementById("editHuespedForm").addEventListener("submit", (e) => {
    e.preventDefault()

    const index = huespedes.findIndex((h) => h.id === id)
    huespedes[index] = {
      ...huespedes[index],
      nombre: document.getElementById("editNombre").value,
      email: document.getElementById("editEmail").value,
      telefono: document.getElementById("editTelefono").value,
    }

    localStorage.setItem("huespedes", JSON.stringify(huespedes))
    loadHuespedesTable()
    closeModal()
    showMessage("Huésped actualizado exitosamente", "success")
  })

  showModal()
}

function eliminarHuesped(id) {
  if (confirm("¿Está seguro de que desea eliminar este huésped?")) {
    huespedes = huespedes.filter((h) => h.id !== id)
    localStorage.setItem("huespedes", JSON.stringify(huespedes))
    loadHuespedesTable()
    showMessage("Huésped eliminado", "success")
  }
}

function crearUsuario() {
  const modalBody = document.getElementById("modalBody")
  modalBody.innerHTML = `
        <h3>Crear Nuevo Usuario</h3>
        <form id="createUserForm">
            <label>Nombre de Usuario:</label>
            <input type="text" id="createUsername" required>
            
            <label>Email:</label>
            <input type="email" id="createEmail" required>
            
            <label>Contraseña:</label>
            <input type="password" id="createPassword" required>
            
            <label>Confirmar Contraseña:</label>
            <input type="password" id="createConfirmPassword" required>
            
            <label>Rol:</label>
            <select id="createRole" required>
                <option value="user">Usuario</option>
                <option value="manager">Manager</option>
                <option value="admin">Administrador</option>
            </select>
            
            <button type="submit">Crear Usuario</button>
            <button type="button" onclick="closeModal()">Cancelar</button>
        </form>
    `

  document.getElementById("createUserForm").addEventListener("submit", (e) => {
    e.preventDefault()

    const username = document.getElementById("createUsername").value
    const email = document.getElementById("createEmail").value
    const password = document.getElementById("createPassword").value
    const confirmPassword = document.getElementById("createConfirmPassword").value
    const role = document.getElementById("createRole").value

    // Validaciones
    if (password !== confirmPassword) {
      showMessage("Las contraseñas no coinciden", "error")
      return
    }

    if (usuarios.find((u) => u.username === username)) {
      showMessage("El nombre de usuario ya existe", "error")
      return
    }

    if (usuarios.find((u) => u.email === email)) {
      showMessage("El email ya está registrado", "error")
      return
    }

    const nuevoUsuario = {
      id: usuarios.length + 1,
      username: username,
      email: email,
      password: password,
      role: role,
      created: new Date().toISOString(),
      status: "active",
    }

    usuarios.push(nuevoUsuario)
    localStorage.setItem("usuarios", JSON.stringify(usuarios))
    loadUsuariosTable()
    closeModal()
    showMessage("Usuario creado exitosamente", "success")
  })

  showModal()
}

function editarUsuario(id) {
  const usuario = usuarios.find((u) => u.id === id)
  if (!usuario) return

  const modalBody = document.getElementById("modalBody")
  modalBody.innerHTML = `
        <h3>Editar Usuario #${id}</h3>
        <form id="editUserForm">
            <label>Nombre de Usuario:</label>
            <input type="text" id="editUsername" value="${usuario.username}" required>
            
            <label>Email:</label>
            <input type="email" id="editUserEmail" value="${usuario.email}" required>
            
            <label>Rol:</label>
            <select id="editUserRole" required>
                <option value="user" ${usuario.role === "user" ? "selected" : ""}>Usuario</option>
                <option value="manager" ${usuario.role === "manager" ? "selected" : ""}>Manager</option>
                <option value="admin" ${usuario.role === "admin" ? "selected" : ""}>Administrador</option>
            </select>
            
            <label>Estado:</label>
            <select id="editUserStatus" required>
                <option value="active" ${usuario.status === "active" ? "selected" : ""}>Activo</option>
                <option value="inactive" ${usuario.status === "inactive" ? "selected" : ""}>Inactivo</option>
                <option value="suspended" ${usuario.status === "suspended" ? "selected" : ""}>Suspendido</option>
            </select>
            
            <button type="submit">Guardar Cambios</button>
            <button type="button" onclick="closeModal()">Cancelar</button>
        </form>
    `

  document.getElementById("editUserForm").addEventListener("submit", (e) => {
    e.preventDefault()

    const index = usuarios.findIndex((u) => u.id === id)
    usuarios[index] = {
      ...usuarios[index],
      username: document.getElementById("editUsername").value,
      email: document.getElementById("editUserEmail").value,
      role: document.getElementById("editUserRole").value,
      status: document.getElementById("editUserStatus").value,
    }

    localStorage.setItem("usuarios", JSON.stringify(usuarios))
    loadUsuariosTable()
    closeModal()
    showMessage("Usuario actualizado exitosamente", "success")
  })

  showModal()
}

function eliminarUsuario(id) {
  if (currentUser && currentUser.id === id) {
    showMessage("No puedes eliminar tu propio usuario", "error")
    return
  }

  if (confirm("¿Está seguro de que desea eliminar este usuario?")) {
    usuarios = usuarios.filter((u) => u.id !== id)
    localStorage.setItem("usuarios", JSON.stringify(usuarios))
    loadUsuariosTable()
    showMessage("Usuario eliminado", "success")
  }
}

// Funciones de exportación
function exportarReservas() {
  const csv =
    "ID,Usuario,Fecha Entrada,Fecha Salida,Habitación,Huéspedes,Estado\n" +
    reservas
      .map(
        (r) => `${r.id},${r.usuario},${r.fechaEntrada},${r.fechaSalida},${r.tipoHabitacion},${r.huespedes},${r.estado}`,
      )
      .join("\n")

  const blob = new Blob([csv], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "reservas.csv"
  a.click()
  window.URL.revokeObjectURL(url)
}

function handleConfigSave(e) {
  e.preventDefault()

  const config = {
    precioIndividual: document.getElementById("precioIndividual").value,
    precioDoble: document.getElementById("precioDoble").value,
    precioSuite: document.getElementById("precioSuite").value,
    emailHotel: document.getElementById("emailHotel").value,
    telefonoHotel: document.getElementById("telefonoHotel").value,
  }

  // Actualizar precios globales
  roomPrices.individual = Number.parseInt(config.precioIndividual)
  roomPrices.doble = Number.parseInt(config.precioDoble)
  roomPrices.suite = Number.parseInt(config.precioSuite)

  localStorage.setItem("hotelConfig", JSON.stringify(config))
  showAlert("Configuración guardada exitosamente", "success")
}

// Funciones de filtrado
function filterReservations() {
  const searchTerm = document.getElementById("searchReservas").value.toLowerCase()
  const rows = document.querySelectorAll("#reservasAdminTableBody tr")

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase()
    row.style.display = text.includes(searchTerm) ? "" : "none"
  })
}

function filterUsers() {
  const searchTerm = document.getElementById("searchUsuarios").value.toLowerCase()
  const rows = document.querySelectorAll("#usuariosAdminTableBody tr")

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase()
    row.style.display = text.includes(searchTerm) ? "" : "none"
  })
}

// Funciones de utilidad
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES")
}

function getRoomTypeName(roomType) {
  const names = {
    individual: "Habitación Individual",
    doble: "Habitación Doble",
    suite: "Suite Ejecutiva",
  }
  return names[roomType] || roomType
}

function getStatusColor(status) {
  const colors = {
    confirmada: "success",
    pendiente: "warning",
    cancelada: "danger",
    completada: "info",
  }
  return colors[status] || "secondary"
}

function showAlert(message, type) {
  // Crear elemento de alerta
  const alertDiv = document.createElement("div")
  alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`
  alertDiv.style.cssText = "top: 20px; right: 20px; z-index: 9999; min-width: 300px;"
  alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

  document.body.appendChild(alertDiv)

  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.parentNode.removeChild(alertDiv)
    }
  }, 5000)
}

// Funciones de configuración
function handleConfigSave(e) {
  e.preventDefault()

  const config = {
    nombreHotel: document.getElementById("nombreHotel").value,
    direccionHotel: document.getElementById("direccionHotel").value,
    telefonoHotel: document.getElementById("telefonoHotel").value,
    tarifaSimple: document.getElementById("tarifaSimple").value,
    tarifaDoble: document.getElementById("tarifaDoble").value,
    tarifaSuite: document.getElementById("tarifaSuite").value,
  }

  localStorage.setItem("hotelConfig", JSON.stringify(config))
  showMessage("Configuración guardada exitosamente", "success")
}

// Funciones de exportación
function exportarReservas() {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    "ID,Huésped,Email,Habitación,Entrada,Salida,Huéspedes,Estado,Total\n" +
    reservations
      .map(
        (r) =>
          `${r.id},"${r.guestName}","${r.guestEmail}","${getRoomTypeName(r.roomType)}","${r.checkIn}","${r.checkOut}",${r.guests},"${r.status}",${r.total}`,
      )
      .join("\n")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `reservas_${new Date().toISOString().split("T")[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Funciones de modal
function showModal() {
  document.getElementById("modal").style.display = "block"
}

function closeModal() {
  document.getElementById("modal").style.display = "none"
}

// Función para mostrar mensajes
function showMessage(message, type) {
  const messageDiv = document.createElement("div")
  messageDiv.className = `message ${type}`
  messageDiv.textContent = message
  messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        ${type === "success" ? "background-color: #4CAF50;" : "background-color: #f44336;"}
    `

  document.body.appendChild(messageDiv)

  setTimeout(() => {
    messageDiv.style.animation = "slideOut 0.3s ease"
    setTimeout(() => {
      document.body.removeChild(messageDiv)
    }, 300)
  }, 3000)
}

// Cargar configuración guardada al iniciar
document.addEventListener("DOMContentLoaded", () => {
  const savedConfig = localStorage.getItem("hotelConfig")
  if (savedConfig) {
    const config = JSON.parse(savedConfig)

    // Actualizar precios
    if (config.precioIndividual) roomPrices.individual = Number.parseInt(config.precioIndividual)
    if (config.precioDoble) roomPrices.doble = Number.parseInt(config.precioDoble)
    if (config.precioSuite) roomPrices.suite = Number.parseInt(config.precioSuite)

    // Actualizar campos del formulario si están disponibles
    setTimeout(() => {
      if (document.getElementById("precioIndividual")) {
        document.getElementById("precioIndividual").value = config.precioIndividual || 120
        document.getElementById("precioDoble").value = config.precioDoble || 180
        document.getElementById("precioSuite").value = config.precioSuite || 280
        document.getElementById("emailHotel").value = config.emailHotel || "info@hotelituss.com"
        document.getElementById("telefonoHotel").value = config.telefonoHotel || "+54 261 423 7890"
      }
    }, 1000)
  }
})

// Cerrar modal al hacer clic fuera
window.onclick = (event) => {
  const modal = document.getElementById("modal")
  if (event.target === modal) {
    closeModal()
  }
}
