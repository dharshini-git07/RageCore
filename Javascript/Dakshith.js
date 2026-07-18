/* =====================================================
   GAME STORE - MAIN SCRIPT (Dakshith.js)
   Team E - Week 6 Project
   Contains: Spinner, Register (with localStorage),
   Login (with localStorage auth), Contact form, FAQ accordion
   ===================================================== */


/* ============ SPINNER FOR ALL MODULES ============ */
if (document.getElementById('loaderSlot')) {
    fetch('spinner.html')
        .then(res => res.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const loaderEl = doc.getElementById('loader');
            const styleEl = doc.querySelector('style');

            if (styleEl) document.head.appendChild(styleEl.cloneNode(true));

            document.getElementById('loaderSlot').appendChild(loaderEl);

            const dotsEl = loaderEl.querySelector('#dots');
            let count = 0;
            const dotsTimer = setInterval(() => {
                count = (count + 1) % 2;
                if (dotsEl) dotsEl.textContent = '.'.repeat(count);
            }, 200);

            const delay = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000;
            setTimeout(() => {
                loaderEl.classList.add('hidden');
                const arena = document.getElementById('profileArena');
                if (arena) arena.classList.add('show');
                clearInterval(dotsTimer);
            }, delay);
        })
        .catch(err => {
            console.error('Could not load spinner.html:', err);
            const arena = document.getElementById('profileArena');
            if (arena) arena.classList.add('show');
        });
}


