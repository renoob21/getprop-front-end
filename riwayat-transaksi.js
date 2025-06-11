document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);

    let type = urlParams.get("type");

    if (type === "sale-transaction") {
        await populateSaleTransaction();
    } else if (type === "rent-transaction") {
        await populateRentTransaction();
    } else {
        window.location.href = "./riwayat-transaksi.html?type=sale-transaction";
    }
})

async function populateSaleTransaction() {
    let historyContainer = document.getElementById("history-container");

     let user_session = JSON.parse(window.localStorage.getItem("session-data"));

    if (!user_session) {
        let ref = window.location.href;
        window.location.href = `./login.html?ref=${ref}`
    }

    let response = await fetch(`${window.CONFIG.API_BASE_URL}/api/my-sale-transaction`, {
            method: "get",
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
    
    historyContainer.innerHTML = '';

    for (trans of response.data) {
        let prop = trans.sale_property;

        let div = document.createElement("div");
        div.classList.add("transaction-item");
        div.classList.add("card");

        div.innerHTML = `
        <div class="card-image-container">
                    <img src="${prop.picture_url}" alt="Property Image" 
                         onerror="this.onerror=null;this.src='https://placehold.co/100x80/CCCCCC/FFFFFF?text=Error';">
                </div>
                <div class="card-content-flex">
                    <div>
                        <div class="card-main-info">
                            <h3 class="card-title">${prop.title}</h3>
                            <p class="property-address">${prop.address}</p>
                            <span class="transaction-status card-tag status-${trans.status.toLowerCase()}">${trans.status}</span>
                            <p class="card-price">Rp${prop.property_price.toLocaleString("de-DE")}</p> 
                        </div>
                        
                        <div class="sale-details-grid">
                            <p><strong>Tanggal Transaksi:</strong> ${trans.sale_date}</p>
                            <p><strong>Down Payment:</strong> ${trans.down_payment.toLocaleString("de-DE")}</p>
                            <p><strong>Lama angsuran:</strong> ${trans.installment_duration} bulan</p>
                            <p><strong>Cicilan Bulanan:</strong> Rp${trans.monthly_mortgage.toLocaleString("de-DE")}</p>
                        </div>
                        </div>
                    
                </div>
        `;

        if (trans.status === "Unpaid") {
            let a = document.createElement("a");
            a.href = `./sale-payment.html?transaction_id=${trans.sale_transaction_id}`;
            a.classList.add("btn-detail");
            a.textContent = "Bayar Sekarang";
            div.getElementsByClassName("card-content-flex")[0].appendChild(a)
        }

        historyContainer.appendChild(div);
    }
}

async function populateRentTransaction() {
    const transaksiBeliTab = document.getElementById("transaksi-beli");
    const transaksiSewaTab = document.getElementById("transaksi-sewa");

    transaksiBeliTab.classList.remove("active");
    transaksiSewaTab.classList.add("active");


    let historyContainer = document.getElementById("history-container");

     let user_session = JSON.parse(window.localStorage.getItem("session-data"));

    if (!user_session) {
        let ref = window.location.href;
        window.location.href = `./login.html?ref=${ref}`
    }

    let response = await fetch(`${window.CONFIG.API_BASE_URL}/api/my-rent-transaction`, {
            method: "get",
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

    console.log(response);
    
    historyContainer.innerHTML = '';

    for (trans of response.data) {
        let prop = trans.rent_property;

        let div = document.createElement("div");
        div.classList.add("transaction-item");
        div.classList.add("card");

        div.innerHTML = `
        <div class="card-image-container">
                    <img src="${prop.picture_url}" alt="Property Image" 
                         onerror="this.onerror=null;this.src='https://placehold.co/100x80/CCCCCC/FFFFFF?text=Error';">
                </div>
                <div class="card-content-flex">
                    <div>
                        <div class="card-main-info">
                            <h3 class="card-title">${prop.title}</h3>
                            <p class="property-address">${prop.address}</p>
                            <span class="transaction-status card-tag status-${trans.status.toLowerCase()}">${trans.status}</span>
                            <p class="card-price">Rp${trans.total_payment.toLocaleString("de-DE")}</p> 
                        </div>
                        
                        <div class="sale-details-grid">
                            <p><strong>Tanggal Mulai:</strong> ${trans.start_date}</p>
                            <p><strong>Tanggal Selesai:</strong> ${trans.end_date}</p>
                            <p><strong>Sewa per Bulan:</strong> Rp${prop.monthly_rent.toLocaleString("de-DE")}</p>
                        </div>
                        </div>
                    
                </div>
        `;

        if (trans.status === "Unpaid") {
            let a = document.createElement("a");
            a.href = `./rent-payment.html?transaction_id=${trans.rent_transaction_id}`;
            a.classList.add("btn-detail");
            a.textContent = "Bayar Sekarang";
            div.getElementsByClassName("card-content-flex")[0].appendChild(a)
        }

        historyContainer.appendChild(div);
    }
    
}