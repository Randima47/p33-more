// IMAGE MODAL ZOOM (supports both grid and detail images)
document.querySelectorAll('.service-img, .service-detail-img').forEach(img => {
  img.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    Object.assign(modal.style, {
      display: 'flex',
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.8)',
      cursor: 'zoom-out'
    });

    const zoomedImg = document.createElement('img');
    zoomedImg.src = img.src;
    zoomedImg.alt = img.alt;
    zoomedImg.style.maxWidth = '90%';
    zoomedImg.style.maxHeight = '90%';

    modal.appendChild(zoomedImg);
    document.body.appendChild(modal);

    modal.addEventListener('click', () => modal.remove());
  });
});

// STRICT FORM VALIDATION + SUCCESS + CONDITIONAL REDIRECT
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const errorBox = form.querySelector('#formErrors');
    if (errorBox) {
      errorBox.innerHTML = '';
      errorBox.style.display = 'none';
    }

    const addError = msg => {
      if (errorBox) {
        errorBox.innerHTML += `<p>${msg}</p>`;
        errorBox.style.display = 'block';
      } else {
        alert(msg);
      }
    };

    form.querySelectorAll('input, textarea, select').forEach(el => {
      el.style.borderColor = '';
      el.setAttribute('aria-invalid', 'false');
    });

    let valid = true;
    const setInvalid = (el, msg) => {
      valid = false;
      el.style.borderColor = 'red';
      el.setAttribute('aria-invalid', 'true');
      addError(msg);
      el.focus();
    };

    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const phone = form.querySelector('#phone');
    const message = form.querySelector('#message');
    const interest = form.querySelector('#interest');
    const typeSelect = form.querySelector('#type');
    const dateInput = form.querySelector('#date');

    // Name validation
    if (name) {
      const v = (name.value || '').trim();
      if (v.length < 2) {
        setInvalid(name, 'Full name must be at least 2 characters.');
      } else if (!/^[\p{L}][\p{L}\s'-]{1,}$/u.test(v)) {
        setInvalid(name, 'Full name must contain only letters and valid separators.');
      }
    }

    // Helper: Gmail-only validation + typo correction
    function isValidEmail(email) {
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
      if (!gmailRegex.test(email)) {
        const domain = email.split('@')[1]?.toLowerCase();
        const commonTypos = {
          "gamil.com": "gmail.com",
          "gmial.com": "gmail.com",
          "gnail.com": "gmail.com",
          "gmail.co": "gmail.com"
        };
        if (commonTypos[domain]) {
          return {
            valid: false,
            message: `Did you mean ${email.split('@')[0]}@${commonTypos[domain]}?`
          };
        }
        return { valid: false, message: " Please check your email, and try again." };
      }
      return { valid: true, message: "Valid email." };
    }

    // Email validation inside your form submit handler
    if (email) {
      const v = (email.value || '').trim();
      if (!v) {
        setInvalid(email, 'Email is required.');
      } else {
        const result = isValidEmail(v);
        if (!result.valid) {
          setInvalid(email, result.message);
        }
      }
    }

    // Phone validation
    if (phone) {
      const v = (phone.value || '').trim();
      if (!v) setInvalid(phone, 'Please enter a valid phone number.');
      else if (!/^\d{10,15}$/.test(v)) setInvalid(phone, 'Phone number must be 10–15 digits.');
    }

    if (typeSelect) {
      const v = (typeSelect.value || '').trim();
      if (!v) setInvalid(typeSelect, 'Please select a message type.');
    }

    if (interest) {
      const v = (interest.value || '').trim();
      if (!v) setInvalid(interest, 'Please select an area of interest.');
    }

    if (message) {
      const v = (message.value || '').trim();
      if (!v) setInvalid(message, 'Please enter your message.');
      else if (v.length < 10) setInvalid(message, 'Message must be at least 10 characters.');
    }

    if (dateInput) {
      const v = (dateInput.value || '').trim();
      if (!v) setInvalid(dateInput, 'Please select a date.');
      else {
        const selectedDate = new Date(v);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (Number.isNaN(selectedDate.getTime())) setInvalid(dateInput, 'Invalid date format.');
        else if (selectedDate < today) setInvalid(dateInput, 'check your date and try again.');
      }
    }

    if (!valid) return;

    const successMsg = form.querySelector('#form-success') || document.getElementById('form-success');
    const successText = form.getAttribute('data-success') || 'Form submitted successfully!';
    if (successMsg) {
      successMsg.style.display = 'block';
      successMsg.textContent = successText;
    } else {
      alert(successText);
    }

    const rawTarget = interest ? (interest.value || '').trim() : '';
    if (rawTarget) {
      const resolver = document.createElement('a');
      resolver.href = rawTarget;
      const absoluteTarget = resolver.href;

      setTimeout(() => {
        if (successMsg) successMsg.style.display = 'none';
        try {
          window.location.assign(absoluteTarget);
        } catch (err) {
          addError(`Could not navigate to ${rawTarget}. Check the path or filename.`);
          console.error('Navigation error:', err);
        }
      }, 1500);
    } else {
      setTimeout(() => {
        if (successMsg) successMsg.style.display = 'none';
      }, 2000);
    }
  });
});

