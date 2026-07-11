/**
 * Finwave Forex Services - Premium Interactions
 * Powered by GSAP & Lenis
 */

document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();

    // 1. Preloader Logic
    const preloader = document.getElementById('preloader');
    const loaderProgress = document.getElementById('loader-progress');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                initScrollAnimations();
            }, 400);
        }
        loaderProgress.style.width = `${progress}%`;
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

    // 4. GSAP Scroll Animations
    function initScrollAnimations() {
        if (typeof gsap === 'undefined') return;
        const revealUpElements = document.querySelectorAll('.reveal-up');
        revealUpElements.forEach((el, index) => {
            gsap.fromTo(el, 
                { y: 50, opacity: 0, filter: 'blur(10px)' },
                { 
                    y: 0, 
                    opacity: 1, 
                    filter: 'blur(0px)',
                    duration: 1, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
        
        const revealLeftElements = document.querySelectorAll('.reveal-left, .reveal-right');
        revealLeftElements.forEach((el) => {
            gsap.fromTo(el, 
                { opacity: 0, scale: 0.95 },
                { 
                    opacity: 1, 
                    scale: 1,
                    duration: 1, 
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

    // 8. Quote Calculator Logic
    const quoteInput = document.getElementById('quote-input');
    const quoteOutput = document.getElementById('quote-output');
    const sendCurr = document.getElementById('quote-send-curr');
    const recvCurr = document.getElementById('quote-recv-curr');
    const rateDisplay = document.getElementById('quote-rate');
    
    const baseRates = {
        'USD': 1.0, 'EUR': 1.0815, 'GBP': 1.2730,
        'AUD': 0.6540, 'CAD': 0.7380, 'JPY': 0.0067,
        'INR': 0.0121, 'CHF': 1.1320
    };
    
    const calculateQuote = () => {
        const send = sendCurr.value;
        const recv = recvCurr.value;
        let currentRate = (send === recv) ? 1.0000 : (baseRates[send] || 1.0) / (baseRates[recv] || 1.0);
        rateDisplay.textContent = currentRate.toFixed(4);
        
        const amount = parseFloat(quoteInput.value) || 0;
        quoteOutput.textContent = (amount * currentRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    if (quoteInput && quoteOutput && sendCurr && recvCurr) {
        quoteInput.addEventListener('input', calculateQuote);
        sendCurr.addEventListener('change', calculateQuote);
        recvCurr.addEventListener('change', calculateQuote);
        calculateQuote();
    }
});
