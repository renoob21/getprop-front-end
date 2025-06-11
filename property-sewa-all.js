document.addEventListener("DOMContentLoaded", async () => {
    let productContainer = document.getElementById("product-container");

    let rentResponse = await fetch(`${window.CONFIG.API_BASE_URL}/api/rent-property`)
        .then(res => res.json())
        .then(json => json);

  if (rentResponse.success) {

    let properties = rentResponse.data;

    for (prop of properties) {
      let card = document.createElement("div");
      card.className = "card";

  
      card.innerHTML = `
            <img src="${prop.picture_url}" alt="Seaside Serenity Villa" />
            <h3 class="card-title">${prop.title}</h3>
            <p class="card-price">Rp ${prop.monthly_rent.toLocaleString("de-DE")}/bulan</p>
            
            <div class="property-features-list" aria-label="Fasilitas properti">
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
        </div>
            <a class="btn-detail" href="./detail-properti-sewa.html?property_id=${prop.rent_property_id}">Lihat Detail</a>
      `
      productContainer.appendChild(card);

    }}
})