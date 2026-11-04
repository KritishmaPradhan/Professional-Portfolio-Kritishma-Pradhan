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

// Contact form submission

const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

const API_URL =
  "https://portfolio-contact-api.pradhankritishma.workers.dev/contact";

contactForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const submitButton = contactForm.querySelector(
    'button[type="submit"]'
  );

  // Collect form data
  const formData = new FormData(contactForm);

  const payload = {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    subject: String(formData.get("subject") || "").trim(),
    message: String(formData.get("message") || "").trim()
  };

  // Prevent duplicate submissions
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  contactStatus.textContent = "Sending your message...";

  try {
    // Send data to Cloudflare Worker
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Unable to send your message."
      );
    }

    // Success
    contactStatus.textContent =
      "Thank you! Your message has been sent successfully.";

    contactForm.reset();

  } catch (error) {
    console.error("Contact form error:", error);

    contactStatus.textContent =
      error.message || "Something went wrong. Please try again.";

  } finally {
    // Restore button
    submitButton.disabled = false;
    submitButton.textContent = "Send Message";
  }
});


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
    const gallery = document.querySelector('#achievements .gallery-grid');
    const items = gallery?.querySelectorAll('.gallery-item') || [];
    if (!items.length) return;

    const moreBtn = document.querySelector('#achievements .gallery-more-btn');
    if (moreBtn) {
        moreBtn.addEventListener('click', () => {
            const isExpanded = moreBtn.getAttribute('aria-expanded') === 'true';
            items.forEach((item, index) => {
                if (index >= 3) item.hidden = isExpanded;
            });
            moreBtn.setAttribute('aria-expanded', String(!isExpanded));
            moreBtn.innerHTML = isExpanded
                ? 'More <i class="fas fa-chevron-down" aria-hidden="true"></i>'
                : 'Less <i class="fas fa-chevron-up" aria-hidden="true"></i>';
        });
    }

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

// Creativity Toggle Functionality with Lightbox
const initCreativityToggle = () => {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const galleries = document.querySelectorAll('.creativity-gallery');

    // Create lightbox for creativity items
    const creativityLightbox = document.createElement('div');
    creativityLightbox.className = 'creativity-lightbox';
    creativityLightbox.innerHTML = `
        <div class="creativity-lightbox-content">
            <button class="creativity-lightbox-close" type="button" aria-label="Close preview">&times;</button>
            <img src="" alt="Design preview">
            <p class="creativity-lightbox-caption"></p>
        </div>
    `;
    document.body.appendChild(creativityLightbox);

    const closeLightboxBtn = creativityLightbox.querySelector('.creativity-lightbox-close');
    const lightboxImg = creativityLightbox.querySelector('img');
    const lightboxCaption = creativityLightbox.querySelector('.creativity-lightbox-caption');

    const closeCreativityLightbox = () => {
        creativityLightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Add click handlers to creativity items
    const addLightboxHandlers = () => {
        const creativityItems = document.querySelectorAll('.creativity-item');
        creativityItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const caption = item.querySelector('p');
                if (!img) return;

                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || 'Design';
                lightboxCaption.textContent = caption ? caption.textContent : 'Design';
                creativityLightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    };

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');

            // Remove active class from all buttons
            toggleBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            // Hide all galleries
            galleries.forEach(gallery => {
                gallery.style.display = 'none';
            });

            // Show selected gallery
            const selectedGallery = document.getElementById(`${category}-gallery`);
            if (selectedGallery) {
                selectedGallery.style.display = 'grid';
                // Re-attach click handlers when gallery is shown
                setTimeout(addLightboxHandlers, 0);
            }
        });
    });

    // Lightbox close handlers
    closeLightboxBtn.addEventListener('click', closeCreativityLightbox);
    creativityLightbox.addEventListener('click', e => {
        if (e.target === creativityLightbox) closeCreativityLightbox();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && creativityLightbox.classList.contains('active')) {
            closeCreativityLightbox();
        }
    });

    // Initial setup
    addLightboxHandlers();
};

initCreativityToggle(); 

