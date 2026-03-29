/**
 * Wenzhou Impressions - Pure JavaScript Version
 * Converted from React
 */

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
      // Note: In a real implementation, you would need to set up a backend
      // or use a proxy to handle API calls securely
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
  // This is a mock function. In production, replace with actual API call
  // You would need to implement a backend endpoint to securely call the Gemini API
  
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
// Itinerary Section
// ========================================

function initItinerary() {
  const generateBtn = $('#generateBtn');

  // Check if itinerary section exists (it may have been replaced with culture section)
  if (!generateBtn) {
    console.log('Itinerary section not found - skipped initialization');
    return;
  }

  const daysSelect = $('#daysSelect');
  const interestsInput = $('#interestsInput');
  const sparklesIcon = generateBtn.querySelector('.sparkles-icon');
  const loaderIcon = generateBtn.querySelector('.loader-icon');
  const btnText = generateBtn.querySelector('.btn-text');

  generateBtn.addEventListener('click', async () => {
    const days = daysSelect.value;
    const interests = interestsInput.value.trim();

    // Show loading state
    generateBtn.disabled = true;
    sparklesIcon.classList.add('hidden');
    loaderIcon.classList.remove('hidden');
    btnText.textContent = 'Deep Thinking...';

    try {
      const itinerary = await mockGenerateItinerary(days, interests);
      displayItinerary(itinerary);
    } catch (error) {
      console.error('Itinerary generation error:', error);
      displayItinerary('Sorry, I couldn\'t generate an itinerary at this time. Please try again later.');
    } finally {
      generateBtn.disabled = false;
      sparklesIcon.classList.remove('hidden');
      loaderIcon.classList.add('hidden');
      btnText.textContent = 'Generate Itinerary';
    }
  });
}

async function mockGenerateItinerary(days, interests) {
  // This is a mock function. In production, replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 2000));

  const interestText = interests || 'a mix of nature, culture, and food';
  
  return `# Your ${days}-Day Wenzhou Journey\n\n*Crafted for travelers interested in: ${interestText}*\n\n---\n\n## Day 1: Arrival & City Exploration\n\n### Morning\n- **Jiangxin Islet** - Start your journey at this historic island park in the middle of the Oujiang River. Visit the twin pagodas and explore the ancient temples that have stood for centuries.\n\n### Afternoon\n- **Wuma Street** - Wander through Wenzhou's most famous pedestrian street, perfect for experiencing local culture and shopping.\n- **Try Wenzhou Fish Balls** - Don't miss this unique local delicacy!\n\n### Evening\n- **Oujiang River Night View** - Enjoy the beautiful illuminated riverfront.\n\n---\n\n## Day 2: Natural Wonders\n\n### Full Day\n- **Yandang Mountain** (if time permits for a day trip) OR\n- **Nanxi River** - Take a bamboo raft ride down the crystal-clear waters, passing ancient villages and lush mountains.\n\n### Cultural Experience\n- Visit a traditional tea house and enjoy local Oolong tea.\n\n---\n\n${days >= 3 ? `## Day 3: Culture & Cuisine\n\n### Morning\n- **Wenzhou Museum** - Deep dive into the city's 2,200-year history.\n\n### Afternoon\n- **Local Food Tour** - Sample:\n  - Glutinous Rice (Nuomi Fan) for breakfast\n  - Fresh seafood at a local restaurant\n  - Traditional pastries\n\n### Evening\n- **Southern Opera Performance** - If available, experience this ancient art form that originated in Wenzhou.\n\n---\n` : ''}${days >= 5 ? `## Day 4-5: Extended Exploration\n\n### Day 4: Wuyanling Nature Reserve\n- Explore the pristine subtropical forest\n- Bird watching and nature photography\n- Visit the source of the Feiyun River\n\n### Day 5: Ancient Villages\n- Visit traditional Wenzhou villages\n- Experience rural life and architecture\n- Shop for local handicrafts\n\n---\n` : ''}\n## Travel Tips\n\n- **Best Time to Visit**: Spring (March-May) or Autumn (September-November)\n- **Getting Around**: The city has good public transportation; taxis are affordable\n- **Language**: Mandarin is widely spoken; Wenzhou dialect is very distinct\n- **Currency**: Chinese Yuan (CNY)\n\nEnjoy your journey through this beautiful city where mountains meet the sea! 🏔️🌊`;
}

function displayItinerary(itinerary) {
  const resultPlaceholder = $('#itineraryResult');
  const contentDiv = $('#itineraryContent');

  resultPlaceholder.classList.add('hidden');
  contentDiv.innerHTML = markdownToHtml(itinerary);
  contentDiv.classList.remove('hidden');
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
// Music Player Section (Deprecated - kept for reference)
// ========================================

function initMusicPlayer() {
  const generateBtn = $('#generateMusicBtn');
  if (!generateBtn) return; // Section removed from HTML

  // Music player functionality removed
  console.log('Music player section has been replaced with video section');
}

async function mockGenerateMusic(prompt) {
  // This is a mock function. In production:
  // 1. You need a backend endpoint to call the Lyria API securely
  // 2. The API returns base64 audio data that needs to be converted to a Blob
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // For demo purposes, return a placeholder audio URL
  // In production, this would be a blob URL created from the API response
  console.log('Music prompt:', prompt);
  
  // Return null to indicate this is a mock (no actual audio)
  // In production, return the actual blob URL
  return null;
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
  initItinerary();
  initVideoPlayer();
  initMusicPlayer();
  initFooter();

  console.log('🎋 Wenzhou Impressions - Loaded successfully!');
});

// ========================================
// API Integration Notes
// ========================================

/*
To make the AI features work in production, you need to:

1. **Explore Search & Itinerary:**
   - Set up a backend endpoint (Node.js/Express, Python/Flask, etc.)
   - Use the Google GenAI SDK on the backend
   - Call the Gemini API from your backend
   - Frontend makes requests to your backend endpoint

2. **Music Generation:**
   - Similar setup with backend proxy
   - Use the Lyria API through Google GenAI
   - Handle the streaming response and convert base64 to audio blob
   - Return the audio URL to frontend

3. **Environment Variables:**
   - Store GEMINI_API_KEY securely on your backend
   - Never expose API keys in frontend code

Example backend endpoint structure:

```javascript
// server.js (Express example)
app.post('/api/explore', async (req, res) => {
  const { query } = req.body;
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const result = await ai.models.generateContent({...});
  res.json(result);
});
```
*/
