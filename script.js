// Mobile menu + overlay (phone / narrow screens)
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');
const navLinks = document.querySelectorAll('.nav-link');

function getHeaderOffset() {
    const el = document.getElementById('navbar');
    return el ? el.getBoundingClientRect().height : 80;
}

function setMenuOpen(open) {
    navMenu.classList.toggle('active', open);
    mobileMenuToggle.classList.toggle('active', open);
    document.body.classList.toggle('menu-open', open);
    mobileMenuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileMenuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (navOverlay) {
        navOverlay.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
}

function closeMenu() {
    setMenuOpen(false);
}

mobileMenuToggle.addEventListener('click', () => {
    const next = !navMenu.classList.contains('active');
    setMenuOpen(next);
});

if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
        mobileMenuToggle.focus();
    }
});

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 768px)').matches) {
            closeMenu();
        }
    });
});

window.addEventListener('resize', () => {
    if (!window.matchMedia('(max-width: 768px)').matches && navMenu.classList.contains('active')) {
        closeMenu();
    }
});
// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - getHeaderOffset() - 8;
            window.scrollTo({
                top: Math.max(0, offsetTop),
                behavior: 'smooth'
            });
        }
    });
});

// Services & about features (populates sections — was empty on all screen sizes)
const SERVICES = [
    {
        icon: '📱',
        title: 'Phone Repair',
        text: 'Screens, batteries, charging ports, water damage, and more for iPhone, Android, and other smartphones.'
    },
    {
        icon: '💻',
        title: 'Laptop & Computer',
        text: 'Diagnostics, SSD upgrades, keyboard replacements, cooling issues, and software troubleshooting.'
    },
    {
        icon: '📲',
        title: 'Tablet Repair',
        text: 'Glass, displays, batteries, and connectors for iPad and Android tablets.'
    },
    {
        icon: '🎮',
        title: 'Gaming Consoles',
        text: 'HDMI, power, disc drive, overheating, and controller repairs for major console brands.'
    },
    {
        icon: '📺',
        title: 'TV & Monitor',
        text: 'Power, backlight, and board-level repairs where cost-effective for your display.'
    },
    {
        icon: '🔧',
        title: 'Other Electronics',
        text: 'Small electronics and accessories — ask us if we can fix it before you replace it.'
    }
];

const FEATURES = [
    'Free diagnostic estimates on most repairs',
    'Quality parts and professional tools',
    'Fast turnaround on common repairs',
    'Honest recommendations — repair vs. replace'
];

function renderServices() {
    const grid = document.getElementById('services-grid');
    if (!grid) return;
    grid.innerHTML = SERVICES.map(
        (s) =>
            `<article class="service-card">
                <div class="service-icon" aria-hidden="true">${s.icon}</div>
                <h3>${s.title}</h3>
                <p>${s.text}</p>
            </article>`
    ).join('');
}

function renderFeatures() {
    const list = document.getElementById('features-list');
    if (!list) return;
    list.innerHTML = FEATURES.map(
        (f) =>
            `<div class="feature-item">
                <span class="check-icon" aria-hidden="true">✓</span>
                <span>${f}</span>
            </div>`
    ).join('');
}

// Contact form (FormSubmit — works on any static host including Vercel)
const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/smartfixmarshalltx@gmail.com';

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    if (formData.get('company')) {
        return;
    }

    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        message: formData.get('message')
    };

    if (!data.name || !data.email || !data.message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
        const response = await fetch(FORMSUBMIT_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                phone: data.phone || '',
                service: data.service || '',
                message: data.message,
                _subject: 'SmartFix Marshall — Website contact'
            })
        });

        const result = await response.json().catch(() => null);
        if (response.ok && result && result.success) {
            showFormMessage('Thank you! Your message has been sent. We will get back to you soon.', 'success');
            contactForm.reset();
        } else {
            throw new Error((result && result.message) || 'Form submission failed');
        }
    } catch (error) {
        showFormMessage('Sorry, there was an error sending your message. Please try again or call us directly at (903) 578-7629.', 'error');
        console.error('Form submission error:', error);
    } finally {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
});

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';

    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const timeout = type === 'success' ? 5000 : 10000;
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, timeout);
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Phone number formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                value = `(${value}`;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
        e.target.value = value;
    });
}

// Add active class to current section in navigation
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - getHeaderOffset() - 12;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Error handling for images
document.addEventListener('DOMContentLoaded', () => {
    renderServices();
    renderFeatures();

    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });

    // Animate elements on load
    const animatedElements = document.querySelectorAll('.service-card, .info-card, .about-text, .about-image');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
