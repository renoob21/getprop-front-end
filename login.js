const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("mousedown", () => {
  passwordField.type = "text";
});

togglePassword.addEventListener("mouseup", () => {
  passwordField.type = "password";
});

togglePassword.addEventListener("mouseleave", () => {
  passwordField.type = "password";
});

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

    window.location.href = "./index.html";
  
  
})

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
      .then(json => json);

    console.log(response);

  if (!response.success) {
    showToast(`Error login: 
      ${response.error}`, "error");

    return;
  }

  showToast(`Login succes.
      User: ${response.data.user_data.full_name}`);
  
  window.localStorage.setItem("session-data", JSON.stringify(response.data));

  const urlParams = new URLSearchParams(window.location.search);
  let ref = urlParams.get("ref");

  if (!ref) {
    window.location.href = "./index.html";
  } else {
    window.location.href = ref;
  }

})