// SITE SEARCH FUNCTIONALITY WITH DROPDOWN
function searchSite() {
  const dropdownEl = document.getElementById('searchSelect');
  const inputEl = document.getElementById('searchInput');
  const keyword = (dropdownEl?.value || inputEl?.value || '').toLowerCase();
  const results = document.getElementById('searchResults');
  if (!results) return;
  results.innerHTML = '';

  const pages = [
    { title: 'Web Development', url: 'web dev.html', keywords: ['web', 'development', 'responsive', 'design'] },
    { title: 'App Development', url: 'app dev.html', keywords: ['app', 'mobile', 'development'] },
    { title: 'Brand Strategy', url: 'brand strategy.html', keywords: ['brand', 'strategy', 'identity'] },
    { title: 'Content Creation', url: 'content creation.html', keywords: ['content', 'creation', 'media'] },
    { title: 'Our Story', url: 'our story.html', keywords: ['story', 'founder', 'journey'] },
    { title: 'Bookings', url: 'bookings.html', keywords: ['book', 'appointment'] },
    { title: 'About Us', url: 'Pages/about.html', keywords: ['about', 'team', 'mission'] },
    { title: 'Services', url: 'Pages/service.html', keywords: ['services', 'offerings'] },
    { title: 'Contact', url: 'Pages/contact.html', keywords: ['contact', 'email', 'phone'] },
    { title: 'Enquiry', url: 'Pages/enquiry.html', keywords: ['enquiry', 'form', 'questions'] }
  ];

  const matches = pages.filter(page => page.keywords.some(k => keyword.includes(k) || k.includes(keyword)));

  if (matches.length === 0) {
    results.innerHTML = '<li>No results found.</li>';
  } else {
    matches.forEach(match => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${match.url}">${match.title}</a>`;
      results.appendChild(li);
    });
  }
}

// AUTO-UPDATE FOOTER YEAR
document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

// ACCORDION TOGGLE FUNCTIONALITY WITH ICON ROTATION
document.querySelectorAll('.accordion-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));

    const content = button.nextElementSibling;
    if (content) {
      content.classList.toggle('expanded', !expanded);
    }

    const icon = button.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-chevron-down', expanded);
      icon.classList.toggle('fa-chevron-up', !expanded);
    }
  });
});
// LIVE DATE AND TIME DISPLAY
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  const formatted = now.toLocaleString('en-ZA', options);
  const datetimeElement = document.getElementById('datetime');
  if (datetimeElement) {
    datetimeElement.textContent = `- ${formatted}`;
  }
}
setInterval(updateDateTime, 1000);
updateDateTime();


// READ MORE TOGGLE
document.querySelectorAll('.read-more-btn').forEach(button => {
  button.addEventListener('click', () => {
    const extended = button.nextElementSibling;
    const icon = button.querySelector('i');
    const isHidden = extended.hasAttribute('hidden');

    if (isHidden) {
      extended.removeAttribute('hidden');
      icon.classList.replace('fa-angle-down', 'fa-angle-up');
      button.innerHTML = '<i class="fas fa-angle-up"></i> Read Less';
    } else {
      extended.setAttribute('hidden', '');
      icon.classList.replace('fa-angle-up', 'fa-angle-down');
      button.innerHTML = '<i class="fas fa-angle-down"></i> Read More';
    }
  });
});
// LOGO LIGHTBOX EXPANSION
document.querySelectorAll('.logo').forEach(logo => {
  logo.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    Object.assign(modal.style, {
      display: 'flex',
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.8)',
      cursor: 'zoom-out',
      zIndex: 9999
    });

    const zoomedImg = document.createElement('img');
    zoomedImg.src = logo.src;
    zoomedImg.alt = logo.alt;
    zoomedImg.style.maxWidth = '90%';
    zoomedImg.style.maxHeight = '90%';
    zoomedImg.style.border = '4px solid #FFD700';
    zoomedImg.style.borderRadius = '10px';

    modal.appendChild(zoomedImg);
    document.body.appendChild(modal);

    modal.addEventListener('click', () => modal.remove());
  });
});
// HAMBURGER MENU TOGGLE FOR MOBILE NAVIGATION
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.querySelector('#mainNav ul');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('hamreveal');
      navMenu.classList.toggle('hamreveal');
      hamburger.setAttribute('aria-expanded', String(!isOpen));
    });
  }
});
// Prevent accidental Enter submissions except in textarea
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form').forEach(f => {
    f.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
      }
    });
  });
});

