const MASTER_MENU = [
  // Kategori: minuman
  { id: 'ocha', kategori: 'minuman', nama: 'OCHA TEA', harga: 10, deskripsi: 'Traditional Japanese tea served ice/hot' },
  { id: 'greentea', kategori: 'minuman', nama: 'GREEN TEA', harga: 10, deskripsi: 'Green tea traditional served ice/hot' },
  { id: 'milk', kategori: 'minuman', nama: 'MILK TEA', harga: 10, deskripsi: 'A hot drink made of milk, egg yolk, honey, and ginger' },
  { id: 'oolong', kategori: 'minuman', nama: 'OOLONG TEA', harga: 11, deskripsi: 'Traditional Chinese tea served ice/hot' },
  { id: 'lemon', kategori: 'minuman', nama: 'LEMON TEA', harga: 13, deskripsi: 'Tea with lemon special served ice/hot' },

  // Kategori: makanan
  { id: 'miso', kategori: 'makanan', nama: 'MISO RAMEN', harga: 15, deskripsi: 'Japanese noodle soup made with wheat noodles' },
  { id: 'shoyu', kategori: 'makanan', nama: 'SHOYU RAMEN', harga: 12, deskripsi: 'Ramen served with soy sauce based broth' },
  { id: 'chicken', kategori: 'makanan', nama: 'CHICKEN RAMEN', harga: 11, deskripsi: 'Ramen served with chicken katsu set' },
  { id: 'chashu', kategori: 'makanan', nama: 'CHASHU RAMEN', harga: 13, deskripsi: 'Ramen served with carbonara sauce and meat' },
  { id: 'curry', kategori: 'makanan', nama: 'CURRY RAMEN', harga: 14, deskripsi: 'Ramen with curry sauce and chicken teriyaki' }
];

function renderMenuUtama() {
  const listMinumanEl = document.getElementById('list-minuman');
  const listMakananEl = document.getElementById('list-makanan');

  listMinumanEl.innerHTML = '';
  listMakananEl.innerHTML = '';

  MASTER_MENU.forEach(item => {
    const htmlItem = `
      <label class="menu-utama">
        <div class="menu-minum">
          <div class="menu-item">
            <div class="name-and-check">
              <input type="checkbox" class="food-checkbox" data-id="${item.id}" data-name="${item.nama}" data-price="${item.harga}">
              <span class="custom-checkmark"></span>
              <span class="item-name">${item.nama}</span>
            </div>
            <span class="item-price">${item.harga}K</span>
          </div>
          <p class="minum">${item.deskripsi}</p>
          <br>
        </div>
      </label>
    `;

    if (item.kategori === 'minuman') {
      listMinumanEl.innerHTML += htmlItem;
    } else if (item.kategori === 'makanan') {
      listMakananEl.innerHTML += htmlItem;
    }
  });
}

renderMenuUtama();

const checkboxes = document.querySelectorAll('.food-checkbox');
const itemCountEl = document.getElementById('item-count');
const totalPriceEl = document.getElementById('total-price');
const orderBtn = document.getElementById('order-btn');

const modal = document.getElementById('checkout-modal');
const modalTotalPrice = document.getElementById('modal-total-price');
const tableInput = document.getElementById('table-number');
const paymentSelect = document.getElementById('payment-method');
const cancelModalBtn = document.getElementById('cancel-modal-btn');
const confirmOrderBtn = document.getElementById('confirm-order-btn');

// --- LOGIKA DIALOG PERAN (PELANGGAN VS PEGAWAI) ---
const roleModal = document.getElementById('role-modal');
const btnPelanggan = document.getElementById('btn-pelanggan');
const btnPegawai = document.getElementById('btn-pegawai');

const staffNav = document.getElementById('staff-nav');
const navMenuUtama = document.getElementById('nav-menu-utama');
const navPesanan = document.getElementById('nav-pesanan');
const navGantiPeran = document.getElementById('nav-ganti-peran');

const menuSection = document.querySelector('.row-kolom');
const orderBar = document.querySelector('.order-bar');
const pesananView = document.getElementById('pesanan-view');
const daftarPesananContainer = document.getElementById('daftar-pesanan-container');
const orderBadge = document.getElementById('order-badge');

const editOrderModal = document.getElementById('edit-order-modal');
const editOrderIndexInput = document.getElementById('edit-order-index');
const editTableInput = document.getElementById('edit-table-number');
const editPaymentSelect = document.getElementById('edit-payment-method');
const editTotalPriceEl = document.getElementById('edit-total-price');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const saveEditBtn = document.getElementById('save-edit-btn');

