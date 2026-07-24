document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle hamburger icon if using icons
            const icon = navToggle.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = navToggle ? navToggle.querySelector('i') : null;
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // 3. Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const animObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => {
        animObserver.observe(el);
    });

    // 4. Gallery Image Lightbox & Filters (Only runs on gallery page)
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        setupGallery();
    }

    // 5. Contact Form Submission (Only runs on contact page)
    const contactForm = document.getElementById('sngt-contact-form');
    if (contactForm) {
        setupContactForm(contactForm);
    }
});

function setupGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Category Filter
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button styling
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                const itemCats = item.getAttribute('data-categories').split(' ');
                if (category === 'all' || itemCats.includes(category)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Lightbox Creation & Logic
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-overlay"></div>
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="" alt="Full view" class="lightbox-img">
            <p class="lightbox-caption"></p>
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');

    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption h4').innerText;
        
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxCaption.innerText = caption;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop page scroll
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Resume page scroll
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);
}

function setupContactForm(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show submitting animation/message
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';

        // Simulate server request
        setTimeout(() => {
            // Show alert or clean form
            submitBtn.innerHTML = '<i class="fa fa-check"></i> Message Sent!';
            submitBtn.style.backgroundColor = '#27ae60';
            submitBtn.style.color = '#fff';
            
            // Create nice pop-up success alert
            const alertBox = document.createElement('div');
            alertBox.className = 'alert alert-success';
            alertBox.innerHTML = `
                <h4>Thank You!</h4>
                <p>Your message has been successfully sent. The Sree Narayana Gurudeva Trust Nashik representative will contact you soon.</p>
            `;
            form.prepend(alertBox);
            
            form.reset();
            
            setTimeout(() => {
                alertBox.remove();
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.color = '';
            }, 6000);
        }, 1500);
    });
}
