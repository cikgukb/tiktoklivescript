let currentMode = 'video';

// Tab Switching Logic
function switchMainTab(tab) {
    document.getElementById('scriptContent').classList.toggle('active', tab === 'script');
    document.getElementById('strategyContent').classList.toggle('active', tab === 'strategy');
    document.getElementById('tabScript').classList.toggle('active', tab === 'script');
    document.getElementById('tabStrategy').classList.toggle('active', tab === 'strategy');

    // Save current tab to local storage
    localStorage.setItem('activeMainTab', tab);
}

function setMode(mode) {
    currentMode = mode;
    document.getElementById('modeVideo').classList.toggle('active', mode === 'video');
    document.getElementById('modeLive').classList.toggle('active', mode === 'live');
}

function setOffer(val) {
    document.getElementById('offer').value = val;
}

document.getElementById('generateBtn').addEventListener('click', generateScript);
document.getElementById('copyBtn').addEventListener('click', copyToClipboard);

// Ads Calculation Logic
function calculateAds() {
    const targetSales = parseFloat(document.getElementById('targetSales').value) || 0;
    const avgPrice = parseFloat(document.getElementById('avgPrice').value) || 0;

    // Constant: ROAS (Return on Ad Spend) estimate for TikTok Shop
    const ROAS = 5.0;

    const budget = targetSales / ROAS;
    const orders = avgPrice > 0 ? Math.ceil(targetSales / avgPrice) : 0;

    document.getElementById('resBudget').innerText = `RM ${budget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('resOrders').innerText = orders.toLocaleString();
}

// Strategy Export Logic
function exportStrategy() {
    const morning = document.getElementById('storyMorning').value;
    const noon = document.getElementById('storyNoon').value;
    const night = document.getElementById('storyNight').value;

    const text = `
🚀 TIKTOK LIVE FUNNEL STRATEGY
------------------------------
🌅 PAGI (TRAFFIC BOOSTER):
${morning || "Belum diisi"}

☀️ TENGAH HARI (CONVERSION):
${noon || "Belum diisi"}

🌙 MALAM (RETARGETING):
${night || "Belum diisi"}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
        alert('Rancangan strategi berjaya disalin! 🚀');
    });
}

// Persistence Logic
function saveData() {
    const data = {
        morning: document.getElementById('storyMorning').value,
        noon: document.getElementById('storyNoon').value,
        night: document.getElementById('storyNight').value,
        targetSales: document.getElementById('targetSales').value,
        avgPrice: document.getElementById('avgPrice').value,
        checklist: Array.from(document.querySelectorAll('.checklist-items input')).map(i => i.checked)
    };
    localStorage.setItem('liveStrategyData', JSON.stringify(data));
}

function loadData() {
    const saved = localStorage.getItem('liveStrategyData');
    if (saved) {
        const data = JSON.parse(saved);
        document.getElementById('storyMorning').value = data.morning || '';
        document.getElementById('storyNoon').value = data.noon || '';
        document.getElementById('storyNight').value = data.night || '';
        document.getElementById('targetSales').value = data.targetSales || '';
        document.getElementById('avgPrice').value = data.avgPrice || '';

        const checks = document.querySelectorAll('.checklist-items input');
        data.checklist?.forEach((c, idx) => {
            if (checks[idx]) checks[idx].checked = c;
        });

        calculateAds();
    }
}

// Initialize
window.onload = () => {
    loadData();
    const activeTab = localStorage.getItem('activeMainTab') || 'script';
    switchMainTab(activeTab);

    // Add event listeners for auto-save
    const inputs = document.querySelectorAll('#strategyContent textarea, #strategyContent input');
    inputs.forEach(input => {
        input.addEventListener('input', saveData);
        input.addEventListener('change', saveData);
    });
};