const btnTambahItemEdit = document.getElementById('btn-tambah-item-edit');
const menuPickerPopup = document.getElementById('menu-picker-popup');
const editSelectedItemsList = document.getElementById('edit-selected-items-list');

const staffAddItemBtn = document.getElementById('staff-add-item-btn');
const staffMenuPickerPopup = document.getElementById('staff-menu-picker-popup');
const staffEditItemsList = document.getElementById('staff-edit-items-list');

let currentEditItems = [];
let currentModalItems = [];
let daftarPesanan = [];

// --- LOGIKA TOMBOL "+" & POPUP KATEGORI MENU (CHECKOUT) ---
function renderModalItems() {
  if (editSelectedItemsList) editSelectedItemsList.innerHTML = '';
  let total = 0;

  currentModalItems.forEach((item, index) => {
    total += item.harga;

    if (editSelectedItemsList) {
      const editLi = document.createElement('li');
      editLi.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 4px 6px; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.85rem;';
      editLi.innerHTML = `
        <span>${item.nama} (${item.harga}K)</span>
        <button type="button" onclick="hapusItemModal(${index})" style="background: #b81d1d; color: white; padding: 2px 8px; font-size: 12px; margin-top: 0;">x</button>
      `;
      editSelectedItemsList.appendChild(editLi);
    }
  });

  modalTotalPrice.textContent = total + 'K';
}

window.hapusItemModal = function(index) {
  currentModalItems.splice(index, 1);
  renderModalItems();
};

window.pilihDariPopup = function(id) {
  const item = MASTER_MENU.find(m => m.id === id);
  if (item) {
    currentModalItems.push({ nama: item.nama, harga: item.harga });
    renderModalItems();
  }
};

function renderMenuPickerPopup() {
  if (!menuPickerPopup) return;
  const minuman = MASTER_MENU.filter(m => m.kategori === 'minuman');
  const makanan = MASTER_MENU.filter(m => m.kategori === 'makanan');

  const buatTombolItem = (item) => `
    <div onclick="pilihDariPopup('${item.id}')" 
         style="display: flex; justify-content: space-between; padding: 6px 8px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.9rem;"
         onmouseover="this.style.background='#540b0e'" 
         onmouseout="this.style.background='transparent'">
      <span>+ ${item.nama}</span>
      <span style="color: #f5b800; font-weight: bold;">${item.harga}K</span>
    </div>
  `;

  menuPickerPopup.innerHTML = `
    <div style="color: #f5b800; font-weight: bold; font-size: 0.85rem; padding: 4px 6px; background: #2b0909;">
      Kategori: Minuman
    </div>
    ${minuman.map(buatTombolItem).join('')}

    <div style="color: #f5b800; font-weight: bold; font-size: 0.85rem; padding: 4px 6px; margin-top: 6px; background: #2b0909;">
      Kategori: Makanan
    </div>
    ${makanan.map(buatTombolItem).join('')}
  `;
}

if (btnTambahItemEdit && menuPickerPopup) {
  btnTambahItemEdit.addEventListener('click', () => {
    if (menuPickerPopup.style.display === 'none' || menuPickerPopup.style.display === '') {
      renderMenuPickerPopup();
      menuPickerPopup.style.display = 'block';
    } else {
      menuPickerPopup.style.display = 'none';
    }
    });
}

// --- LOGIKA POPUP KATEGORI MENU (EDIT PEGAWAI) ---
window.pilihDariPopupEdit = function(id) {
  const menuObj = MASTER_MENU.find(m => m.id === id);
  if (menuObj) {
    currentEditItems.push({ nama: menuObj.nama, harga: menuObj.harga });
    renderStaffEditItems();
  }
};

function renderStaffMenuPickerPopup() {
  if (!staffMenuPickerPopup) return;
  const minuman = MASTER_MENU.filter(m => m.kategori === 'minuman');
  const makanan = MASTER_MENU.filter(m => m.kategori === 'makanan');

  const buatTombolItem = (item) => `
    <div onclick="pilihDariPopupEdit('${item.id}')" 
         style="display: flex; justify-content: space-between; padding: 6px 8px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.9rem;"
         onmouseover="this.style.background='#540b0e'" 
         onmouseout="this.style.background='transparent'">
      <span>+ ${item.nama}</span>
      <span style="color: #f5b800; font-weight: bold;">${item.harga}K</span>
    </div>
  `;

  staffMenuPickerPopup.innerHTML = `
    <div style="color: #f5b800; font-weight: bold; font-size: 0.85rem; padding: 4px 6px; background: #2b0909;">
      Kategori: Minuman
    </div>
    ${minuman.map(buatTombolItem).join('')}

    <div style="color: #f5b800; font-weight: bold; font-size: 0.85rem; padding: 4px 6px; margin-top: 6px; background: #2b0909;">
      Kategori: Makanan
    </div>
    ${makanan.map(buatTombolItem).join('')}
  `;
}

