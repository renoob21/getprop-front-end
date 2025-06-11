
let globalRentProperty;

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);

    let property_id = urlParams.get("property_id");

    let response = await fetch(`${window.CONFIG.API_BASE_URL}/api/rent-property/${property_id}`)
        .then(res => {
            if (res.status === 404 || res.status === 403) {
                const currentHref = window.location.href;
                window.location.href = `./${res.status}.html?ref=${currentHref}`;
                return;
            }

            return res.json();
        })
        .then(json => json);

    console.log(response);
    console.log(response.status);

    if (!response.success) {
        return;
    }

    let prop = response.data;

    let propertyPicture = document.getElementById("property-picture");

    propertyPicture.src = prop.picture_url;

    let propertyTitle = document.getElementById("property-title");
    propertyTitle.textContent = prop.title;

    let propertyPrice = document.getElementById("property-price");
    propertyPrice.innerHTML = `Rp${prop.monthly_rent.toLocaleString("de-DE")}/bulan <span class="tag">RENT</span>`;

    let propertyAddress = document.getElementById("property-address");
    propertyAddress.textContent = prop.address;

    let descriptionField = document.getElementById("description-field");
    descriptionField.textContent = prop.description;

    let totalPrice = document.getElementById("total-price");
    totalPrice.textContent = `Rp${prop.monthly_rent.toLocaleString("de-DE")}`;

    let featureList = document.getElementById("feature-list");
    featureList.innerHTML = `
            <span title="Land Area" class="feature-chip">
                <img src="${'assets/icons/rulers.svg'}" alt="Land Area Icon" class="feature-icon"> ${prop.lt} m²
            </span>
            <span title="Building Area" class="feature-chip">
                <img src="${'assets/icons/house-door.svg'}" alt="Building Area Icon" class="feature-icon"> ${prop.lb} m²
            </span>
            <span title="Number of Bedrooms" class="feature-chip">
                <img src="${'assets/icons/bed-solid.svg'}" alt="Bedroom Icon" class="feature-icon"> ${prop.bedroom} KT
            </span>
            <span title="Number of Bathrooms" class="feature-chip">
                <img src="${'assets/icons/bath-solid.svg'}" alt="Bathroom Icon" class="feature-icon"> ${prop.bathroom} KM
            </span>
        `;

    let startDate = document.getElementById("start_date");
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedToday = `${yyyy}-${mm}-${dd}`;
    startDate.value = formattedToday;
    startDate.setAttribute("min", formattedToday);

    let endDate = document.getElementById("end_date");

    let lamaSewa = document.getElementById("month_length");


    startDate.addEventListener("input", (input) => {
        let startRent = new Date(startDate.value);

        const addedMonth = Number(lamaSewa.value)  + startRent.getMonth();
        const yyyy = startRent.getFullYear() + Math.floor((addedMonth) / 12);
        let mm = String(addedMonth % 12 + 1).padStart(2, '0'); // Months are 0-indexed
        let dd = String(startRent.getDate()).padStart(2, '0');

        if (mm === "02" && dd === "29" && !isLeapYear(Number(yyyy))) {
                mm = "03";
                dd = "01";
            }
        
        endDate.value = `${yyyy}-${mm}-${dd}`;

    })

    let lengthInputHandler = (input) => {
            console.log(`Value: ${input.target.value}`);
            let startRent = new Date(startDate.value);

            const addedMonth = Number(input.target.value)  + startRent.getMonth();
            const yyyy = startRent.getFullYear() + Math.floor((addedMonth) / 12);
            let mm = String(addedMonth % 12 + 1).padStart(2, '0'); // Months are 0-indexed
            let dd = String(startRent.getDate()).padStart(2, '0');

            if (mm === "02" && Number(dd) >= 29 && !isLeapYear(Number(yyyy))) {
                    mm = "03";
                    dd = String(Number(dd) - 28).padStart(2, '0');
                } else if (dd === "31" && (mm === "04" || mm === "06" || mm ==="09" || mm === "11")) {
                    dd = "01";
                    mm = String(Number(mm) + 1).padStart(2, '0');
                }
            
            endDate.value = `${yyyy}-${mm}-${dd}`;

            let totalRentPrice = prop.monthly_rent * Number(input.target.value);

            totalPrice.textContent = `Rp${totalRentPrice.toLocaleString("de-DE")}`;

            
        }

    let debounceLengthInputHandler = debounce(lengthInputHandler, 500);

    document.getElementById("month_length").addEventListener("input", debounceLengthInputHandler);

    lamaSewa.value = "1";
    lamaSewa.dispatchEvent(new Event("input", {bubbles: true}));

})

async function submitRent() {
    let rentForm = document.getElementById("rent-form");
    const urlParams = new URLSearchParams(window.location.search);

    let rent_property_id = urlParams.get("property_id");

    if (!rentForm.checkValidity()) {
        rentForm.reportValidity()
    }

    let user_session = JSON.parse(window.localStorage.getItem("session-data"));

    if (!user_session) {
        let ref = window.location.href;
        window.location.href = `./login.html?ref=${ref}`
    }

    formData = new FormData(rentForm);

    let reqBody = {
        rent_property_id,
        start_date: formData.get("start_date"),
        end_date: formData.get("end_date"),
    }

    let json = JSON.stringify(reqBody);

    console.log(reqBody);

    
    let response = await fetch(`${window.CONFIG.API_BASE_URL}/api/rent-transaction`, {
            method: "post",
            body: json,
            headers: {
                "session_id" : user_session.session_id,
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(json => json);

    if (!response.success) {
        if (response.message === "Unable to retrieve user session") {
            let ref = window.location.href;
            window.location.href = `./login.html?ref=${ref}`;
        }
    } else {
        window.location.href = `./rent-payment.html?transaction_id=${response.data.rent_transaction_id}`;
    }
}