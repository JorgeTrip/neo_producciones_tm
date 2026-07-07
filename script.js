// Configuración del año actual en el copyright del footer
document.getElementById('year').textContent = new Date().getFullYear();

// Control de apertura y cierre del menú móvil de navegación
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// Inicialización de los visores de imágenes 360 interactivos mediante Pannellum
function initPanoramas() {
  const panoramas = [
    { id: 'panorama-1', img: 'images/360/living.webp' },
    { id: 'panorama-2', img: 'images/360/cocina.webp' },
    { id: 'panorama-3', img: 'images/360/dormitorio.webp' },
    { id: 'panorama-4', img: 'images/360/terraza.webp' }
  ];

  panoramas.forEach(p => {
    const el = document.getElementById(p.id);
    if (el && typeof pannellum !== 'undefined') {
      pannellum.viewer(p.id, {
        type: 'equirectangular',
        panorama: p.img,
        autoLoad: true,
        autoRotate: -2,
        compass: false,
        showZoomCtrl: true,
        showFullscreenCtrl: true,
        hotSpotDebug: false
      });
    }
  });
}

// Inicialización de Pannellum cuando el DOM esté completamente cargado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPanoramas);
} else {
  initPanoramas();
}

// Cerrar el menú móvil al hacer clic en cualquiera de los enlaces de navegación
document.querySelectorAll('nav .nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('mobileMenu').classList.remove('open'));
});

// ═══════════════════════════════════════════════════════════════════════════
// SISTEMA DE VISUALIZACIÓN LIGHTBOX CON NAVEGACIÓN Y COMPATIBILIDAD MULTIMEDIA
// ═══════════════════════════════════════════════════════════════════════════
let currentImageIndex = -1;
let galleryImages = [];
let isVideoMode = false;

// Escaneo y recolección de las imágenes del portfolio para construir el carrusel
function collectGalleryImages() {
  galleryImages = [];
  document.querySelectorAll('.gallery-item').forEach(item => {
    const onclickAttr = item.getAttribute('onclick');
    if (onclickAttr && onclickAttr.includes('openLightbox')) {
      const match = onclickAttr.match(/openLightbox\('([^']+)'\)/);
      if (match) galleryImages.push(match[1]);
    }
  });
}

// Ejecutar la recolección al cargar el script
collectGalleryImages();

// Abre el Lightbox y renderiza la imagen seleccionada
function openLightbox(src) {
  isVideoMode = false;
  
  // Si la ruta contiene .JPG o .jpg u otra, la normalizamos a .webp
  // ya que actualizaremos las referencias en el DOM a .webp
  const normalizedSrc = src.replace(/\.(jpe?g|png|JPG|PNG)$/, '.webp');
  currentImageIndex = galleryImages.indexOf(src);
  if (currentImageIndex === -1) {
    currentImageIndex = galleryImages.indexOf(normalizedSrc);
  }
  
  const lb = document.getElementById('lightbox');
  const content = document.getElementById('lightboxContent');
  const counter = document.getElementById('lightboxCounter');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  
  content.innerHTML = `<img src="${normalizedSrc}" alt="">`;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Lógica de visualización del contador y de navegación
  if (currentImageIndex >= 0) {
    counter.style.display = 'block';
    counter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    prevBtn.style.display = currentImageIndex > 0 ? 'flex' : 'none';
    nextBtn.style.display = currentImageIndex < galleryImages.length - 1 ? 'flex' : 'none';
  } else {
    counter.style.display = 'none';
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }
}

// Navegación secuencial (anterior/siguiente) del Lightbox
function navigateLightbox(direction) {
  if (isVideoMode || currentImageIndex < 0) return;
  
  const newIndex = currentImageIndex + direction;
  if (newIndex >= 0 && newIndex < galleryImages.length) {
    currentImageIndex = newIndex;
    const content = document.getElementById('lightboxContent');
    const counter = document.getElementById('lightboxCounter');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    
    const src = galleryImages[currentImageIndex].replace(/\.(jpe?g|png|JPG|PNG)$/, '.webp');
    content.innerHTML = `<img src="${src}" alt="">`;
    counter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    prevBtn.style.display = currentImageIndex > 0 ? 'flex' : 'none';
    nextBtn.style.display = currentImageIndex < galleryImages.length - 1 ? 'flex' : 'none';
  }
}

// Abre el Lightbox en modo Video (soporte para Vimeo)
function openVideo(url) {
  isVideoMode = true;
  const lb = document.getElementById('lightbox');
  const content = document.getElementById('lightboxContent');
  const counter = document.getElementById('lightboxCounter');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  
  content.innerHTML = `<iframe src="${url}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  counter.style.display = 'none';
  prevBtn.style.display = 'none';
  nextBtn.style.display = 'none';
}

// Abre el Lightbox en modo Video de YouTube
function openYouTube(url) {
  isVideoMode = true;
  const lb = document.getElementById('lightbox');
  const content = document.getElementById('lightboxContent');
  const counter = document.getElementById('lightboxCounter');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const videoId = url.split('/embed/')[1].split('?')[0];

  content.innerHTML = `
    <div style="width: 90vw; max-width: 1200px; aspect-ratio: 16/9; position: relative;">
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        style="border-radius: 8px;">
       Biran
      </iframe>
    </div>
  `;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  counter.style.display = 'none';
  prevBtn.style.display = 'none';
  nextBtn.style.display = 'none';
}

// Cierre del Lightbox y detención de la reproducción de contenido multimedia
function closeLightbox(e) {
  if (e && e.target !== document.getElementById('lightbox')) return;
  const lb = document.getElementById('lightbox');
  lb.classList.remove('active');
  document.getElementById('lightboxContent').innerHTML = '';
  document.body.style.overflow = '';
  currentImageIndex = -1;
  isVideoMode = false;
}

// Atajos de teclado para accesibilidad: Escape (cerrar), Flecha Izquierda (anterior), Flecha Derecha (siguiente)
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('active')) return;
  
  if (e.key === 'Escape') {
    closeLightbox();
  } else if (e.key === 'ArrowLeft') {
    navigateLightbox(-1);
  } else if (e.key === 'ArrowRight') {
    navigateLightbox(1);
  }
});

// Animación de aparición (Scroll Reveal) al desplazarse
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Resaltar automáticamente el enlace activo en la barra de navegación al hacer scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--gold)' : '';
  });
}, { passive: true });
