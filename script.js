// Fecha objetivo: 16 de octubre de 2026, 00:00 en Lima, Perú (UTC-5).
const unlockAt = new Date("2026-10-16T00:00:00-05:00");

const lockScreen = document.getElementById("lock-screen");
const giftScreen = document.getElementById("gift-screen");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const openLetterBtn = document.getElementById("open-letter");
const letter = document.getElementById("letter");
const musicButton = document.getElementById("music-toggle");
const musicDisc = document.getElementById("music-disc");
const loveSong = document.getElementById("love-song");

let timerId = null;
let unlocked = false;
let heartsTimer = null;

// Para probar sin esperar: abre index.html?probar
const testMode = new URLSearchParams(window.location.search).has("probar");

const pad = (n) => String(n).padStart(2, "0");

/* ---------- Desbloqueo ---------- */
function unlockGift() {
  if (unlocked) return;
  unlocked = true;
  clearInterval(timerId);
  lockScreen.classList.add("hidden");
  giftScreen.classList.remove("hidden");
  startHearts();
}

function updateCountdown() {
  const difference = unlockAt.getTime() - Date.now();

  if (testMode || difference <= 0) {
    unlockGift();
    return;
  }

  const totalSeconds = Math.floor(difference / 1000);
  hoursEl.textContent = pad(Math.floor(totalSeconds / 3600));
  minutesEl.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
  secondsEl.textContent = pad(totalSeconds % 60);
}

/* ---------- Corazones flotantes ---------- */
function startHearts() {
  if (heartsTimer) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const holder = document.getElementById("hearts");
  const symbols = ["♡", "♥", "✧"];

  heartsTimer = setInterval(() => {
    if (document.hidden) return;
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.fontSize = `${12 + Math.random() * 18}px`;
    heart.style.animationDuration = `${7 + Math.random() * 6}s`;
    holder.appendChild(heart);
    setTimeout(() => heart.remove(), 14000);
  }, 650);
}

/* ---------- Carta ---------- */
openLetterBtn.addEventListener("click", () => {
  letter.classList.remove("hidden");
  openLetterBtn.classList.add("hidden");
  letter.scrollIntoView({ behavior: "smooth", block: "start" });
});

/* ---------- Música ---------- */
function setPlaying(isPlaying) {
  musicButton.textContent = isPlaying ? "⏸ Pausar" : "▶ Escuchar";
  musicButton.setAttribute("aria-pressed", String(isPlaying));
  musicDisc.classList.toggle("playing", isPlaying);
}

musicButton.addEventListener("click", async () => {
  try {
    if (loveSong.paused) {
      await loveSong.play();
      setPlaying(true);
    } else {
      loveSong.pause();
      setPlaying(false);
    }
  } catch (error) {
    musicButton.textContent = "No se pudo reproducir";
    console.error("Error al reproducir la canción:", error);
  }
});

loveSong.addEventListener("ended", () => setPlaying(false));
loveSong.addEventListener("pause", () => setPlaying(false));
loveSong.addEventListener("play", () => setPlaying(true));

/* ---------- Inicio ---------- */
updateCountdown();
if (!unlocked) {
  timerId = setInterval(updateCountdown, 1000);
  // Al volver a la pestaña, revisa de inmediato
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateCountdown();
  });
}
