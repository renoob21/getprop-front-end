
let globalRentProperty;

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);

    let property_id = urlParams.get("property_id");

    let response = await fetch(`${window.CONFIG.API_BASE_URL}/api/sale-property/${property_id}`)
        .then(res => {
            if (res.status === 404 || res.status === 403) {
                const currentHref = window.location.href;
                window.location.href = `/${res.status}.html?ref=${currentHref}`;
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
    propertyPrice.innerHTML = `Rp${prop.property_price.toLocaleString("de-DE")} <span class="tag">SALE</span>`;

    let propertyAddress = document.getElementById("property-address");
    propertyAddress.textContent = prop.address;

    let descriptionField = document.getElementById("description-field");
    descriptionField.textContent = prop.description;


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


    let lamaAngsuran = document.getElementById("month_length");
    let downPayment = document.getElementById("down_payment");
    let monthlyMortgage = document.getElementById("monthly_mortgage")

    let downPaymentInputHandler = (input) => {
        let length = Number(lamaAngsuran.value);
        let dp = input.target.value;
        let monthly = Math.round(calculateMonthlyMortgage(prop.property_price, dp, length));
        monthlyMortgage.value = `Rp${monthly.toLocaleString("de-DE")}`;
        
        
    }

    let lengthInputHandler = (input) => {
        let length = input.target.value;
        let dp = Number(downPayment.value);
        let monthly = Math.round(calculateMonthlyMortgage(prop.property_price, dp, length));
        monthlyMortgage.value = `Rp${monthly.toLocaleString("de-DE")}`;
        
            
    }

    let debounceLengthInputHandler = debounce(lengthInputHandler, 500);
    let debounceDpInputHandler = debounce(downPaymentInputHandler, 500);

    document.getElementById("month_length").addEventListener("input", debounceLengthInputHandler);
    downPayment.addEventListener("input", debounceDpInputHandler);

    downPayment.value = prop.property_price * 0.1;
    downPayment.dispatchEvent(new Event("input", {bubbles: true}));

    lamaAngsuran.value = "12";
    lamaAngsuran.dispatchEvent(new Event("input", {bubbles: true}));

});


function calculateMonthlyMortgage(totalLoan, downPayment, loanDuration, interestRate = 0.06) { 
    let principal = totalLoan - downPayment;
    let monthlyInterestRate = interestRate / 12;
    let monthly = principal * monthlyInterestRate * Math.pow(1+monthlyInterestRate, loanDuration) / (Math.pow(1+monthlyInterestRate, loanDuration) - 1);
    return monthly;
}


async function submitPurchase() {
    let saleForm = document.getElementById("sale-form");
    const urlParams = new URLSearchParams(window.location.search);

    let sale_property_id = urlParams.get("property_id");

    if (!saleForm.checkValidity()) {
        saleForm.reportValidity()
    }

    let user_session = JSON.parse(window.localStorage.getItem("session-data"));

    if (!user_session) {
        let ref = window.location.href;
        window.location.href = `/login.html?ref=${ref}`
    }

    formData = new FormData(saleForm);

    let reqBody = {
        sale_property_id,
        down_payment: Number(formData.get("down_payment")),
        installment_duration: Number(formData.get("month_length")),
    }

    let json = JSON.stringify(reqBody);

//     console.log(reqBody);

    
    let response = await fetch(`${window.CONFIG.API_BASE_URL}/api/sale-transaction`, {
            method: "post",
            body: json,
            headers: {
                "session_id" : user_session.session_id,
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(json => json);

            console.log(response);

    if (!response.success) {
        if (response.message === "Unable to retrieve user session") {
            let ref = window.location.href;
            window.location.href = `/login.html?ref=${ref}`;
        }
    } else {
        
        window.location.href = `/sale-payment.html?transaction_id=${response.data.sale_transaction_id}`;
    }
}