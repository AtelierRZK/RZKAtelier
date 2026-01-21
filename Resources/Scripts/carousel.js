// Lightweight swipeable carousel for product images
// Usage: call window.initProductCarousels(root?) after content renders
(function () {
  function createCarousel(container, imageSources) {
    const carousel = document.createElement('div');
    carousel.className = 'carousel';

    const track = document.createElement('div');
    track.className = 'carousel-track';
    carousel.appendChild(track);

    const slides = imageSources.map(function (src) {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      const img = document.createElement('img');
      img.src = src;
      img.alt = container.querySelector('img') ? container.querySelector('img').alt || '' : '';
      slide.appendChild(img);
      return slide;
    });

    slides.forEach(function (s) { track.appendChild(s); });

    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-btn prev';
    prevBtn.setAttribute('aria-label', 'Previous image');
    prevBtn.textContent = '‹';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-btn next';
    nextBtn.setAttribute('aria-label', 'Next image');
    nextBtn.textContent = '›';

    const dots = document.createElement('div');
    dots.className = 'carousel-dots';

    const dotButtons = imageSources.map(function (_, i) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to image ' + (i + 1));
      dots.appendChild(dot);
      return dot;
    });

    carousel.appendChild(prevBtn);
    carousel.appendChild(nextBtn);
    carousel.appendChild(dots);

    let index = 0;
    const total = imageSources.length;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    function clamp(i) { return Math.max(0, Math.min(total - 1, i)); }

    function update() {
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      dotButtons.forEach(function (b, i) { b.classList.toggle('active', i === index); });
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === total - 1;
    }

    function goTo(i) { index = clamp(i); update(); }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);
    dotButtons.forEach(function (b, i) { b.addEventListener('click', function () { goTo(i); }); });

    // Pointer/touch events for swipe
    function onPointerDown(ev) {
      isDragging = true;
      startX = ev.touches ? ev.touches[0].clientX : ev.clientX;
      currentX = startX;
      track.style.transition = 'none';
    }

    function onPointerMove(ev) {
      if (!isDragging) return;
      currentX = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const dx = currentX - startX;
      const percent = (dx / carousel.clientWidth) * 100;
      track.style.transform = 'translateX(' + (-index * 100 + percent) + '%)';
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      const dx = currentX - startX;
      track.style.transition = '';
      const threshold = carousel.clientWidth * 0.15;
      if (dx > threshold) {
        prev();
      } else if (dx < -threshold) {
        next();
      } else {
        update();
      }
    }

    track.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    track.addEventListener('touchstart', onPointerDown, { passive: true });
    track.addEventListener('touchmove', onPointerMove, { passive: true });
    track.addEventListener('touchend', onPointerUp);

    update();
    return carousel;
  }

  function parseDataImages(value) {
    if (!value) return [];
    return value.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function upgradeContainer(container) {
    if (container.dataset.carouselInit === 'true') return;
    container.dataset.carouselInit = 'true';

    // Collect images: prefer data-images on container or existing img src
    var dataImages = parseDataImages(container.getAttribute('data-images'));
    var images = dataImages.length ? dataImages : [];

    if (!images.length) {
      var existingImg = container.querySelector('img');
      if (existingImg && existingImg.src) {
        images = [existingImg.src, existingImg.src, existingImg.src];
      }
    }

    if (!images.length) return; // nothing to do

    // Remove existing imgs inside container (we'll replace with carousel)
    Array.prototype.slice.call(container.querySelectorAll('img')).forEach(function (img) {
      img.remove();
    });

    const carousel = createCarousel(container, images.slice(0, 3));
    container.insertBefore(carousel, container.firstChild);
  }

  function init(root) {
    var scope = root || document;
    var containers = scope.querySelectorAll('.product-image-container');
    containers.forEach(function (c) { upgradeContainer(c); });
  }

  // Expose and auto-init on DOM ready for static content
  window.initProductCarousels = init;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(document); });
  } else {
    init(document);
  }
})();


