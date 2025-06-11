// ======= Metode Pembayaran =======
const paymentMethodRadios = document.getElementsByName('payment-method');
const bankDetails = document.getElementById('bank-details');
const creditDetails = document.getElementById('credit-details');
const ewalletDetails = document.getElementById('ewallet-details');

function hideAllPaymentDetails() {
  bankDetails.style.display = 'none';
  creditDetails.style.display = 'none';
  ewalletDetails.style.display = 'none';
}

function showPaymentDetail(method) {
  hideAllPaymentDetails();
  if (method === 'bank') bankDetails.style.display = 'block';
  else if (method === 'credit') creditDetails.style.display = 'block';
  else if (method === 'ewallet') ewalletDetails.style.display = 'block';
}

paymentMethodRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    showPaymentDetail(radio.value);
  });
});


const checkedMethod = Array.from(paymentMethodRadios).find(r => r.checked);
if (checkedMethod) showPaymentDetail(checkedMethod.value);

// ======= Dompet Digital Dinamis =======
const ewalletRadios = document.getElementsByName('ewallet-choice');
// const ewalletNumber = document.getElementById('ewallet-number');
// const ewalletInstruction = document.getElementById('ewallet-instruction');

const ewalletData = {
  ovo: {
    number: '0812-3456-7890',
    instruction: 'Buka aplikasi OVO, pilih menu Transfer dan masukkan nomor tujuan di atas untuk melakukan pembayaran.'
  },
  gopay: {
    number: '0813-9876-5432',
    instruction: 'Buka aplikasi GoPay, pilih Bayar/Scan QR, dan lakukan transfer ke nomor di atas.'
  },
  dana: {
    number: '0821-1122-3344',
    instruction: 'Buka aplikasi DANA, pilih Kirim Dana, lalu masukkan nomor tujuan di atas untuk membayar.'
  }
};

function updateEwalletInfo() {
  let selected = null;
  ewalletRadios.forEach(r => {
    if (r.checked) selected = r.value;
  });

  if (selected && ewalletData[selected]) {
    // ewalletNumber.textContent = ewalletData[selected].number;
    // ewalletInstruction.textContent = ewalletData[selected].instruction;
  } else {
    // ewalletNumber.textContent = '-';
    // ewalletInstruction.textContent = 'Pilih dompet digital untuk melihat petunjuk pembayaran.';
  }
}

ewalletRadios.forEach(radio => {
  radio.addEventListener('change', updateEwalletInfo);
});

updateEwalletInfo();

// ======= Opsi Cicilan =======
const paymentOptions = document.getElementsByName('payment-option');
const installmentOptionsDiv = document.getElementById('installment-options');
const installmentCountSelect = document.getElementById('installment-count');
const installmentMonthlyText = document.getElementById('installment-monthly');
const totalPriceText = document.getElementById('total-price');

function parseRupiahToNumber(rupiah) {
  return Number(rupiah.replace(/[^0-9,-]+/g, '').replace(',', '.'));
}

function formatNumberToRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
}

const priceStr = document.getElementById('price-value').textContent.trim();
const discountStr = document.getElementById('discount-value').textContent.trim();
const depositStr = document.getElementById('deposit-value').textContent.trim();

const price = parseRupiahToNumber(priceStr);
const discount = parseRupiahToNumber(discountStr);
const deposit = parseRupiahToNumber(depositStr);
const total = price - discount - deposit;

function updateInstallment() {
  if (installmentOptionsDiv.style.display === 'none') {
    totalPriceText.textContent = formatNumberToRupiah(total);
    installmentMonthlyText.textContent = formatNumberToRupiah(0);
    return;
  }
  const count = parseInt(installmentCountSelect.value);
  const monthly = total / count;
  installmentMonthlyText.textContent = formatNumberToRupiah(monthly);
  totalPriceText.textContent = formatNumberToRupiah(total);
}

paymentOptions.forEach(opt => {
  opt.addEventListener('change', () => {
    if (opt.value === 'installment' && opt.checked) {
      installmentOptionsDiv.style.display = 'block';
    } else {
      installmentOptionsDiv.style.display = 'none';
    }
    updateInstallment();
  });
});

installmentCountSelect.addEventListener('change', () => {
  updateInstallment();
});

updateInstallment();

// ======= Tombol Bayar dengan Validasi =======
const btnPay = document.querySelector('.btn-pay');

