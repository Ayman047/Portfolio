// ===== Boot screen: remove from the DOM once its fade-out finishes =====
const bootScreen = document.getElementById("boot-screen");
if (bootScreen) {
  bootScreen.classList.add("boot-hide");
  setTimeout(() => bootScreen.remove(), 3300);
}

// ===== Taskbar clock =====
function updateClock() {
  const clockEl = document.getElementById("clock");
  if (!clockEl) return;
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  clockEl.textContent = `${hours}:${minutes} ${ampm}`;
}
updateClock();
setInterval(updateClock, 1000 * 15);

// ===== Start menu toggle =====
const startBtn = document.getElementById("start-btn");
const startMenu = document.getElementById("start-menu");

function closeStartMenu() {
  startMenu.classList.remove("open");
  startBtn.setAttribute("aria-expanded", "false");
}

if (startBtn && startMenu) {
  startBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = startMenu.classList.toggle("open");
    startBtn.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (e) => {
    if (!startMenu.contains(e.target) && e.target !== startBtn) {
      closeStartMenu();
    }
  });

  startMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeStartMenu);
  });
}

// ===== Taskbar app buttons: scroll to section + reflect active window =====
const taskButtons = document.querySelectorAll(".task-btn");
const windows = document.querySelectorAll(".win-window");

taskButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.target);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function setActiveWindow(id) {
  windows.forEach((w) => w.classList.toggle("win-active", w.id === id));
  taskButtons.forEach((b) =>
    b.classList.toggle("active", b.dataset.target === id)
  );
}

// Bring a window "to front" (visually, via active titlebar) on click
windows.forEach((w) => {
  w.addEventListener("mousedown", () => setActiveWindow(w.id));
});

// Sync taskbar + active window with whichever section is in view
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveWindow(entry.target.id);
        }
      });
    },
    { threshold: 0.4 }
  );
  windows.forEach((w) => observer.observe(w));
} else {
  setActiveWindow("profile");
}
