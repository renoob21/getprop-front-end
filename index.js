document.addEventListener('DOMContentLoaded', async () => {
  


  /*
  Tarik data buat ambil properti jual
   */
  let saleContainer = document.getElementById("sale-list");

  let saleResponse = await fetch(`${window.CONFIG.API_BASE_URL}/api/sale-property`)
    .then(res => res.json())
    .then(json => json);

  if (saleResponse.success) {

    let properties = saleResponse.data;

    let listNum = properties.length > 5 ? 5 : properties.length;

    for (i = 0; i < listNum; i++) {
      let card = document.createElement("div");
      card.className = "card";

      prop = properties[i];
  
      card.innerHTML = `
            <img src="${prop.picture_url}" alt="Seaside Serenity Villa" />
            <h3 class="card-title">${prop.title}</h3>
            <p class="card-price">Rp ${prop.property_price.toLocaleString("de-DE")}</p>
            <p class="card-desc">${prop.description}</p>
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
            <a class="btn-detail" href="./detail-properti-jual.html?property_id=${prop.sale_property_id}">Lihat Detail</a>
      `
      saleContainer.appendChild(card);

    }

    

  }


  /*Tarik Properti Sewa */

  let rentContainer = document.getElementById("rent-list");

  let rentResponse = await fetch(`${window.CONFIG.API_BASE_URL}/api/rent-property`)
  .then(res => {
            if (res.status === 404 || res.status === 403) {
                const currentHref = window.location.href;
                window.location.href = `./${res.status}.html?ref=${currentHref}`;
                return;
            }

            return res.json();
          }
          )
  .then(json => json);

  if (rentResponse.success) {

    let properties = rentResponse.data;

    let listNum = properties.length > 5 ? 5 : properties.length;

    for (i = 0; i < listNum; i++) {
      let card = document.createElement("div");
      card.className = "card";

      prop = properties[i];
  
      card.innerHTML = `
            <img src="${prop.picture_url}" alt="Seaside Serenity Villa" />
            <h3 class="card-title">${prop.title}</h3>
            <p class="card-price">Rp ${prop.monthly_rent.toLocaleString("de-DE")}/bulan</p>
            <p class="card-desc">${prop.description}</p>
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
      rentContainer.appendChild(card);

    }

    setPagination();
  }

    

  
});


function setPagination() {
  // Cari semua section yang memiliki cards dan pagination di halaman
  const sections = document.querySelectorAll('section.section');

  sections.forEach(section => {
    const cardsContainer = section.querySelector('.cards');
    const btnPrev = section.querySelector('.btn-prev');
    const btnNext = section.querySelector('.btn-next');

    if (cardsContainer && btnPrev && btnNext) {
      // Lebar satu card + jarak gap (gap 16px di CSS)
      const card = cardsContainer.querySelector('.card');
      const cardStyle = window.getComputedStyle(card);
      const cardWidth = card.offsetWidth;
      const gap = parseInt(cardStyle.marginRight) || 16; // fallback 16 jika marginRight tidak ada

      const scrollAmount = cardWidth + gap;

      btnPrev.addEventListener('click', () => {
        // Geser ke kiri sebanyak satu card
        cardsContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });

      btnNext.addEventListener('click', () => {
        // Geser ke kanan sebanyak satu card
        cardsContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    }
  });
}