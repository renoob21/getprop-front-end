document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);

    let user_session = JSON.parse(window.localStorage.getItem("session-data"));

    if (!user_session) {
        let ref = window.location.href;
        window.location.href = `/login.html?ref=${ref}`
    }

    let rent_transaction_id = urlParams.get("transaction_id");

    let response = await fetch(`${window.CONFIG.API_BASE_URL}/api/rent-transaction/${rent_transaction_id}`, {
            method: "get",
            headers: {
                "session_id" : user_session.session_id,
            }
        })
            .then(res => {
            if (res.status === 404 || res.status === 403) {
                const currentHref = window.location.href;
                window.location.href = `/${res.status}.html?ref=${currentHref}`;
                return;
            }

            return res.json();
          })
            .then(json => json);

    if (!response.success) {
        if (response.message === "Unable to retrieve user session") {
            let ref = window.location.href;
            window.location.href = `/login.html?ref=${ref}`;
        }

        return;
    }

    console.log(response);
    let transaction = response.data;
    let property = transaction.rent_property;

    let startDate = new Date(transaction.start_date);
    let endDate = new Date(transaction.end_date);

    let totalDuration = 0;

    totalDuration+= ((endDate.getFullYear() - startDate.getFullYear()) * 12);

    totalDuration += (endDate.getMonth() - startDate.getMonth());

    let propertyPicture = document.getElementById("property-picture");
    propertyPicture.src = property.picture_url;
    let title = document.getElementById("title");
    title.textContent = property.title;
    let address = document.getElementById("address");
    address.textContent = property.address;
    let rentDuration = document.getElementById("rent-duration");
    rentDuration.textContent = totalDuration;
    let totalPrice = document.getElementById("total-price");
    totalPrice.textContent = `Rp${transaction.total_payment.toLocaleString("de-DE")}`;
    let description = document.getElementById("description");
    description.textContent = property.description;
})

async function payRent() {
    const urlParams = new URLSearchParams(window.location.search);
    let rent_transaction_id = urlParams.get("transaction_id");

    let user_session = JSON.parse(window.localStorage.getItem("session-data"));

    if (!user_session) {
        let ref = window.location.href;
        window.location.href = `/login.html?ref=${ref}`
    }


    let response = await fetch(`${window.CONFIG.API_BASE_URL}/api/pay-rent/${rent_transaction_id}`, {
            method: "post",
            headers: {
                "session_id" : user_session.session_id,
            }
        })
            .then(res => res.json())
            .then(json => json);

    if (!response.success) {
        if (response.message === "Unable to retrieve user session") {
            let ref = window.location.href;
            window.location.href = `/login.html?ref=${ref}`;
        }

        return;
    }

    window.location.href = "./riwayat-transaksi.html?type=rent_transaction";

}