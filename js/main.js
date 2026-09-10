/**
 * Main Interactive Logic for Wedding Invitation
 * Minh Trí & Cẩm Hương - 29.09.2026
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. GENERATE AMBIENT FLOATING HEARTS
  initAmbientHearts();

  // 2. ENVELOPE OPENING INTERACTION
  initEnvelopeOpener();

  // 3. BACKGROUND MUSIC LOGIC
  initAudioPlayer();

  // 4. PHOTO GALLERY & LIGHTBOX
  initGalleryAndLightbox();

  // 5. COUNTDOWN TIMER
  initCountdownTimer();

  // 6. COPY ACCOUNT NUMBER
  initCopyAccountNumber();

  // 7. RSVP MODAL
  initRsvpModal();

  // 8. SUNBEAM TYNDALL DUST MOTES (CANVAS)
  initSunbeamDust();
});

/**
 * Tạo hiệu ứng mưa trái tim bay lơ lửng cho bì thư
 */
function initAmbientHearts() {
  const container = document.querySelector(".ambient-hearts-container");
  if (!container) return;

  const heartColors = ["#c9a24a", "#a8323b", "#7a1f26", "#ece4d8", "#c9a24a", "#8c2029"];
  const heartSvgPath = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

  for (let i = 0; i < 22; i++) {
    const heart = document.createElement("div");
    heart.className = "falling-heart";

    const left = Math.random() * 96 + 2; // 2% to 98%
    const size = Math.floor(Math.random() * 14) + 11; // 11px to 25px
    const duration = (Math.random() * 8 + 18).toFixed(1); // 18s to 26s
    const delay = -(Math.random() * 20).toFixed(1); // -0s to -20s
    const sway = (Math.random() * 50 - 25).toFixed(1); // -25px to 25px
    const color = heartColors[Math.floor(Math.random() * heartColors.length)];

    heart.style.left = `${left}%`;
    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    heart.style.color = color;
    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.setProperty("--sway", `${sway}px`);

    heart.innerHTML = `<svg viewBox="0 0 24 24"><path d="${heartSvgPath}"></path></svg>`;
    container.appendChild(heart);
  }
}

/**
 * Xử lý mở thiệp mời
 */
function initEnvelopeOpener() {
  const envelope = document.getElementById("envelope-landing");
  const openBtn = document.getElementById("btn-open-envelope");
  const waxSeal = document.getElementById("wax-seal-btn");
  const audio = document.getElementById("bg-audio");
  const floatingAudio = document.getElementById("floating-audio");

  const openCard = () => {
    if (envelope.classList.contains("opened")) return;
    envelope.classList.add("opened");

    // Bật nhạc nền
    if (audio) {
      audio.play().then(() => {
        if (floatingAudio) floatingAudio.classList.add("playing");
      }).catch(() => {
        console.log("Audio autoplay prevented by browser policy");
      });
    }

    // Scroll nhẹ lên đầu thiệp
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (openBtn) openBtn.addEventListener("click", openCard);
  if (waxSeal) waxSeal.addEventListener("click", openCard);

  // Hỗ trợ tham số URL ?open=1
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("open") === "1") {
    setTimeout(openCard, 300);
  }
}

/**
 * Trình phát nhạc nền với nút tròn nổi
 */
function initAudioPlayer() {
  const audio = document.getElementById("bg-audio");
  const floatingAudio = document.getElementById("floating-audio");
  if (!audio || !floatingAudio) return;

  floatingAudio.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => {
        floatingAudio.classList.add("playing");
      }).catch(e => console.error(e));
    } else {
      audio.pause();
      floatingAudio.classList.remove("playing");
    }
  });

  audio.addEventListener("play", () => floatingAudio.classList.add("playing"));
  audio.addEventListener("pause", () => floatingAudio.classList.remove("playing"));
}

/**
 * Khởi tạo lưới Album ảnh và trình xem phóng to (Lightbox)
 */
let currentLightboxIndex = 0;

