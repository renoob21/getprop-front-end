let currentIndex = 0;
const images = [
  './assets/house1.jpg',
  './assets/house2.jpg',
  './assets/house3.jpg',
  './assets/house4.jpg',
  './assets/house5.jpg'
];

function showToast(message, status = 'success', duration = 4000) {
    const toast = document.getElementById('toast');
    toast.innerHTML = message;
    toast.classList.add('show');
    toast.classList.add(status)

    // Hide after `duration` ms
    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.remove(status);
    }, duration);
}

const sliderImage = document.getElementById('slider-image');

function changeImage() {
  currentIndex = (currentIndex + 1) % images.length;
  sliderImage.style.opacity = 0;
  setTimeout(() => {
    sliderImage.src = images[currentIndex];
    sliderImage.style.opacity = 1;
  }, 500);
}

setInterval(changeImage, 5000);

const togglePassword = document.getElementById("togglePassword");
const passwordField = document.getElementById("password");

togglePassword.addEventListener("mousedown", () => {
  passwordField.type = "text";
});

togglePassword.addEventListener("mouseup", () => {
  passwordField.type = "password";
});

togglePassword.addEventListener("mouseleave", () => {
  passwordField.type = "password";
});

const toggleRePassword = document.getElementById("toggleRePassword");
const rePasswordField = document.getElementById("rePassword");

toggleRePassword.addEventListener("mousedown", () => {
  rePasswordField.type = "text";
});

toggleRePassword.addEventListener("mouseup", () => {
  rePasswordField.type = "password";
});

toggleRePassword.addEventListener("mouseleave", () => {
  rePasswordField.type = "password";
});

document.addEventListener("DOMContentLoaded", async () => {
  let user_session = JSON.parse(window.localStorage.getItem("session-data"));

    if (!user_session) {
        return;
    }

    let response =  await fetch(`${window.CONFIG.API_BASE_URL}/api/profile`, {
        headers: {"session_id": user_session.session_id}
    })
        .then(res => res.json())
        .then(json => json);

    if (!response.success) {
        return;
    }

    window.location.href = "index.html";
  
  
})

// Validasi Form Registrasi
document.getElementById("register-form").addEventListener("submit", async function (e) {
  e.preventDefault(); // mencegah reload halaman

  const inputs = this.querySelectorAll("input[required]");
  let valid = true;
  let message = "";

  // Periksa semua input yang required
  inputs.forEach((input) => {
    if (!input.value.trim()) {
      valid = false;
      input.style.border = "1px solid red";
    } else {
      input.style.border = "";
    }
  });

  // Validasi email
  const email = this.querySelector("input[type='email']");
  const emailValue = email.value.trim();
  const atIndex = emailValue.indexOf('@');
  const dotIndex = emailValue.lastIndexOf('.');

  if (
    atIndex < 1 || 
    dotIndex < atIndex + 2 || 
    dotIndex + 2 >= emailValue.length
  ) {
    valid = false;
    message += "Format email tidak valid.\n";
    email.style.border = "1px solid red";
  }

  // Validasi password
  const password = passwordField.value;
  const rePassword = rePasswordField.value;

  if (password.length < 6) {
    valid = false;
    message += "Password harus minimal 6 karakter.\n";
    passwordField.style.border = "1px solid red";
  }

  if (password !== rePassword) {
    valid = false;
    message += "Konfirmasi password tidak cocok.\n";
    rePasswordField.style.border = "1px solid red";
  }

  if (!valid) {
    showToast("Terjadi kesalahan:\n" + message, "error");
  } else {

    let formData = new FormData(this);
    console.log(formData);

    let object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    let json = JSON.stringify(object);

    const reqHeader = new Headers();
    reqHeader.append("Content-Type", "application/json");

    let response = await fetch(`${window.CONFIG.API_BASE_URL}/api/user`, {
      method: "post",
      body: json,
      headers: reqHeader,
    })
      .then(res => res.json())
      .then(json => json);;

    if (response.success) {
      showToast("Registrasi berhasil!");
      window.location.href = "login.html"
    } else {
      showToast(`${response.message}
        ${response.error}`, "error");
    }
  }
});

document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  console.log("Method called");

  if (!this.checkValidity()) {
    this.reportValidity();
    return;
  }

  let formData = new FormData(this);

  let object = {};
  
  formData.forEach(function(value, key){
      object[key] = value;
  });
  let json = JSON.stringify(object);

  const reqHeader = new Headers();
  reqHeader.append("Content-Type", "application/json");

  let response = await fetch(`${window.CONFIG.API_BASE_URL}/api/login`, {
      method: "post",
      body: json,
      headers: reqHeader,
    })
      .then(res => res.json())
      .then(json => json);;

  if (response.success) {
    showToast(`Login succes.
      User: ${response.data.full_name}`)
  } else {
    showToast(`Error login: 
      ${response.error}`, "error")
  }
})