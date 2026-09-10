/**
 * Main Interactive Logic for Wedding Invitation
 * Minh Trí & Cẩm Hương - 29.09.2026
 */

document.addEventListener('DOMContentLoaded', () => {
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

    // 9. CELEBRATION CONFETTI CANNON (CANVAS)
    initConfettiCannon();
});

/**
 * Tạo hiệu ứng mưa trái tim bay lơ lửng cho bì thư
 */
function initAmbientHearts() {
    const container = document.querySelector('.ambient-hearts-container');
    if (!container) return;

    const heartColors = ['#c9a24a', '#a8323b', '#7a1f26', '#ece4d8', '#c9a24a', '#8c2029'];
    const heartSvgPath =
        'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

    for (let i = 0; i < 22; i++) {
        const heart = document.createElement('div');
        heart.className = 'falling-heart';

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
        heart.style.setProperty('--sway', `${sway}px`);

        heart.innerHTML = `<svg viewBox="0 0 24 24"><path d="${heartSvgPath}"></path></svg>`;
        container.appendChild(heart);
    }
}

/**
 * Xử lý mở thiệp mời
 */
function initEnvelopeOpener() {
    const envelope = document.getElementById('envelope-landing');
    const openBtn = document.getElementById('btn-open-envelope');
    const waxSeal = document.getElementById('wax-seal-btn');
    const audio = document.getElementById('bg-audio');
    const floatingAudio = document.getElementById('floating-audio');

    const openCard = () => {
        if (envelope.classList.contains('opened')) return;
        envelope.classList.add('opened');

        // Bật nhạc nền
        if (audio) {
            audio
                .play()
                .then(() => {
                    if (floatingAudio) floatingAudio.classList.add('playing');
                })
                .catch(() => {
                    console.log('Audio autoplay prevented by browser policy');
                });
        }

        // Scroll nhẹ lên đầu thiệp
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (openBtn) openBtn.addEventListener('click', openCard);
    if (waxSeal) waxSeal.addEventListener('click', openCard);

    // Hỗ trợ tham số URL ?open=1
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('open') === '1') {
        setTimeout(openCard, 300);
    }
}

/**
 * Trình phát nhạc nền với nút tròn nổi
 */
function initAudioPlayer() {
    const audio = document.getElementById('bg-audio');
    const floatingAudio = document.getElementById('floating-audio');
    if (!audio || !floatingAudio) return;

    floatingAudio.addEventListener('click', () => {
        if (audio.paused) {
            audio
                .play()
                .then(() => {
                    floatingAudio.classList.add('playing');
                })
                .catch((e) => console.error(e));
        } else {
            audio.pause();
            floatingAudio.classList.remove('playing');
        }
    });

    audio.addEventListener('play', () => floatingAudio.classList.add('playing'));
    audio.addEventListener('pause', () => floatingAudio.classList.remove('playing'));
}

/**
 * Khởi tạo Album ảnh 3D Coverflow và trình xem phóng to (Lightbox)
 */
let currentLightboxIndex = 0;

