const tours = [
  {
    id: 1,
    name: "Tour Đà Lạt 3N2Đ",
    location: "Đà Lạt",
    price: 2990000,
    days: 3,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    description: "Khám phá Đà Lạt mộng mơ với lịch trình 3 ngày 2 đêm, tham quan Hồ Xuân Hương, Thung Lũng Tình Yêu, Langbiang và nhiều địa điểm nổi tiếng khác."
  },
  {
    id: 2,
    name: "Tour Phú Quốc 4N3Đ",
    location: "Phú Quốc",
    price: 4990000,
    days: 4,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    description: "Tận hưởng biển xanh cát trắng tại Phú Quốc với các hoạt động lặn biển, câu cá, tham quan Grand World và chợ đêm."
  },
  {
    id: 3,
    name: "Tour Đà Nẵng - Hội An",
    location: "Đà Nẵng",
    price: 3590000,
    days: 3,
    image: "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80",
    description: "Trải nghiệm Bà Nà Hills, Cầu Vàng, biển Mỹ Khê và phố cổ Hội An trong tour hấp dẫn này."
  },
  {
    id: 4,
    name: "Tour Nha Trang Biển Xanh",
    location: "Nha Trang",
    price: 3890000,
    days: 3,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    description: "Du lịch biển Nha Trang với các hoạt động vui chơi, nghỉ dưỡng, tham quan VinWonders và đảo Hòn Mun."
  }
];

let selectedTour = null;

function renderTours(filteredTours = tours) {
  const tourList = document.getElementById("tourList");
  tourList.innerHTML = "";

  filteredTours.forEach(tour => {
    const card = document.createElement("div");
    card.className = "tour-card";
    card.innerHTML = `
      <img src="${tour.image}" alt="${tour.name}">
      <div class="tour-content">
        <h3>${tour.name}</h3>
        <p>📍 ${tour.location}</p>
        <p>🗓️ ${tour.days} ngày</p>
        <p class="price">${tour.price.toLocaleString("vi-VN")} VNĐ</p>
        <button class="btn" onclick="showTourDetail(${tour.id})">Xem chi tiết</button>
      </div>
    `;
    tourList.appendChild(card);
  });
}

function showTourDetail(id) {
  selectedTour = tours.find(t => t.id === id);
  const detail = document.getElementById("tourDetail");
  const detailSection = document.getElementById("detailSection");
  const bookingSection = document.getElementById("bookingSection");

  detail.innerHTML = `
    <img src="${selectedTour.image}" alt="${selectedTour.name}" style="width:100%; max-height:350px; object-fit:cover; border-radius:14px; margin-bottom:20px;">
    <h3 style="font-size: 30px; margin-bottom: 10px;">${selectedTour.name}</h3>
    <p>📍 <strong>Địa điểm:</strong> ${selectedTour.location}</p>
    <p>🗓️ <strong>Thời gian:</strong> ${selectedTour.days} ngày</p>
<p>💰 <strong>Giá:</strong> ${selectedTour.price.toLocaleString("vi-VN")} VNĐ / người</p>
    <p style="margin-top:14px; line-height:1.7;">${selectedTour.description}</p>
  `;

  detailSection.classList.remove("hidden");
  bookingSection.classList.remove("hidden");
  updateTotalPrice();

  window.scrollTo({
    top: detailSection.offsetTop - 60,
    behavior: "smooth"
  });
}

function updateTotalPrice() {
  const people = Number(document.getElementById("peopleCount").value || 1);
  const totalPriceEl = document.getElementById("totalPrice");

  if (!selectedTour) {
    totalPriceEl.textContent = "0 VNĐ";
    return;
  }

  const total = selectedTour.price * people;
  totalPriceEl.textContent = total.toLocaleString("vi-VN") + " VNĐ";
}

document.getElementById("peopleCount").addEventListener("input", updateTotalPrice);

document.getElementById("bookingForm").addEventListener("submit", function(e) {
  e.preventDefault();

  if (!selectedTour) {
    alert("Vui lòng chọn tour trước.");
    return;
  }

  const name = document.getElementById("customerName").value;
  const email = document.getElementById("customerEmail").value;
  const phone = document.getElementById("customerPhone").value;
  const people = Number(document.getElementById("peopleCount").value);
  const total = selectedTour.price * people;

  const booking = {
    id: Date.now(),
    tourName: selectedTour.name,
    location: selectedTour.location,
    name,
    email,
    phone,
    people,
    total,
    status: "Đã đặt thành công",
    date: new Date().toLocaleString("vi-VN")
  };

  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));

  alert("🎉 Đặt tour thành công!");
  document.getElementById("bookingForm").reset();
  document.getElementById("totalPrice").textContent = "0 VNĐ";
  renderBookingHistory();

  document.getElementById("history").scrollIntoView({ behavior: "smooth" });
});

function renderBookingHistory() {
  const bookingHistory = document.getElementById("bookingHistory");
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  bookingHistory.innerHTML = "";

  if (bookings.length === 0) {
    bookingHistory.innerHTML = "<p style='text-align:center;'>Chưa có booking nào.</p>";
    return;
  }

  [...bookings].reverse().forEach(booking => {
    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `
      <h3>${booking.tourName}</h3>
      <p>📍 ${booking.location}</p>
      <p>👤 ${booking.name}</p>
      <p>📧 ${booking.email}</p>
      <p>📞 ${booking.phone}</p>
      <p>👥 ${booking.people} người</p>
      <p>💰 <strong>${booking.total.toLocaleString("vi-VN")} VNĐ</strong></p>
      <p>🕒 ${booking.date}</p>
      <p class="status-success">${booking.status}</p>
    `;
    bookingHistory.appendChild(item);
  });
}

function filterTours() {
const search = document.getElementById("searchInput").value.toLowerCase();
  const location = document.getElementById("locationFilter").value;

  const filtered = tours.filter(tour => {
    const matchSearch = tour.name.toLowerCase().includes(search);
    const matchLocation = location === "" || tour.location === location;
    return matchSearch && matchLocation;
  });

  renderTours(filtered);
}

document.getElementById("searchInput").addEventListener("input", filterTours);
document.getElementById("locationFilter").addEventListener("change", filterTours);

renderTours();
renderBookingHistory();