if (staffAddItemBtn && staffMenuPickerPopup) {
  staffAddItemBtn.addEventListener('click', () => {
    if (staffMenuPickerPopup.style.display === 'none' || staffMenuPickerPopup.style.display === '') {
      renderStaffMenuPickerPopup();
      staffMenuPickerPopup.style.display = 'block';
    } else {
      staffMenuPickerPopup.style.display = 'none';
    }
  });
}

// --- LOGIKA PESANAN & PEGAWAI ---
function renderPesanan() {
  orderBadge.textContent = daftarPesanan.length;

  if (daftarPesanan.length === 0) {
    daftarPesananContainer.innerHTML = '<p style="text-align: center; color: #e0d5d5;">Belum ada pesanan masuk.</p>';
    return;
  }

  daftarPesananContainer.innerHTML = daftarPesanan.map((order, index) => `
    <div class="order-card">
      <div style="display: flex; justify-content: space-between; font-weight: bold; color: #f5b800; margin-bottom: 6px;">
        <span>Meja No. ${order.meja}</span>
        <span>${order.total} (${order.metode})</span>
      </div>
      <div style="font-size: 0.9rem;">
        <strong>Item:</strong>
        <ol style="margin: 4px 0 0 0; padding-left: 20px; line-height: 1.5;">
          ${order.items.map(item => `<li>${item}</li>`).join('')}
        </ol>
      </div>
      <div class="order-card-actions" style="margin-top: 10px;">
        <button type="button" class="btn-edit-order" onclick="bukaEditPesanan(${index})">Edit</button>
        <button type="button" class="btn-delete-order" onclick="hapusPesanan(${index})">Hapus</button>
      </div>
    </div>
  `).join('');
}

window.hapusPesanan = function(index) {
  const pesanan = daftarPesanan[index];
  if (confirm(`Yakin ingin menghapus pesanan untuk Meja No. ${pesanan.meja}?`)) {
    daftarPesanan.splice(index, 1);
    renderPesanan();
  }
};

function renderStaffEditItems() {
  if (!staffEditItemsList) return;
  staffEditItemsList.innerHTML = '';
  let total = 0;

  if (currentEditItems.length === 0) {
    staffEditItemsList.innerHTML = '<li style="padding: 8px; color: #e0d5d5; font-size: 0.85rem; text-align: center;">Belum ada item.</li>';
  }

  currentEditItems.forEach((item, idx) => {
    total += item.harga;
    const li = document.createElement('li');
    li.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.85rem;';
    li.innerHTML = `
      <span>${idx + 1}. ${item.nama} (${item.harga}K)</span>
      <button type="button" onclick="hapusItemEdit(${idx})" style="background: #b81d1d; color: white; padding: 2px 8px; font-size: 12px; margin-top: 0;">x</button>
    `;
    staffEditItemsList.appendChild(li);
  });

  editTotalPriceEl.textContent = total + 'K';
}

window.hapusItemEdit = function(idx) {
  currentEditItems.splice(idx, 1);
  renderStaffEditItems();
};

window.bukaEditPesanan = function(index) {
  const pesanan = daftarPesanan[index];
  editOrderIndexInput.value = index;
  editTableInput.value = pesanan.meja;
  editPaymentSelect.value = pesanan.metode;

  currentEditItems = pesanan.items.map(namaItem => {
    const found = MASTER_MENU.find(m => m.nama === namaItem);
    return {
      nama: namaItem,
      harga: found ? found.harga : 0
    };
  });

  if (staffMenuPickerPopup) staffMenuPickerPopup.style.display = 'none';
  renderStaffEditItems();
  editOrderModal.style.display = 'flex';
};

if (cancelEditBtn) {
  cancelEditBtn.addEventListener('click', () => {
    editOrderModal.style.display = 'none';
  });
}

