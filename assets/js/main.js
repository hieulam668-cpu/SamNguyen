let roomsData = [];

/* LOAD DATA */
document.addEventListener("DOMContentLoaded", () => {
  fetch("data/rooms.json")
    .then((res) => res.json())
    .then((data) => {
      roomsData = data;
      renderRooms(data);
    });
});

/* RENDER ROOM CARDS */
function renderRooms(rooms) {
  const list = document.getElementById("roomList");
  list.innerHTML = "";

  rooms.forEach((room) => {
    const card = document.createElement("div");
    card.className = "room-card";

    card.innerHTML = `
      <div class="room-thumb" style="background-image:url('${
        room.image
      }')"></div>
      <div class="room-info">
        <div>
          <div class="room-name">${room.label}</div>
          <div class="room-sub">${room.name}</div>
        </div>
        <div class="room-price">${formatPrice(room.price.weekday)}</div>
      </div>
    `;

    card.onclick = () => openModal(room.id);
    list.appendChild(card);
  });
}

/* MODAL */
function openModal(id) {
  const room = roomsData.find((r) => r.id === id);
  if (!room) return;

  document.getElementById("modalLabel").textContent = room.label;
  document.getElementById("modalName").textContent = room.name;
  document.getElementById("modalSize").textContent = room.size;
  document.getElementById("modalView").textContent = room.view;
  document.getElementById("modalPrice").textContent =
    formatPrice(room.price.weekday) + " / đêm";

  const features = document.getElementById("modalFeatures");
  features.innerHTML = "";
  room.features.forEach((f) => {
    const li = document.createElement("li");
    li.textContent = f;
    features.appendChild(li);
  });

  buildGallery(room.image);

  document.getElementById("roomModal").classList.add("show");
  document.body.style.overflow = "hidden";
}

/* GALLERY (THUMBNAILS) */
function buildGallery(img) {
  const wrap = document.getElementById("roomGallery");
  const mainImg = document.getElementById("roomImg");
  wrap.innerHTML = "";

  const prefix = img.replace(/-\d+\.jpg$/, "");
  let first = true;

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

    if (first) {
      mainImg.src = src;
      thumb.classList.add("active");
      first = false;
    }

    wrap.appendChild(thumb);
  }
}

/* CLOSE MODAL */
document.getElementById("modalClose").onclick = closeModal;
document.getElementById("roomModal").onclick = (e) => {
  if (e.target.id === "roomModal") closeModal();
};

function closeModal() {
  document.getElementById("roomModal").classList.remove("show");
  document.body.style.overflow = "";
}

/* UTILS */
function formatPrice(price) {
  return price.toLocaleString("vi-VN") + "₫";
}