function initGalleryAndLightbox() {
    const stage = document.getElementById('coverflow-stage');
    const container = document.getElementById('coverflow-container');
    const prevBtn = document.getElementById('coverflow-prev');
    const nextBtn = document.getElementById('coverflow-next');
    const currentCounter = document.getElementById('coverflow-current');
    const totalCounter = document.getElementById('coverflow-total');

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxCounter = document.getElementById('lightbox-counter');

    if (!stage || !WEDDING_DATA.gallery) return;

    const gallery = WEDDING_DATA.gallery;
    const total = gallery.length;
    let currentIndex = 0;
    const cards = [];

    if (totalCounter) totalCounter.textContent = total;

    // Render danh sách thẻ 3D Coverflow
    stage.innerHTML = '';
    gallery.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'coverflow-card';
        card.dataset.index = index;
        card.innerHTML = `<img src="${item.thumb}" alt="Ảnh cưới ${item.id}" loading="${index < 5 ? 'eager' : 'lazy'}" />`;

        card.addEventListener('click', () => {
            if (index === currentIndex) {
                openLightbox(index);
            } else {
                goToIndex(index);
            }
        });

        stage.appendChild(card);
        cards.push(card);
    });

    // Hàm cập nhật trạng thái 3D cho từng thẻ ảnh
    const updateCoverflow = () => {
        const isMobile = window.innerWidth < 640;
        const spacing = isMobile ? 150 : 205;
        const zStep = isMobile ? 105 : 125;
        const rotY = isMobile ? 36 : 38;

        cards.forEach((card, i) => {
            let diff = (i - currentIndex) % total;
            if (diff > Math.floor(total / 2)) diff -= total;
            if (diff < -Math.floor(total / 2)) diff += total;

            card.classList.toggle('active', diff === 0);

            if (diff === 0) {
                card.style.transform = 'translateX(0px) translateZ(0px) rotateY(0deg) scale(1)';
                card.style.zIndex = '20';
                card.style.opacity = '1';
                card.style.visibility = 'visible';
                card.style.filter = 'brightness(1)';
                card.style.pointerEvents = 'auto';
            } else if (diff === 1) {
                card.style.transform = `translateX(${spacing}px) translateZ(-${zStep}px) rotateY(-${rotY}deg) scale(0.85)`;
                card.style.zIndex = '15';
                card.style.opacity = '0.8';
                card.style.visibility = 'visible';
                card.style.filter = 'brightness(0.72)';
                card.style.pointerEvents = 'auto';
            } else if (diff === -1) {
                card.style.transform = `translateX(-${spacing}px) translateZ(-${zStep}px) rotateY(${rotY}deg) scale(0.85)`;
                card.style.zIndex = '15';
                card.style.opacity = '0.8';
                card.style.visibility = 'visible';
                card.style.filter = 'brightness(0.72)';
                card.style.pointerEvents = 'auto';
            } else if (diff === 2) {
                card.style.transform = `translateX(${spacing * 1.72}px) translateZ(-${zStep * 1.9}px) rotateY(-${rotY * 1.25}deg) scale(0.72)`;
                card.style.zIndex = '10';
                card.style.opacity = '0.42';
                card.style.visibility = 'visible';
                card.style.filter = 'brightness(0.52)';
                card.style.pointerEvents = 'auto';
            } else if (diff === -2) {
                card.style.transform = `translateX(-${spacing * 1.72}px) translateZ(-${zStep * 1.9}px) rotateY(${rotY * 1.25}deg) scale(0.72)`;
                card.style.zIndex = '10';
                card.style.opacity = '0.42';
                card.style.visibility = 'visible';
                card.style.filter = 'brightness(0.52)';
                card.style.pointerEvents = 'auto';
            } else {
                card.style.transform = `translateX(${Math.sign(diff) * spacing * 2.2}px) translateZ(-340px) rotateY(${-Math.sign(diff) * rotY * 1.4}deg) scale(0.5)`;
                card.style.zIndex = '1';
                card.style.opacity = '0';
                card.style.visibility = 'hidden';
                card.style.pointerEvents = 'none';
            }
        });

        if (currentCounter) currentCounter.textContent = currentIndex + 1;
    };

    const goToIndex = (newIndex) => {
        currentIndex = (newIndex + total) % total;
        updateCoverflow();
    };

    // Điều hướng bằng nút
    if (prevBtn)
        prevBtn.addEventListener('click', () => {
            goToIndex(currentIndex - 1);
            startAutoplay();
        });
    if (nextBtn)
        nextBtn.addEventListener('click', () => {
            goToIndex(currentIndex + 1);
            startAutoplay();
        });

    // Thao tác vuốt cảm ứng trên Mobile (Touch Swipe)
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchMove = false;

    if (container) {
        container.addEventListener(
            'touchstart',
            (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                isTouchMove = false;
            },
            { passive: true },
        );

        container.addEventListener(
            'touchmove',
            (e) => {
                const diffX = e.touches[0].clientX - touchStartX;
                const diffY = e.touches[0].clientY - touchStartY;
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
                    isTouchMove = true;
                }
            },
            { passive: true },
        );

        container.addEventListener(
            'touchend',
            (e) => {
                if (!isTouchMove) return;
                const diffX = e.changedTouches[0].clientX - touchStartX;
                if (diffX < -35) {
                    goToIndex(currentIndex + 1);
                } else if (diffX > 35) {
                    goToIndex(currentIndex - 1);
                }
            },
            { passive: true },
        );

        // Thao tác kéo chuột trên PC (Mouse Drag)
        let isMouseDown = false;
        let mouseStartX = 0;

        container.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            mouseStartX = e.clientX;
        });

        window.addEventListener('mouseup', (e) => {
            if (!isMouseDown) return;
            isMouseDown = false;
            const diffX = e.clientX - mouseStartX;
            if (diffX < -40) {
                goToIndex(currentIndex + 1);
            } else if (diffX > 40) {
                goToIndex(currentIndex - 1);
            }
        });
    }

    // Tự động xoay chuyển êm ái mỗi 2.5 giây (chạy nhanh, sinh động hơn)
    let autoplayTimer = null;
    let resumeTimeout = null;

    const startAutoplay = () => {
        stopAutoplay();
        autoplayTimer = setInterval(() => {
            goToIndex(currentIndex + 1);
        }, 2000);
    };

    const stopAutoplay = () => {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
        if (resumeTimeout) {
            clearTimeout(resumeTimeout);
            resumeTimeout = null;
        }
    };

    if (container) {
        container.addEventListener('mouseenter', stopAutoplay);
        container.addEventListener('mouseleave', startAutoplay);
        container.addEventListener('touchstart', stopAutoplay, { passive: true });
        container.addEventListener(
            'touchend',
            () => {
                stopAutoplay();
                resumeTimeout = setTimeout(startAutoplay, 1200);
            },
            { passive: true },
        );
    }

    startAutoplay();

    // Xử lý thay đổi kích thước màn hình
    window.addEventListener('resize', updateCoverflow);

    // ==========================================
    // LIGHTBOX FULLSCREEN LOGIC
    // ==========================================
    const showLightboxImage = (index) => {
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        currentLightboxIndex = index;
        const item = gallery[index];
        if (lightboxImg) lightboxImg.src = item.src;
        if (lightboxCounter) lightboxCounter.textContent = `${index + 1} / ${total}`;
    };

    const openLightbox = (index) => {
        stopAutoplay();
        showLightboxImage(index);
        if (lightbox) lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        if (lightbox) lightbox.classList.remove('active');
        document.body.style.overflow = '';
        goToIndex(currentLightboxIndex);
        startAutoplay();
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showLightboxImage(currentLightboxIndex - 1);
        });
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showLightboxImage(currentLightboxIndex + 1);
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });
    }

    // Phím tắt bàn phím
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showLightboxImage(currentLightboxIndex - 1);
            if (e.key === 'ArrowRight') showLightboxImage(currentLightboxIndex + 1);
        }
    });

    // Khởi tạo vị trí 3D ban đầu
    updateCoverflow();
}