if (saveEditBtn) {
  saveEditBtn.addEventListener('click', () => {
    const index = parseInt(editOrderIndexInput.value, 10);
    const mejaBaru = editTableInput.value.trim();
    const metodeBaru = editPaymentSelect.value;

    if (!mejaBaru) {
      alert('Nomor meja tidak boleh kosong.');
      editTableInput.focus();
      return;
    }

    const n = Number(mejaBaru);
    if (n < 1 || n > 50 || !Number.isInteger(n)) {
      alert("Hanya menerima bilangan bulat 1-50 sebagai nomor meja.");
      editTableInput.focus();
      return;
    }

    const sudahDipakai = daftarPesanan.some((order, i) => i !== index && Number(order.meja) === n);
    if (sudahDipakai) {
      alert(`Meja No. ${n} sudah digunakan pesanan lain!`);
      editTableInput.focus();
      return;
    }

    if (currentEditItems.length === 0) {
      alert('Pesanan harus memiliki minimal satu menu.');
      return;
    }

    daftarPesanan[index] = {
      meja: String(n),
      items: currentEditItems.map(item => item.nama),
      total: editTotalPriceEl.textContent,
      metode: metodeBaru
    };

    editOrderModal.style.display = 'none';
    renderPesanan();
  });
}

// --- EVENT LISTENER PERAN & NAVIGASI ---
btnPelanggan.addEventListener('click', () => {
  staffNav.style.display = 'none';
  roleModal.style.display = 'none';
});

btnPegawai.addEventListener('click', () => {
  staffNav.style.display = 'flex';
  roleModal.style.display = 'none';
});

navGantiPeran.addEventListener('click', () => {
  menuSection.style.display = 'flex';
  orderBar.style.display = 'flex';
  if (pesananView) pesananView.style.display = 'none';
  roleModal.style.display = 'flex';
});

navMenuUtama.addEventListener('click', () => {
  navMenuUtama.classList.add('active');
  navPesanan.classList.remove('active');
  menuSection.style.display = 'flex';
  orderBar.style.display = 'flex';
  if (pesananView) pesananView.style.display = 'none';
});

navPesanan.addEventListener('click', () => {
  navPesanan.classList.add('active');
  navMenuUtama.classList.remove('active');
  menuSection.style.display = 'none';
  orderBar.style.display = 'none';
  if (pesananView) {
    pesananView.style.display = 'block';
    renderPesanan();
  }
});

// --- LOGIKA CHECKOUT & ORDER BAR ---
function updateOrder() {
  let total = 0;
  let count = 0;

  checkboxes.forEach(box => {
    if (box.checked) {
      total += parseInt(box.getAttribute('data-price'), 10);
      count++;
    }
  });

  itemCountEl.textContent = count;
  totalPriceEl.textContent = total + 'K';
}

orderBtn.addEventListener('click', () => {
  currentModalItems = [];

  checkboxes.forEach(box => {
    if (box.checked) {
      const name = box.getAttribute('data-name');
      const price = parseInt(box.getAttribute('data-price'), 10);
      currentModalItems.push({ nama: name, harga: price });
    }
  });

  if (currentModalItems.length === 0) {
    alert('Please select at least one item from the menu first.');
    return;
  }

  if (menuPickerPopup) menuPickerPopup.style.display = 'none';
  renderModalItems();
  modal.style.display = 'flex';
});

cancelModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

confirmOrderBtn.addEventListener('click', () => {
  const tableNumber = tableInput.value.trim();
  if (!tableNumber) {
    alert('Input nomor meja Anda dulu.');
    tableInput.focus();
    return;
  }

  const n = Number(tableNumber);
  if (n < 1 || n > 50 || !Number.isInteger(n)) {
    alert("Hanya menerima bilangan bulat 1-50 sebagai nomor meja.");
    tableInput.focus();
    return;
  }

  const sudahDipakai = daftarPesanan.some(order => Number(order.meja) === n);
  if (sudahDipakai) {
    alert(`Meja No. ${n} sudah terisi! Silakan pilih nomor meja lain.`);
    tableInput.focus();
    return;
  }

  if (currentModalItems.length === 0) {
    alert('Pesanan tidak boleh kosong.');
    return;
  }

  const itemTerpilih = currentModalItems.map(item => item.nama);

  daftarPesanan.push({
    meja: String(n),
    items: itemTerpilih,
    total: modalTotalPrice.textContent,
    metode: paymentSelect.value
  });
  orderBadge.textContent = daftarPesanan.length;

  alert(
    `Thank you ^^! Orderan Anda di Meja No. ${n} telah diterima.\n` +
    `Total: ${modalTotalPrice.textContent} (${paymentSelect.value})\n\n` +
    `!Jangan lupa untuk membayar pesanan Anda di Kasir dulu!`
  );

  modal.style.display = 'none';
  tableInput.value = '';
  checkboxes.forEach(box => (box.checked = false));
  updateOrder();
});

checkboxes.forEach(box => {
  box.addEventListener('change', updateOrder);
});