/* ============ REGISTER PAGE (Live validation + password tracker + localStorage) ============ */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('registerForm');
    if (!form) return; // not on register page, skip

    // Select Form and Inputs
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const terms = document.getElementById('terms-consent');
    const ageConsent = document.getElementById('age-consent'); // 18+ Checkbox

    // Regex Patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passPatterns = {
        length: /.{8,}/,
        capital: /[A-Z]/,
        number: /[0-9]/,
        special: /[!@#$%^&*(),.?":{}|<>]/
    };

    // 1. Inject Error Message Spans dynamically
    const inputs = [firstName, lastName, email, confirmPassword];
    inputs.forEach(input => {
        const errorSpan = document.createElement('span');
        errorSpan.className = 'error-msg';
        input.closest('.input-group').appendChild(errorSpan);
    });

    // 2. Inject Show/Hide Password Buttons
    const svgEye = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>`;
    const svgEyeSlash = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>`;

    [password, confirmPassword].forEach(input => {
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'toggle-password';
        toggleBtn.innerHTML = svgEye;
        input.closest('.input-wrapper').appendChild(toggleBtn);

        toggleBtn.addEventListener('click', () => {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            toggleBtn.innerHTML = type === 'password' ? svgEye : svgEyeSlash;
        });
    });

    // 3. Inject Password Live Tracker UI
    const trackerHTML = `
        <div class="password-tracker" id="passTracker">
            <div class="req-item" id="req-length"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> 8+ Characters</div>
            <div class="req-item" id="req-capital"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> 1 Capital Letter</div>
            <div class="req-item" id="req-number"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> 1 Number</div>
            <div class="req-item" id="req-special"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> 1 Special Character</div>
        </div>
    `;
    password.closest('.input-group').insertAdjacentHTML('beforeend', trackerHTML);
    const passTracker = document.getElementById('passTracker');

    // Utility: Show/Hide Errors
    function setError(input, message) {
        input.classList.remove('valid');
        input.classList.add('invalid');
        const errorMsg = input.closest('.input-group').querySelector('.error-msg');
        if (errorMsg) {
            errorMsg.innerText = message;
            errorMsg.classList.add('show');
        }
    }

    function setSuccess(input) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        const errorMsg = input.closest('.input-group').querySelector('.error-msg');
        if (errorMsg) {
            errorMsg.classList.remove('show');
        }
    }

    // 4. Live Validation Events

    // Names
    [firstName, lastName].forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim().length < 3) {
                setError(input, 'Must be at least 3 characters');
            } else {
                setSuccess(input);
            }
        });
    });

    // Email
    email.addEventListener('input', () => {
        if (!emailPattern.test(email.value.trim())) {
            setError(email, 'Enter a valid email address');
        } else {
            setSuccess(email);
        }
    });

    // Password Live Tracker
    password.addEventListener('focus', () => {
        passTracker.classList.add('active');
    });

    password.addEventListener('input', () => {
        const val = password.value;
        let isPassValid = true;

        if (passPatterns.length.test(val)) { document.getElementById('req-length').classList.add('met'); }
        else { document.getElementById('req-length').classList.remove('met'); isPassValid = false; }

        if (passPatterns.capital.test(val)) { document.getElementById('req-capital').classList.add('met'); }
        else { document.getElementById('req-capital').classList.remove('met'); isPassValid = false; }

        if (passPatterns.number.test(val)) { document.getElementById('req-number').classList.add('met'); }
        else { document.getElementById('req-number').classList.remove('met'); isPassValid = false; }

        if (passPatterns.special.test(val)) { document.getElementById('req-special').classList.add('met'); }
        else { document.getElementById('req-special').classList.remove('met'); isPassValid = false; }

        if (isPassValid) {
            password.classList.remove('invalid');
            password.classList.add('valid');
            if (confirmPassword.value.length > 0) {
                confirmPassword.dispatchEvent(new Event('input'));
            }
        } else {
            password.classList.remove('valid');
            password.classList.add('invalid');
        }
    });

    // Confirm Password
    confirmPassword.addEventListener('input', () => {
        if (confirmPassword.value === '') {
            setError(confirmPassword, 'Please confirm your password');
        } else if (confirmPassword.value !== password.value) {
            setError(confirmPassword, 'Passwords do not match');
        } else {
            setSuccess(confirmPassword);
        }
    });

    // Clear Checkbox Error on Click
    [terms, ageConsent].forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                e.target.closest('.consent-box').style.color = '';
            }
        });
    });

    // 5. Form Submit Validation + localStorage Save
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Check First Name
        if (firstName.value.trim().length < 3) {
            setError(firstName, 'First Name is required (Min 3 chars)');
            isValid = false;
        }

        // Check Last Name
        if (lastName.value.trim().length < 3) {
            setError(lastName, 'Last Name is required');
            isValid = false;
        }

        // Check Email
        if (!emailPattern.test(email.value.trim())) {
            setError(email, 'Valid email is required');
            isValid = false;
        }

        // Check Password
        const pVal = password.value;
        if (!(passPatterns.length.test(pVal) && passPatterns.capital.test(pVal) && passPatterns.number.test(pVal) && passPatterns.special.test(pVal))) {
            password.classList.add('invalid');
            passTracker.classList.add('active');
            isValid = false;
        }

        // Check Confirm Password
        if (confirmPassword.value === '' || confirmPassword.value !== password.value) {
            setError(confirmPassword, 'Passwords must match');
            isValid = false;
        }

        // Check 18+ Consent
        const ageConsentBox = ageConsent.closest('.consent-box');
        if (!ageConsent.checked) {
            ageConsentBox.style.color = 'var(--error-color)';
            isValid = false;
        } else {
            ageConsentBox.style.color = '';
        }

        // Check Terms
        const termsConsentBox = terms.closest('.consent-box');
        if (!terms.checked) {
            termsConsentBox.style.color = 'var(--error-color)';
            isValid = false;
        } else {
            termsConsentBox.style.color = '';
        }

        if (!isValid) {
            // Shake effect for invalid form
            form.style.transform = 'translateX(-10px)';
            setTimeout(() => form.style.transform = 'translateX(10px)', 100);
            setTimeout(() => form.style.transform = 'translateX(-10px)', 200);
            setTimeout(() => form.style.transform = 'translateX(0)', 300);
            return;
        }

        // ---- Duplicate Email Check (localStorage) ----
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        const emailTaken = existingUsers.some(
            user => user.email.toLowerCase() === email.value.trim().toLowerCase()
        );

        if (emailTaken) {
            setError(email, 'An account with this email already exists');
            return;
        }

        // ---- Final Action: Save to localStorage ----
        const btn = document.getElementById('register-submit-btn');
        btn.innerHTML = 'Creating Warrior...';
        btn.style.opacity = '0.7';

        setTimeout(() => {
            const newUser = {
                firstName: firstName.value.trim(),
                lastName: lastName.value.trim(),
                email: email.value.trim(),
                password: password.value, // NOTE: plain text, demo/learning purposes only
                registeredAt: new Date().toISOString()
            };

            existingUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(existingUsers));

            alert("Account Created Successfully! Welcome to the Arena.");

            form.reset();
            btn.innerHTML = 'Register';
            btn.style.opacity = '1';
            inputs.forEach(input => input.classList.remove('valid'));
            password.classList.remove('valid');
            passTracker.classList.remove('active');
            document.querySelectorAll('.req-item').forEach(item => item.classList.remove('met'));

            // Redirect to login page after successful registration
            window.location.href = 'login.html';
        }, 1500);
    });
});


