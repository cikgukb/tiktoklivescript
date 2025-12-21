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
        if (el) funnelData[id] = el.type === 'checkbox' ? el.checked : el.value;
    });

    const data = {
        funnel: funnelData,
        targetSales: document.getElementById('targetSales').value,
        avgPrice: document.getElementById('avgPrice').value,
        strategyProduct: document.getElementById('strategyProductInput').value,
        autoAI: document.getElementById('autoGenerateToggle').checked,
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

        if (document.getElementById('targetSales')) document.getElementById('targetSales').value = data.targetSales || '';
        if (document.getElementById('avgPrice')) document.getElementById('avgPrice').value = data.avgPrice || '';
        if (document.getElementById('strategyProductInput')) document.getElementById('strategyProductInput').value = data.strategyProduct || '';
        if (document.getElementById('autoGenerateToggle')) document.getElementById('autoGenerateToggle').checked = data.autoAI !== false;

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

// --- AI & MODAL LOGIC ---

function openSettings() {
    document.getElementById('settingsModal').classList.add('active');
    const savedKey = localStorage.getItem('geminiApiKey');
    if (savedKey) document.getElementById('geminiApiKey').value = savedKey;
}

function closeSettings() {
    document.getElementById('settingsModal').classList.remove('active');
}

function saveSettings() {
    const key = document.getElementById('geminiApiKey').value.trim();
    localStorage.setItem('geminiApiKey', key);
    alert('Tetapan telah disimpan! ✨');
    closeSettings();
}

async function callGemini(prompt) {
    const apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) {
        alert("Sila masukkan Gemini API Key di bahagian Tetapan (ikon ⚙️) untuk menggunakan fungsi ini.");
        openSettings();
        return null;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Ralat API");
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            // Safety filter or empty response
            if (data.promptFeedback?.blockReason) {
                throw new Error(`AI menyekat permintaan ini: ${data.promptFeedback.blockReason}`);
            }
            throw new Error("AI tidak memberikan jawapan. Sila cuba lagi dengan prompt yang berbeza.");
        }

        const text = data.candidates[0].content.parts[0].text.trim();
        return text.replace(/\*\*/g, '').replace(/^"|"$/g, '');
    } catch (error) {
        console.error("Gemini Error:", error);
        alert("Ralat AI: " + error.message);
        return null;
    }
}

async function suggestAI(fieldId, btnEl = null, context = 'script') {
    const btn = btnEl || (typeof event !== 'undefined' ? event.currentTarget : null);
    if (!btn) return;

    const productNameInput = document.getElementById(context === 'script' ? 'productName' : 'strategyProductInput');
    const productName = productNameInput ? productNameInput.value.trim() : "";

    if (!productName) {
        alert("Sila masukkan Nama Produk dahulu.");
        productNameInput?.focus();
        return;
    }

    const originalText = btn.innerHTML;
    btn.classList.add('loading');
    btn.innerHTML = '✨...';

    let prompt = "";
    if (context === 'script') {
        const prompts = {
            targetAudience: `Berikan 1 baris target audience yang spesifik untuk produk: ${productName}. Contoh: Suri rumah yang ingin menambah pendapatan.`,
            mainProblem: `Berikan 1 atau 2 ayat mengenai masalah utama yang dihadapi pelanggan berkaitan produk: ${productName}.`,
            uniqueFeatures: `Senaraikan 3 kelebihan utama produk: ${productName} dalam bentuk poin ringkas.`,
        };
        prompt = prompts[fieldId] || `Berikan idea kreatif untuk input ${fieldId} bagi produk ${productName}.`;
    } else {
        // Funnel strategy context
        const fieldMap = {
            morningV1: "Video 1 (View Objective) untuk Fasa Pagi",
            morningV2: "Video 2 (Ads Beg Kuning) untuk Fasa Pagi",
            morningV3: "Video 3 (Jemput Live) untuk Fasa Pagi",
            noonV1: "Video 1 (View Objective) untuk Fasa Tengah Hari",
            noonV2: "Video 2 (Ads Beg Kuning) untuk Fasa Tengah Hari",
            noonV3: "Video 3 (Jemput Live) untuk Fasa Tengah Hari",
            nightV1: "Video 1 (View Objective) untuk Fasa Malam",
            nightV2: "Video 2 (Ads Beg Kuning) untuk Fasa Malam",
            nightV3: "Video 3 (Jemput Live) untuk Fasa Malam",
        };
        prompt = `Tuliskan 1 plot cerita pendek (naratif) untuk TikTok bagi ${fieldMap[fieldId] || fieldId} berkaitan produk: ${productName}. Pastikan ia ringkas dan berkesan.`;
    }

    const result = await callGemini(prompt);
    if (result) {
        document.getElementById(fieldId).value = result;
        saveData();
    }

    btn.classList.remove('loading');
    btn.innerHTML = originalText;
}