function initGalleryAndLightbox() {
  const galleryGrid = document.getElementById("gallery-grid");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const lightboxCounter = document.getElementById("lightbox-counter");

  if (!galleryGrid || !lightbox || !WEDDING_DATA.gallery) return;

  // Render danh sách ảnh
  galleryGrid.innerHTML = "";
  WEDDING_DATA.gallery.forEach((item, index) => {
    const el = document.createElement("div");
    el.className = "gallery-item";
    el.innerHTML = `
      <img src="${item.thumb}" alt="Ảnh cưới ${item.id}" loading="lazy" />
    `;
    el.addEventListener("click", () => openLightbox(index));
    galleryGrid.appendChild(el);
  });

  const showImage = (index) => {
    if (index < 0) index = WEDDING_DATA.gallery.length - 1;
    if (index >= WEDDING_DATA.gallery.length) index = 0;
    currentLightboxIndex = index;
    const item = WEDDING_DATA.gallery[index];
    lightboxImg.src = item.src;
    lightboxCounter.textContent = `${index + 1} / ${WEDDING_DATA.gallery.length}`;
  };

  const openLightbox = (index) => {
    showImage(index);
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", (e) => { e.stopPropagation(); showImage(currentLightboxIndex - 1); });
  if (lightboxNext) lightboxNext.addEventListener("click", (e) => { e.stopPropagation(); showImage(currentLightboxIndex + 1); });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox-content")) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showImage(currentLightboxIndex - 1);
    if (e.key === "ArrowRight") showImage(currentLightboxIndex + 1);
  });

  // Touch swipe support on mobile
  let touchStartX = 0;
  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener("touchend", (e) => {
    const diffX = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diffX) > 45) {
      if (diffX > 0) showImage(currentLightboxIndex - 1);
      else showImage(currentLightboxIndex + 1);
    }
  }, { passive: true });
}

/**
 * Đồng hồ đếm ngược
 */
function initCountdownTimer() {
  const daysEl = document.getElementById("countdown-days");
  const hoursEl = document.getElementById("countdown-hours");
  const minsEl = document.getElementById("countdown-mins");
  const secsEl = document.getElementById("countdown-secs");

  if (!daysEl) return;

  const targetDate = new Date(WEDDING_DATA.reception.isoDateTime).getTime();

  const update = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minsEl.textContent = String(mins).padStart(2, "0");
    secsEl.textContent = String(secs).padStart(2, "0");
  };

  update();
  setInterval(update, 1000);
}

/**
 * Sao chép STK ngân hàng
 */
function initCopyAccountNumber() {
  const btn = document.getElementById("btn-copy-stk");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const stk = WEDDING_DATA.bank.accountNumber;
    navigator.clipboard.writeText(stk).then(() => {
      showToast("Đã sao chép số tài khoản!");
    }).catch(() => {
      // Fallback
      const input = document.createElement("input");
      input.value = stk;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      showToast("Đã sao chép số tài khoản!");
    });
  });
}

/**
 * Hiển thị Toast thông báo
 */
function showToast(text) {
  let toast = document.querySelector(".toast-msg");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast-msg";
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

/**
 * Modal Xác Nhận Tham Dự (RSVP)
 */
function initRsvpModal() {
  const openBtn = document.getElementById("btn-open-rsvp");
  const modal = document.getElementById("rsvp-modal");
  const closeBtn = document.getElementById("rsvp-modal-close");
  const form = document.getElementById("rsvp-form");

  if (!modal) return;

  const openModal = () => {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (openBtn) openBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const guestName = document.getElementById("rsvp-name").value;
      const count = document.getElementById("rsvp-count").value;
      const wish = document.getElementById("rsvp-wish").value;

      const responses = JSON.parse(localStorage.getItem("wedding_rsvp") || "[]");
      responses.push({
        name: guestName,
        count: count,
        wish: wish,
        date: new Date().toISOString()
      });
      localStorage.setItem("wedding_rsvp", JSON.stringify(responses));

      closeModal();
      form.reset();
      showToast("Cảm ơn bạn đã gửi phản hồi tham dự!");
    });
  }
}

/**
 * Chùm bụi nắng vàng & hạt sao li ti (Tyndall Sunbeam Dust Motes)
 * Dựa trên hiệu ứng hạt vi mô lơ lửng trong luồng sáng tự nhiên
 */