/* ============ LOGIN PAGE (Validation + localStorage Auth) ============ */
document.addEventListener('DOMContentLoaded', () => {

    /* ---------- TOP LOADER ---------- */
    const loader = document.getElementById('loaderSlot');
    if (loader) {
        requestAnimationFrame(() => {
            loader.classList.add('loader-done');
            setTimeout(() => loader.remove(), 500);
        });
    }

    /* ---------- LOGIN FORM ---------- */
    const form = document.getElementById('loginForm') || document.querySelector('.login-card form');
    if (!form) return; // not on login page, skip

    const usernameField = document.getElementById('username')
        || document.getElementById('loginEmail')
        || form.querySelector('input[type="text"]');
    const passwordField = document.getElementById('loginPassword')
        || form.querySelector('input[type="password"]');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Create (once) a small error-message element right under a field
    const getErrorEl = (input) => {
        const wrapper = input.closest('.input-group');
        let errorEl = wrapper.nextElementSibling;
        if (!errorEl || !errorEl.classList.contains('field-error-msg')) {
            errorEl = document.createElement('span');
            errorEl.className = 'field-error-msg';
            wrapper.insertAdjacentElement('afterend', errorEl);
        }
        return errorEl;
    };

    const setFieldError = (input, message) => {
        input.classList.toggle('input-invalid', Boolean(message));
        getErrorEl(input).textContent = message || '';
    };

    const validators = [
        {
            field: usernameField,
            check: () => usernameField.value.trim().length > 0,
            message: 'Please enter your email.',
        },
        {
            field: passwordField,
            check: () => passwordField.value.length >= 6,
            message: 'Password must be at least 6 characters.',
        },
    ];

    // Live validation: clear a field's error as soon as it becomes valid
    validators.forEach(({ field, check }) => {
        field.addEventListener('input', () => {
            if (check()) setFieldError(field, '');
        });
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        let hasError = false;
        let firstInvalidField = null;

        validators.forEach(({ field, check, message }) => {
            const valid = check();
            setFieldError(field, valid ? '' : message);
            if (!valid) {
                hasError = true;
                firstInvalidField = firstInvalidField || field;
            }
        });

        if (hasError) {
            firstInvalidField.focus();
            return;
        }

        // ---- Real Authentication Check (localStorage) ----
        const emailVal = usernameField.value.trim();
        const passwordVal = passwordField.value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const matchedUser = users.find(
            user => user.email.toLowerCase() === emailVal.toLowerCase()
        );

        if (!matchedUser) {
            setFieldError(usernameField, 'No account found with this email.');
            usernameField.focus();
            return;
        }

        if (matchedUser.password !== passwordVal) {
            setFieldError(passwordField, 'Incorrect password.');
            passwordField.focus();
            return;
        }

        // Save logged-in session
        localStorage.setItem('loggedInUser', JSON.stringify(matchedUser));

        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in…';

        setTimeout(() => {
            submitBtn.textContent = 'Welcome back';
            // Redirect to dashboard/home after login
            window.location.href = 'index.html';
        }, 900);
    });

});