// Portfolio chatbot
const initPortfolioChatbot = () => {
    const chatbot = document.getElementById('portfolio-chatbot');
    if (!chatbot) return;

    const toggle = document.getElementById('portfolio-chatbot-toggle');
    const close = document.getElementById('portfolio-chatbot-close');
    const panel = document.getElementById('portfolio-chatbot-panel');
    const messages = document.getElementById('portfolio-chatbot-messages');
    const form = document.getElementById('portfolio-chatbot-form');
    const input = document.getElementById('portfolio-chatbot-input');
    const suggestions = document.getElementById('portfolio-chatbot-suggestions');

    const knowledgeBase = [
        { topic: "About me", text: "I'm a computer engineer who enjoys building web apps and learning about AI. I'm open to freelance and full-time opportunities." },
        { topic: "Projects", text: "My featured projects include Hastakala by K, an ecommerce website for a small crochet business; FindIt, a lost and found system built with Laravel, MySQL, and React; and Brainy Snake Game, a quiz-based Snake game built with Python, Turtle, and SQLite. I also create Figma prototypes, graphic designs, and logos." },
        { topic: "Project", text: "My featured projects include Hastakala by K, an ecommerce website for a small crochet business; FindIt, a lost and found system built with Laravel, MySQL, and React; and Brainy Snake Game, a quiz-based Snake game built with Python, Turtle, and SQLite." },
        { topic: "Skills", text: "My core skills are JavaScript, Python, HTML/CSS, React, and I'm currently learning about machine learning and Data science." },
        { topic: "Experience", text: "I've worked as a full stack developer(laravel/React), freelancing design projects" },
        { topic: "Educational", text: "I studied Computer Science from Purbanchal University and have since focused on self-directed learning in web development and applied AI." },
        { topic: "Available", text: "I'm currently open to new opportunities, both freelance projects and full-time roles." },
        { topic: "About me", text: "I'm Kritishma Pradhan, a passionate computer engineering student and aspiring developer from Nepal. I have a strong interest in programming, frontend development, embedded systems, machine learning, data science, and creative design." },
        { topic: "Kritishma Pradhan", text: "My full name is Kritishma Pradhan. I am a computer engineering student who is eager to explore the computer world, improve my technical abilities, and contribute to innovative projects." },
        { topic: "Career interests", text: "I am interested in programming, web development, frontend development, backend development, embedded systems, artificial intelligence, machine learning, data science, graphic design, and creative technology projects." },
        { topic: "Education", text: "I am pursuing a Bachelor of Computer Engineering at Acme Engineering College under Purbanchal University." },
        { topic: "Relevant coursework", text: "My relevant coursework includes Data Structures and Algorithms, Artificial Intelligence, Operating Systems, Microprocessor, Data Mining, and Object-Oriented Programming." },
        { topic: "Programming skills", text: "My programming skills include Python with Django, HTML, CSS, JavaScript, C, C++, SQL, and data analysis." },
        { topic: "Design and creativity skills", text: "My design and creativity skills include Adobe Photoshop, Canva, Inkscape, graphic design, and Figma." },
        { topic: "Hardware and IoT skills", text: "I have experience with Arduino Uno and Cisco Packet Tracer, and I am interested in embedded systems and microcontroller programming." },
        { topic: "Tools and platforms", text: "I use Git, GitHub, Visual Studio Code, Google Colab, and Orange Data Mining." },
        { topic: "Hastakala by K", text: "Hastakala by K is an ecommerce website created for a small crochet business. The project uses HTML, CSS, JavaScript, and Python with Django. It includes a static live demo and an ecommerce platform source code repository." },
        { topic: "Hastakala by K links", text: "The Hastakala by K static site is available at https://kritishmapradhan.github.io/hastakalabyk-website-for-crochet-brand/. The ecommerce platform source code is available at https://github.com/KritishmaPradhan/Hastakala-by-K-e-commerce-platform.git." },
        { topic: "Lost and Found System", text: "Lost and Found System, also called FindIt, is a full-stack web application for schools and colleges. It allows students to report lost or found items and connect through real-time private chat. The project uses Laravel with PHP, MySQL, and React JS." },
        { topic: "FindIt project link", text: "The FindIt Lost and Found System source code is available at https://github.com/KritishmaPradhan/Lost-and-Found-Tracker---FindIT-Laravel-ReactJS-Project.git." },
        { topic: "Brainy Snake Game", text: "Brainy Snake Game is a retro-inspired Snake game with quiz-based gameplay and a user and admin authentication system. It was built using Python, Turtle, and SQLite." },
        { topic: "Brainy Snake Game link", text: "The Brainy Snake Game source code is available at https://github.com/KritishmaPradhan/The-Brainy-snake-game." },
        { topic: "Figma designs", text: "My Figma design projects include a UI/UX digital brochure called Visit Nepal, a personal digital diary design featuring travel, food, and creative experiences, and a real estate admin panel prototype called Basobas." },
        { topic: "Visit Nepal design", text: "Visit Nepal is a UI/UX digital brochure prototype created in Figma." },
        { topic: "Digital Diary design", text: "Digital Diary is a personal digital journal design focused on travel, food, and creative experiences." },
        { topic: "Basobas design", text: "Basobas is a real estate admin panel web dashboard design prototype created in Figma." },
        { topic: "Creative work", text: "My creative work includes Canva designs, Inkscape designs, graphic design projects, and logo designs. I have created designs inspired by projects such as Claude, Orange, Starbucks, Visit Nepal, Ethical Pink, Kamal, ACIT, Saranz, and the Brainy Snake Game." },
        { topic: "Arduino IDE training", text: "Through an Arduino IDE training program, I gained hands-on experience with microcontroller programming and embedded systems." },
        { topic: "Machine learning and data science training", text: "I completed machine learning and data science training where I learned the basics of machine learning algorithms with Data Science." },
        { topic: "Coding competitions", text: "I have participated in coding competitions and various coding challenges to improve my problem-solving skills." },
        { topic: "Technical exhibitions", text: "I have participated in and volunteered at technical exhibitions showcasing innovative projects." },
        { topic: "Event organization", text: "I have organized and marketed events, volunteered, presented hackathon project demos, and participated in tech debates." },
        { topic: "Design competitions", text: "I have participated in design competitions and completed basic graphic design training." },
        { topic: "Creative writing", text: "I have developed and curated literary content through personal writing projects and web publishing practice." },
        { topic: "Achievements and certifications", text: "My achievements and certifications include organizing the Jyoti ACIT Tech Expo 2023, participating in ACIT Design Blitz 2023, organizing ACIT Tech Fest 2.0 in 2025, completing Early Learning Skills training in 2014, completing an Edu-Com course on Excel, PowerPoint, email, and internet skills, earning a Nepal Scout Certificate of Accomplishment, and participating in the Aarohan 2.0 Coding Competition in 2024." },
        { topic: "ACIT Tech Fest", text: "I participated as an organizer in ACIT Tech Fest 2.0 in 2025." },
        { topic: "Contact", text: "I am based in Nepal. My email address is pradhankritishma@gmail.com and my phone number is +977 9864540394." },
        { topic: "GitHub", text: "My GitHub profile is available at https://github.com/KritishmaPradhan." },
        { topic: "LinkedIn", text: "My LinkedIn profile is available at https://linkedin.com/in/kritishma-pradhan-8181b1293." }
    ];

    const tokenize = text => text.toLowerCase().match(/[a-z0-9']+/g) || [];
    const intentRules = [
        { keywords: ['project', 'projects', 'portfolio', 'built', 'developed'], topic: 'Projects' },
        { keywords: ['skill', 'skills', 'technology', 'technologies', 'programming'], topic: 'Skills' },
        { keywords: ['available', 'availability', 'freelance', 'hire', 'hiring', 'opportunity', 'opportunities'], topic: 'Available' },
        { keywords: ['education', 'educational', 'study', 'studied', 'degree', 'coursework'], topic: 'Educational' },
        { keywords: ['contact', 'email', 'phone', 'reach'], topic: 'Contact' },
        { keywords: ['github'], topic: 'GitHub' },
        { keywords: ['linkedin'], topic: 'LinkedIn' }
    ];
    const docTokens = knowledgeBase.map(doc => tokenize(`${doc.text} ${doc.topic}`));
    const documentFrequency = {};
    docTokens.forEach(tokens => new Set(tokens).forEach(token => {
        documentFrequency[token] = (documentFrequency[token] || 0) + 1;
    }));

    const findIntentMatch = question => {
        const queryTokens = new Set(tokenize(question));
        const rule = intentRules.find(candidate =>
            candidate.keywords.some(keyword => queryTokens.has(keyword))
        );
        if (!rule) return null;

        const index = knowledgeBase.findIndex(doc => doc.topic === rule.topic);
        return index === -1 ? null : { index, score: 10 };
    };

    const findBestMatch = question => {
        const intentMatch = findIntentMatch(question);
        if (intentMatch) return intentMatch;

        const queryTokens = tokenize(question);
        let best = { index: -1, score: 0 };
        docTokens.forEach((tokens, index) => {
            const tokenSet = new Set(tokens);
            const score = queryTokens.reduce((total, token) => {
                if (!tokenSet.has(token)) return total;
                return total + Math.log((knowledgeBase.length + 1) / ((documentFrequency[token] || 0) + 1)) + 1;
            }, 0);
            if (score > best.score) best = { index, score };
        });
        return best;
    };

    const addMessage = (text, sender, topic) => {
        const message = document.createElement('div');
        message.className = `portfolio-chatbot-message ${sender}`;
        message.textContent = text;
        if (topic) {
            const score = document.createElement('span');
            score.className = 'portfolio-chatbot-score';
            score.textContent = `matched topic: ${topic}`;
            message.appendChild(score);
        }
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    };

    const respondTo = question => {
        addMessage(question, 'user');
        const best = findBestMatch(question);
        if (best.index === -1 || best.score < 1.2) {
            addMessage("I don't have specific info on that yet - feel free to reach out through the contact form!", 'bot');
        } else {
            const answer = knowledgeBase[best.index];
            addMessage(answer.text, 'bot', answer.topic);
        }
    };

    const setOpen = isOpen => {
        chatbot.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Close portfolio chatbot' : 'Open portfolio chatbot');
        panel.setAttribute('aria-hidden', String(!isOpen));
        if (isOpen) input.focus();
    };

    toggle.addEventListener('click', () => setOpen(!chatbot.classList.contains('is-open')));
    close.addEventListener('click', () => setOpen(false));
    form.addEventListener('submit', event => {
        event.preventDefault();
        const question = input.value.trim();
        if (!question) return;
        respondTo(question);
        input.value = '';
    });

    ['Give an overview of your projects', 'What are your skills?', 'Are you available for work?'].forEach(question => {
        const chip = document.createElement('button');
        chip.className = 'portfolio-chatbot-chip';
        chip.type = 'button';
        chip.textContent = question;
        chip.addEventListener('click', () => respondTo(question));
        suggestions.appendChild(chip);
    });

    addMessage('Hi! Ask me anything about this portfolio.', 'bot');
};

initPortfolioChatbot();
