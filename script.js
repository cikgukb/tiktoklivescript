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

// Theme Switching Logic
function switchTheme(theme) {
    if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
        document.body.setAttribute('data-theme', theme);
    }
    localStorage.setItem('preferredTheme', theme);
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
// Strategy Export Logic
function exportStrategy() {
    const getVal = (id) => document.getElementById(id).value || "Belum diisi";
    const getCheck = (id) => document.getElementById(id).checked ? " [OK]" : " [ ]";

    const text = `
🚀 TIKTOK LIVE FUNNEL STRATEGY (DETAIL)
----------------------------------------
🌅 FASA PAGI:
Video 1 (View): ${getVal('morningV1')}
- Custom Audience (75% View):${getCheck('mChecksV1_1')}
- Lookalike Audience:${getCheck('mChecksV1_2')}
Video 2 (Yellow Bag): ${getVal('morningV2')}
Video 3 (Invite): ${getVal('morningV3')}

☀️ FASA TENGAH HARI:
Video 1 (View): ${getVal('noonV1')}
- Custom Audience (75% View):${getCheck('nChecksV1_1')}
- Lookalike Audience:${getCheck('nChecksV1_2')}
Video 2 (Yellow Bag): ${getVal('noonV2')}
Video 3 (Invite): ${getVal('noonV3')}

🌙 FASA MALAM:
Video 1 (View): ${getVal('nightV1')}
- Custom Audience (75% View):${getCheck('niChecksV1_1')}
- Lookalike Audience:${getCheck('niChecksV1_2')}
Video 2 (Yellow Bag): ${getVal('nightV2')}
Video 3 (Invite): ${getVal('nightV3')}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
        alert('Rancangan strategi berjaya disalin! 🚀');
    });
}

// Persistence Logic
function saveData() {
    const funnelData = {};
    const ids = [
        'morningV1', 'morningV2', 'morningV3', 'mChecksV1_1', 'mChecksV1_2',
        'noonV1', 'noonV2', 'noonV3', 'nChecksV1_1', 'nChecksV1_2',
        'nightV1', 'nightV2', 'nightV3', 'niChecksV1_1', 'niChecksV1_2'
    ];
    ids.forEach(id => {
        const el = document.getElementById(id);
        funnelData[id] = el.type === 'checkbox' ? el.checked : el.value;
    });

    const data = {
        funnel: funnelData,
        targetSales: document.getElementById('targetSales').value,
        avgPrice: document.getElementById('avgPrice').value,
        checklist: Array.from(document.querySelectorAll('.checklist-items input')).map(i => i.checked)
    };
    localStorage.setItem('liveStrategyDataV2', JSON.stringify(data));
}

function loadData() {
    const saved = localStorage.getItem('liveStrategyDataV2');
    if (saved) {
        const data = JSON.parse(saved);

        // Load Funnel Data
        if (data.funnel) {
            Object.keys(data.funnel).forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    if (el.type === 'checkbox') el.checked = data.funnel[id];
                    else el.value = data.funnel[id];
                }
            });
        }

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

    // Set Tab
    const activeTab = localStorage.getItem('activeMainTab') || 'script';
    switchMainTab(activeTab);

    // Set Theme
    const preferredTheme = localStorage.getItem('preferredTheme') || 'dark';
    document.getElementById('themeSelect').value = preferredTheme;
    switchTheme(preferredTheme);

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