/* ============ PROFILE PAGE (Show logged-in user's real data) ============ */
document.addEventListener('DOMContentLoaded', () => {
    const profileArena = document.getElementById('profileArena');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');

    // Only run on the profile page
    if (!profileArena || !profileName || !profileEmail) return;

    const loggedInUserRaw = localStorage.getItem('loggedInUser');

    // No active session -> send back to login
    if (!loggedInUserRaw) {
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(loggedInUserRaw);

    // Fill in real details
    profileName.textContent = `${user.firstName}_${user.lastName}`.toUpperCase();
    profileEmail.textContent = user.email;

    // Mobile number wasn't collected at registration, so show a placeholder
    const profileMobile = document.getElementById('profileMobile');
    if (profileMobile) {
        profileMobile.textContent = user.mobile || 'Not Provided';
    }

    // Logout clears the session before navigating away
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser');
            // href="index.html" on the <a> tag will still navigate normally
        });
    }
});


/* =====================================================
   GAME STORE - CONTACT PAGE SCRIPT
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {

    /* ---------- FAQ ACCORDION ---------- */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach((other) => {
                other.classList.remove('active');
                other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ---------- CONTACT FORM VALIDATION ---------- */
    const form = document.getElementById('contactForm');
    if (!form) return;

    const fields = {
        name: document.getElementById('cf-name'),
        email: document.getElementById('cf-email'),
        subject: document.getElementById('cf-subject'),
        message: document.getElementById('cf-message'),
    };
    const status = document.getElementById('cf-status');

    const errorFor = (key) => document.getElementById(`cf-${key}-error`);

    const clearErrors = () => {
        Object.keys(fields).forEach((key) => {
            errorFor(key).textContent = '';
        });
    };

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        clearErrors();

        let hasError = false;

        if (!fields.name.value.trim()) {
            errorFor('name').textContent = 'Please enter your name.';
            hasError = true;
        }

        if (!fields.email.value.trim()) {
            errorFor('email').textContent = 'Please enter your email.';
            hasError = true;
        } else if (!isValidEmail(fields.email.value.trim())) {
            errorFor('email').textContent = 'Please enter a valid email.';
            hasError = true;
        }

        if (!fields.subject.value.trim()) {
            errorFor('subject').textContent = 'Please add a subject.';
            hasError = true;
        }

        if (!fields.message.value.trim()) {
            errorFor('message').textContent = 'Please write a message.';
            hasError = true;
        }

        if (hasError) {
            status.textContent = '';
            return;
        }

        // No backend wired up yet — this is where a real fetch() call would go.
        status.textContent = "Message sent — we'll get back to you shortly.";
        status.style.color = 'var(--success-color)';
        form.reset();
    });

});




/* ===== theme toggle (shared across ALL pages via localStorage) ===== */
(function () {
  var root = document.documentElement;

  function get(k){ try{ return window.localStorage.getItem(k); }catch(e){ return null; } }
  function set(k,v){ try{ window.localStorage.setItem(k,v); }catch(e){} }

  // Applies the theme to <html> + updates the toggle switch UI if it exists on this page.
  function applyTheme(isLight, switchInput) {
    if (isLight) root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    if (switchInput) switchInput.checked = isLight;
    set('ragecore-theme', isLight ? 'light' : 'dark');
  }

  // 1. ALWAYS apply the saved theme on every page load, regardless of
  //    whether this page has the toggle button (fixes theme not
  //    carrying over to index.html, games.html, contact.html, etc.)
  var switchInputOnLoad = document.getElementById('brightModeSwitch');
  applyTheme(get('ragecore-theme') === 'light', switchInputOnLoad);

  // 2. ONLY wire up the click/change listeners if the toggle UI exists
  //    on this page (currently just profile.html).
  var toggleBtn = document.getElementById('themeToggle');
  var switchInput = document.getElementById('brightModeSwitch');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') !== 'light', switchInput);
    });
  }
  if (switchInput) {
    switchInput.addEventListener('change', function () {
      applyTheme(switchInput.checked, switchInput);
    });
  }
})();

