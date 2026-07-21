/**
 * FINWAVE - High Performance Agency Script
 * Optimized for 120fps Rendering & Minimal Paint
 */

// 1. Cinematic Loader
const initLoader = () => {
    const loader = document.querySelector('.cinematic-loader');
    if(!loader) return;
    const percentTxt = document.querySelector('.loader-percentage');
    const fill = document.querySelector('.loader-fill');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        fill.style.width = `${progress}%`;
        percentTxt.textContent = `${progress.toFixed(2)}%`;
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                gsap.to('.loader-content', { opacity: 0, duration: 0.4 });
                gsap.to('.loader-panels .panel', {
                    yPercent: -100,
                    duration: 1.2,
                    stagger: 0.1,
                    ease: 'power4.inOut',
                    onComplete: () => {
                        loader.remove(); // Completely remove from DOM
                        document.body.classList.remove('loading-state');
                        initScrollAnimations();
                    }
                });
            }, 400);
        }
    }, 80);
};

// 2. Removed Lenis for Native Performance
// Global Observers for Off-Screen Pausing
let dashboardTickInterval;
const ioConfig = { root: null, rootMargin: '0px', threshold: 0 };

const heroObserver = new IntersectionObserver((entries) => {
    const globe = document.querySelector('.globe-container');
    const aurora = document.querySelector('.aurora-bg');
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if(globe) globe.style.animationPlayState = 'running';
            if(aurora) aurora.style.display = 'block';
        } else {
            if(globe) globe.style.animationPlayState = 'paused';
            if(aurora) aurora.style.display = 'none'; // Skip rendering entirely
        }
    });
}, ioConfig);

const dashboardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startLiveTicks();
        } else {
            clearInterval(dashboardTickInterval);
        }
    });
}, ioConfig);

