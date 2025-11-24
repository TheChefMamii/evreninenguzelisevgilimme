/* --- AYARLAR --- */
const startDate = new Date("2025-05-30T00:00:00"); 
const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
const BOT_TOKEN = '8387694074:AAHF30x-1NcmE0Gs4v2jWMpyJPDuwy0XCa4'; 
const CHAT_ID = '6750266187';

/* --- GÜNCELLEME BİLDİRİM SİSTEMİ (YENİ) --- */
// BURAYI SEN HER YENİLİK YAPTIĞINDA DEĞİŞTİR (Örn: 1.3 yap)
const CURRENT_VERSION = "1.0"; 

function checkUpdates() {
    const lastSeenVersion = localStorage.getItem('lastSeenVersion');
    const dot = document.getElementById('update-dot');
    const menuDot = document.getElementById('menu-notification-dot');

    // Eğer son görülen versiyon, şimdiki versiyon değilse (yani yeniyse)
    if (lastSeenVersion !== CURRENT_VERSION) {
        dot.style.display = 'block'; // Butonun yanındaki nokta
        menuDot.style.display = 'block'; // Hamburger menüdeki nokta
    } else {
        dot.style.display = 'none';
        menuDot.style.display = 'none';
    }
}

// Güncellemeler sayfasına tıklayınca bu çalışır
function markUpdatesRead() {
    localStorage.setItem('lastSeenVersion', CURRENT_VERSION);
    document.getElementById('update-dot').style.display = 'none';
    document.getElementById('menu-notification-dot').style.display = 'none';
}

/* --- TEMA LİSTESİ --- */
const themes = [
    { id: 0, name: "Soft Pink (Default)", primary: "#ff4b6e", bg: "linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)" },
    { id: 1, name: "Hot Pink", primary: "#ff0066", bg: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)" },
    { id: 2, name: "Rose Gold", primary: "#b76e79", bg: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)" },
    { id: 3, name: "Ocean Blue", primary: "#00b4db", bg: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)" },
    { id: 4, name: "Mint Love", primary: "#00b09b", bg: "linear-gradient(135deg, #d2ccc4 0%, #2f80ed 100%)" },
    { id: 5, name: "Galaxy Purple", primary: "#8e2de2", bg: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", text: "#333" },
    { id: 6, name: "Sunset", primary: "#ff9966", bg: "linear-gradient(135deg, #f5af19 0%, #f12711 100%)" },
    { id: 7, name: "Classic Red", primary: "#ff0000", bg: "linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)" },
    { id: 8, name: "Dark Mode", primary: "#bb86fc", bg: "#121212", text: "#ffffff", glass: "rgba(255,255,255,0.1)", nav: "#1f1f1f" },
    { id: 9, name: "Event (Dynamic)", primary: "#d4af37", bg: "linear-gradient(to right, #bf953f, #fcf6ba)", isEvent: true }
];

/* --- BAŞLANGIÇ --- */
window.addEventListener("load", function() {
    initClock();
    initTheme();
    getAntalyaWeather(); // Hava Durumunu Başlat
    checkUpdates(); // Güncellemeleri Kontrol Et
    
    setTimeout(function() {
        document.getElementById("loading-screen").style.opacity = "0";
        setTimeout(() => {
            document.getElementById("loading-screen").style.display = "none";
            document.getElementById("welcome-screen").classList.remove("hidden");
            
            setTimeout(() => {
                const appContainer = document.getElementById("app-container");
                document.getElementById("welcome-screen").style.opacity = "0";
                setTimeout(() => {
                    document.getElementById("welcome-screen").style.display = "none";
                    appContainer.classList.remove("hidden"); 
                    appContainer.style.display = "block";
                }, 800); 
            }, 2500); 
        }, 800); 
    }, 3000); 
});

/* --- ANTALYA HAVA DURUMU (GitHub Fix + 20 Derece Kuralı) --- */
function getAntalyaWeather() {
    const wIcon = document.getElementById('w-icon');
    const wTemp = document.getElementById('w-temp');
    const wMsg = document.getElementById('w-msg');

    // Antalya Koordinatları
    const lat = 36.8841;
    const lon = 30.7056;
    
    // HTTPS protokolü kullanıyoruz, GitHub'da sorun çıkmaz
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(response => {
            if (!response.ok) throw new Error('Hava durumu alınamadı');
            return response.json();
        })
        .then(data => {
            const temp = Math.round(data.current_weather.temperature);
            const code = data.current_weather.weathercode;
            
            // İkon Seçimi
            if(code <= 3) wIcon.className = "fa-solid fa-sun";
            else if(code > 3 && code < 50) wIcon.className = "fa-solid fa-cloud";
            else if(code >= 50) wIcon.className = "fa-solid fa-cloud-rain";
            
            wTemp.innerText = `Antalya ${temp}°C`;

            // --- SICAKLIK MANTIĞI (20 DERECE SINIR) ---
            if (temp <= 20) {
                wMsg.innerText = "Sıkı giyin güzelim, üşüme 🧥";
            } else if (temp > 20 && temp < 28) {
                wMsg.innerText = "Hava güzel, tadını çıkar ⛅";
            } else {
                wMsg.innerText = "Çok sıcak, bol su iç 💧";
            }
        })
        .catch(err => {
            console.log("Hava Durumu Hatası:", err);
            wTemp.innerText = "Antalya"; 
            // Hata olursa mesajı gizlemek yerine tatlı bir şey yazalım
            wMsg.innerText = "Seninle hava hep güzel ☀️"; 
        });
}

/* --- TEMA MOTORU --- */
function initTheme() {
    const themeGrid = document.querySelector(".theme-grid");
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    let eventThemeId = null;

    if(month === 10 && day === 31) eventThemeId = 6;
    if(month === 2 && day === 14) eventThemeId = 1;
    if((month === 12 && day === 31) || (month === 1 && day === 1)) eventThemeId = 9;

    let savedTheme = localStorage.getItem("selectedTheme");
    
    if(eventThemeId !== null && !savedTheme) {
        applyTheme(eventThemeId);
    } else if(savedTheme) {
        applyTheme(parseInt(savedTheme));
    }

    themes.forEach(theme => {
        const btn = document.createElement("div");
        btn.classList.add("theme-btn");
        
        if(theme.bg.includes("linear-gradient")) {
            btn.style.background = theme.bg;
        } else {
            btn.style.backgroundColor = theme.bg;
        }
        
        if(theme.isEvent) {
            btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles" style="color:white; font-size:12px; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);"></i>';
        }

        btn.onclick = () => {
            applyTheme(theme.id);
            localStorage.setItem("selectedTheme", theme.id);
        };
        themeGrid.appendChild(btn);
    });
}