/* ===== Avatar picker (persists via localStorage) ===== */
(function () {
  var editBtn = document.getElementById('avatarEditBtn');
  var ringWrap = document.getElementById('avatarRingWrap');
  var ringInner = document.getElementById('avatarRingInner');
  var overlay = document.getElementById('avatarModalOverlay');
  var options = document.querySelectorAll('.avatar-option');
  var cancelBtn = document.getElementById('avatarCancelBtn');
  var confirmBtn = document.getElementById('avatarConfirmBtn');
  var selectedIndex = null;
  if (!editBtn || !ringWrap || !ringInner || !overlay) return; // not on profile page, skip safely

  function get(k){ try{ return window.localStorage.getItem(k); }catch(e){ return null; } }
  function set(k,v){ try{ window.localStorage.setItem(k,v); }catch(e){} }

  function applyAvatar(idx) {
    var opt = document.querySelector('.avatar-option[data-avatar="' + idx + '"]');
    if (!opt) return;
    var chosenSvg = opt.querySelector('svg').cloneNode(true);
    ringInner.innerHTML = '';
    ringInner.appendChild(chosenSvg);
    options.forEach(function (o) { o.classList.remove('selected'); });
    opt.classList.add('selected');
    selectedIndex = idx;
  }

  // Restore saved avatar on load
  var savedAvatar = get('ragecore-avatar');
  if (savedAvatar !== null) applyAvatar(savedAvatar);

  function openModal() { overlay.classList.add('show'); }
  function closeModal() { overlay.classList.remove('show'); }

  editBtn.addEventListener('click', openModal);
  ringWrap.addEventListener('click', openModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });

  options.forEach(function (opt) {
    opt.addEventListener('click', function () {
      options.forEach(function (o) { o.classList.remove('selected'); });
      opt.classList.add('selected');
      selectedIndex = opt.getAttribute('data-avatar');
    });
  });

  if (confirmBtn) {
    confirmBtn.addEventListener('click', function () {
      if (selectedIndex === null) { closeModal(); return; }
      applyAvatar(selectedIndex);
      set('ragecore-avatar', selectedIndex);
      closeModal();
    });
  }
})();

/* ===== Persisted profile fields (username, email, mobile, country) ===== */
var PROFILE_FIELD_KEYS = {
  fieldUsername: 'ragecore-username',
  fieldEmail: 'ragecore-email',
  fieldMobile: 'ragecore-mobile',
  fieldCountry: 'ragecore-country'
};

function psGet(k){ try{ return window.localStorage.getItem(k); }catch(e){ return null; } }
function psSet(k,v){ try{ window.localStorage.setItem(k,v); }catch(e){} }

// Restore saved field values on load (only runs if these elements exist, e.g. profile.html)
Object.keys(PROFILE_FIELD_KEYS).forEach(function (fieldId) {
  var saved = psGet(PROFILE_FIELD_KEYS[fieldId]);
  if (saved) {
    var el = document.getElementById(fieldId);
    if (el) el.textContent = saved;
  }
});

var savedUsername = psGet(PROFILE_FIELD_KEYS.fieldUsername);
var profileNameElForRestore = document.getElementById('profileName');
if (savedUsername && profileNameElForRestore) {
  profileNameElForRestore.textContent = savedUsername;
}

