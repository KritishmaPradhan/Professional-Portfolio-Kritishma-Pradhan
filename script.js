// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

//omit form submission code for now
// // Form submission
// const contactForm = document.getElementById('contact-form');
// if (contactForm) {
//     contactForm.addEventListener('submit', function(e) {
//         e.preventDefault();
        
//         // Get form data
//         const formData = new FormData(this);
//         const name = formData.get('name');
//         const email = formData.get('email');
//         const subject = formData.get('subject');
//         const message = formData.get('message');
        
//         // Here you would typically send the form data to a server
//         // For now, we'll just show an alert
//         alert(`Thank you for your message, ${name}! I'll get back to you soon at ${email}.`);
//         this.reset();
//     });
// }

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.skill-category, .project-card, .experience-item');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial state for animation
document.addEventListener('DOMContentLoaded', () => {
    // Add animation to skill cards, project cards, and experience items
    const animatedElements = document.querySelectorAll('.skill-category, .project-card, .experience-item');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    // Trigger animation on page load
    setTimeout(() => {
        animateOnScroll();
    }, 300);
});

// Add scroll event listener for animation
window.addEventListener('scroll', animateOnScroll);

// Add active class to current section in navigation
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksItems.forEach(li => {
        li.querySelector('a').classList.remove('active');
        if (li.querySelector('a').getAttribute('href') === `#${current}`) {
            li.querySelector('a').classList.add('active');
        }
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Interactive tilt/spotlight effect for skill cards
const skillCards = document.querySelectorAll('.skill-category');

skillCards.forEach(card => {
    const maxTilt = 7;

    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * (maxTilt * 2);
        const rotateX = (0.5 - (y / rect.height)) * (maxTilt * 2);

        card.style.transform = `translateY(-8px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Automatic carousel for Experience & Activities
const initExperienceCarousel = () => {
    const viewport = document.querySelector('.experience-carousel');
    const track = document.querySelector('.experience-grid');
    if (!viewport || !track) return;

    const cards = Array.from(track.children);
    if (cards.length < 2) return;

    let rafId = null;
    let angle = 0;
    let speed = 0.22;
    let radius = 420;
    let paused = false;

    const setup = () => {
        const viewportWidth = viewport.clientWidth;
        const itemWidth = Math.max(220, Math.min(360, viewportWidth * 0.52));
        
        // Responsive radius and height calculation
        let responsiveRadius;
        let containerHeight;
        
        if (viewportWidth <= 480) {
            responsiveRadius = Math.max(320, itemWidth * 1.15);
            containerHeight = 420;
            speed = 0.28;
        } else if (viewportWidth <= 768) {
            responsiveRadius = Math.max(360, itemWidth * 1.22);
            containerHeight = 380;
            speed = 0.25;
        } else if (viewportWidth <= 1024) {
            responsiveRadius = Math.max(340, itemWidth * 1.28);
            containerHeight = 380;
            speed = 0.22;
        } else {
            responsiveRadius = Math.max(380, itemWidth * 1.32);
            containerHeight = 420;
            speed = 0.22;
        }
        
        radius = responsiveRadius;
        
        track.style.setProperty('--exp-item-width', `${itemWidth}px`);
        track.style.height = `${containerHeight}px`;
        track.style.minHeight = `${containerHeight}px`;
        viewport.style.minHeight = `${containerHeight + 80}px`;

        const stepAngle = 360 / cards.length;
        cards.forEach((card, index) => {
            const baseAngle = stepAngle * index;
            card.dataset.baseAngle = `${baseAngle}`;
        });
    };

    const tick = () => {
        if (!paused) {
            angle = (angle + speed) % 360;
        }

        track.style.transform = `translateZ(-${radius}px) rotateY(${-angle.toFixed(3)}deg)`;

        cards.forEach(card => {
            const baseAngle = parseFloat(card.dataset.baseAngle || '0');
            const relative = (((baseAngle - angle) % 360) + 360) % 360;
            const radians = (relative * Math.PI) / 180;
            const frontness = (Math.cos(radians) + 1) / 2;
            const scale = 0.58 + (frontness * 0.54);
            
            // Responsive Y offset - reduced on mobile
            const viewportWidth = viewport.clientWidth;
            const maxYOffset = viewportWidth <= 768 ? 50 : 70;
            const y = (1 - frontness) * maxYOffset;
            
            const opacity = 0.28 + (frontness * 0.72);
            const blur = (1 - frontness) * 2.2;

            card.style.transform = `translateX(-50%) translateY(${y.toFixed(2)}px) rotateY(${baseAngle.toFixed(3)}deg) translateZ(${radius.toFixed(2)}px) scale(${scale.toFixed(3)})`;
            card.style.opacity = opacity.toFixed(3);
            card.style.filter = `blur(${blur.toFixed(2)}px)`;
            card.style.zIndex = `${Math.round(frontness * 100)}`;
        });

        rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
    };

    const start = () => {
        if (!rafId) {
            rafId = requestAnimationFrame(tick);
        }
    };

    viewport.addEventListener('mouseenter', () => {
        paused = true;
    });
    viewport.addEventListener('mouseleave', () => {
        paused = false;
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            stop();
            setup();
            start();
        }, 200);
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop();
        else start();
    });

    setup();
    start();
};

initExperienceCarousel();

// Dynamic Achievements section (filters + lightbox)
const initAchievementsSection = () => {
    const items = document.querySelectorAll('.gallery-item');
    if (!items.length) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox';
    lightbox.innerHTML = `
        <div class="gallery-lightbox-content">
            <button class="gallery-lightbox-close" type="button" aria-label="Close preview">&times;</button>
            <img src="" alt="Achievement preview">
            <p class="gallery-lightbox-caption"></p>
        </div>
    `;
    document.body.appendChild(lightbox);

    const closeBtn = lightbox.querySelector('.gallery-lightbox-close');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.gallery-lightbox-caption');

    items.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const desc = item.querySelector('.description');
            if (!img || !desc) return;

            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || 'Achievement';
            lightboxCaption.textContent = desc.textContent || '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
};

initAchievementsSection();