/**
 * Đồng hồ đếm ngược
 */
function initCountdownTimer() {
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minsEl = document.getElementById('countdown-mins');
    const secsEl = document.getElementById('countdown-secs');

    if (!daysEl) return;

    const targetDate = new Date(WEDDING_DATA.reception.isoDateTime).getTime();

    const update = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minsEl.textContent = '00';
            secsEl.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minsEl.textContent = String(mins).padStart(2, '0');
        secsEl.textContent = String(secs).padStart(2, '0');
    };

    update();
    setInterval(update, 1000);
}

/**
 * Sao chép STK ngân hàng
 */
function initCopyAccountNumber() {
    const btn = document.getElementById('btn-copy-stk');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const stk = WEDDING_DATA.bank.accountNumber;
        navigator.clipboard
            .writeText(stk)
            .then(() => {
                showToast('Đã sao chép số tài khoản!');
            })
            .catch(() => {
                // Fallback
                const input = document.createElement('input');
                input.value = stk;
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
                showToast('Đã sao chép số tài khoản!');
            });
    });
}

/**
 * Hiển thị Toast thông báo
 */
function showToast(text) {
    let toast = document.querySelector('.toast-msg');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-msg';
        document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2400);
}

/**
 * Modal Xác Nhận Tham Dự (RSVP) & Thiệp Tri Ân (Thank You Card)
 */
