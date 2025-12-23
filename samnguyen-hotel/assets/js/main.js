let roomsData = [];

function getTodayPrice(room) {
  const day = new Date().getDay(); // 0 = CN, 6 = T7
  const isWeekend = day === 0 || day === 6;
  return isWeekend ? room.price.weekend : room.price.weekday;
}

/* ===============================
   LOAD DATA
================================ */

document.addEventListener("DOMContentLoaded", () => {
  fetch("data/rooms.json")
    .then((res) => res.json())
    .then((data) => {
      roomsData = data;
      renderRooms(data);
    })
    .catch((err) => console.error("Load rooms error:", err));
});

/* ===============================
   RENDER ROOM CARD
================================ */
function renderRooms(rooms) {
  const list = document.getElementById("roomList");
  list.innerHTML = "";

  rooms.forEach((room) => {
    const card = document.createElement("div");
    card.className = "room-card";
    card.dataset.id = room.id;

    card.innerHTML = `
      <div class="room-thumb" style="background-image:url('${
        room.image
      }')"></div>
      <div class="room-info">
        <div>
          <div class="room-name">${room.label}</div>
          <div class="room-sub">${room.name}</div>
        </div>
        <div class="room-price">${formatPrice(getTodayPrice(room))}</div>
      </div>
    `;

    card.onclick = () => openModal(room.id);
    list.appendChild(card);
  });
}

/* ===============================
   MODAL
================================ */
function openModal(id) {
  const room = roomsData.find((r) => r.id === id);
  if (!room) return;

  // set ảnh chính
  const mainImg = document.getElementById("roomImg");
  mainImg.src = room.image;

  // build gallery (dựa theo quy tắc tên ảnh)
  buildGallery(room.image);

  // info
  document.getElementById("modalLabel").textContent = room.label;
  document.getElementById("modalName").textContent = room.name;
  document.getElementById("modalSize").textContent = room.size;
  document.getElementById("modalView").textContent = room.view;
  document.getElementById("modalPrice").textContent =
    formatPrice(getTodayPrice(room)) + " / đêm";

  const featuresEl = document.getElementById("modalFeatures");
  featuresEl.innerHTML = "";
  room.features.forEach((f) => {
    const li = document.createElement("li");
    li.textContent = f;
    featuresEl.appendChild(li);
  });

  document.getElementById("roomModal").classList.add("show");
  document.body.style.overflow = "hidden";
}

function buildGallery(img) {
  const wrap = document.getElementById("roomGallery");
  const mainImg = document.getElementById("roomImg");
  wrap.innerHTML = "";

  // img ví dụ: assets/images/rooms/standard-1.jpg
  const prefix = img.replace(/-\d+\.jpg$/, "");

  let firstSet = false;

  for (let i = 1; i <= 30; i++) {
    const src = `${prefix}-${i}.jpg`;

    const thumb = document.createElement("img");
    thumb.src = src;

    thumb.onclick = () => {
      document
        .querySelectorAll(".room-thumbs img")
        .forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
      mainImg.src = src;
    };

    thumb.onerror = () => thumb.remove();

    if (!firstSet) {
      mainImg.src = src;
      thumb.classList.add("active");
      firstSet = true;
    }

    wrap.appendChild(thumb);
  }
}

/* ===============================
   CLOSE MODAL
================================ */
document.getElementById("modalClose").onclick = closeModal;
document.getElementById("roomModal").onclick = (e) => {
  if (e.target.id === "roomModal") closeModal();
};

function closeModal() {
  document.getElementById("roomModal").classList.remove("show");
  document.body.style.overflow = "";
}

/* ===============================
   UTILS
================================ */
function formatPrice(price) {
  return price.toLocaleString("vi-VN") + "₫";
}
