/* Interactive Script - Team Vayusat Website */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Navigation Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Mobile Navigation Drawer
    const menuBtn = document.getElementById('menuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    const toggleDrawer = () => {
        menuBtn.classList.toggle('active');
        mobileDrawer.classList.toggle('active');
        document.body.style.overflow = mobileDrawer.classList.contains('active') ? 'hidden' : '';
    };

    menuBtn.addEventListener('click', toggleDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileDrawer.classList.contains('active')) {
                toggleDrawer();
            }
        });
    });

    // 4. Stellar Background Canvas Starfield
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    
    let stars = [];
    const starCount = window.innerWidth < 768 ? 75 : 175;
    let mouse = { x: null, y: null, targetX: 0, targetY: 0 };

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars();
    };

    const initStars = () => {
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.25,
                opacity: Math.random() * 0.7 + 0.1,
                speedX: (Math.random() - 0.5) * 0.12,
                speedY: (Math.random() - 0.5) * 0.12,
                depth: Math.random() * 3 + 1 // depth factor for parallax
            });
        }
    };

    const drawStars = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw ambient background space gradient
        const spaceGrad = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
        );
        spaceGrad.addColorStop(0, '#0c142c');
        spaceGrad.addColorStop(0.5, '#050914');
        spaceGrad.addColorStop(1, '#03050c');
        ctx.fillStyle = spaceGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Smooth mouse position for parallax
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // Draw and update stars
        stars.forEach(star => {
            // Add subtle mouse parallax offset based on depth
            const parallaxX = mouse.x * 0.03 * star.depth;
            const parallaxY = mouse.y * 0.03 * star.depth;

            ctx.beginPath();
            ctx.arc(star.x + parallaxX, star.y + parallaxY, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            
            // Draw glow for slightly larger stars
            if (star.radius > 1.2) {
                ctx.shadowBlur = 4;
                ctx.shadowColor = '#00f0ff';
            } else {
                ctx.shadowBlur = 0;
            }
            
            ctx.fill();

            // Drift movement
            star.x += star.speedX;
            star.y += star.speedY;

            // Boundary wrapping
            if (star.x < 0) star.x = canvas.width;
            if (star.x > canvas.width) star.x = 0;
            if (star.y < 0) star.y = canvas.height;
            if (star.y > canvas.height) star.y = 0;
        });

        requestAnimationFrame(drawStars);
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
        // Map mouse position centered around origin (0, 0)
        mouse.targetX = e.clientX - window.innerWidth / 2;
        mouse.targetY = e.clientY - window.innerHeight / 2;
    });

    resizeCanvas();
    drawStars();

    // 5. Scroll Animations (Intersection Observer)
    const animScrollItems = document.querySelectorAll('.animate-scroll');
    
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animScrollItems.forEach(item => {
        scrollObserver.observe(item);
    });

    // 6. Stats Counter Animation
    const counterElements = document.querySelectorAll('.metric-val');
    let countersTriggered = false;

    const runCounters = () => {
        if (countersTriggered) return;
        countersTriggered = true;

        counterElements.forEach(element => {
            const target = parseFloat(element.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const stepTime = 15; // 15ms interval
            const steps = duration / stepTime;
            let current = 0;
            const increment = target / steps;

            const updateCounter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target % 1 === 0 ? target : target.toFixed(1);
                    clearInterval(updateCounter);
                } else {
                    element.textContent = target % 1 === 0 ? Math.floor(current) : current.toFixed(1);
                }
            }, stepTime);
        });
    };

    const statsSection = document.querySelector('.metrics-container');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                runCounters();
                statsObserver.unobserve(statsSection);
            }
        }, {
            threshold: 0.2
        });
        
        statsObserver.observe(statsSection);
    }

    // 7. Mock Contact Form Submission Interactivity
    window.handleFormSubmit = (event) => {
        event.preventDefault();
        
        const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const successToast = document.getElementById('formToast');
        
        // Grab values
        const nameVal = document.getElementById('name').value;
        const emailVal = document.getElementById('email').value;
        const subjectVal = document.getElementById('subject').value;
        const messageVal = document.getElementById('message').value;

        console.log('Sending message:', { nameVal, emailVal, subjectVal, messageVal });

        // Button sending state
        submitBtn.disabled = true;
        const origBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <span>Beaming Signals...</span>
            <i data-lucide="loader" class="badge-icon" style="animation: rotateSlow 2s linear infinite"></i>
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Simulate transmission delay (1.2s)
        setTimeout(() => {
            // Activate success toast with beautiful glass sliding transition
            successToast.classList.add('active');
            
            // Re-render check icon inside toast
            if (typeof lucide !== 'undefined') lucide.createIcons();
            
            // Reset form values
            form.reset();

            // Hide toast after 5 seconds and reset button
            setTimeout(() => {
                successToast.classList.remove('active');
                submitBtn.disabled = false;
                submitBtn.innerHTML = origBtnText;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }, 5000);

        }, 1200);
    };

    // 8. Media Gallery Lightbox Carousel
    const galleryPhotos = [
        {
            src: 'assets/gallery1.jpg',
            caption: 'CanSat 7U Cylinder Structure & Avionics Integration'
        },
        {
            src: 'assets/gallery2.jpg',
            caption: 'High-Fidelity Model Rocket Standing in Aerospace Department'
        },
        {
            src: 'assets/gallery3.jpg',
            caption: 'Technical Briefing & Rocket Review with Project Mentor'
        },
        {
            src: 'assets/gallery4.jpg',
            caption: 'Field Parachute Calibration & Recovery Deployment Setup'
        },
        {
            src: 'assets/gallery5.jpg',
            caption: 'Team Vayusat at IN-SPACe Model Rocketry Competition National Site'
        },
        {
            src: 'assets/gallery6.jpg',
            caption: 'Model Rocket Nosecone Approved Seal (Thrust Tech India)'
        },
        {
            src: 'assets/gallery7.jpg',
            caption: 'Team Selfie Outdoors next to Digital Twin Rocket Model'
        },
        {
            src: 'assets/gallery8.jpg',
            caption: 'Fin Calibration & Assembly Adjustments under Project Canopy'
        },
        {
            src: 'assets/gallery9.jpg',
            caption: 'Team Vayusat in Hangar Pavilion during Pre-Launch Stage'
        },
        {
            src: 'assets/gallery10.jpg',
            caption: 'Solid Propulsion Model Rocket Display (Dassault Systemes & DSU)'
        },
        {
            src: 'assets/gallery11.jpg',
            caption: 'DSU Rocket Standing on Thrust Tech India Launch Pad Rail'
        },
        {
            src: 'assets/gallery12.jpg',
            caption: 'Team Vayusat Receiving Competition National Runner-Up Award'
        },
        {
            src: 'assets/gallery13.jpg',
            caption: 'Team Vayusat posing with LUNA MK-III Rocket on Launch Rail'
        },
        {
            src: 'assets/gallery14.jpg',
            caption: 'National Model Rocketry Exhibition Stand with Multi-Coloured Prototypes'
        },
        {
            src: 'assets/gallery15.jpg',
            caption: 'DSU Team and Dignitaries at the Aerospace Innovation Symposium'
        },
        {
            src: 'assets/gallery16.jpg',
            caption: 'Ground Station Live Launch Monitoring & Telemetry Feeds'
        },
        {
            src: 'assets/gallery17.jpg',
            caption: 'Technical Evaluation & 7U CanSat Presentation to Competition Jury'
        },
        {
            src: 'assets/gallery18.jpg',
            caption: '3D-Printed Yellow CanSat Model & Recovery Parachute Assembly'
        },
        {
            src: 'assets/gallery19.jpg',
            caption: 'Luna MK-III Open Avionics Bay & Payload Wire Audit'
        },
        {
            src: 'assets/gallery20.jpg',
            caption: 'IN-SPACe CanSat India Student Competition National 2nd Place Trophy'
        },
        {
            src: 'assets/gallery21.jpg',
            caption: 'Red 7U CanSat Model showing deployable landing legs, table setup'
        },
        {
            src: 'assets/gallery22.jpg',
            caption: 'Team Vayusat Stage Celebration holding the National Trophy Award'
        }
    ];

    let currentPhotoIndex = 0;
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');

    window.openLightbox = (index) => {
        currentPhotoIndex = index;
        updateLightboxContent();
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = (event) => {
        if (event) {
            const isOverlay = event.target === lightboxModal;
            const isCloseBtn = event.target.closest('.lightbox-close-btn');
            if (!isOverlay && !isCloseBtn) return;
        }
        lightboxModal.classList.remove('active');
        if (!mobileDrawer.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    };

    window.navigateLightbox = (direction, event) => {
        if (event) event.stopPropagation();
        currentPhotoIndex = (currentPhotoIndex + direction + galleryPhotos.length) % galleryPhotos.length;
        updateLightboxContent();
    };

    const updateLightboxContent = () => {
        if (!lightboxImg || !lightboxCaption) return;
        
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            const photo = galleryPhotos[currentPhotoIndex];
            lightboxImg.src = photo.src;
            lightboxImg.alt = photo.caption;
            lightboxCaption.textContent = photo.caption;
            
            lightboxImg.onload = () => {
                lightboxImg.style.opacity = '1';
                lightboxImg.style.transform = 'scale(1)';
            };
        }, 150);
    };

    // Keyboard support for Lightbox
    window.addEventListener('keydown', (e) => {
        if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        }
    });
});
