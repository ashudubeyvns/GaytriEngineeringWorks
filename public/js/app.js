(() => {

  // ============================================================
  // SECTION: THEME & NAVIGATION
  // ============================================================


  // ============================================================
  // SECTION: HOMEPAGE LOGO INTRO
  // ============================================================

  // Cinematic GEW logo intro on the homepage. The logo enters in 3D, settles, then reveals the site.
  const intro = document.querySelector('#gew-intro');
  if (intro) {
    const finishIntro = () => intro.classList.add('hide');
    window.setTimeout(finishIntro, 2200);
    intro.addEventListener('click', finishIntro, { once:true });
  }

  // Persist the user's light/dark preference across every GEW page.
  const themeToggle = document.querySelector('.theme-toggle');
  const applyTheme = (theme) => {
    const isLight = theme === 'light';
    document.body.classList.toggle('light', isLight);
    if (themeToggle) {
      themeToggle.innerHTML = isLight
        ? '<span class="theme-toggle-icon" aria-hidden="true">☾</span><span class="theme-toggle-label">Dark mode</span>'
        : '<span class="theme-toggle-icon" aria-hidden="true">☼</span><span class="theme-toggle-label">Light mode</span>';
      themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
      themeToggle.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
    }
  };
  const savedTheme = localStorage.getItem('gew-theme') || 'dark';
  applyTheme(savedTheme);
  themeToggle?.addEventListener('click', () => {
    const next = document.body.classList.contains('light') ? 'dark' : 'light';
    localStorage.setItem('gew-theme', next);
    applyTheme(next);
  });


  // Keep every WhatsApp contact link in sync with the single GEW_CONFIG value.
  const gewConfig = window.GEW_CONFIG || {};
  const whatsappNumber = gewConfig.whatsappNumber || '919451055994';
  const whatsappDisplay = gewConfig.whatsappDisplay || '+91 94510-55994';
  document.querySelectorAll('a[href*="wa.me/"]').forEach(link => {
    const current = new URL(link.href, window.location.origin);
    const message = current.searchParams.get('text') || 'Hello Gaytri Engineering Works, I want to discuss an industrial requirement.';
    link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    if (link.classList.contains('topbar-wa')) link.innerHTML = `WhatsApp: ${whatsappDisplay} ↗`;
  });

  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  navToggle?.addEventListener('click', () => navLinks?.classList.toggle('open'));

  // Solutions dropdown: hover/focus on desktop, tap-to-open on mobile.
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');
    toggle?.addEventListener('click', event => {
      if (window.matchMedia('(max-width: 950px)').matches) {
        event.preventDefault();
        const open = dropdown.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
      }
    });
  });

  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => navLinks?.classList.remove('open')));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  document.querySelectorAll('[data-count]').forEach(el => {
    const target = Number(el.dataset.count);
    let done = false;
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || done) return;
      done = true;
      const duration = 1100, start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))) + (el.dataset.suffix || '');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    observer.observe(el);
  });


  // ============================================================
  // SECTION: CURSOR-BASED CARD INTERACTION
  // ============================================================

  // Desktop cards respond gently to the cursor. The CSS variables
  // also move a soft light spot so dark and light themes feel alive.
  const interactiveCards = document.querySelectorAll(
    '.interactive-card, .card, .project-card, .service-card, .workforce-role'
  );

  interactiveCards.forEach(card => {
    card.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;

      const tiltX = ((percentX - 50) / 50) * 1.8;
      const tiltY = ((50 - percentY) / 50) * 1.8;

      card.style.setProperty('--card-x', `${percentX}%`);
      card.style.setProperty('--card-y', `${percentY}%`);
      card.style.setProperty('--tilt-x', `${tiltX}deg`);
      card.style.setProperty('--tilt-y', `${tiltY}deg`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--card-x', '50%');
      card.style.setProperty('--card-y', '50%');
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });

  
  // ============================================================
  // SECTION: GST CALCULATOR (ILLUSTRATIVE)
  // ============================================================
  const gstAmount = document.querySelector('#gst-amount');
  const gstRate = document.querySelector('#gst-rate');
  const gstBase = document.querySelector('#gst-base');
  const gstTax = document.querySelector('#gst-tax');
  const gstTotal = document.querySelector('#gst-total');

  const updateGstCalculator = () => {
    if (!gstAmount || !gstRate || !gstBase || !gstTax || !gstTotal) return;
    const amount = Math.max(Number(gstAmount.value) || 0, 0);
    const rate = Math.max(Number(gstRate.value) || 0, 0);
    const tax = amount * rate / 100;
    const formatINR = value => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    gstBase.textContent = formatINR(amount);
    gstTax.textContent = formatINR(tax);
    gstTotal.textContent = formatINR(amount + tax);
  };

  gstAmount?.addEventListener('input', updateGstCalculator);
  gstRate?.addEventListener('change', updateGstCalculator);
  updateGstCalculator();

// ============================================================
  // SECTION: QUOTATION / INQUIRY FORM
  // ============================================================

  // The static website does not contain SMTP credentials. Instead, the form
  // sends the inquiry to a Google Apps Script web app that emails GEW.
  // This keeps the website deployable on Firebase Hosting without Spring Boot.
  const form = document.querySelector('#inquiry-form');
  const status = document.querySelector('#form-status');
  const quotationEndpoint = gewConfig.quotationEndpoint || '';

  form?.addEventListener('submit', async e => {
    e.preventDefault();

    const button = form.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(form).entries());

    status.className = 'status';
    status.textContent = '';

    if (!quotationEndpoint) {
      status.className = 'status show error';
      status.textContent = 'The quotation form is not connected yet. Please use WhatsApp or call GEW directly.';
      return;
    }

    button.disabled = true;
    button.textContent = 'Sending inquiry...';

    try {
      const response = await fetch(quotationEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(data)
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok || body.ok === false) {
        throw new Error(body.message || 'Unable to send inquiry right now.');
      }

      status.className = 'status show ok';
      status.textContent = body.message || 'Thank you. Your inquiry has been sent to Gaytri Engineering Works.';
      form.reset();
    } catch (err) {
      status.className = 'status show error';
      status.textContent = err.message || 'Something went wrong. Please call GEW directly.';
    } finally {
      button.disabled = false;
      button.textContent = 'Send Inquiry / Request Quotation';
    }
  });

  // Lightweight 3D industrial scene. It is intentionally optional: the site remains usable if the CDN is blocked.
  const canvas = document.querySelector('#hero-canvas');
  if (canvas) {
    const loadThree = () => new Promise((resolve, reject) => {
      if (window.THREE) return resolve(window.THREE);
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.min.js';
      s.onload = () => resolve(window.THREE);
      s.onerror = reject;
      document.head.appendChild(s);
    });
    loadThree().then(THREE => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, innerWidth / Math.max(innerHeight,1), .1, 100);
      camera.position.set(0, 1.2, 8.5);
      const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
      renderer.setSize(innerWidth, innerHeight);
      const group = new THREE.Group(); scene.add(group);
      const metal = new THREE.MeshStandardMaterial({color:0x6e7887, metalness:.85, roughness:.25});
      const blue = new THREE.MeshStandardMaterial({color:0x1264d9, metalness:.65, roughness:.25});
      const gold = new THREE.MeshStandardMaterial({color:0xe7b941, metalness:.9, roughness:.18});
      const green = new THREE.MeshStandardMaterial({color:0x126b58, metalness:.65, roughness:.28});
      const addBox = (x,y,z,sx,sy,sz,mat) => { const m = new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat); m.position.set(x,y,z); group.add(m); return m; };
      const addCyl = (x,y,z,r,h,mat,rot='y') => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,32),mat); m.position.set(x,y,z); if(rot==='x') m.rotation.z=Math.PI/2; group.add(m); return m; };
      addBox(0,-1.15,0,7,.22,2.1,metal);
      for(let i=-3;i<=3;i+=1.5) addBox(i,-.9,0,.16,2.2,1.7,metal);
      addBox(-2.1,.45,0,1.8,2.8,1.2,blue); addBox(-.7,.65,0,1.05,3.2,1.25,blue); addBox(.8,.35,0,1.15,2.5,1.5,green);
      addCyl(2.25,.35,0,.58,2.6,metal); addCyl(2.25,1.7,0,.22,1.5,gold); addCyl(2.25,2.55,0,.5,.18,gold);
      for(let i=0;i<4;i++) addCyl(-2.2,.1,-.95+i*.62,.16,1.5,gold,'x');
      const ring = new THREE.Mesh(new THREE.TorusGeometry(3.1,.035,12,180),gold); ring.rotation.x=Math.PI/2.7; ring.position.y=.3; group.add(ring);
      const light = new THREE.PointLight(0x2e8cff, 18, 15); light.position.set(4,4,4); scene.add(light);
      const warm = new THREE.PointLight(0xffd66b, 12, 13); warm.position.set(-4,2,2); scene.add(warm);
      scene.add(new THREE.AmbientLight(0xffffff, 1.3));
      let mx=0,my=0; addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5)*.45;my=(e.clientY/innerHeight-.5)*.25;});
      const clock = new THREE.Clock();
      const resize=()=>{camera.aspect=innerWidth/Math.max(innerHeight,1);camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);};
      addEventListener('resize',resize); resize();
      const animate=()=>{const t=clock.getElapsedTime(); group.rotation.y += (mx-group.rotation.y)*.025; group.rotation.x += (-my-group.rotation.x)*.025; group.position.y=Math.sin(t*.7)*.08; renderer.render(scene,camera); requestAnimationFrame(animate);}; animate();
    }).catch(() => { canvas.style.display='none'; });
  }
})();

/* ============================================================
   GEW — QUOTATION HERO → FORM SMOOTH SCROLL
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    const quotationHero = document.querySelector(".quotation-hero-clickable");
    const quotationForm = document.querySelector("#quotation-form");

    if (!quotationHero || !quotationForm) {
        return;
    }

    const scrollToQuotationForm = () => {
        quotationForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };

    quotationHero.addEventListener("click", scrollToQuotationForm);

    quotationHero.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            scrollToQuotationForm();
        }
    });
});