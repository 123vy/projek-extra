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

// Jalankan render menu saat halaman dimuat
renderMenuUtama();

const checkboxes = document.querySelectorAll('.food-checkbox');
const itemCountEl = document.getElementById('item-count');
const totalPriceEl = document.getElementById('total-price');
const orderBtn = document.getElementById('order-btn');

const modal = document.getElementById('checkout-modal');
const modalOrderList = document.getElementById('modal-order-list');
const modalTotalPrice = document.getElementById('modal-total-price');
const tableInput = document.getElementById('table-number');
const paymentSelect = document.getElementById('payment-method');
const paymentInstruction = document.getElementById('payment-instruction');
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
const editMenuList = document.getElementById('edit-menu-list');
const editMenuDropdown = document.getElementById('edit-menu-dropdown');
const editPaymentSelect = document.getElementById('edit-payment-method');
const editTotalPriceEl = document.getElementById('edit-total-price');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const saveEditBtn = document.getElementById('save-edit-btn');

let daftarPesanan = []; // Menyimpan riwayat pesanan sementara
let itemEditSementara = []; // Menampung array nama item yang sedang diedit

function fillDropdown() {
  editMenuDropdown.innerHTML = MASTER_MENU.map(item => 
    `<option value="${item.nama}">${item.nama} - ${item.harga}K (${item.kategori.toUpperCase()})</option>`
  ).join('');
}
fillDropdown();

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
      <div style="font-size: 0.9rem;">Item: ${order.items.join(', ')}</div>
      <div class="order-card-actions">
        <button type="button" class="btn-edit-order" onclick="bukaEditPesanan(${index})">Edit</button>
        <button type="button" class="btn-delete-order" onclick="hapusPesanan(${index})">Hapus</button>
      </div>
    </div>
  `).join('');
}

// ✅ TAMBAHAN BARU 1: Fungsi Hapus Pesanan
window.hapusPesanan = function(index) {
  const pesanan = daftarPesanan[index];
  if (confirm(`Yakin ingin menghapus pesanan untuk Meja No. ${pesanan.meja}?`)) {
    daftarPesanan.splice(index, 1);
    renderPesanan();
  }
};

// ✅ TAMBAHAN BARU 2: Fungsi Memanggil Modal Edit saat tombol "Edit" diklik
window.bukaEditPesanan = function(index) {
  const pesanan = daftarPesanan[index];
  editOrderIndexInput.value = index;
  editTableInput.value = pesanan.meja;
  editPaymentSelect.value = pesanan.metode;

  if (editMenuList) {
    editMenuList.innerHTML = '';
    checkboxes.forEach(box => {
      const name = box.closest('.menu-item').querySelector('.item-name').textContent.trim();
      const price = parseInt(box.getAttribute('data-price'), 10);
      const isChecked = pesanan.items.includes(name) ? 'checked' : '';

      const label = document.createElement('label');
      label.className = 'edit-menu-item';
      label.innerHTML = `
        <span>
          <input type="checkbox" class="edit-food-cb" data-name="${name}" data-price="${price}" ${isChecked}>
          ${name}
        </span>
        <span>${price}K</span>
      `;
      editMenuList.appendChild(label);
    });

    hitungTotalEdit();
    document.querySelectorAll('.edit-food-cb').forEach(cb => {
      cb.addEventListener('change', hitungTotalEdit);
    });
  } else {
    editTotalPriceEl.textContent = pesanan.total;
  }

  // Perintah utama memunculkan pop-up edit
  editOrderModal.style.display = 'flex';
};

// ✅ TAMBAHAN BARU 3: Hitung ulang total harga saat checkbox di modal edit diubah
function hitungTotalEdit() {
  let total = 0;
  document.querySelectorAll('.edit-food-cb:checked').forEach(cb => {
    total += parseInt(cb.getAttribute('data-price'), 10);
  });
  editTotalPriceEl.textContent = total + 'K';
}

// ✅ TAMBAHAN BARU 4: Tombol Batal & Simpan Perubahan di dalam Modal Edit
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

    let itemBaru = daftarPesanan[index].items;
    if (editMenuList) {
      itemBaru = [];
      document.querySelectorAll('.edit-food-cb:checked').forEach(cb => {
        itemBaru.push(cb.getAttribute('data-name'));
      });

      if (itemBaru.length === 0) {
        alert('Pilih minimal satu menu pesanan.');
        return;
      }
    }

    daftarPesanan[index] = {
      meja: mejaBaru,
      items: itemBaru,
      total: editTotalPriceEl.textContent,
      metode: metodeBaru
    };

    editOrderModal.style.display = 'none';
    renderPesanan();
  });
}

// 1. Jika klik Pelanggan -> Tutup dialog, sembunyikan tombol pegawai
btnPelanggan.addEventListener('click', () => {
  staffNav.style.display = 'none';
  roleModal.style.display = 'none';
});

// 2. Jika klik Pegawai -> Langsung masuk & tampilkan tombol pojok kiri atas
btnPegawai.addEventListener('click', () => {
  staffNav.style.display = 'flex';
  roleModal.style.display = 'none';
});

// Tombol untuk membuka kembali dialog peran
navGantiPeran.addEventListener('click', () => {
  // Kembalikan ke tampilan menu utama terlebih dahulu
  menuSection.style.display = 'flex';
  orderBar.style.display = 'flex';
  if (pesananView) pesananView.style.display = 'none';
  
  roleModal.style.display = 'flex';
});

// Navigasi Pegawai: Klik "Menu Utama"
navMenuUtama.addEventListener('click', () => {
  navMenuUtama.classList.add('active');
  navPesanan.classList.remove('active');
  menuSection.style.display = 'flex';
  orderBar.style.display = 'flex';
  if (pesananView) pesananView.style.display = 'none';
});

// Navigasi Pegawai: Klik "Pesanan"
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

function updateOrder() {
  let total = 0;
  let count = 0;

  checkboxes.forEach(box => {
    if (box.checked) {
      total += parseInt(box.getAttribute('data-price'));
      count++;
    }
  });

  itemCountEl.textContent = count;
  totalPriceEl.textContent = total + 'K';
}

orderBtn.addEventListener('click', () => {
  modalOrderList.innerHTML = '';
  let count = 0;

  checkboxes.forEach(box => {
    if (box.checked) {
      const menuItem = box.closest('.menu-item');
      const name = menuItem.querySelector('.item-name').textContent.trim();
      const price = menuItem.querySelector('.item-price').textContent.trim();
      
      const li = document.createElement('li');
      li.innerHTML = `<span>${name}</span><span>${price}</span>`;
      modalOrderList.appendChild(li);
      count++;
    }
  });

  if (count === 0) {
    alert('Please select at least one item from the menu first.');
    return;
  }

  modalTotalPrice.textContent = totalPriceEl.textContent;
  modal.style.display = 'flex';
});

// Update payment instructions ktk payment method ubh
paymentSelect.addEventListener('change', () => {
  const method = paymentSelect.value;
  if (method === 'Cashier') {
    paymentInstruction.textContent = 'Please proceed to the front cashier counter with your table number to complete payment.';
  } else if (method === 'QRIS') {
    paymentInstruction.textContent = 'Scan the QRIS code at your table or at the cashier counter, then show the receipt to our staff.';
  } else if (method === 'E-Wallet') {
    paymentInstruction.textContent = 'Transfer via GoPay / OVO / DANA at the cashier counter and mention your table number.';
  }
});

// Close modal on Cancel
cancelModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Confirm Order
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

    const itemTerpilih = [];
  checkboxes.forEach(box => {
    if (box.checked) {
      const name = box.closest('.menu-item').querySelector('.item-name').textContent.trim();
      itemTerpilih.push(name);
    }
  });

  daftarPesanan.push({
    meja: tableNumber,
    items: itemTerpilih,
    total: modalTotalPrice.textContent,
    metode: paymentSelect.value
  });
  orderBadge.textContent = daftarPesanan.length;


  alert(
    `Thank you ^^! Orderan Anda di Meja No. ${tableNumber} telah diterima.\n` +
    `Total: ${modalTotalPrice.textContent} (${paymentSelect.value})\n\n` +
    `!Jangan lupa untuk membayar pesanan Anda di Kasir dulu!`
  );

  // Reset form and close modal
  modal.style.display = 'none';
  tableInput.value = '';
  checkboxes.forEach(box => (box.checked = false));
  updateOrder();
});



checkboxes.forEach(box => {
  box.addEventListener('change', updateOrder);
});


