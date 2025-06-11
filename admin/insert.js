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

async function insertRentalProperty() {
    let form = document.getElementById("insert-form");
    let formData = new FormData(form);

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    try {
        let response = await fetch(`${window.CONFIG.API_BASE_URL}/api/rent-property`, {
            method: "post",
            body: formData,
        })
            .then(res => res.json())
            .then(json => json);

        if (response.success) {
            showToast(
                `${response.message}
                Property: ${response.data.title}`
            )

            form.reset();
        } else {
            showToast(
                `${response.message}
                ${response.error}`,
                'error'
            )
        }
    } catch (err) {
        console.log(err);
        showToast(err), 'error';
    }
}

async function insertSaleProperty() {
    let form = document.getElementById("insert-form");
    let formData = new FormData(form);

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    try {
        let response = await fetch(`${window.CONFIG.API_BASE_URL}/api/sale-property`, {
            method: "post",
            body: formData,
        })
            .then(res => res.json())
            .then(json => json);

        if (response.success) {
            showToast(
                `${response.message}
                Property: ${response.data.title}`
            )

            form.reset();
        } else {
            showToast(
                `${response.message}
                ${response.error}`,
                'error'
            )
        }
    } catch (err) {
        console.log(err);
        showToast(err), 'error';
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    const ownerEl = document.getElementById("owner");

    let ownerList = await fetch(`${window.CONFIG.API_BASE_URL}/api/owner`)
                                .then(res => res.json())
                                .then(json => json.data);
    
    // console.log(ownerList);

    ownerList.forEach(owner => {
        console.log(owner);

        let option = document.createElement("option");
        option.value = owner.owner_id;
        option.textContent = owner.owner_name;

        ownerEl.appendChild(option)
    });
    
})