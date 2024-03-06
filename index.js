const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");

const Pengeluaran = document.getElementById("Pengeluaran");
const Pemasukan = document.getElementById("Pemasukan");
const Saldo = document.getElementById("jumlahSaldo");

const userTemp = document.querySelector("[data-user-temp]");
const inputFilter = document.getElementById("inputFilter");
const inputSearchFilter = document.getElementById("inputSearchFilter");
const tableBody = document.querySelector('table tbody');

let jumlahPengeluaran = 0;
let jumlahPemasukan = 0;
let jumlahSaldo = 500000;


// munculin side bar
menuBtn.addEventListener('click', () => {
    sideMenu.style.display = "block";
})


// tutup side bar
closeBtn.addEventListener('click', () => {
    sideMenu.style.display = "none";
})

// ganti tema dark-light mode
themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-variables');

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
})

// filter jenis transaksi
inputFilter.onchange = function () {
    const value = this.value.toLowerCase();
    users.forEach(user => {
        const isVis = user.jenisTransaksi.toLowerCase().includes(value);
        user.element.style.display = isVis ? "" : "none"; // Use style.display to hide or show the row
                //document.getElementById("1").style.display = "none";
    });
}

// filter nama transaksi
inputSearchFilter.addEventListener('keyup', e => {
    const value = e.target.value.toLowerCase();
    users.forEach(user => {
        const isVis = user.namaTransaksi.toLowerCase().includes(value);
        user.element.style.display = isVis ? "" : "none"; // Use style.display to hide or show the row
    });
})

// Menambahkan separator titik pada jumlah uang
function numberWithDot(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


fetch("http://localhost:3000/user")
    .then(res => res.json())
    .then(data => {
       users = data.reverse().map(user => {
            const element = td_fun(user);
            jumlahPengeluaran += user.jenisTransaksi === 'Pengeluaran' ? parseInt(user.nominalTransaksi.replaceAll(".","")) : 0;
            jumlahPemasukan += user.jenisTransaksi === 'Pemasukan' ? parseInt(user.nominalTransaksi.replaceAll(".","")) : 0;
            return {namaTransaksi: user.namaTransaksi, jenisTransaksi: user.jenisTransaksi, element}; 
        });
        Pengeluaran.innerHTML = "Rp" +  numberWithDot(jumlahPengeluaran);
        Pemasukan.innerHTML = "Rp" + numberWithDot(jumlahPemasukan);
        Saldo.innerHTML = "Rp" + numberWithDot(jumlahSaldo);
    });


function td_fun({namaTransaksi, kuantitas, nominalTransaksi, jenisTransaksi}) {
    let tr = document.createElement('tr');
    tr.innerHTML = `<tr>
                        <td>${kuantitas}</td>
                        <td>${namaTransaksi}</td>
                        <td>Rp ${nominalTransaksi}</td>
                        <td class="${jenisTransaksi === 'Pengeluaran' ? 'danger' : jenisTransaksi === 'Pemasukan' ? 'income' : 'primary'}">
                        ${jenisTransaksi}
                        </td>
                        <td class="primary">Detail</td>
                    </tr>`;

    tableBody.appendChild(tr);
    return tr;
}

document.getElementById("inputTransaksi").addEventListener("click", function(){
    document.querySelector(".popup").style.display = "flex";
})

document.getElementById("closeTransaksi").addEventListener("click", function(){
    document.querySelector(".popup").style.display = "none";
})


// Masukkan transaksi
document.getElementById("unggahTransaksi").addEventListener("click", function(){
const newEntry = {
        "id": 1,
        "namaTransaksi": document.querySelector('#transaksi').value,
        "kuantitas": document.querySelector('#kuantitas').value,
        "nominalTransaksi": document.querySelector('#nominal').value,
        "jenisTransaksi": document.querySelector('#jenis').value
    };
    td_fun(newEntry);

    fetch('http://localhost:3000/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    // Mengosongkan input box
    document.querySelector('#transaksi').value = "";
    document.querySelector('#kuantitas').value = "";
    document.querySelector('#jumlah').value = "";
    document.querySelector('#jenis').value = "";

})