function initRsvpModal() {
    const openBtn = document.getElementById('btn-open-rsvp');
    const modal = document.getElementById('rsvp-modal');
    const closeBtn = document.getElementById('rsvp-modal-close');
    const form = document.getElementById('rsvp-form');
    const formView = document.getElementById('rsvp-form-view');
    const successView = document.getElementById('rsvp-success-view');
    const thankyouCloseBtn = document.getElementById('btn-thankyou-close');
    const guestNameDisplay = document.getElementById('thankyou-guest-name');

    if (!modal) return;

    const openModal = () => {
        // Reset về form view mỗi khi mở
        if (formView && successView) {
            formView.style.display = '';
            successView.style.display = 'none';
            successView.classList.remove('animate-fade-in');
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (typeof fireConfettiCannon === 'function') {
            fireConfettiCannon();
        }
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Đặt lại form sau khi đóng modal xong
        setTimeout(() => {
            if (formView && successView) {
                formView.style.display = '';
                successView.style.display = 'none';
                successView.classList.remove('animate-fade-in');
            }
            if (form) form.reset();
        }, 300);
    };

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (thankyouCloseBtn) thankyouCloseBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const guestNameInput = document.getElementById('rsvp-name');
            const guestName = (guestNameInput ? guestNameInput.value : '').trim();
            const count = document.getElementById('rsvp-count').value;
            const wish = document.getElementById('rsvp-wish').value;

            const responses = JSON.parse(localStorage.getItem('wedding_rsvp') || '[]');
            responses.push({
                name: guestName,
                count: count,
                wish: wish,
                date: new Date().toISOString(),
            });
            localStorage.setItem('wedding_rsvp', JSON.stringify(responses));

            // Cá nhân hóa tên khách trên tấm thiệp cảm ơn
            if (guestNameDisplay) {
                guestNameDisplay.textContent = guestName || 'Bạn';
            }

            // Nổ pháo giấy chúc mừng
            if (typeof fireConfettiCannon === 'function') {
                fireConfettiCannon();
            }

            // Chuyển đổi mượt sang Tấm thiệp tri ân (Thank You Card)
            if (formView && successView) {
                formView.style.display = 'none';
                successView.style.display = 'block';
                successView.classList.add('animate-fade-in');
            }
        });
    }
}

/**
 * Chùm bụi nắng vàng & hạt sao li ti (Tyndall Sunbeam Dust Motes)
 * Dựa trên hiệu ứng hạt vi mô lơ lửng trong luồng sáng tự nhiên
 */
