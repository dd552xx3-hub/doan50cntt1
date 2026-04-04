const tours = [
  { id: 1, name: "Tour Đà Lạt 3N2Đ", location: "Đà Lạt", price: 2990000, days: 3, image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80", description: "Khám phá Đà Lạt mộng mơ." },
  { id: 2, name: "Tour Phú Quốc 4N3Đ", location: "Phú Quốc", price: 4990000, days: 4, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", description: "Tận hưởng biển xanh cát trắng." },
  { id: 3, name: "Tour Đà Nẵng - Hội An", location: "Đà Nẵng", price: 3590000, days: 3, image: "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80", description: "Trải nghiệm Bà Nà Hills, Cầu Vàng." },
  { id: 4, name: "Tour Nha Trang Biển Xanh", location: "Nha Trang", price: 3890000, days: 3, image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80", description: "Du lịch biển Nha Trang." }
];

let currentUser = null;

auth.onAuthStateChanged((user) => {
  currentUser = user;
  const loginBtn = document.getElementById("loginNavBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const adminBtn = document.getElementById("adminNavBtn");
  const historyNav = document.getElementById("navHistory");

  if (user) {
    if(loginBtn) loginBtn.classList.add("hidden");
    if(logoutBtn) logoutBtn.classList.remove("hidden");
    if(historyNav) historyNav.classList.remove("hidden");
    if (user.email === "admin@50cntt1.com" && adminBtn) adminBtn.classList.remove("hidden");
  } else {
    if(loginBtn) loginBtn.classList.remove("hidden");
    if(logoutBtn) logoutBtn.classList.add("hidden");
    if(adminBtn) adminBtn.classList.add("hidden");
    if(historyNav) historyNav.classList.add("hidden");
  }

  const path = window.location.pathname;
  if(path.includes("history.html")) loadHistory();
  if(path.includes("admin.html")) checkAdmin(user);
});

if(document.getElementById("logoutBtn")) {
  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => { alert("Đã đăng xuất!"); window.location.href="index.html"; });
  };
}

function renderTours(dataToRender) {
  const box = document.getElementById("tourList");
  if(!box) return;
  box.innerHTML = "";
  dataToRender.forEach(t => {
    box.innerHTML += `
      <div class="tour-card">
        <img src="${t.image}" alt="${t.name}">
        <div class="tour-content">
          <h3>${t.name}</h3>
          <p>📍 ${t.location} | 🗓️ ${t.days} ngày</p>
          <p class="price">${t.price.toLocaleString()} VNĐ</p>
          <a href="detail.html?id=${t.id}" class="btn">Xem chi tiết & Đặt</a>
        </div>
      </div>`;
  });
}

if(document.getElementById("tourList")) {
  renderTours(tours);
  const searchInp = document.getElementById("searchInput");
  if(searchInp) {
    searchInp.oninput = () => {
      const q = searchInp.value.toLowerCase();
      renderTours(tours.filter(t => t.name.toLowerCase().includes(q)));
    };
  }
}

const urlParams = new URLSearchParams(window.location.search);
const detailId = urlParams.get('id');
let currentDiscount = 0;
let selectedTour = null;

if (detailId && document.getElementById("tourDetailBox")) {
  selectedTour = tours.find(t => t.id == detailId);
  if(selectedTour) {
    document.getElementById("tourDetailBox").innerHTML = `
      <img src="${selectedTour.image}" style="width:100%; border-radius:14px; height: 350px; object-fit: cover;">
      <h2 style="margin:20px 0;">${selectedTour.name}</h2>
      <p>📍 ${selectedTour.location} | 🗓️ ${selectedTour.days} ngày | 💰 Giá: <strong style="color:red">${selectedTour.price.toLocaleString()} VNĐ</strong></p>
      <p style="margin-top:10px">${selectedTour.description}</p>
    `;
    updatePrice();
  }
}

function updatePrice() {
  if(!selectedTour) return;
  const p = Number(document.getElementById("peopleCount").value || 1);
  const total = (selectedTour.price * p) * (1 - currentDiscount);
  document.getElementById("totalPrice").innerText = total.toLocaleString() + " VNĐ";
}
if(document.getElementById("peopleCount")) document.getElementById("peopleCount").oninput = updatePrice;

if(document.getElementById("applyPromoBtn")) {
  document.getElementById("applyPromoBtn").onclick = () => {
    if(document.getElementById("promoCode").value.toUpperCase() === "SUMMER2026") {
      currentDiscount = 0.15; updatePrice(); alert("Giảm 15% thành công!");
    } else alert("Mã sai!");
  };
}

if(document.getElementById("bookingForm")) {
  document.getElementById("bookingForm").onsubmit = (e) => {
    e.preventDefault();
    if(!currentUser) { alert("Đại ca vui lòng đăng nhập trước!"); window.location.href="auth.html"; return; }
    
    const p = Number(document.getElementById("peopleCount").value);
    const total = (selectedTour.price * p) * (1 - currentDiscount);

    db.collection("bookings").add({
      uid: currentUser.uid, email: currentUser.email,
      name: document.getElementById("customerName").value, phone: document.getElementById("customerPhone").value,
      tourName: selectedTour.name, people: p, total: total,
      status: "Chờ duyệt", date: new Date().toLocaleString("vi-VN"), isRated: false
    }).then(() => {
      alert("🎉 Đặt tour thành công! Vui lòng chờ Admin duyệt.");
      window.location.href = "history.html";
    });
  };
}

function loadHistory() {
  if(!currentUser) return;
  db.collection("bookings").where("uid", "==", currentUser.uid).onSnapshot(snap => {
    const box = document.getElementById("bookingHistoryList");
    box.innerHTML = snap.empty ? "<p>Chưa có đơn nào.</p>" : "";
    snap.forEach(doc => {
      const b = doc.data();
      const ratingHtml = b.isRated ? `<span style="color:#f59e0b">⭐ Đã đánh giá</span>` : `<button class="btn" onclick="openRating('${doc.id}')" style="padding:5px; margin-top:10px;">Đánh giá</button>`;
      box.innerHTML += `<div class="history-item">
        <h3>${b.tourName}</h3>
        <p>Tổng: <strong style="color:red">${b.total.toLocaleString()} đ</strong> - Trạng thái: <strong style="color:green">${b.status}</strong></p>
        <p>Ngày đặt: ${b.date}</p>
        ${ratingHtml}
      </div>`;
    });
  });
}

function checkAdmin(user) {
  if(!user || user.email !== "admin@50cntt1.com") { alert("Cấm vào!"); window.location.href="index.html"; return; }
  
  db.collection("bookings").onSnapshot(snap => {
    const tb = document.getElementById("adminBookingTable"); tb.innerHTML = "";
    snap.forEach(doc => {
      const b = doc.data();
      tb.innerHTML += `<tr>
        <td>${b.name}<br>${b.phone}</td><td>${b.tourName}</td><td style="color:red;font-weight:bold">${b.total.toLocaleString()}</td>
        <td>
          <select onchange="db.collection('bookings').doc('${doc.id}').update({status: this.value})">
            <option value="Chờ duyệt" ${b.status==='Chờ duyệt'?'selected':''}>Chờ duyệt</option>
            <option value="Đã duyệt" ${b.status==='Đã duyệt'?'selected':''}>Đã duyệt</option>
          </select>
        </td>
        <td><button onclick="if(confirm('Xóa?')) db.collection('bookings').doc('${doc.id}').delete()" style="color:red">Xóa</button></td>
      </tr>`;
    });
  });

  db.collection("customers").onSnapshot(snap => {
    const ls = document.getElementById("customerList"); 
    if(ls) {
      ls.innerHTML = "";
      snap.forEach(doc => {
        ls.innerHTML += `<li class="history-item">📧 ${doc.data().email} - 📅 Gia nhập: ${doc.data().joinDate}</li>`;
      });
    }
  });
}

if(document.getElementById("openChatBtn")) {
    document.getElementById("openChatBtn").onclick = () => document.getElementById("chatbot").classList.remove("hidden");
    document.getElementById("closeChat").onclick = () => document.getElementById("chatbot").classList.add("hidden");
    document.getElementById("sendChat").onclick = () => {
      const inp = document.getElementById("chatInput");
      if(!inp.value) return;
      document.getElementById("chatMessages").innerHTML += `<div class="user-msg">${inp.value}</div>`;
      setTimeout(() => {
        document.getElementById("chatMessages").innerHTML += `<div class="bot-msg">Dạ hệ thống ghi nhận. Liên hệ 0123456789 để hỗ trợ ạ!</div>`;
        document.getElementById("chatMessages").scrollTop = 9999;
      }, 1000);
      inp.value = "";
    };
}
