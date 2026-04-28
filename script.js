// 1. ACCURATE CALENDAR COUNTDOWN
const weddingDate = new Date("Nov 30, 2026 00:00:00");

function updateCountdown() {
    const now = new Date();
    let years = weddingDate.getFullYear() - now.getFullYear();
    let months = weddingDate.getMonth() - now.getMonth();
    let days = weddingDate.getDate() - now.getDate();
    let hours = weddingDate.getHours() - now.getHours();
    let minutes = weddingDate.getMinutes() - now.getMinutes();
    let seconds = weddingDate.getSeconds() - now.getSeconds();

    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) {
        let prevMonth = new Date(weddingDate.getFullYear(), weddingDate.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
    }
    if (months < 0) { months += 12; years--; }

    let totalMonths = (years * 12) + months;

    if (weddingDate - now > 0) {
        document.getElementById('months').innerText = totalMonths.toString().padStart(2, '0');
        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
    }
}
setInterval(updateCountdown, 1000);
updateCountdown();

// 2. SCRATCH CARD LOGIC (NO TEXT, AUTO JUMP)
const canvas = document.getElementById('scratch-canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

// Scaled for mobile
canvas.width = 180;
canvas.height = 70;

// Solid Gold Foil Layer
ctx.fillStyle = '#d4af37'; 
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Add Silk Texture Lines for a premium look
ctx.strokeStyle = '#b08d57';
ctx.lineWidth = 1;
for (let i = 0; i < 400; i += 8) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i - 40, 160); ctx.stroke();
}

function scratch(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    checkScratch();
}

function checkScratch() {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 0; i < data.length; i += 40) {
        if (data[i + 3] === 0) transparent++;
    }
    if (transparent > (data.length / 40) * 0.45) { // 45% scratched
        autoEnter();
    }
}

function autoEnter() {
    canvas.style.opacity = "0";
    // Slight delay to let them see the date before jumping
    setTimeout(() => {
        document.getElementById('intro-overlay').classList.add('slide-up');
        document.getElementById('main-site').classList.remove('hidden');
        initScrollReveal();
    }, 800);
}

canvas.addEventListener('mousedown', () => isDrawing = true);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mousemove', scratch);
canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); });
canvas.addEventListener('touchend', () => isDrawing = false);
canvas.addEventListener('touchmove', (e) => { scratch(e); e.preventDefault(); }, { passive: false });

// 3. SLIDESHOW & SCROLL REVEAL
let slideIdx = 0;
const slides = document.querySelectorAll('.mySlides');
function runSlideshow() {
    slides.forEach(s => s.classList.remove('active'));
    slideIdx = (slideIdx + 1) % slides.length;
    slides[slideIdx].classList.add('active');
    setTimeout(runSlideshow, 4000);
}
if(slides.length > 0) runSlideshow();

function initScrollReveal() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('appear'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
}