/* ===== Username edit (sidebar name) ===== */
(function () {
  var nameEditBtn = document.getElementById('nameEditBtn');
  var nameSpan = document.getElementById('profileName');
  var fieldUsername = document.getElementById('fieldUsername');
  if (!nameEditBtn || !nameSpan || !fieldUsername) return; // not on profile page, skip safely

  nameEditBtn.addEventListener('click', function () {
    var currentName = nameSpan.textContent.trim();
    var input = document.createElement('input');
    input.type = 'text';
    input.value = currentName;
    input.className = 'name-input';
    input.maxLength = 24;
    nameSpan.replaceWith(input);
    input.focus();
    input.select();

    function commit() {
      var newName = input.value.trim() || currentName;
      var span = document.createElement('span');
      span.id = 'profileName';
      span.textContent = newName;
      input.replaceWith(span);
      nameSpan = span;
      fieldUsername.textContent = newName;
      psSet(PROFILE_FIELD_KEYS.fieldUsername, newName);
    }
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') commit();
      if (e.key === 'Escape') { input.value = currentName; commit(); }
    });
    input.addEventListener('blur', commit);
  });
})();

/* ===== Inline field edit (Account Info card) — persists to localStorage ===== */
document.querySelectorAll('.field-edit').forEach(function (btn) {
  var targetId = btn.getAttribute('data-target');
  if (targetId === 'none') return;
  btn.addEventListener('click', function () {
    var span = document.getElementById(targetId);
    if (!span) return;
    var current = span.textContent.trim();
    var input = document.createElement('input');
    input.type = 'text';
    input.value = current;
    input.className = 'field-input';
    span.replaceWith(input);
    input.focus();
    input.select();

    function commit() {
      var newVal = input.value.trim() || current;
      var newSpan = document.createElement('span');
      newSpan.id = targetId;
      newSpan.textContent = newVal;
      input.replaceWith(newSpan);

      var storeKey = PROFILE_FIELD_KEYS[targetId];
      if (storeKey) psSet(storeKey, newVal);

      if (targetId === 'fieldUsername') {
        var profileNameEl = document.getElementById('profileName');
        if (profileNameEl) profileNameEl.textContent = newVal;
      }
    }
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') commit();
      if (e.key === 'Escape') { input.value = current; commit(); }
    });
    input.addEventListener('blur', commit);
  });
});