function initSunbeamDust() {
  const canvas = document.getElementById("sunbeam-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || canvas.offsetWidth || (canvas.parentElement ? canvas.parentElement.offsetWidth : 390);
    const h = rect.height || canvas.offsetHeight || (canvas.parentElement ? canvas.parentElement.offsetHeight : 600);
    width = canvas.width = Math.round(w * dpr);
    height = canvas.height = Math.round(h * dpr);
  }

  resize();
  window.addEventListener("resize", resize);
  if (window.ResizeObserver && canvas.parentElement) {
    new ResizeObserver(resize).observe(canvas.parentElement);
  }

  const MOTES_COUNT = 160;
  const motes = [];

  function createMote(initial = false) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Trục giữa luồng sáng: chạy từ góc trên phải (x ~ 88%, y ~ 0%) xuống góc dưới trái (x ~ 23%, y ~ 100%)
    const t = initial ? Math.random() : -0.05;
    const centerX = (0.88 - t * 0.65) * width;
    const centerY = t * height;
    // Độ rộng luồng sáng: phía trên hẹp hơn (65px), phía dưới mở rộng dần (160px)
    const beamWidth = (65 + t * 95) * dpr;
    const offset = (Math.random() - 0.5) * beamWidth;

    // Vector vuông góc với tia 226deg
    const perpX = offset * 0.707;
    const perpY = offset * 0.707;

    return {
      x: centerX + perpX,
      y: centerY + perpY,
      // 85% là hạt tinh thể siêu li ti (0.6px - 1.5px), 15% là hạt bokeh mềm (1.8px - 2.8px)
      radius: (Math.random() < 0.85 ? 0.6 + Math.random() * 0.9 : 1.8 + Math.random() * 1.0) * dpr,
      // Vận tốc trôi nhẹ nhàng theo luồng sáng chéo
      vx: -(0.25 + Math.random() * 0.35) * dpr,
      vy: (0.35 + Math.random() * 0.50) * dpr,
      // Dao động tự nhiên (Brownian motion)
      wobbleAngle: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.015 + Math.random() * 0.03,
      wobbleAmp: (0.2 + Math.random() * 0.4) * dpr,
      // Nhấp nháy óng ánh
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.02 + Math.random() * 0.05,
      baseAlpha: 0.35 + Math.random() * 0.60,
      isGolden: Math.random() < 0.65
    };
  }

  for (let i = 0; i < MOTES_COUNT; i++) {
    motes.push(createMote(true));
  }

  function draw() {
    if (width === 0 || height === 0) {
      resize();
    }
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter"; // Hạt sáng cộng hưởng óng ánh

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    for (let i = 0; i < motes.length; i++) {
      const m = motes[i];

      // Di chuyển với chuyển động Brown
      m.wobbleAngle += m.wobbleSpeed;
      m.x += m.vx + Math.cos(m.wobbleAngle) * m.wobbleAmp;
      m.y += m.vy + Math.sin(m.wobbleAngle) * (m.wobbleAmp * 0.5);

      // Tái sinh khi trôi ra ngoài biên
      if (m.y > height + 20 || m.x < -30) {
        Object.assign(m, createMote(false));
      }

      // Độ sáng lấp lánh óng ánh
      m.twinklePhase += m.twinkleSpeed;
      const alpha = m.baseAlpha * (0.55 + 0.45 * Math.sin(m.twinklePhase));

      if (m.radius > 1.6 * dpr) {
        // Hạt có quầng sáng mềm mại (hạt cát bắt sáng)
        const glow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.radius * 2);
        glow.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        glow.addColorStop(
          0.5,
          m.isGolden ? `rgba(255, 225, 120, ${alpha * 0.75})` : `rgba(255, 245, 225, ${alpha * 0.75})`
        );
        glow.addColorStop(1, "rgba(245, 185, 70, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius * 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Tiểu tinh thể siêu nhỏ sắc nét
        ctx.fillStyle = m.isGolden ? `rgba(255, 230, 140, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