function generateScript() {
    const productName = document.getElementById('productName').value || "[Nama Produk]";
    const targetAudience = document.getElementById('targetAudience').value || "[Target Audience]";
    const mainProblem = document.getElementById('mainProblem').value || "[Masalah Utama]";
    const usageInstructions = document.getElementById('usageInstructions').value || "[Langkah-langkah penggunaan]";
    const uniqueFeatures = document.getElementById('uniqueFeatures').value || "[Kelebihan Utama]";
    const testimonials = document.getElementById('testimonials').value || "[Kisah Pelanggan/Review]";
    const offer = document.getElementById('offer').value || "[Tawaran]";
    const cta = document.getElementById('cta').value || "[Klik Beg Kuning]";
    const tone = document.getElementById('scriptTone').value;

    const resultDiv = document.getElementById('scriptResult');
    const copyBtn = document.getElementById('copyBtn');

    let script = "";

    const templates = {
        santai: {
            hook: `Korang pernah tak rasa ${mainProblem}? Stress kan? Lagi-lagi untuk ${targetAudience} macam kita ni.`,
            intro: `Sebab tu korang kena tengok ni, **${productName}**. Senang je guna, just ${usageInstructions}. Memang life-changer!`,
            usp: `Paling best sebab ${uniqueFeatures}. Ada yang dah cuba pun cakap: '${testimonials}'. Memang padu!`,
            offer: `Special untuk korang yang tengah tengok ni, saya nak bagi **${offer}**. Rezeki jangan ditolak!`,
            cta: `Cepat-cepat ${cta} sekarang sebelum stok habis!`,
            engage1: "Geng, jom tap-tap skrin jap bagi sampai 5k likes! 🔥",
            engage2: "Siapa nak link atau nak tanya, komen 'SAYA' kat bawah! 👇",
            engage3: "Siapa baru masuk, jangan lupa follow kita tau! ❤️"
        },
        formal: {
            hook: `Adakah anda menghadapi masalah ${mainProblem}? Situasi ini pastinya mencabar buat ${targetAudience}.`,
            intro: `Hari ini saya ingin memperkenalkan penyelesaian terbaik: **${productName}**. Penggunaannya sangat mudah: ${usageInstructions}.`,
            usp: `Produk ini menawarkan pelbagai kelebihan seperti ${uniqueFeatures}. Testimoni pengguna menyatakan: '${testimonials}'.`,
            offer: `Sebagai tawaran istimewa hari ini, kami menyediakan **${offer}** khusus untuk anda.`,
            cta: `Sila ${cta} dengan segera untuk menikmati tawaran ini.`,
            engage1: "Sila berikan maklum balas anda dengan menekan butang 'like' di skrin. 👍",
            engage2: "Sekiranya anda mempunyai sebarang pertanyaan, sila kongsikan di ruangan komen.",
            engage3: "Jangan lupa untuk mengikuti akaun rasmi kami untuk maklumat lanjut. 💼"
        },
        'high energy': {
            hook: `STOP! Korang ada masalah ${mainProblem}? Penat kan? ${targetAudience} semua tolong dengar ni!`,
            intro: `Benda ni memang BOOM! **${productName}**! Guna dia? BAM! ${usageInstructions}. Terus settle masalah!`,
            usp: `Tengok ni! ${uniqueFeatures}. Customer kita sampai cakap: '${testimonials}'! Power gila!`,
            offer: `DENGAR SINI! Untuk harini je, saya bagi **${offer}**! Harga runtuh ni guys!`,
            cta: `GRAB SEKARANG! ${cta}! Jangan tunggu sampai habis!`,
            engage1: "JOM TAP-TAP SKRIN SAMPAI PECAH GUYS! KASI 50K LIKES! 🔥🔥🔥",
            engage2: "SIAPA NAK HARGA NI KOMEN 'MAU' SEKARANG! 👇👇👇",
            engage3: "SHARE LIVE NI KAT 5 ORANG MEMBER KORANG! KITA KASI MERIAH! 🚀"
        }
    };

    const t = templates[tone];

    if (currentMode === 'video') {
        script = `
🎥 **SKRIP VIDEO PENDEK (RANGKA JALAN CERITA)**

1️⃣ **HOOK (3 SAAT PERTAMA)**
"[VOICE: Hook yang menarik! 🎙️]
${t.hook}"

[ENGAGE: ${t.engage1}]

2️⃣ **PERTENGAHAN (PENERANGAN & SOLUSI)**
"[ACTION: Tunjukkan produk rapat ke kamera 🤳]
${t.intro}
${t.usp}"

[ENGAGE: ${t.engage2}]

3️⃣ **KESIMPULAN - CTA**
"[ACTION: Tunjuk fon ke kamera & tunjuk cara klik 📲]
${t.cta}
**Promo: ${offer}**"
        `;
    } else {
        script = `
📱 **SKRIP LIVE STREAM (TIMELINE & STRATEGI)**

⏰ **9:00 AM - 9:05 AM: PEMBUKAAN**
"[VOICE: Pembukaan bertenaga! 📢]
Hello everyone! Selamat datang! Siapa ada masalah ${mainProblem}?
[ENGAGE: ${t.engage1}]"

⏰ **9:05 AM - 9:15 AM: PENGENALAN & DEMO**
"[ACTION: Pegang produk & pusing-pusingkan ✨]
Ini dia **${productName}**. Hero kita harini!
Tengok ni: ${usageInstructions}."

[ENGAGE: ${t.engage2}]

⏰ **9:15 AM - 9:30 AM: USP & TESTIMONI**
"[VOICE: Nada meyakinkan 🤝]
Kenapa kena ada ni? Sebab ${uniqueFeatures}.
Dengar apa orang kata: '${testimonials}'."

⏰ **9:30 AM - 9:45 AM: PROMOSI (FLASH SALE)**
"[ACTION: Bunyikan Locing! 🔔 Ting! Ting! Ting!]
Okay, sedia semua! Sekarang saya nak bagi **${offer}**!
[ENGAGE: ${t.engage3}]"

⏰ **9:45 AM - 10:00 AM: URGENCY & CTA**
"[ACTION: Tunjukkan skrin fon & cara Checkout 📱]
Tinggal sikit je lagi! ${t.cta}"

⏰ **KESIMPULAN**
"[VOICE: Nada Penghargaan ❤️]
Terima kasih semua yang dah grab! Korang memang bijak!"
        `;
    }

    // Process all cues
    let processedScript = script
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[ACTION: (.*?)\]/g, '<span class="cue-action">🎬 ACTION: $1</span>')
        .replace(/\[VOICE: (.*?)\]/g, '<span class="cue-voice">🗣️ VOICE: $1</span>')
        .replace(/\[ENGAGE: (.*?)\]/g, '<span class="cue-engagement">🤝 ENGAGEMENT: $1</span>');

    resultDiv.innerHTML = processedScript;
    copyBtn.style.display = 'block';

    if (window.innerWidth < 850) {
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }
}

function copyToClipboard() {
    const scriptText = document.getElementById('scriptResult').innerText;
    navigator.clipboard.writeText(scriptText).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        const originalText = copyBtn.innerText;
        copyBtn.innerText = '✅ Disalin!';
        setTimeout(() => {
            copyBtn.innerText = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Gagal menyalin: ', err);
    });
}