// 3. Live Forex Dashboard
const initDashboard = () => {
    const dash = document.getElementById('live-dashboard');
    if (dash) dashboardObserver.observe(dash);

    // Base rates against USD for dynamic cross-rate calculation
    const baseRatesToUSD = {
        USD: 1, EUR: 0.9136, GBP: 0.7905, AUD: 1.54,
        CAD: 1.35, SGD: 1.35, AED: 3.67, CHF: 0.88,
        JPY: 150.00, NZD: 1.64, SAR: 3.75, HKD: 7.82,
        THB: 35.80, MYR: 4.75, CNY: 7.20, ZAR: 18.90,
        INR: 83.50 // Current approximate rate
    };

    const currencies = [
        { code: 'USD', name: 'US Dollar', symbol: '$', flag: 'us', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' },
        { code: 'EUR', name: 'Euro', symbol: '€', flag: 'eu', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
        { code: 'GBP', name: 'British Pound', symbol: '£', flag: 'gb', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' },
        { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: 'au', color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.15)' },
        { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: 'ca', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
        { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: 'sg', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' },
        { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: 'ae', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' },
        { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: 'ch', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)' },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: 'jp', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' },
        { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: 'nz', color: '#64748b', bg: 'rgba(100, 116, 139, 0.15)' },
        { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', flag: 'sa', color: '#84cc16', bg: 'rgba(132, 204, 22, 0.15)' },
        { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: 'hk', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
        { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: 'th', color: '#d946ef', bg: 'rgba(217, 70, 239, 0.15)' },
        { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: 'my', color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' },
        { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: 'cn', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.15)' },
        { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: 'za', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' }
    ];

    const marketList = document.getElementById('market-list');
    let isExpanded = false;
    
    if (marketList) {
        let html = '';
        currencies.forEach((c, index) => {
            const rate = baseRatesToUSD['INR'] / (baseRatesToUSD[c.code] || 1);
            const trend = (Math.random() * 0.4) - 0.2; // Random trend between -0.2% and +0.2%
            const trendClass = trend >= 0 ? 'trend-positive' : 'trend-negative';
            const trendArrow = trend >= 0 ? '↑' : '↓';
            const trendText = `${trendArrow} ${Math.abs(trend).toFixed(2)}%`;
            
            const hiddenClass = index >= 5 ? 'hidden-market' : '';
            const displayStyle = index >= 5 ? 'display: none;' : '';
            
            const width = 80;
            const height = 30;
            let pathD = `M 0,${trend >= 0 ? 25 : 5} `;
            let prevY = trend >= 0 ? 25 : 5;
            
            for (let i = 10; i <= width; i += 10) {
                let progress = i / width;
                let targetY = trend >= 0 ? 25 - (20 * progress) : 5 + (20 * progress);
                let nextY = targetY + (Math.random() - 0.5) * 8; // Random noise
                nextY = Math.max(2, Math.min(28, nextY));
                
                // Smooth quadratic bezier curve
                pathD += `Q ${i - 5},${prevY} ${i},${nextY} `;
                prevY = nextY;
            }

            const areaD = pathD + ` L ${width},${height} L 0,${height} Z`;
            const color = trend >= 0 ? 'var(--color-success)' : 'var(--color-warning)';
            const startColor = trend >= 0 ? 'rgba(40, 167, 69, 0.25)' : 'rgba(220, 53, 69, 0.25)';
            const endColor = trend >= 0 ? 'rgba(40, 167, 69, 0)' : 'rgba(220, 53, 69, 0)';
            
            const sparkline = `
            <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" style="overflow:visible;">
                <defs>
                    <linearGradient id="grad-${index}" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="${startColor}" />
                        <stop offset="100%" stop-color="${endColor}" />
                    </linearGradient>
                    <marker id="arrow-${index}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                        <path d="M 2 2 L 8 5 L 2 8" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </marker>
                </defs>
                <path d="${areaD}" fill="url(#grad-${index})" />
                <path d="${pathD}" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" marker-end="url(#arrow-${index})"/>
            </svg>`;
            
            html += `
                <div class="dash-row live-tick ${hiddenClass}" data-pair="${c.code}/INR" style="${displayStyle}">
                    <div class="currency-meta">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <img src="https://flagcdn.com/w40/${c.flag}.png" class="c-flag" alt="${c.code}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1px solid var(--color-border);">
                            <div class="c-symbol" style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: ${c.bg}; border-radius: 50%; font-size: 13px; font-weight: 700; color: ${c.color}; border: 1px solid ${c.bg}; box-shadow: 0 0 10px ${c.bg};">${c.symbol}</div>
                        </div>
                        <div style="margin-left: 0.5rem;">
                            <div class="c-code">${c.code}/INR</div>
                            <div class="font-mono text-muted" style="font-size:12px;">${c.name}</div>
                        </div>
                    </div>
                    <span class="c-val bid">${rate.toFixed(4)}</span>
                    <span class="c-val ask">${(rate + (rate * 0.0001)).toFixed(4)}</span>
                    <span class="c-val dash-trend ${trendClass}">${trendText}</span>
                    <span class="sparkline-container" style="display:flex; align-items:center;">${sparkline}</span>
                    <a href="#contact" class="btn btn-student magnetic" style="padding:0.4rem 1rem; font-size:12px;">Trade</a>
                </div>
            `;
        });
        marketList.innerHTML = html;
        
        const seeMoreBtn = document.getElementById('see-more-btn');
        if (seeMoreBtn) {
            seeMoreBtn.addEventListener('click', () => {
                isExpanded = !isExpanded;
                const hiddenRows = document.querySelectorAll('.hidden-market');
                hiddenRows.forEach(row => {
                    row.style.display = isExpanded ? 'grid' : 'none';
                });
                seeMoreBtn.textContent = isExpanded ? 'See Less' : 'See More Markets';
            });
        }
    }

    const search = document.getElementById('currency-search');
    const rows = document.querySelectorAll('.live-tick');
    const seeMoreContainer = document.getElementById('see-more-container');

    if (search) {
        search.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            rows.forEach(row => {
                const pair = row.dataset.pair.toLowerCase();
                if (query === '') {
                    // Reset to default based on expanded state
                    if (row.classList.contains('hidden-market') && !isExpanded) {
                        row.style.display = 'none';
                    } else {
                        row.style.display = 'grid';
                    }
                } else {
                    row.style.display = pair.includes(query) ? 'grid' : 'none';
                }
            });
            
            if (seeMoreContainer) {
                seeMoreContainer.style.display = query === '' ? 'block' : 'none';
            }
        });
    }

    // Calculator Logic
    const calcAmount = document.getElementById('calc-amount');
    const calcTo = document.getElementById('calc-to');
    const calcResult = document.getElementById('calc-result');
    const calcRate = document.getElementById('calc-rate');

    const updateCalc = () => {
        if(!calcAmount || !calcTo) return;
        const amount = parseFloat(calcAmount.value) || 0;
        
        const fromRate = baseRatesToUSD['INR'];
        const toRate = baseRatesToUSD[calcTo.value] || 1;
        
        // Calculate cross rate (From -> To)
        const rate = toRate / fromRate;
        
        calcRate.textContent = rate.toFixed(6);
        calcResult.textContent = (amount * rate).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    };

    if(calcAmount) {
        calcAmount.addEventListener('input', updateCalc);
        calcTo.addEventListener('change', updateCalc);
        updateCalc();
    }
};

const startLiveTicks = () => {
    const rows = document.querySelectorAll('.live-tick');
    if(!rows.length) return;
    
    clearInterval(dashboardTickInterval);
    dashboardTickInterval = setInterval(() => {
        const row = rows[Math.floor(Math.random() * rows.length)];
        const bid = row.querySelector('.bid');
        const ask = row.querySelector('.ask');
        
        if(bid && ask) {
            const val = parseFloat(bid.textContent);
            const change = (Math.random() - 0.5) * 0.0005;
            
            bid.textContent = (val + change).toFixed(4);
            ask.textContent = (val + change + 0.0002).toFixed(4);
            
            const isUp = change > 0;
            const color = isUp ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)';
            
            gsap.to(row, { backgroundColor: color, duration: 0.1, yoyo: true, repeat: 1, onComplete: () => {
                gsap.set(row, { clearProps: "backgroundColor" });
            }});
        }
    }, 1500);
};

// 4. Calendar Widget Logic Removed

// 5. Scroll Animations (Highly Optimized)
const initScrollAnimations = () => {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const hero = document.querySelector('.hero');
    if (hero) heroObserver.observe(hero);

    // Optimized Text Reveal & Cleanup
    if (typeof SplitType !== 'undefined') {
        const splitElements = document.querySelectorAll('.split-words');
        splitElements.forEach(el => {
            const text = new SplitType(el, { types: 'lines' });
            text.lines.forEach(line => {
                const wrapper = document.createElement('div');
                wrapper.classList.add('split-line');
                line.parentNode.insertBefore(wrapper, line);
                wrapper.appendChild(line);
                gsap.set(line, { yPercent: 100, opacity: 0 });
            });
            
            ScrollTrigger.create({
                trigger: el, 
                start: "top 85%",
                once: true, // Only animate once
                onEnter: () => {
                    gsap.to(text.lines, { 
                        yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.08, ease: 'power4.out',
                        onComplete: () => {
                            text.revert(); // Destroy SplitType and clean DOM wrappers to save memory
                        }
                    });
                }
            });
        });
    }

    // Batched Blur Reveals (Massive Performance Boost)
    ScrollTrigger.batch(".reveal-blur", {
        once: true,
        start: "top 90%",
        onEnter: batch => gsap.to(batch, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, stagger: 0.1, ease: 'power3.out' })
    });

    // Batched Map Lines
    ScrollTrigger.batch(".map-line", {
        once: true,
        start: "top 70%",
        onEnter: batch => gsap.to(batch, { strokeDashoffset: 0, duration: 2, stagger: 0.2, ease: 'power2.inOut' })
    });

    // Counters
    document.querySelectorAll('.count-up').forEach(el => {
        ScrollTrigger.create({
            trigger: el, start: "top 90%", once: true,
            onEnter: () => {
                const target = parseFloat(el.dataset.target);
                gsap.to(el, {
                    innerHTML: target, duration: 2, ease: 'power3.out',
                    snap: { innerHTML: target % 1 !== 0 ? 0.01 : 1 },
                    onUpdate: function() { el.innerHTML = this.targets()[0].innerHTML; }
                });
            }
        });
    });

    // Optimized Navbar Toggle
    // Instead of heavy lenis.on('scroll') calculations, use a ScrollTrigger on the body
    const navbar = document.getElementById('navbar');
    if (navbar) {
        ScrollTrigger.create({
            start: 50,
            onEnter: () => navbar.classList.add('scrolled'),
            onLeaveBack: () => navbar.classList.remove('scrolled')
        });

        // Hide navbar when scrolling down, show when scrolling up
        ScrollTrigger.create({
            start: "top top",
            onUpdate: (self) => {
                if (self.direction === 1 && self.scroll() > 200) {
                    navbar.classList.add('hidden');
                } else if (self.direction === -1) {
                    navbar.classList.remove('hidden');
                }
                
                // Update progress bar
                gsap.set('.scroll-progress', { width: `${self.progress * 100}%` });
            }
        });
    }
};

// 6. Mobile Menu Logic
const initMobileMenu = () => {
    const toggle = document.getElementById('mobile-menu-toggle');
    const overlay = document.getElementById('mobile-nav-overlay');
    const links = document.querySelectorAll('.mobile-nav-link');

    if (!toggle || !overlay) return;

    toggle.addEventListener('click', () => {
        const isActive = overlay.classList.toggle('active');
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', isActive ? 'x' : 'menu');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            overlay.classList.remove('active');
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'menu');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
            document.body.style.overflow = '';
        });
    });
};

// Bootstrap
window.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initDashboard();
    initMobileMenu();
    if (typeof lucide !== 'undefined') lucide.createIcons();
});
