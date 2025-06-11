document.addEventListener('DOMContentLoaded', async () => {
    let userNav = document.getElementById("user-nav");
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

    userNav.innerHTML = `
    <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="User Avatar" class="avatar" />
      <span class="profile-name" tabindex="0" aria-haspopup="true" aria-expanded="false">${response.data.user_data.full_name}</span>
        <ul class="profile-dropdown" aria-label="Menu Profile" role="menu" tabindex="-1">
          <li role="menuitem"><a href="./riwayat-transaksi.html">Riwayat Transaksi</a></li>
          <li role="menuitem" onclick="logout()"><a tabindex="0">Logout</a></li>
        </ul>
        `

    let logo = document.querySelector("div.nav-left .logo");
    logo.addEventListener("click", () => {
        window.location.href = "./index.html"
    })
});

async function logout() {
    let userNav = document.getElementById("user-nav");
    let user_session = JSON.parse(window.localStorage.getItem("session-data"));

    let response =  await fetch(`${window.CONFIG.API_BASE_URL}/api/logout`, {
        headers: {"session_id": user_session.session_id}
    })
        .then(res => res.json())
        .then(json => json);

    window.localStorage.clear();
    window.location.reload();
}