async function suggestPhaseAI(phase, btnEl = null) {
    const btn = btnEl || (typeof event !== 'undefined' ? event.currentTarget : null);
    if (!btn) return;

    const productName = document.getElementById('strategyProductInput').value.trim();
    if (!productName) {
        alert("Sila masukkan Nama Produk di seksyen Smart Plot Generator.");
        document.getElementById('strategyProductInput').focus();
        return;
    }

    const originalText = btn.innerHTML;
    btn.classList.add('loading');
    btn.innerHTML = '✨...';
    const phaseNames = { morning: "Fasa Pagi", noon: "Fasa Tengah Hari", night: "Fasa Malam" };

    const prompt = `Hasilkan 3 plot video pendek (naratif) untuk TikTok bagi ${phaseNames[phase]} untuk mempromosikan ${productName}.
    Video 1: Fokus pada Engagement/View (Tips/Masalah).
    Video 2: Fokus pada Soft Sell (Tunjuk Beg Kuning).
    Video 3: Fokus pada Jemputan ke Live (Urgency).
    Berikan output dalam format JSON yang mengandungi kunci "v1", "v2", dan "v3". Jangan sertakan teks lain!`;

    const result = await callGemini(prompt);
    if (result) {
        try {
            // Clean JSON in case AI adds markdown blocks
            const cleanJson = result.replace(/```json|```/g, '').trim();
            const data = JSON.parse(cleanJson);
            document.getElementById(phase + 'V1').value = data.v1;
            document.getElementById(phase + 'V2').value = data.v2;
            document.getElementById(phase + 'V3').value = data.v3;
            saveData();
        } catch (e) {
            console.error("JSON Parse Error", e);
            // Fallback: split by lines if not JSON
            const lines = result.split('\n').filter(l => l.length > 5);
            if (lines.length >= 1) document.getElementById(phase + 'V1').value = lines[0];
            if (lines.length >= 2) document.getElementById(phase + 'V2').value = lines[1];
            if (lines.length >= 3) document.getElementById(phase + 'V3').value = lines[2];
        }
    }

    btn.classList.remove('loading');
    btn.innerHTML = originalText;
}

async function generateAllPlots() {
    const productName = document.getElementById('strategyProductInput').value;
    const useAI = document.getElementById('autoGenerateToggle').checked;

    if (!productName) {
        alert("Sila masukkan nama produk anda terlebih dahulu.");
        return;
    }

    if (!useAI) {
        alert("Mod 'Gunakan Magic AI' dimatikan. Sila aktifkan toggle untuk menjana secara automatik.");
        return;
    }

    const btn = document.getElementById('generateAllPlotsBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = "⏳ Menjana Strategi Lengkap...";
    btn.disabled = true;

    // Sequential generate to avoid token overload or race conditions
    await suggestPhaseAI_Internal('morning', productName);
    await suggestPhaseAI_Internal('noon', productName);
    await suggestPhaseAI_Internal('night', productName);

    btn.innerHTML = originalText;
    btn.disabled = false;
    alert("Strategi untuk semua fasa telah berjaya dijana! 🚀");
}

// Internal version of suggestPhaseAI for bulk generation (no UI feedback on button)
async function suggestPhaseAI_Internal(phase, productName) {
    const phaseNames = { morning: "Fasa Pagi", noon: "Fasa Tengah Hari", night: "Fasa Malam" };
    const prompt = `Hasilkan 3 plot video pendek (naratif) untuk TikTok bagi ${phaseNames[phase]} untuk mempromosikan ${productName}.
    Video 1: Fokus pada Engagement/View (Tips/Masalah).
    Video 2: Fokus pada Soft Sell (Tunjuk Beg Kuning).
    Video 3: Fokus pada Jemputan ke Live (Urgency).
    Berikan output dalam format JSON yang mengandungi kunci "v1", "v2", dan "v3". Jangan sertakan teks lain!`;

    const result = await callGemini(prompt);
    if (result) {
        try {
            const cleanJson = result.replace(/```json|```/g, '').trim();
            const data = JSON.parse(cleanJson);
            document.getElementById(phase + 'V1').value = data.v1;
            document.getElementById(phase + 'V2').value = data.v2;
            document.getElementById(phase + 'V3').value = data.v3;
            saveData();
        } catch (e) {
            const lines = result.split('\n').filter(l => l.length > 5);
            if (lines[0]) document.getElementById(phase + 'V1').value = lines[0];
            if (lines[1]) document.getElementById(phase + 'V2').value = lines[1];
            if (lines[2]) document.getElementById(phase + 'V3').value = lines[2];
        }
    }
}

document.getElementById('generateAllPlotsBtn')?.addEventListener('click', generateAllPlots);

function copyToClipboard() {
    const scriptText = document.getElementById('scriptResult').innerText;
    if (!scriptText || scriptText.includes("Isi borang di sebelah")) {
        alert("Tiada skrip untuk disalin!");
        return;
    }

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
