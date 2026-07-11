/**
 * Finwave Forex Services
 * Infrastructure UI Interactions
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Icons
    lucide.createIcons();

    // 2. Initialize Lenis for Smooth Scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time)=>{
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 3. GSAP Scroll Animations
    gsap.registerPlugin(ScrollTrigger);

    const revealUpElements = document.querySelectorAll('.reveal-up');
    revealUpElements.forEach((el) => {
        gsap.fromTo(el, 
            { y: 30, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.8, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    const revealLeftElements = document.querySelectorAll('.reveal-left');
    revealLeftElements.forEach((el) => {
        gsap.fromTo(el, 
            { x: -30, opacity: 0 },
            { 
                x: 0, 
                opacity: 1, 
                duration: 0.8, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    const revealRightElements = document.querySelectorAll('.reveal-right');
    revealRightElements.forEach((el) => {
        gsap.fromTo(el, 
            { x: 30, opacity: 0 },
            { 
                x: 0, 
                opacity: 1, 
                duration: 0.8, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // 4. Tab Logic for Data Tables & Code Blocks
    const setupTabs = (containerSelector, btnClass) => {
        const containers = document.querySelectorAll(containerSelector);
        containers.forEach(container => {
            const tabs = container.querySelectorAll(btnClass);
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Remove active from all siblings
                    tabs.forEach(t => t.classList.remove('active'));
                    // Add active to clicked
                    tab.classList.add('active');
                    
                    // Specific logic for rates table
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

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, { offset: -80 });
            }
        });
    });

    // 6. Quote Calculator Logic
    const quoteInput = document.getElementById('quote-input');
    const quoteOutput = document.getElementById('quote-output');
    const sendCurr = document.getElementById('quote-send-curr');
    const recvCurr = document.getElementById('quote-recv-curr');
    const rateDisplay = document.getElementById('quote-rate');
    
    // Relative values in USD
    const baseRates = {
        'USD': 1.0,
        'EUR': 1.0815,
        'GBP': 1.2730,
        'AUD': 0.6540,
        'CAD': 0.7380,
        'JPY': 0.0067,
        'INR': 0.0121,
        'CHF': 1.1320
    };

    let currentRate = baseRates['USD'] / baseRates['EUR'];

    const calculateQuote = () => {
        const send = sendCurr.value;
        const recv = recvCurr.value;
        
        if (send === recv) {
            currentRate = 1.0000;
        } else {
            const sendBase = baseRates[send] || 1.0;
            const recvBase = baseRates[recv] || 1.0;
            currentRate = sendBase / recvBase;
        }
        
        rateDisplay.textContent = currentRate.toFixed(4);
        
        const amount = parseFloat(quoteInput.value) || 0;
        const calculated = amount * currentRate;
        quoteOutput.textContent = calculated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    if (quoteInput && quoteOutput && sendCurr && recvCurr) {
        quoteInput.addEventListener('input', calculateQuote);
        sendCurr.addEventListener('change', calculateQuote);
        recvCurr.addEventListener('change', calculateQuote);
        calculateQuote(); // Init
    }
});
