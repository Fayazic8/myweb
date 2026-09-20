document.addEventListener('DOMContentLoaded', function() {
    // ... (Semua kode fitur situs umum dari sebelumnya tetap sama) ...
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() { mainNav.classList.toggle('active'); const icon = menuToggle.querySelector('i'); icon.setAttribute('data-feather', mainNav.classList.contains('active') ? 'x' : 'menu'); feather.replace(); });
        document.addEventListener('click', function(e) { if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) { mainNav.classList.remove('active'); const icon = menuToggle.querySelector('i'); icon.setAttribute('data-feather', 'menu'); feather.replace(); } });
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => { link.addEventListener('click', () => { if (mainNav.classList.contains('active')) { mainNav.classList.remove('active'); const icon = menuToggle.querySelector('i'); icon.setAttribute('data-feather', 'menu'); feather.replace(); } }); });
    }
    const logoElement = document.getElementById('typing-logo');
    if (logoElement) {
        const words = ["Fayazi.", "Executor.", "Damn Bro.", "CoolMan.", "No Excuses.", "Real Builder.", "Journal of Action.", "Make It Real."];
        let wordIndex = 0, charIndex = 0, isDeleting = false;
        function type() { const currentWord = words[wordIndex]; if (isDeleting) charIndex--; else charIndex++; logoElement.textContent = currentWord.substring(0, charIndex); let typeSpeed = isDeleting ? 75 : 150; if (!isDeleting && charIndex === currentWord.length) { isDeleting = true; typeSpeed = 2000; } else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; typeSpeed = 500; } setTimeout(type, typeSpeed); }
        type();
    }
    const revealElements = document.querySelectorAll('.page-section, .jejak-card, .proyek-card, .log-entry');
    function revealOnScroll() { const windowHeight = window.innerHeight; const elementVisible = 100; for (let el of revealElements) { if (el.getBoundingClientRect().top < windowHeight - elementVisible) { el.classList.add('active'); } } }
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
    const jejakCards = document.querySelectorAll('.jejak-card');
    jejakCards.forEach(card => { card.addEventListener('mousemove', (e) => { const rect = card.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; card.style.setProperty('--mouse-x', `${x}px`); card.style.setProperty('--mouse-y', `${y}px`); }); });
    const loadMoreBtn = document.getElementById('load-more-log');
    if(loadMoreBtn) { const hiddenEntries = document.querySelectorAll('.log-entry.hidden'); if (hiddenEntries.length > 0) { loadMoreBtn.style.display = 'block'; loadMoreBtn.addEventListener('click', () => { hiddenEntries.forEach(entry => { entry.classList.remove('hidden'); }); loadMoreBtn.style.display = 'none'; }); } }

    // --- [FINAL V2] LOGIKA DASHBOARD FINANSIAL INTERAKTIF ---
    // !!! GANTI URL INI DENGAN URL BARU DARI LANGKAH 3 !!!
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzvHaShHMjA-XA0Csi50xZUIckvLeexN-_suWC0ZBAAGEb6cTXBHgXdvijd5cnvJTN2/exec'; 

    const dashboardContainer = document.getElementById('finansial-dashboard-container');
    const switcherBtns = document.querySelectorAll('.switcher-btn');
    let financialData = null; 

    const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

    function renderDashboard(period) {
        if (!financialData || !dashboardContainer) return;
        const data = financialData[period];
        if (!data) {
            dashboardContainer.innerHTML = '<div class="loader-finansial">Data tidak tersedia.</div>';
            return;
        }

        const bersihIsNegative = data.bersih < 0;
        // [FIX] Logika progres bar disesuaikan
        const progressHari = data.totalHari > 0 ? (data.hariTerisi / data.totalHari) * 100 : 0;
        const progressTarget = data.target > 0 ? (data.bersih / data.target) * 100 : 0;
        const hariLabel = period === 'daily' ? 'Hari' : (period === 'weekly' ? 'Minggu' : 'Bulan');

        dashboardContainer.innerHTML = `
            <div class="dashboard-card">
                <div class="card-header-finansial"><h4>Total Pemasukan</h4><span class="tooltip-trigger"><i data-feather="help-circle"></i><span class="tooltip-text">${data.detailPemasukan}</span></span></div>
                <p class="angka-besar angka-pemasukan">${formatRupiah(data.pemasukan)}</p>
            </div>
            <div class="dashboard-card">
                <div class="card-header-finansial"><h4>Total Pengeluaran</h4><span class="tooltip-trigger"><i data-feather="help-circle"></i><span class="tooltip-text">${data.detailPengeluaran}</span></span></div>
                <p class="angka-besar angka-pengeluaran">${formatRupiah(data.pengeluaran)}</p>
            </div>
            <div class="dashboard-card">
                <div class="card-header-finansial"><h4>Pendapatan Bersih</h4></div>
                <p class="angka-besar angka-bersih ${bersihIsNegative ? 'negatif' : 'positif'}">${formatRupiah(data.bersih)}</p>
            </div>
            <div class="dashboard-card" style="grid-column: 1 / -1;">
                <div class="progress-section">
                    <div class="progress-label"><span>Progres Hari Kerja</span><span>${data.hariTerisi} dari ${data.totalHari} Hari Total ${hariLabel} Ini</span></div>
                    <div class="progress-bar"><div class="progress-bar-fill" style="width: ${progressHari.toFixed(2)}%; background-color: #4A90E2;"></div></div>
                </div>
                <div class="progress-section">
                    <div class="progress-label"><span>Progres Target Pendapatan</span><span>${formatRupiah(data.bersih)} / ${formatRupiah(data.target)}</span></div>
                    <div class="progress-bar"><div class="progress-bar-fill" style="width: ${Math.min(Math.max(progressTarget, 0), 100).toFixed(2)}%;"></div></div>
                </div>
            </div>`;
        feather.replace();
    }

    // [BARU] CODE-GATE untuk data Mingguan & Bulanan
    const CODE_GATE = {
        validCodes: ['NOEXCUSES2026', 'MEDANPERANG', 'EXECUTORMODE'], // ganti/tambah kode di sini kapan saja
        unlocked: false,
        pendingPeriod: null,
        attempts: 0
    };
    const gateOverlay = document.getElementById('code-gate-overlay');
    const paywallOverlay = document.getElementById('paywall-overlay');
    const gateInput = document.getElementById('code-gate-input');
    const gateError = document.getElementById('code-gate-error');
    const gateTitle = document.getElementById('code-gate-title');
    const gateSubmit = document.getElementById('code-gate-submit');
    const gateCancel = document.getElementById('code-gate-cancel');
    const paywallClose = document.getElementById('paywall-close');

    function setActivePeriodBtn(period) {
        switcherBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-period') === period));
    }

    function openGate(period) {
        CODE_GATE.pendingPeriod = period;
        CODE_GATE.attempts = 0;
        if (gateInput) gateInput.value = '';
        if (gateError) gateError.textContent = '';
        if (gateTitle) gateTitle.textContent = period === 'weekly' ? 'Data Mingguan Terkunci' : 'Data Bulanan Terkunci';
        if (gateOverlay) { gateOverlay.classList.remove('hidden-gate'); }
        if (gateInput) setTimeout(() => gateInput.focus(), 100);
    }

    function closeGate(revertToDaily) {
        if (gateOverlay) gateOverlay.classList.add('hidden-gate');
        if (revertToDaily && !CODE_GATE.unlocked) {
            setActivePeriodBtn('daily');
            renderDashboard('daily');
        }
    }

    if (gateCancel) gateCancel.addEventListener('click', () => closeGate(true));

    // [BARU] Paywall bersama — dipakai oleh gate Finansial, Logbook, dan Knowledge Base
    let paywallRevertFn = null;
    const paywallTargetText = document.getElementById('paywall-target-text');
    function showPaywall(targetLabel, revertFn) {
        if (paywallTargetText) paywallTargetText.textContent = targetLabel;
        paywallRevertFn = revertFn || null;
        if (gateOverlay) gateOverlay.classList.add('hidden-gate');
        if (paywallOverlay) paywallOverlay.classList.remove('hidden-gate');
    }
    if (paywallClose) paywallClose.addEventListener('click', () => {
        paywallOverlay.classList.add('hidden-gate');
        if (paywallRevertFn) paywallRevertFn();
        paywallRevertFn = null;
    });

    function attemptUnlock() {
        if (!gateInput) return;
        const val = gateInput.value.trim().toUpperCase();
        if (CODE_GATE.validCodes.includes(val)) {
            CODE_GATE.unlocked = true;
            gateOverlay.classList.add('hidden-gate');
            setActivePeriodBtn(CODE_GATE.pendingPeriod);
            renderDashboard(CODE_GATE.pendingPeriod);
            switcherBtns.forEach(b => {
                if (b.classList.contains('switcher-btn--premium')) {
                    b.textContent = b.getAttribute('data-period') === 'weekly' ? 'Mingguan' : 'Bulanan';
                }
            });
        } else {
            showPaywall('semua data finansial', () => {
                setActivePeriodBtn('daily');
                renderDashboard('daily');
            });
        }
    }
    if (gateSubmit) gateSubmit.addEventListener('click', attemptUnlock);
    if (gateInput) gateInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') attemptUnlock(); });

    switcherBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const period = btn.getAttribute('data-period');
            if ((period === 'weekly' || period === 'monthly') && !CODE_GATE.unlocked) {
                openGate(period);
                return;
            }
            setActivePeriodBtn(period);
            renderDashboard(period);
        });
    });

    if (dashboardContainer) {
    fetch(SCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            if (data.error) { throw new Error(data.message); }
            financialData = data;
            renderDashboard('daily'); // Default tampilan harian
        })
        .catch(error => {
            console.error('Error:', error);
            dashboardContainer.innerHTML = `<div class="loader-finansial" style="color: var(--status-red);">Gagal memuat data: ${error.message}.</div>`;
        });
    }
    // --- SKILL ARENA TAB FILTER ---
    const skillTabs = document.querySelectorAll('.skill-tab');
    const skillCards = document.querySelectorAll('.skill-arena-card');
    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            skillTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const cat = tab.getAttribute('data-category');
            skillCards.forEach(card => {
                if (cat === 'all' || card.getAttribute('data-category') === cat) {
                    card.classList.remove('hidden-by-filter');
                } else {
                    card.classList.add('hidden-by-filter');
                }
            });
        });
    });

    // [BARU] CODE-GATE untuk buka semua Logbook
    const LOGBOOK_GATE = {
        validCodes: ['MEDANPERANG2026', 'EXECUTORLOG'], // ganti/tambah kode di sini kapan saja
        unlocked: false,
        attempts: 0
    };
    const logbookUnlockBtn = document.getElementById('logbook-unlock-btn');
    const logbookOverlay = document.getElementById('logbook-gate-overlay');
    const logbookInput = document.getElementById('logbook-gate-input');
    const logbookError = document.getElementById('logbook-gate-error');
    const logbookSubmit = document.getElementById('logbook-gate-submit');
    const logbookCancel = document.getElementById('logbook-gate-cancel');
    const logbookContact = document.getElementById('logbook-gate-contact');

    if (logbookUnlockBtn) {
        logbookUnlockBtn.addEventListener('click', () => {
            if (LOGBOOK_GATE.unlocked) return;
            logbookInput.value = '';
            logbookError.textContent = '';
            logbookContact.style.display = 'none';
            logbookOverlay.classList.remove('hidden-gate');
            setTimeout(() => logbookInput.focus(), 100);
        });
    }
    if (logbookCancel) logbookCancel.addEventListener('click', () => logbookOverlay.classList.add('hidden-gate'));

    function attemptLogbookUnlock() {
        if (!logbookInput) return;
        const val = logbookInput.value.trim().toUpperCase();
        if (LOGBOOK_GATE.validCodes.includes(val)) {
            LOGBOOK_GATE.unlocked = true;
            logbookOverlay.classList.add('hidden-gate');
            document.querySelectorAll('.log-entry.log-locked').forEach(el => {
                el.classList.add('unlocked-entry', 'active');
            });
            if (logbookUnlockBtn) {
                logbookUnlockBtn.innerHTML = '<span>🔓 Semua Logbook Terbuka</span>';
                logbookUnlockBtn.style.cursor = 'default';
            }
        } else {
            showPaywall('arsip logbook lengkap', null);
        }
    }
    if (logbookSubmit) logbookSubmit.addEventListener('click', attemptLogbookUnlock);
    if (logbookInput) logbookInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') attemptLogbookUnlock(); });

    // [BARU] CODE-GATE untuk Knowledge Base Premium (SOP & Resep Komersial)
    const KB_GATE = {
        validCodes: ['SOPKOMERSIAL', 'DAPURPRESISI', 'RESEPKOMERSIAL2026'], // ganti/tambah kode di sini kapan saja
        unlocked: false,
        attempts: 0
    };
    const kbUnlockBtn = document.getElementById('kb-unlock-btn');
    const kbOverlay = document.getElementById('kb-gate-overlay');
    const kbInput = document.getElementById('kb-gate-input');
    const kbError = document.getElementById('kb-gate-error');
    const kbSubmit = document.getElementById('kb-gate-submit');
    const kbCancel = document.getElementById('kb-gate-cancel');
    const kbContact = document.getElementById('kb-gate-contact');
    const kbTeaserContent = document.getElementById('kb-teaser-content');

    if (kbUnlockBtn) {
        kbUnlockBtn.addEventListener('click', () => {
            if (KB_GATE.unlocked) return;
            kbInput.value = '';
            kbError.textContent = '';
            kbContact.style.display = 'none';
            kbOverlay.classList.remove('hidden-gate');
            setTimeout(() => kbInput.focus(), 100);
        });
    }
    if (kbCancel) kbCancel.addEventListener('click', () => kbOverlay.classList.add('hidden-gate'));

    function attemptKbUnlock() {
        if (!kbInput) return;
        const val = kbInput.value.trim().toUpperCase();
        if (KB_GATE.validCodes.includes(val)) {
            KB_GATE.unlocked = true;
            kbOverlay.classList.add('hidden-gate');
            if (kbTeaserContent) {
                kbTeaserContent.innerHTML = `
                    <div class="teaser-icon" style="color: var(--status-green);"><i data-feather="unlock"></i></div>
                    <h4 class="gold-text">Akses Diterima 🔓</h4>
                    <p>Modul SOP & Resep Komersial masih dalam proses penulisan. Karena kode kamu valid, kamu bakal jadi yang pertama dikabari begitu kontennya rilis.</p>`;
                feather.replace();
            }
        } else {
            showPaywall('SOP & Resep Komersial', null);
        }
    }
    if (kbSubmit) kbSubmit.addEventListener('click', attemptKbUnlock);
    if (kbInput) kbInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') attemptKbUnlock(); });

    feather.replace();
});

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 1. LOGIC UNTUK TOMBOL "BUKA SEMUA LOGBOOK"
    // ==========================================
    const logbookBtn = document.getElementById('logbook-unlock-btn');
    const logbookOverlay = document.getElementById('logbook-gate-overlay');
    const logbookCancelBtn = document.getElementById('logbook-gate-cancel');
    const logbookSubmitBtn = document.getElementById('logbook-gate-submit');
    const paywallOverlay = document.getElementById('paywall-overlay'); // Untuk pop-up lucu-lucuan

    if (logbookBtn && logbookOverlay) {
        // Buka Popup Logbook saat tombol ditekan
        logbookBtn.addEventListener('click', function() {
            logbookOverlay.classList.remove('hidden-gate');
        });

        // Tutup Popup saat tombol Batal ditekan
        logbookCancelBtn.addEventListener('click', function() {
            logbookOverlay.classList.add('hidden-gate');
        });

        // Simulasi jika kode dimasukkan (Bisa disesuaikan)
        logbookSubmitBtn.addEventListener('click', function() {
            const input = document.getElementById('logbook-gate-input').value;
            const errorMsg = document.getElementById('logbook-gate-error');
            
            if(input === 'KODERAHASIA') { // Ganti dengan kode yang benar
                // Logika jika kode benar
                logbookOverlay.classList.add('hidden-gate');
                document.querySelectorAll('.log-locked').forEach(el => el.style.display = 'block');
                document.querySelector('.logbook-unlock-wrap').style.display = 'none';
            } else {
                // Munculkan error dan pop-up paywall bercandaan
                errorMsg.textContent = "Kode salah!";
                setTimeout(() => {
                    logbookOverlay.classList.add('hidden-gate');
                    paywallOverlay.classList.remove('hidden-gate');
                    errorMsg.textContent = ""; // reset error
                }, 800);
            }
        });
    }

    // ==========================================
    // 2. LOGIC UNTUK TOMBOL "MASUKKAN KODE AKSES" (PREMIUM SOP)
    // ==========================================
    const kbBtn = document.getElementById('kb-unlock-btn');
    const kbOverlay = document.getElementById('kb-gate-overlay');
    const kbCancelBtn = document.getElementById('kb-gate-cancel');
    const kbSubmitBtn = document.getElementById('kb-gate-submit');

    if (kbBtn && kbOverlay) {
        // Buka Popup Knowledge Base saat tombol ditekan
        kbBtn.addEventListener('click', function() {
            kbOverlay.classList.remove('hidden-gate');
        });

        // Tutup Popup saat tombol Batal ditekan
        kbCancelBtn.addEventListener('click', function() {
            kbOverlay.classList.add('hidden-gate');
        });

        // Simulasi Submit Knowledge Base
        kbSubmitBtn.addEventListener('click', function() {
             const input = document.getElementById('kb-gate-input').value;
             const errorMsg = document.getElementById('kb-gate-error');
             
             if(input === 'SOPRAHASIA') { // Ganti dengan kode yang benar
                 kbOverlay.classList.add('hidden-gate');
                 alert("Akses diberikan! Halaman SOP akan terbuka.");
                 // window.location.href = "halaman-sop.html"; // Redirect ke halaman rahasia
             } else {
                 errorMsg.textContent = "Kode salah atau kadaluarsa!";
                 setTimeout(() => {
                    kbOverlay.classList.add('hidden-gate');
                    paywallOverlay.classList.remove('hidden-gate');
                    errorMsg.textContent = ""; // reset error
                }, 800);
             }
        });
    }

    // ==========================================
    // 3. LOGIC UNTUK TUTUP PAYWALL BERCANDAAN
    // ==========================================
    const paywallCloseBtn = document.getElementById('paywall-close');
    if(paywallCloseBtn && paywallOverlay) {
        paywallCloseBtn.addEventListener('click', function() {
            paywallOverlay.classList.add('hidden-gate');
        });
    }
});