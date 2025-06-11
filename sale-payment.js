document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);

    let user_session = JSON.parse(window.localStorage.getItem("session-data"));

    if (!user_session) {
        let ref = window.location.href;
        window.location.href = `./login.html?ref=${ref}`
    }

    let rent_transaction_id = urlParams.get("transaction_id");

    let response = await fetch(`${window.CONFIG.API_BASE_URL}/api/sale-transaction/${rent_transaction_id}`, {
            method: "get",
            headers: {
                "session_id" : user_session.session_id,
            }
        })
            .then(res => {
            if (res.status === 404 || res.status === 403) {
                const currentHref = window.location.href;
                window.location.href = `./${res.status}.html?ref=${currentHref}`;
                return;
            }

            return res.json();
          })
            .then(json => json);

    if (!response.success) {
        if (response.message === "Unable to retrieve user session") {
            let ref = window.location.href;
            window.location.href = `./login.html?ref=${ref}`;
        }

        return;
    }

    console.log(response);
    let transaction = response.data;
    let property = transaction.sale_property;

    let total_payment = transaction.down_payment + transaction.monthly_mortgage;

    

    let propertyPicture = document.getElementById("property-picture");
    propertyPicture.src = property.picture_url;
    let title = document.getElementById("title");
    title.textContent = property.title;
    let address = document.getElementById("address");
    address.textContent = property.address;
    
    let totalPrice = document.getElementById("total-price");
    totalPrice.textContent = `Rp${total_payment.toLocaleString("de-DE")}`;
    let description = document.getElementById("description");
    description.innerHTML = property.description.replace("\r\n", "<br>");

    let downPayment = document.getElementById("down-payment");
    downPayment.textContent = `Rp${transaction.down_payment.toLocaleString("de-DE")}`;
    let monthly_mortgage = document.getElementById("monthly-mortgage");
    monthly_mortgage.textContent = `Rp${transaction.monthly_mortgage.toLocaleString("de-DE")}`;
})

async function paySale() {
    const urlParams = new URLSearchParams(window.location.search);
    let rent_transaction_id = urlParams.get("transaction_id");

    let user_session = JSON.parse(window.localStorage.getItem("session-data"));

    if (!user_session) {
        let ref = window.location.href;
        window.location.href = `./login.html?ref=${ref}`
    }


    let response = await fetch(`${window.CONFIG.API_BASE_URL}/api/pay-sale/${rent_transaction_id}`, {
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
            window.location.href = `./login.html?ref=${ref}`;
        }

        return;
    }

    window.location.href = "./riwayat-transaksi.html?type=sale-transaction";

}