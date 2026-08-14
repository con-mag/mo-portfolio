document.addEventListener('DOMContentLoaded', () => {
    // Intro Screen Logic
    const introScreen = document.getElementById('intro-screen');
    if (introScreen) {
        setTimeout(() => {
            introScreen.style.opacity = '0';
            setTimeout(() => {
                introScreen.style.visibility = 'hidden';
                document.body.classList.remove('intro-active');
            }, 1000);
        }, 2500);
    }

    // 1. Set Current Year in Footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Dark/Light Mode Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check local storage or default to dark
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // 3. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        const mobileLinks = mobileMenu.querySelectorAll('a');

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }

    // 4. Scroll Animations (Fade-in)
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const fadeObserverOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const fadeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, fadeObserverOptions);

        fadeElements.forEach(el => {
            fadeObserver.observe(el);
        });
    } else {
        // Fallback if IntersectionObserver is not supported or motion is reduced
        fadeElements.forEach(el => el.classList.add('visible'));
    }

    // 5. Animated Counters
    const statsSection = document.getElementById('con-stats');
    let hasAnimated = false;

    if (statsSection && !prefersReducedMotion) {
        const statNumbers = document.querySelectorAll('.stat-number');

        const animateCounters = () => {
            statNumbers.forEach(stat => {
                const target = parseFloat(stat.getAttribute('data-target'));
                const suffix = stat.getAttribute('data-suffix') || '';
                const duration = 2000; // ms
                const frameRate = 30; // ms
                const totalFrames = duration / frameRate;
                let currentFrame = 0;
                
                const isFloat = target % 1 !== 0;

                const updateCounter = () => {
                    currentFrame++;
                    const progress = currentFrame / totalFrames;
                    // Easing: easeOutQuart
                    const easeProgress = 1 - Math.pow(1 - progress, 4);
                    
                    let currentVal = target * easeProgress;
                    
                    if (currentFrame < totalFrames) {
                        let displayVal = isFloat ? currentVal.toFixed(1) : Math.floor(currentVal).toLocaleString('en-US');
                        stat.textContent = displayVal + suffix;
                        setTimeout(updateCounter, frameRate);
                    } else {
                        let finalVal = isFloat ? target : target.toLocaleString('en-US');
                        stat.textContent = finalVal + suffix;
                    }
                };
                
                updateCounter();
            });
        };

        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    animateCounters();
                    hasAnimated = true;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    } else if (statsSection && prefersReducedMotion) {
        // If reduced motion, set instantly
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const suffix = stat.getAttribute('data-suffix') || '';
            const isFloat = target % 1 !== 0;
            let finalVal = isFloat ? target : target.toLocaleString('en-US');
            stat.textContent = finalVal + suffix;
        });
    }
});
