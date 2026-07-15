/**
 * Finwave Forex Services - Premium Interactions
 * Powered by GSAP & Lenis
 */

document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();

    // 1. Preloader Logic
    const preloader = document.getElementById('preloader');
    const loaderProgress = document.getElementById('loader-progress');
    const loaderPercentage = document.getElementById('loader-percentage');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 400);
        }
        loaderProgress.style.width = `${progress}%`;
        if (loaderPercentage) loaderPercentage.textContent = Math.floor(progress) + '%';
    }, 100);

    // 3. Smooth Scrolling (Lenis)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
    });
    
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    // Sync GSAP with Lenis
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time)=>{
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }

    // 3.5 Mobile Menu Logic
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navWrapper = document.getElementById('nav-wrapper');
    const mobileNavLinks = document.querySelectorAll('.nav-link');
    
    if (menuBtn && navWrapper) {
        const toggleMenu = () => {
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            menuBtn.setAttribute('aria-expanded', !isExpanded);
            menuBtn.classList.toggle('active');
            navWrapper.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        };

        menuBtn.addEventListener('click', toggleMenu);
        
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navWrapper.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }

    // 4. GSAP Advanced Animations (Parallax & Stagger)
    function initScrollAnimations() {
        if (typeof gsap === 'undefined') return;

        // Respect prefers-reduced-motion and improve mobile performance
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion || window.innerWidth < 768) {
            // Reveal everything immediately instead of animating
            gsap.set('.reveal-up, .reveal-left, .reveal-right, .bento-card', { opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)' });
            return;
        }
        
        // Parallax reveals for main content
        const revealUpElements = document.querySelectorAll('.reveal-up');
        revealUpElements.forEach((el) => {
            gsap.fromTo(el, 
                { y: 80, opacity: 0, filter: 'blur(15px)' },
                { 
                    y: 0, 
                    opacity: 1, 
                    filter: 'blur(0px)',
                    duration: 1.2, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
        
        // Staggered reveal for Bento Grid
        const bentoGrid = document.querySelector('.bento-grid');
        if (bentoGrid) {
            gsap.fromTo('.bento-card', 
                { y: 50, opacity: 0, scale: 0.9 },
                {
                    y: 0, opacity: 1, scale: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: bentoGrid,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        const revealLeftElements = document.querySelectorAll('.reveal-left, .reveal-right');
        revealLeftElements.forEach((el) => {
            gsap.fromTo(el, 
                { opacity: 0, x: (el.classList.contains('reveal-left') ? 50 : -50) },
                { 
                    opacity: 1, 
                    x: 0,
                    duration: 1.2, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    // Initialize animations
    initScrollAnimations();

    // 5. Sticky Header Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 6. 3D Tilt Effect on Cards
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // 7. Tab Logic
    const setupTabs = (containerSelector, btnClass) => {
        const containers = document.querySelectorAll(containerSelector);
        containers.forEach(container => {
            const tabs = container.querySelectorAll(btnClass);
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    const targetId = tab.getAttribute('data-target');
                    if (targetId) {
                        const allBodies = document.querySelectorAll('.rates-tbody');
                        allBodies.forEach(body => body.style.display = 'none');
                        const targetBody = document.getElementById(targetId);
                        if (targetBody) {
                            targetBody.style.display = 'table-row-group';
                        }
                    }
                });
            });
        });
    }
    setupTabs('.table-controls', '.tab-btn');
    setupTabs('.api-code', '.code-tab');

    // 7.5 Advanced Interactions (Magnetic Buttons, Custom Cursor, Theme Toggle)
    

    // Magnetic Buttons
    const magneticBtns = document.querySelectorAll('.btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.3; // 30% pull strength
            const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    // 8. Live FX API & Quote Calculator Logic
    const quoteInput = document.getElementById('quote-input');
    const quoteOutput = document.getElementById('quote-output');
    const sendCurr = document.getElementById('quote-send-curr');
    const recvCurr = document.getElementById('quote-recv-curr');
    const rateDisplay = document.getElementById('quote-rate');
    const refreshBtn = document.getElementById('widget-refresh');
    const tickerTrack = document.getElementById('ticker-track');
    
    const CCYS = [
        { code: 'USD', flag: '🇺🇸', name: 'US Dollar' },
        { code: 'EUR', flag: '🇪🇺', name: 'Euro' },
        { code: 'GBP', flag: '🇬🇧', name: 'British Pound' },
        { code: 'AUD', flag: '🇦🇺', name: 'Australian Dollar' },
        { code: 'CAD', flag: '🇨🇦', name: 'Canadian Dollar' },
        { code: 'SGD', flag: '🇸🇬', name: 'Singapore Dollar' },
        { code: 'AED', flag: '🇦🇪', name: 'UAE Dirham' },
        { code: 'CHF', flag: '🇨🇭', name: 'Swiss Franc' },
        { code: 'JPY', flag: '🇯🇵', name: 'Japanese Yen' },
        { code: 'NZD', flag: '🇳🇿', name: 'New Zealand Dollar' },
        { code: 'SAR', flag: '🇸🇦', name: 'Saudi Riyal' },
        { code: 'HKD', flag: '🇭🇰', name: 'Hong Kong Dollar' },
        { code: 'THB', flag: '🇹🇭', name: 'Thai Baht' },
        { code: 'MYR', flag: '🇲🇾', name: 'Malaysian Ringgit' },
        { code: 'CNY', flag: '🇨🇳', name: 'Chinese Yuan' },
        { code: 'ZAR', flag: '🇿🇦', name: 'South African Rand' }
    ];

    // Fallback static rates in case API fails
    let liveRates = {
        'usd': 1.0, 'eur': 0.924, 'gbp': 0.785,
        'aud': 1.529, 'cad': 1.354, 'jpy': 149.5,
        'inr': 83.1, 'chf': 0.883, 'sgd': 1.34, 
        'aed': 3.67, 'nzd': 1.63, 'sar': 3.75, 
        'hkd': 7.82, 'thb': 35.8, 'myr': 4.71, 
        'cny': 7.19, 'zar': 18.9
    };

    const formatNumber = (num, minDec = 2, maxDec = 2) => {
        return num.toLocaleString('en-US', { minimumFractionDigits: minDec, maximumFractionDigits: maxDec });
    };

    const parseAmount = (str) => {
        return parseFloat(str.replace(/,/g, '')) || 0;
    };

    const calculateQuote = (reverse = false) => {
        const send = sendCurr.value.toLowerCase();
        const recv = recvCurr.value.toLowerCase();
        
        let sendRate = liveRates[send] || 1;
        let recvRate = liveRates[recv] || 1;
        let currentRate = (send === recv) ? 1.0 : (recvRate / sendRate);
        
        let displayRate = (send === recv) ? 1.0 : (sendRate / recvRate);
        rateDisplay.textContent = formatNumber(displayRate, 4, 4);
        
        if (reverse) {
            const amount = parseAmount(quoteOutput.value);
            quoteInput.value = formatNumber(amount / currentRate);
        } else {
            const amount = parseAmount(quoteInput.value);
            quoteOutput.value = formatNumber(amount * currentRate);
        }
    };

    const handleInputFormatting = (e) => {
        const isReverse = e.target === quoteOutput;
        // Strip non-numeric, format, and set back
        let val = e.target.value.replace(/[^0-9.]/g, '');
        if (val === '') {
            e.target.value = '';
            calculateQuote(isReverse);
            return;
        }
        // Don't format while typing decimal
        if (val.includes('.')) {
            let parts = val.split('.');
            if(parts[1].length > 2) parts[1] = parts[1].substring(0,2);
            e.target.value = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + parts[1];
        } else {
            e.target.value = val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        calculateQuote(isReverse);
    };

    const fetchLiveRates = async () => {
        rateDisplay.textContent = 'Fetching...';
        if(refreshBtn) {
            gsap.to(refreshBtn, { rotation: "+=360", duration: 1, repeat: -1, ease: "linear" });
        }
        try {
            const res = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
            const data = await res.json();
            if(data && data.usd) {
                liveRates = data.usd;
                updateTicker();
            }
        } catch (err) {
            console.error('Failed to fetch live rates, using fallbacks.', err);
        } finally {
            if(refreshBtn) gsap.killTweensOf(refreshBtn);
            calculateQuote();
            populateTables();
        }
    };

    const populateTables = () => {
        const cashTbody = document.getElementById('rates-cash');
        const travelTbody = document.getElementById('rates-travel');
        if (!cashTbody || !travelTbody) return;

        let cashHtml = '';
        let travelHtml = '';
        
        let sendRateInr = liveRates['inr'] || 83.1;

        CCYS.forEach((ccy, index) => {
            const code = ccy.code.toLowerCase();
            const recvRate = liveRates[code] || 1;
            const baseRate = sendRateInr / recvRate;
            
            const weBuy = baseRate * 0.992;
            const weSell = baseRate * 1.008;

            const isUp = Math.random() > 0.5;
            const change = (Math.random() * 0.2).toFixed(2);
            
            const extraRowClass = index >= 5 ? 'class="extra-rate-row"' : '';
            const extraRowStyle = index >= 5 ? 'style="display: none;"' : '';
            
            cashHtml += `
                <tr ${extraRowClass} ${extraRowStyle}>
                    <td class="font-medium">${ccy.flag} ${ccy.code} - ${ccy.name}</td>
                    <td class="font-mono">${weBuy.toFixed(2)}</td>
                    <td class="font-mono">${weSell.toFixed(2)}</td>
                    <td><span class="badge ${isUp ? 'badge-success' : ''}" ${!isUp ? 'style="color:var(--danger);"' : ''}>${isUp ? '+' : '-'}${change}%</span></td>
                    <td><i data-lucide="check-circle-2" class="text-primary"></i> Available</td>
                </tr>`;
                
            const weBuyTravel = baseRate * 0.988;
            const weSellTravel = baseRate * 1.010;
            travelHtml += `
                <tr ${extraRowClass} ${extraRowStyle}>
                    <td class="font-medium">${ccy.flag} ${ccy.code} - Multi-Currency Card</td>
                    <td class="font-mono">${weBuyTravel.toFixed(2)}</td>
                    <td class="font-mono">${weSellTravel.toFixed(2)}</td>
                    <td><span class="badge ${isUp ? 'badge-success' : ''}" ${!isUp ? 'style="color:var(--danger);"' : ''}>${isUp ? '+' : '-'}${change}%</span></td>
                    <td><i data-lucide="credit-card" class="text-primary"></i> Zero Load Fee</td>
                </tr>`;
        });

        cashTbody.innerHTML = cashHtml;
        travelTbody.innerHTML = travelHtml;
        
        // Re-initialize Lucide icons for the new elements
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
        // Add sparklines
        addSparklines();
    };

    const updateTicker = () => {
        if(!tickerTrack) return;
        tickerTrack.innerHTML = '';
        
        CCYS.forEach(ccy => {
            const code = ccy.code.toLowerCase();
            const rate = liveRates[code];
            if(rate) {
                const up = Math.random() > 0.5;
                const change = (Math.random() * 0.5).toFixed(2);
                const html = `<span class="ticker-item">
                    <span class="pair">USD/${ccy.code}</span> 
                    <span class="px">${formatNumber(rate, 4, 4)}</span>
                    <span class="${up ? 'up' : 'down'}">${up ? '▲' : '▼'} ${change}%</span>
                </span>`;
                tickerTrack.innerHTML += html;
            }
        });
        tickerTrack.innerHTML += tickerTrack.innerHTML;
    };

    const addSparklines = () => {
        const trendCells = document.querySelectorAll('.data-table td:nth-child(4)');
        trendCells.forEach(cell => {
            if(!cell.querySelector('svg')) {
                const text = cell.textContent.trim();
                const isUp = text.includes('+');
                const color = isUp ? 'var(--success)' : 'var(--danger)';
                const pathD = isUp ? "M2,16 L14,14 L26,17 L38,9 L50,11 L58,3 L53,3 M58,3 L58,8" : "M2,4 L14,6 L26,3 L38,11 L50,9 L58,17 L53,17 M58,17 L58,12";
                
                const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("class", "sparkline");
                svg.setAttribute("viewBox", "0 0 60 20");
                svg.setAttribute("preserveAspectRatio", "none");
                svg.style.marginLeft = '10px';
                
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", pathD);
                path.setAttribute("fill", "none");
                path.setAttribute("stroke", color);
                path.setAttribute("stroke-width", "2.5");
                path.setAttribute("stroke-linecap", "round");
                path.setAttribute("stroke-linejoin", "round");
                path.setAttribute("vector-effect", "non-scaling-stroke");
                
                svg.appendChild(path);
                
                // Wrap content in flex
                const wrapper = document.createElement('div');
                wrapper.style.display = 'flex';
                wrapper.style.alignItems = 'center';
                
                while (cell.firstChild) wrapper.appendChild(cell.firstChild);
                wrapper.appendChild(svg);
                cell.appendChild(wrapper);
            }
        });
    };

    if (quoteInput && quoteOutput && sendCurr && recvCurr) {
        quoteInput.addEventListener('input', handleInputFormatting);
        quoteOutput.addEventListener('input', handleInputFormatting);
        sendCurr.addEventListener('change', () => calculateQuote(false));
        recvCurr.addEventListener('change', () => calculateQuote(false));
        if(refreshBtn) refreshBtn.addEventListener('click', fetchLiveRates);
        
        const seeMoreBtn = document.getElementById('see-more-rates-btn');
        if (seeMoreBtn) {
            let expanded = false;
            seeMoreBtn.addEventListener('click', () => {
                expanded = !expanded;
                const extraRows = document.querySelectorAll('.extra-rate-row');
                extraRows.forEach(row => {
                    row.style.display = expanded ? 'table-row' : 'none';
                });
                seeMoreBtn.innerHTML = expanded ? 
                    'See Less <i data-lucide="chevron-up" style="width:16px; height:16px; margin-left:0.5rem;"></i>' : 
                    'See More <i data-lucide="chevron-down" style="width:16px; height:16px; margin-left:0.5rem;"></i>';
                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
        }
        
        // Initial fetch
        fetchLiveRates();
        
        // Auto-refresh rates every 30 seconds
        setInterval(fetchLiveRates, 30000);
    }
});