/* ===== Nav profile icon: route based on login state ===== */
(function () {
  function goToProfileOrLogin(e) {
    e.preventDefault();
    var loggedInUser = null;
    try { loggedInUser = localStorage.getItem('loggedInUser'); } catch (err) {}

    if (loggedInUser) {
      window.location.href = 'profile.html';
    } else {
      window.location.href = 'login.html';
    }
  }

  var navBtn = document.getElementById('profileNavBtn');
  if (navBtn) navBtn.addEventListener('click', goToProfileOrLogin);

  var navBtnMobile = document.getElementById('profileNavBtnMobile');
  if (navBtnMobile) navBtnMobile.addEventListener('click', goToProfileOrLogin);
})();
/* ===== Payment Methods: Remove + Add (persists via localStorage) ===== */
(function () {
  var payList = document.querySelector('.pay-list');
  if (!payList) return; // not on profile page, skip safely

  function pmGet(k) { try { return JSON.parse(window.localStorage.getItem(k)) || []; } catch (e) { return []; } }
  function pmSet(k, v) { try { window.localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  var REMOVED_KEY = 'ragecore-removed-cards';
  var ADDED_KEY = 'ragecore-added-cards';

  // Restore: hide any default cards the user removed earlier
  var removedIds = pmGet(REMOVED_KEY);
  removedIds.forEach(function (id) {
    var el = payList.querySelector('[data-pay-id="' + id + '"]');
    if (el) el.remove();
  });

  // Restore: re-add any custom cards the user added earlier
  var addedCards = pmGet(ADDED_KEY);
  addedCards.forEach(function (card) {
    payList.insertBefore(buildPayItem(card), payList.querySelector('.add-pay-btn'));
  });

  // Give every existing default pay-item a stable id (based on its name) if it doesn't have one
  payList.querySelectorAll('.pay-item').forEach(function (item, i) {
    if (!item.dataset.payId) item.dataset.payId = 'default-' + i;
  });

  function buildPayItem(card) {
    var div = document.createElement('div');
    div.className = 'pay-item';
    div.dataset.payId = card.id;
    div.innerHTML =
      '<div class="pay-left">' +
        '<div class="pay-icon pay-upi">' + card.tag + '</div>' +
        '<div>' +
          '<div class="pay-name">' + card.name + '</div>' +
          '<div class="pay-sub">' + card.sub + '</div>' +
        '</div>' +
      '</div>' +
      '<button class="pay-remove">Remove</button>';
    return div;
  }

  // Remove handler (works for default + newly added cards, using event delegation)
  payList.addEventListener('click', function (e) {
    if (!e.target.classList.contains('pay-remove')) return;
    var item = e.target.closest('.pay-item');
    if (!item) return;
    var id = item.dataset.payId;

    // Track removal so it stays removed after refresh
    if (id.indexOf('default-') === 0) {
      var removed = pmGet(REMOVED_KEY);
      removed.push(id);
      pmSet(REMOVED_KEY, removed);
    } else {
      var added = pmGet(ADDED_KEY).filter(function (c) { return c.id !== id; });
      pmSet(ADDED_KEY, added);
    }

    item.style.opacity = '0';
    item.style.transform = 'translateX(20px)';
    setTimeout(function () { item.remove(); }, 200);
  });

  // Add Payment Method handler
  var addBtn = document.querySelector('.add-pay-btn');
  if (addBtn) {
    addBtn.addEventListener('click', function () {
      var upiId = prompt('Enter your UPI ID (e.g. yourname@bank):');
      if (!upiId || !upiId.trim()) return;

      var card = {
        id: 'custom-' + Date.now(),
        tag: 'UPI',
        name: upiId.trim(),
        sub: 'Linked UPI ID'
      };

      var added = pmGet(ADDED_KEY);
      added.push(card);
      pmSet(ADDED_KEY, added);

      payList.insertBefore(buildPayItem(card), addBtn);
    });
  }
})();

/* ===== Preferences toggles: persist Deal Alerts / Order Updates ===== */
(function () {
  var prefRows = document.querySelectorAll('.pref-row');
  if (!prefRows.length) return; // not on profile page, skip safely

  function prefGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function prefSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }

  prefRows.forEach(function (row, index) {
    var checkbox = row.querySelector('.switch input[type="checkbox"]');
    if (!checkbox || checkbox.id === 'brightModeSwitch') return; // theme switch handled separately

    var key = 'ragecore-pref-' + index;
    var saved = prefGet(key);
    if (saved !== null) checkbox.checked = saved === 'true';

    checkbox.addEventListener('change', function () {
      prefSet(key, checkbox.checked);
    });
  });
})();

/* ===== Change Password button (simple inline flow) ===== */
(function () {
  var changePwBtn = document.getElementById('changePwBtn');
  if (!changePwBtn) return;

  changePwBtn.addEventListener('click', function () {
    var newPw = prompt('Enter your new password (min 6 characters):');
    if (!newPw) return;
    if (newPw.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    try {
      var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      if (loggedInUser) {
        loggedInUser.password = newPw;
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

        var users = JSON.parse(localStorage.getItem('users')) || [];
        var idx = users.findIndex(function (u) { return u.email === loggedInUser.email; });
        if (idx !== -1) {
          users[idx].password = newPw;
          localStorage.setItem('users', JSON.stringify(users));
        }
      }
    } catch (e) {}

    alert('Password updated successfully.');
  });
})();

/* ===== Deactivate Account button ===== */
(function () {
  var deactivateBtn = document.querySelector('.danger-btn');
  if (!deactivateBtn) return; 

  deactivateBtn.addEventListener('click', function () {
    var confirmed = confirm('Are you sure you want to deactivate your account? This cannot be undone.');
    if (!confirmed) return;

    try {
      var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      if (loggedInUser) {
        var users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(function (u) { return u.email !== loggedInUser.email; });
        localStorage.setItem('users', JSON.stringify(users));
      }
      localStorage.removeItem('loggedInUser');
    } catch (e) {}

    alert('Your account has been deactivated.');
    window.location.href = 'index.html';
  });
})();