// Firebase is initialized in index.html via CDN (window.db)
document.addEventListener('DOMContentLoaded', async () => {
    
    // Fetch data from Firestore
    try {
        const docRef = window.db.collection('config').doc('main');
        const docSnap = await docRef.get();
        
        if (docSnap.exists) {
            const data = docSnap.data();
            
            // Apply Texts
            if(data.texts) {
                if(data.texts.subtitle) document.getElementById('d-subtitle').textContent = data.texts.subtitle;
                if(data.texts.title) document.getElementById('d-title').textContent = data.texts.title;
                if(data.texts.tagline) document.getElementById('d-tagline').textContent = data.texts.tagline;
                if(data.texts.date) document.getElementById('d-date').textContent = data.texts.date;
                if(data.texts.time) document.getElementById('d-time').textContent = data.texts.time;
                if(data.texts.address) document.getElementById('d-address').textContent = data.texts.address;
                if(data.texts.intro) document.getElementById('d-intro').textContent = data.texts.intro;
                
                if(data.texts.locationName) document.getElementById('d-location-name').textContent = data.texts.locationName;
                if(data.texts.address) document.getElementById('d-address-scroller').textContent = data.texts.address;
                if(data.texts.date) document.getElementById('d-date-scroller').textContent = data.texts.date;
                if(data.texts.time) document.getElementById('d-time-scroller').textContent = data.texts.time;
                
                if(data.texts.dresscodeTitle) document.getElementById('d-dresscode-title').textContent = data.texts.dresscodeTitle;
                if(data.texts.dresscodeDesc) document.getElementById('d-dresscode-desc').textContent = data.texts.dresscodeDesc;
                if(data.texts.finale) document.getElementById('d-finale').innerHTML = data.texts.finale.replace(/\n/g, '<br>');
            }
            
            // Apply Colors
            if(data.colors) {
                const root = document.documentElement;
                if(data.colors.bg) root.style.setProperty('--bg-color', data.colors.bg);
                if(data.colors.bgAlt) root.style.setProperty('--bg-alt', data.colors.bgAlt);
                if(data.colors.gold) root.style.setProperty('--gold', data.colors.gold);
                if(data.colors.textPrimary) root.style.setProperty('--text-primary', data.colors.textPrimary);
                if(data.colors.textSecondary) root.style.setProperty('--text-secondary', data.colors.textSecondary);
                
                // If bg is solid, set body bg to it instead of #030308
                if(data.colors.bg && data.colors.bg !== 'transparent') {
                    document.body.style.backgroundColor = data.colors.bg;
                    document.getElementById('stars-canvas').style.backgroundColor = data.colors.bg;
                    document.querySelector('.preloader').style.backgroundColor = data.colors.bg;
                }
            }
        }
    } catch (e) {
        console.error('Error fetching config:', e);
    }

    // Set Current Year in Footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // GSAP Preloader & Hero Animation
    const tl = gsap.timeline();

    tl.to(".preloader-text", { opacity: 1, duration: 1, ease: "power2.inOut" })
      .to(".preloader-text", { opacity: 0, duration: 0.8, delay: 0.5, ease: "power2.inOut" })
      .to(".preloader", { y: "-100%", duration: 1, ease: "expo.inOut" }, "-=0.2")
      .to(".hero-anim", { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.2, 
          ease: "power3.out" 
      }, "-=0.5");

    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    // Only init custom cursor if it's a non-touch device
    if (window.matchMedia("(pointer: fine)").matches) {
        let posX = 0, posY = 0;
        let mouseX = 0, mouseY = 0;

        gsap.to({}, 0.016, {
            repeat: -1,
            onRepeat: function() {
                posX += (mouseX - posX) / 9;
                posY += (mouseY - posY) / 9;
                
                gsap.set(follower, {
                    css: {
                        left: posX,
                        top: posY
                    }
                });
                
                gsap.set(cursor, {
                    css: {
                        left: mouseX,
                        top: mouseY
                    }
                });
            }
        });

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Hover effect for links and buttons
        const hoverElements = document.querySelectorAll('a, button, .gallery-item, .detail-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.backgroundColor = 'transparent';
                cursor.style.border = '1px solid var(--gold)';
                follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
                follower.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = 'var(--gold)';
                cursor.style.border = 'none';
                follower.style.transform = 'translate(-50%, -50%) scale(1)';
                follower.style.backgroundColor = 'transparent';
            });
        });
    }

    // Scroll Animations with ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Fade Up Elements
    const fadeUpElements = document.querySelectorAll('.fade-up');
    fadeUpElements.forEach(el => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Parallax Effect for Backgrounds
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.to(".parallax-bg", {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: ".parallax-section",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // Horizontal Scroller Pinning with staggered card animations
        const scrollerContainer = document.querySelector('.scroller-container');
        const scrollerCards = gsap.utils.toArray('.scroller-card');
        
        if (scrollerContainer && scrollerCards.length > 0) {
            let scrollerWidth = scrollerContainer.scrollWidth - window.innerWidth + (window.innerWidth * 0.1); 
            
            // 1. Create the horizontal scroll tween
            gsap.to(scrollerContainer, {
                x: () => -scrollerWidth + "px",
                ease: "none",
                scrollTrigger: {
                    trigger: ".info-scroller",
                    start: "center center",
                    pin: true,
                    scrub: 1,
                    end: () => "+=" + (scrollerContainer.scrollWidth * 1.5)
                }
            });

            // 2. Animate each card coming from the bottom in a sequence (staggered)
            // This guarantees they never pop up at the exact same time
            gsap.set(scrollerCards, { y: 100, opacity: 0 });
            gsap.to(scrollerCards, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.4, // Card 2 waits 0.4s after Card 1, Card 3 waits 0.4s after Card 2
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".info-scroller",
                    start: "center center", // Trigger the sequence exactly when the section pins
                    toggleActions: "play none none reverse"
                }
            });
        }
    }

    // Countdown Logic
    // Set the date we're counting down to
    // You can change this date!
    const countDownDate = new Date("Sep 24, 2026 20:00:00").getTime();

    const x = setInterval(function() {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = days < 10 ? "0" + days : days;
        document.getElementById("hours").textContent = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").textContent = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").textContent = seconds < 10 ? "0" + seconds : seconds;

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("countdown").innerHTML = "<div class='time-box'><span class='time-val'>È arrivato il momento!</span></div>";
        }
    }, 1000);

    // Simple Particles for Hero Background (Keep this subtle)
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 3 + 1;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.position = 'absolute';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = 'rgba(212, 175, 55, ' + (Math.random() * 0.3 + 0.1) + ')';
        particle.style.borderRadius = '50%';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        particlesContainer.appendChild(particle);
        
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            gsap.to(particle, {
                y: y - 100 - Math.random() * 100,
                x: x + (Math.random() * 50 - 25),
                opacity: 0,
                duration: duration,
                delay: delay,
                repeat: -1,
                ease: "none"
            });
        }
    }

    // Interactive Starry Sky Canvas
    const starsCanvas = document.getElementById('stars-canvas');
    if (starsCanvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const ctx = starsCanvas.getContext('2d');
        let width, height;
        let starsArray = [];
        let scrollVelocityY = 0;
        let lastScrollY = window.scrollY;

        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            starsCanvas.width = width;
            starsCanvas.height = height;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Star {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.radius = Math.random() * 1.5 + 0.5;
                this.baseSpeed = (Math.random() * 0.05) + 0.02; // slow constant movement
            }

            update() {
                // Add scroll speed effect to base speed (supports both directions)
                let currentSpeed = this.baseSpeed + (scrollVelocityY * 0.15 * this.radius);
                
                this.y += currentSpeed;

                // Loop stars back to top or bottom depending on direction
                if (this.y > height) {
                    this.y = 0;
                    this.x = Math.random() * width;
                } else if (this.y < 0) {
                    this.y = height;
                    this.x = Math.random() * width;
                }
            }

            draw() {
                ctx.beginPath();
                // Stretching effect (warp speed) depends on absolute velocity
                let stretch = 1 + (Math.abs(scrollVelocityY) * 0.4); 
                ctx.ellipse(this.x, this.y, this.radius, this.radius * stretch, 0, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.radius / 1.5})`;
                ctx.fill();
            }
        }

        // Create stars
        for (let i = 0; i < 250; i++) {
            starsArray.push(new Star());
        }

        // Track scroll velocity
        window.addEventListener('scroll', () => {
            let currentScrollY = window.scrollY;
            let deltaY = currentScrollY - lastScrollY;
            // Keep the sign to know direction (positive = down, negative = up)
            scrollVelocityY = deltaY; 
            lastScrollY = currentScrollY;
        });

        function animateStarsCanvas() {
            // Trail effect (semi-transparent clear)
            ctx.fillStyle = 'rgba(3, 3, 8, 0.4)';
            ctx.fillRect(0, 0, width, height);

            starsArray.forEach(star => {
                star.update();
                star.draw();
            });

            // Gradually decrease scroll effect momentum
            scrollVelocityY *= 0.92;
            if (Math.abs(scrollVelocityY) < 0.1) scrollVelocityY = 0;

            requestAnimationFrame(animateStarsCanvas);
        }

        animateStarsCanvas();
    }
});