function applyTheme(id) {
    const theme = themes.find(t => t.id === id);
    if(!theme) return;

    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--bg-gradient', theme.bg);
    root.style.setProperty('--text-color', theme.text || '#333');
    root.style.setProperty('--text-secondary', theme.text ? '#aaa' : '#777');
    root.style.setProperty('--glass-bg', theme.glass || 'rgba(255, 255, 255, 0.6)');
    root.style.setProperty('--nav-bg', theme.nav || 'white');

    document.querySelectorAll(".theme-btn").forEach((btn, index) => {
        if(index === id) btn.classList.add("active");
        else btn.classList.remove("active");
    });
}

/* --- SAAT --- */
function initClock() {
    const clockEl = document.getElementById("live-clock");
    setInterval(() => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        clockEl.innerText = `${hours}:${minutes}`;
    }, 1000);
}

/* --- MENÜ İŞLEMLERİ --- */
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if(sidebar.style.left === '0px') {
        sidebar.style.left = '-80%';
        overlay.style.display = 'none';
        sidebar.classList.remove('active');
    } else {
        sidebar.style.left = '0px';
        overlay.style.display = 'block';
        sidebar.classList.add('active');
    }
}
function openMsgModal() { toggleMenu(); document.getElementById('msg-modal').classList.remove('hidden'); }
function closeMsgModal() { document.getElementById('msg-modal').classList.add('hidden'); }

function openInfoModal() { toggleMenu(); document.getElementById('info-modal').classList.remove('hidden'); }
function closeInfoModal() { document.getElementById('info-modal').classList.add('hidden'); }

/* --- TELEGRAM --- */
document.getElementById('sendMsg').onclick = () => {
    const msgInput = document.getElementById('messageText');
    const msg = msgInput.value.trim();
    if(!msg) { alert('Boş mesaj mı? :('); return; }
    
    const btn = document.getElementById('sendMsg');
    btn.innerText = "Gönderiliyor..."; btn.disabled = true;

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: `❤️ Mesaj:\n\n${msg}` })
    }).then(r=>r.json()).then(d=>{
        if(d.ok) { alert('Gitti aşkım! ❤️'); msgInput.value = ''; closeMsgModal(); }
        else alert('Hata oluştu');
    }).finally(()=>{ btn.innerText = "Gönder ❤️"; btn.disabled = false; });
};

/* --- MENÜ GEÇİŞİ --- */
function switchTab(tabName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if(tabName === 'home') {
        document.getElementById('home-page').classList.add('active');
        document.querySelector('.nav-item:nth-child(1)').classList.add('active');
    } else {
        document.getElementById('settings-page').classList.add('active');
        document.querySelector('.nav-item:nth-child(2)').classList.add('active');
    }
}

/* --- MÜZİK & SAYAÇ --- */
musicToggle.addEventListener('change', function() { this.checked ? music.play().catch(()=>{}) : music.pause(); });

function updateCounter() {
    const now = new Date();
    const diff = now - startDate;
    const totalSeconds = Math.floor(Math.abs(diff) / 1000);
    document.getElementById("days").innerText = Math.floor(totalSeconds / 3600 / 24);
    document.getElementById("hours").innerText = String(Math.floor((totalSeconds / 3600) % 24)).padStart(2,'0');
    document.getElementById("minutes").innerText = String(Math.floor((totalSeconds / 60) % 60)).padStart(2,'0');
    document.getElementById("seconds").innerText = String(Math.floor(totalSeconds % 60)).padStart(2,'0');
}
setInterval(updateCounter, 1000); updateCounter();