function initSunbeamDust() {
    const canvas = document.getElementById('sunbeam-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        const w = rect.width || canvas.offsetWidth || (canvas.parentElement ? canvas.parentElement.offsetWidth : 390);
        const h =
            rect.height || canvas.offsetHeight || (canvas.parentElement ? canvas.parentElement.offsetHeight : 600);
        width = canvas.width = Math.round(w * dpr);
        height = canvas.height = Math.round(h * dpr);
    }

    resize();
    window.addEventListener('resize', resize);
    if (window.ResizeObserver && canvas.parentElement) {
        new ResizeObserver(resize).observe(canvas.parentElement);
    }

    // 120 hạt bụi nắng li ti thanh thoát, nhẹ nhàng
    const MOTES_COUNT = 240;
    const motes = [];

    function createMote(initial = false) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        // Mật độ dày đặc hơn ở nửa trên (nơi chùm tia sáng bắt đầu)
        const rawT = initial ? Math.random() : -0.05;
        const t = initial ? Math.pow(rawT, 1.25) : -0.05;

        // Trục giữa luồng sáng: chạy từ góc trên phải (x ~ 88%, y ~ 0%) xuống góc dưới trái (x ~ 22%, y ~ 100%)
        const centerX = (0.9 - t * 0.7) * width;
        const centerY = t * height;

        // Độ rộng luồng sáng: phía trên hẹp hơn (55px), phía dưới mở rộng dần (170px)
        const beamWidth = (55 + t * 115) * dpr;
        // Phân phối Gauss (hạt tập trung nhiều ở lõi chùm sáng)
        const u = Math.random() + Math.random() - 1;
        const offset = u * (beamWidth * 0.55);

        const perpX = offset * 0.707;
        const perpY = offset * 0.707;

        // 3 cấp độ hạt: 75% siêu li ti (0.6 - 1.4px), 18% lấp lánh (1.5 - 2.2px), 7% bokeh mờ (2.5 - 4.0px)
        const typeRoll = Math.random();
        let radius, type;
        if (typeRoll < 0.75) {
            type = 'micro';
            radius = (0.6 + Math.random() * 0.8) * dpr;
        } else if (typeRoll < 0.93) {
            type = 'glint';
            radius = (1.5 + Math.random() * 0.8) * dpr;
        } else {
            type = 'bokeh';
            radius = (2.6 + Math.random() * 1.5) * dpr;
        }

        return {
            x: centerX + perpX,
            y: centerY + perpY,
            radius,
            type,
            vx: -(0.2 + Math.random() * 0.35) * dpr,
            vy: (0.35 + Math.random() * 0.55) * dpr,
            wobbleAngle: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.015 + Math.random() * 0.035,
            wobbleAmp: (0.15 + Math.random() * 0.35) * dpr,
            twinklePhase: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.025 + Math.random() * 0.06,
            baseAlpha: 0.45 + Math.random() * 0.55,
            colorTone: Math.random(), // tỉ lệ ánh vàng ấm vs trắng sáng
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

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        for (let i = 0; i < motes.length; i++) {
            const m = motes[i];

            // Chuyển động Brownian mượt mà lơ lửng
            m.wobbleAngle += m.wobbleSpeed;
            m.x += m.vx + Math.cos(m.wobbleAngle) * m.wobbleAmp;
            m.y += m.vy + Math.sin(m.wobbleAngle) * (m.wobbleAmp * 0.5);

            // Tái sinh khi trôi ra ngoài biên
            if (m.y > height + 20 || m.x < -30) {
                Object.assign(m, createMote(false));
            }

            // Nhịp nhấp nháy óng ánh
            m.twinklePhase += m.twinkleSpeed;
            const twinkle = 0.55 + 0.45 * Math.sin(m.twinklePhase);
            const alpha = m.baseAlpha * twinkle;

            if (m.type === 'bokeh') {
                // Hạt bokeh mờ ảo tạo chiều sâu quang học
                const glow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.radius);
                glow.addColorStop(0, `rgba(255, 245, 210, ${alpha * 0.7})`);
                glow.addColorStop(0.4, `rgba(240, 185, 70, ${alpha * 0.4})`);
                glow.addColorStop(1, 'rgba(220, 150, 40, 0)');
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
                ctx.fill();
            } else if (m.type === 'glint') {
                // Hạt lấp lánh có quầng hào quang + nhân trắng sáng
                const glow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.radius * 2.2);
                glow.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.95})`);
                glow.addColorStop(0.35, `rgba(255, 220, 100, ${alpha * 0.8})`);
                glow.addColorStop(0.7, `rgba(230, 160, 40, ${alpha * 0.35})`);
                glow.addColorStop(1, 'rgba(210, 130, 20, 0)');
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(m.x, m.y, m.radius * 2.2, 0, Math.PI * 2);
                ctx.fill();

                // Nhân hạt sáng óng
                ctx.fillStyle = `rgba(255, 250, 235, ${alpha * 0.95})`;
                ctx.beginPath();
                ctx.arc(m.x, m.y, m.radius * 0.7, 0, Math.PI * 2);
                ctx.fill();

                // Tia chớp 4 cánh siêu mảnh khi đạt đỉnh lấp lánh
                if (twinkle > 0.85) {
                    const flareLen = m.radius * 2.4;
                    ctx.strokeStyle = `rgba(255, 248, 220, ${(twinkle - 0.85) * 6 * alpha})`;
                    ctx.lineWidth = 0.8 * dpr;
                    ctx.beginPath();
                    ctx.moveTo(m.x - flareLen, m.y);
                    ctx.lineTo(m.x + flareLen, m.y);
                    ctx.moveTo(m.x, m.y - flareLen);
                    ctx.lineTo(m.x, m.y + flareLen);
                    ctx.stroke();
                }
            } else {
                // Hạt cát siêu li ti (0.6 - 1.4px) - hàng trăm hạt tinh thể ánh kim
                const r = m.radius;
                // Viền ấm nhẹ giúp hạt hiển thị sắc nét trên cả nền kem lẫn nền tối
                ctx.fillStyle = `rgba(200, 140, 30, ${alpha * 0.6})`;
                ctx.beginPath();
                ctx.arc(m.x, m.y, r + 0.4 * dpr, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle =
                    m.colorTone > 0.4 ? `rgba(255, 235, 140, ${alpha * 0.95})` : `rgba(255, 255, 255, ${alpha * 0.95})`;
                ctx.beginPath();
                ctx.arc(m.x, m.y, r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        requestAnimationFrame(draw);
    }

    // Vẽ frame đầu tiên đồng bộ
    draw();
}

/**
 * Pháo giấy đám cưới ăn mừng (Celebration Confetti Cannon)
 * Bắn chéo từ góc phải bên dưới màn hình nổ chéo lên giữa màn hình
 */
let fireConfettiCannon = null;

function initConfettiCannon() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let animationId = null;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener('resize', resize);
    resize();

    // Bảng màu tiệc cưới hoàng gia sang trọng: Vàng đồng, Ánh kim, Đỏ rượu vang, Hồng phấn, Trắng ngọc trai
    const colors = [
        '#d4af37', // Vàng hoàng gia
        '#ffd700', // Vàng ánh kim
        '#c9a24a', // Vàng đồng
        '#7a1f26', // Đỏ rượu vang
        '#a8323b', // Đỏ đô
        '#e06d75', // Hồng cánh sen
        '#fffaf0', // Trắng ngọc trai
        '#f5e6ca', // Vàng kem nhũ
        '#c0392b'  // Đỏ rực rỡ
    ];

    function drawHeart(c, x, y, size) {
        c.beginPath();
        const topCurveHeight = size * 0.3;
        c.moveTo(x, y + topCurveHeight);
        c.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
        c.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + size, x, y + size);
        c.bezierCurveTo(x, y + size, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
        c.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
        c.closePath();
        c.fill();
    }

    function createParticle(burstOriginX, burstOriginY) {
        // Góc bắn: Bắn từ góc dưới bên phải màn hình nổ chéo lên (khoảng 218 độ +/- 22 độ)
        // 180 độ là sang trái, 270 độ là thẳng đứng lên => 218 độ hướng thẳng tâm màn hình
        const baseAngleDeg = 218;
        const spreadDeg = 44; // Độ xòe pháo hoa
        const angleDeg = baseAngleDeg + (Math.random() - 0.5) * spreadDeg;
        const angleRad = (angleDeg * Math.PI) / 180;

        // Tốc độ phóng ban đầu cực mạnh tạo cảm giác nổ pháo giấy thật
        const speed = 19 + Math.random() * 25; // 19 -> 44 px/frame

        const isHeart = Math.random() < 0.20; // 20% hạt trái tim tình yêu
        const isRibbon = !isHeart && Math.random() < 0.45; // 45% dải ruy băng dài

        return {
            x: burstOriginX,
            y: burstOriginY,
            vx: Math.cos(angleRad) * speed,
            vy: Math.sin(angleRad) * speed,
            drag: 0.954 + Math.random() * 0.015, // Lực cản gió
            gravity: 0.38 + Math.random() * 0.16, // Trọng lực rơi
            w: isRibbon ? 6 + Math.random() * 6 : 8 + Math.random() * 6,
            h: isRibbon ? 14 + Math.random() * 14 : 8 + Math.random() * 6,
            size: 10 + Math.random() * 8, // dùng cho trái tim
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.28,
            tiltAngle: Math.random() * Math.PI * 2,
            tiltSpeed: 0.08 + Math.random() * 0.14, // Tốc độ lật cánh 3D
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.04 + Math.random() * 0.06,
            alpha: 1,
            decay: 0.005 + Math.random() * 0.007, // Tốc độ mờ dần
            isHeart: isHeart,
            isRibbon: isRibbon
        };
    }

    function burst(count = 75) {
        // Tọa độ bắn: Ngay tại góc dưới bên phải màn hình
        const originX = width + 10;
        const originY = height + 10;
        for (let i = 0; i < count; i++) {
            particles.push(createParticle(originX, originY));
        }

        if (!animationId) {
            animate();
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            // Vật lý chuyển động: Vận tốc, cản gió và trọng lực
            p.vx *= p.drag;
            p.vy = p.vy * p.drag + p.gravity;
            p.x += p.vx;
            p.y += p.vy;

            // Chao đảo tự nhiên trong không khí
            p.wobble += p.wobbleSpeed;
            p.x += Math.sin(p.wobble) * 0.8;

            // Xoay và lật mặt 3D
            p.rotation += p.rotationSpeed;
            p.tiltAngle += p.tiltSpeed;

            // Giảm độ rõ nét
            p.alpha -= p.decay;

            // Hạt ra khỏi màn hình hoặc đã mờ hẳn
            if (p.alpha <= 0 || p.y > height + 60 || p.x < -80) {
                particles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            // Lật mặt phẳng 3D giấy bay
            ctx.scale(Math.cos(p.tiltAngle), 1);

            ctx.fillStyle = p.color;

            if (p.isHeart) {
                drawHeart(ctx, -p.size / 2, -p.size / 2, p.size);
            } else {
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(-p.w / 2, -p.h / 2, p.w, p.h, 2);
                } else {
                    ctx.rect(-p.w / 2, -p.h / 2, p.w, p.h);
                }
                ctx.fill();
            }

            ctx.restore();
        }

        if (particles.length > 0) {
            animationId = requestAnimationFrame(animate);
        } else {
            animationId = null;
            ctx.clearRect(0, 0, width, height);
        }
    }

    // Bắn 2 đợt liên tiếp (Double Burst) để tạo cảm giác nổ pháo hoa hoành tráng
    fireConfettiCannon = function() {
        burst(75);
        setTimeout(() => burst(50), 140);
    };

    window.fireConfettiCannon = fireConfettiCannon;
}