btnPay.addEventListener('click', (e) => {
  e.preventDefault();

  const selectedPaymentMethod = Array.from(paymentMethodRadios).find(r => r.checked)?.value || null;
  const selectedPaymentOption = Array.from(paymentOptions).find(r => r.checked)?.value || 'full';

  if (!selectedPaymentMethod) {
    alert('Pilih metode pembayaran.');
    return;
  }

  if (selectedPaymentMethod === 'credit') {
    const cardNumberInput = document.getElementById('card-number');
    const cardNumber = cardNumberInput.value.trim();
    if (cardNumber.length < 13 || !/^\d{13,19}$/.test(cardNumber)) {
      alert('Masukkan nomor kartu kredit yang valid (13-19 digit angka).');
      cardNumberInput.focus();
      return;
    }

    const cardExpiryInput = document.getElementById('card-expiry');
    if (!cardExpiryInput.value) {
      alert('Masukkan tanggal kadaluarsa kartu kredit.');
      cardExpiryInput.focus();
      return;
    }

    const cardCVVInput = document.getElementById('card-cvv');
    const cvv = cardCVVInput.value.trim();
    if (!/^\d{3,4}$/.test(cvv)) {
      alert('Masukkan CVV kartu kredit yang valid (3-4 digit).');
      cardCVVInput.focus();
      return;
    }
  }

  if (selectedPaymentMethod === 'ewallet') {
    const selectedEwallet = Array.from(ewalletRadios).find(r => r.checked);
    if (!selectedEwallet) {
      alert('Pilih dompet digital yang akan digunakan.');
      return;
    }
  }

  // Ambil detail pembayaran untuk ditampilkan
  let paymentDetailsSummary = '';
  if (selectedPaymentMethod === 'bank') {
    const bankSelect = document.getElementById('transfer-bank');
    paymentDetailsSummary = `Transfer Bank: ${bankSelect.options[bankSelect.selectedIndex].text}`;
  } else if (selectedPaymentMethod === 'credit') {
    const cardNumber = document.getElementById('card-number').value.trim();
    const cardExpiry = document.getElementById('card-expiry').value.trim();
    // CVV disembunyikan
    paymentDetailsSummary = `Kartu Kredit - Nomor: ${cardNumber}, Kadaluarsa: ${cardExpiry}`;
  } else if (selectedPaymentMethod === 'ewallet') {
    const selectedEwallet = Array.from(ewalletRadios).find(r => r.checked)?.value || '-';
    paymentDetailsSummary = `Dompet Digital: ${selectedEwallet.toUpperCase()}`;
  }

  let installmentInfo = 'Pembayaran penuh sekaligus.';
  if (selectedPaymentOption === 'installment') {
    const months = installmentCountSelect.value;
    const monthly = installmentMonthlyText.textContent;
    installmentInfo = `Cicilan selama ${months} bulan, estimasi cicilan per bulan: ${monthly}`;
  }

  alert(
    `Detail Pembayaran:\n` +
    `Metode: ${selectedPaymentMethod.toUpperCase()}\n` +
    `${paymentDetailsSummary}\n` +
    `${installmentInfo}\n` +
    `Total: ${totalPriceText.textContent}\n\n` +
    `Lanjutkan ke proses pembayaran...`
  );
});



//  // Script untuk toggle opsi cicilan dan hitung simulasi cicilan
//     const paymentOptions = document.getElementsByName('payment-option');
//     const installmentOptionsDiv = document.getElementById('installment-options');
//     const installmentCountSelect = document.getElementById('installment-count');
//     const installmentMonthlyText = document.getElementById('installment-monthly');
//     const totalPriceText = document.getElementById('total-price');

//     // Ambil nilai harga (contoh dari string, perlu diolah)
//     const parseRupiahToNumber = (rupiah) => {
//       return Number(rupiah.replace(/[^0-9,-]+/g, '').replace(',', '.'));
//     };

//     const formatNumberToRupiah = (number) => {
//       return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
//     };

//     const priceStr = document.getElementById('price-value').textContent.trim();
//     const discountStr = document.getElementById('discount-value').textContent.trim();
//     const depositStr = document.getElementById('deposit-value').textContent.trim();

//     // Convert string ke number
//     const price = parseRupiahToNumber(priceStr);
//     const discount = parseRupiahToNumber(discountStr);
//     const deposit = parseRupiahToNumber(depositStr);

//     // Total yang harus dibayar: price - discount - deposit
//     const total = price - discount - deposit;

//     function updateInstallment() {
//       if (installmentOptionsDiv.style.display === 'none') {
//         totalPriceText.textContent = formatNumberToRupiah(total);
//         installmentMonthlyText.textContent = formatNumberToRupiah(0);
//         return;
//       }
//       const count = parseInt(installmentCountSelect.value);
//       const monthly = total / count;
//       installmentMonthlyText.textContent = formatNumberToRupiah(monthly);
//       totalPriceText.textContent = formatNumberToRupiah(total);
//     }

//     // Toggle cicilan / bayar penuh
//     paymentOptions.forEach(opt => {
//       opt.addEventListener('change', () => {
//         if (opt.value === 'installment' && opt.checked) {
//           installmentOptionsDiv.style.display = 'block';
//         } else {
//           installmentOptionsDiv.style.display = 'none';
//         }
//         updateInstallment();
//       });
//     });

//     installmentCountSelect.addEventListener('change', () => {
//       updateInstallment();
//     });

//     // Inisialisasi awal
//     updateInstallment();

