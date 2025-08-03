function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function createParticles() {
  const particlesContainer = document.querySelector('.particles');
  const particleCount = window.innerWidth < 768 ? 40 : 80;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = Math.random() * 3 + 1 + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = `rgba(${Math.random() * 55 + 200}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`;
    particle.style.animationDuration = Math.random() * 10 + 5 + 's';
    particle.style.animationDelay = Math.random() * 5 + 's';
    particlesContainer.appendChild(particle);
  }
}

function showNotification(message, type = 'info', duration = 5000) {
  const container = document.querySelector('.notification-container');
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  const icon = document.createElement('span');
  icon.className = 'notification-icon';
  icon.textContent = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  const messageSpan = document.createElement('span');
  messageSpan.textContent = sanitizeHTML(message);
  const closeBtn = document.createElement('span');
  closeBtn.className = 'notification-close';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', () => notification.remove());
  closeBtn.addEventListener('touchstart', () => notification.remove());
  notification.appendChild(icon);
  notification.appendChild(messageSpan);
  notification.appendChild(closeBtn);
  container.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, duration);
}

async function fetchWithRetry(url, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.text();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

async function fetchNews() {
  const newsGrid = document.getElementById('news-grid');
  newsGrid.innerHTML = '<div class="news-loading"><div class="loading-bar"></div><p>Loading news...</p></div>';
  const feeds = [
    { url: 'https://www.bleepingcomputer.com/feed/', source: 'BleepingComputer' },
    { url: 'https://thehackernews.com/feed', source: 'The Hacker News' },
    { url: 'https://www.darkreading.com/rss.xml', source: 'Dark Reading' }
  ];
  let articles = [];
  let errors = [];
  for (const feed of feeds) {
    try {
      const text = await fetchWithRetry('https://api.allorigins.win/raw?url=' + encodeURIComponent(feed.url));
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      const items = xmlDoc.querySelectorAll('item');
      if (items.length > 0) {
        Array.from(items).forEach(item => {
          const title = sanitizeHTML(item.querySelector('title')?.textContent || 'No title');
          let description = item.querySelector('description')?.textContent || 'No description';
          const link = item.querySelector('link')?.textContent || '#';
          const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
          const enclosure = item.querySelector('enclosure');
          const mediaContent = item.querySelector('media\\:content, content');
          const mediaThumbnail = item.querySelector('media\\:thumbnail, thumbnail');
          let imgSrc = 'https://placehold.co/300x150?text=News+Image';
          if (enclosure && enclosure.getAttribute('url')?.match(/\.(jpg|jpeg|png|gif)$/i)) {
            imgSrc = enclosure.getAttribute('url');
          } else if (mediaContent && mediaContent.getAttribute('url')?.match(/\.(jpg|jpeg|png|gif)$/i)) {
            imgSrc = mediaContent.getAttribute('url');
          } else if (mediaThumbnail && mediaThumbnail.getAttribute('url')?.match(/\.(jpg|jpeg|png|gif)$/i)) {
            imgSrc = mediaThumbnail.getAttribute('url');
          } else {
            const descriptionDiv = document.createElement('div');
            descriptionDiv.innerHTML = description;
            const img = descriptionDiv.querySelector('img');
            if (img && img.src?.startsWith('https')) {
              imgSrc = img.src;
            }
          }
          const descriptionDiv = document.createElement('div');
          descriptionDiv.innerHTML = description;
          description = sanitizeHTML(descriptionDiv.textContent.substring(0, 150) + '...');
          if (!imgSrc.startsWith('https')) {
            imgSrc = 'https://placehold.co/300x150?text=News+Image';
          }
          articles.push({ title, description, link, pubDate, imgSrc, source: feed.source });
        });
      }
    } catch (error) {
      console.error(`Error fetching ${feed.source} feed:`, error);
      errors.push(feed.source);
    }
  }
  articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  articles = articles.slice(0, 6);
  if (articles.length === 0) {
    newsGrid.innerHTML = '<p class="news-error">Unable to load news. Please check your connection and try again later.</p>';
    showNotification('Failed to load news from all sources.', 'error');
    return;
  }
  newsGrid.innerHTML = '';
  articles.forEach(article => {
    const newsCard = document.createElement('div');
    newsCard.className = 'news-card';
    newsCard.innerHTML = `
      <img src="${sanitizeHTML(article.imgSrc)}" alt="${sanitizeHTML(article.title)}" onerror="this.src='https://placehold.co/300x150?text=News+Image';">
      <h3 class="news-title">${sanitizeHTML(article.title)}</h3>
      <p class="news-description">${sanitizeHTML(article.description)}</p>
      <p class="news-source">Source: ${sanitizeHTML(article.source)} | ${new Date(article.pubDate).toLocaleDateString()}</p>
      <a href="${sanitizeHTML(article.link)}" target="_blank" rel="noopener noreferrer" class="news-link">Read More</a>
    `;
    newsGrid.appendChild(newsCard);
  });
  if (errors.length > 0) {
    showNotification(`Some sources (${errors.join(', ')}) failed to load.`, 'info');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  fetchNews();
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.animate-on-scroll').forEach(element => {
    observer.observe(element);
  });
  setTimeout(() => {
    document.querySelector('.loading-screen').classList.add('hidden');
  }, 2000);
});
