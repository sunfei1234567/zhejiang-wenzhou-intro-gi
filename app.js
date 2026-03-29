
// ========================================
// Utility Functions
// ========================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ========================================
// Hero Carousel
// ========================================

function initHeroCarousel() {
  const slides = $$('.carousel-slide');
  const indicators = $$('.indicator');
  const prevBtn = $('.carousel-prev');
  const nextBtn = $('.carousel-next');
  
  if (slides.length === 0) return;
  
  let currentSlide = 0;
  let autoplayInterval;
  
  function showSlide(index) {
    // Wrap around
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    currentSlide = index;
    
    // Update slides
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });
    
    // Update indicators
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === currentSlide);
    });
  }
  
  function nextSlide() {
    showSlide(currentSlide + 1);
  }
  
  function prevSlide() {
    showSlide(currentSlide - 1);
  }
  
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000); // 5 seconds
  }
  
  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }
  
  // Event listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      stopAutoplay();
      startAutoplay();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      stopAutoplay();
      startAutoplay();
    });
  }
  
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      showSlide(index);
      stopAutoplay();
      startAutoplay();
    });
  });
  
  // Pause on hover
  const carousel = $('.hero-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
  }
  
  // Start autoplay
  startAutoplay();
}

// ========================================
// Scroll Animations
// ========================================

function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with scroll-animate class
  $$('.scroll-animate').forEach(el => observer.observe(el));
}

// ========================================
// Explore Section (AI Search)
// ========================================

function initExplore() {
  const form = $('#exploreForm');
  const input = $('#exploreInput');
  const btn = $('#exploreBtn');
  const response = $('#exploreResponse');
  const searchIcon = btn.querySelector('.search-icon');
  const loaderIcon = btn.querySelector('.loader-icon');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    // Show loading state
    btn.disabled = true;
    searchIcon.classList.add('hidden');
    loaderIcon.classList.remove('hidden');
    response.classList.add('hidden');

    try {
      // Note: In a real implementation, 
      // This is a placeholder for the actual API integration
      const result = await mockExploreSearch(query);
      displayExploreResponse(result);
    } catch (error) {
      console.error('Search error:', error);
      displayExploreResponse({
        text: 'Sorry, I couldn\'t fetch information at this time. Please try again later.',
        sources: []
      });
    } finally {
      btn.disabled = false;
      searchIcon.classList.remove('hidden');
      loaderIcon.classList.add('hidden');
    }
  });
}

async function mockExploreSearch(query) {
  // This is a mock function. 
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    text: `## Discovering Wenzhou: ${query}\n\nWenzhou is a fascinating city located on the southeastern coast of Zhejiang Province, China. Here are some key highlights:\n\n### Cultural Heritage\n- Birthplace of Chinese landscape poetry\n- Cradle of Southern Opera (Nanxi)\n- Home to the famous "Wenzhou Model" of entrepreneurship\n\n### Must-Visit Places\n1. **Yandang Mountain** - A UNESCO Global Geopark known for its dramatic peaks\n2. **Nanxi River** - Crystal clear waters through ancient villages\n3. **Jiangxin Islet** - Historic island park in the Oujiang River\n\n### Local Cuisine\n- Wenzhou Fish Balls (irregular strips, not round!)\n- Glutinous Rice (Nuomi Fan) - The quintessential breakfast\n- Fresh seafood from the East China Sea\n\nWould you like to know more about any specific aspect of Wenzhou?`,
    sources: [
      { title: 'Wenzhou Tourism Official Website', uri: 'https://www.wenzhou.gov.cn' },
      { title: 'Yandang Mountain UNESCO Global Geopark', uri: 'https://www.yandangshan.com' }
    ]
  };
}

function displayExploreResponse(result) {
  const response = $('#exploreResponse');
  const content = response.querySelector('.response-content');
  const sourcesSection = response.querySelector('.response-sources');
  const sourcesList = response.querySelector('.sources-list');

  // Convert markdown-like content to HTML
  content.innerHTML = markdownToHtml(result.text);

  // Display sources if available
  if (result.sources && result.sources.length > 0) {
    sourcesList.innerHTML = result.sources.map(source => `
      <li>
        <a href="${source.uri}" target="_blank" rel="noopener noreferrer">
          ${source.title || source.uri}
        </a>
      </li>
    `).join('');
    sourcesSection.classList.remove('hidden');
  } else {
    sourcesSection.classList.add('hidden');
  }

  response.classList.remove('hidden');
  response.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ========================================
// Video Section
// ========================================

function initVideoPlayer() {
  const video = $('#wenzhouVideo');
  const playBtn = $('#videoPlayBtn');
  const overlay = $('#videoOverlay');

  if (!video || !playBtn) return;

  // Custom play button click
  playBtn.addEventListener('click', () => {
    video.play();
    overlay.classList.add('hidden');
  });

  // When video starts playing
  video.addEventListener('play', () => {
    overlay.classList.add('hidden');
  });

  // When video is paused
  video.addEventListener('pause', () => {
    // Only show overlay if video hasn't ended
    if (!video.ended) {
      overlay.classList.remove('hidden');
    }
  });

  // When video ends
  video.addEventListener('ended', () => {
    overlay.classList.remove('hidden');
  });

  // Click on video to toggle play/pause (when controls are visible)
  video.addEventListener('click', (e) => {
    // Don't trigger if clicking on controls
    if (e.target === video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  });
}

// ========================================
// Markdown to HTML Converter (Simple)
// ========================================

function markdownToHtml(markdown) {
  if (!markdown) return '';

  let html = markdown
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold and Italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Lists
    .replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>')
    .replace(/^\s*\d+\.\s+(.*$)/gim, '<li>$1</li>')
    // Horizontal rule
    .replace(/^---$/gim, '<hr>')
    // Paragraphs (must be last)
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<')) {
    html = '<p>' + html + '</p>';
  }

  // Fix list wrapping
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  // Remove duplicate ul tags
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  return html;
}

// ========================================
// Footer Year
// ========================================

function initFooter() {
  const yearSpan = $('#currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// ========================================
// Initialize Everything
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initHeroCarousel();
  initScrollAnimations();
  initExplore();
  initVideoPlayer();
  initFooter();

  console.log('🎋 Wenzhou Impressions - Loaded successfully!');
});

