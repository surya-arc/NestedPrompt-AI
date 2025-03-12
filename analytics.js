/**
 * NestedPrompt-AI Analytics Module
 * Tracks user interactions and engagement metrics
 */

// Basic analytics tracking
class PromptAnalytics {
  constructor() {
    this.sessionStartTime = new Date();
    this.interactions = [];
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Track prompt submissions
    document.getElementById('enhance-button')?.addEventListener('click', () => {
      this.trackEvent('prompt_submitted', {
        promptLength: document.getElementById('user-prompt')?.value?.length || 0
      });
    });

    // Track example clicks
    document.querySelectorAll('.example-card').forEach(card => {
      card.addEventListener('click', () => {
        this.trackEvent('example_clicked', {
          exampleType: card.querySelector('.example-title')?.textContent || 'Unknown'
        });
      });
    });

    // Track time on page
    window.addEventListener('beforeunload', () => {
      const sessionDuration = (new Date() - this.sessionStartTime) / 1000;
      this.trackEvent('session_ended', {
        durationSeconds: sessionDuration,
        interactionCount: this.interactions.length
      });
      
      // Send final analytics data
      this.sendAnalyticsData();
    });
  }

  trackEvent(eventName, eventData = {}) {
    const event = {
      timestamp: new Date().toISOString(),
      eventName,
      eventData,
      url: window.location.href,
      referrer: document.referrer || 'direct'
    };
    
    this.interactions.push(event);
    console.log('Event tracked:', eventName);
    
    // For real implementation, you would batch send these events
    // this.sendAnalyticsData();
  }

  sendAnalyticsData() {
    // In a production environment, you would send this data to your analytics service
    // For now, we'll just log it
    console.log('Analytics data:', this.interactions);
    
    // Example of how you might send this to a server
    /*
    fetch('https://nestedprompt-ai.com/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        events: this.interactions,
        userAgent: navigator.userAgent,
        screenSize: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      })
    });
    */
  }
}

// Implement structured data enhancement for SERPs
function injectStructuredData() {
  // Add WebSite schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NestedPrompt-AI",
    "url": "https://nestedprompt-ai.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://nestedprompt-ai.com/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
  
  // Add BreadcrumbList schema for better navigation display in search results
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://nestedprompt-ai.com"
      }
    ]
  };
  
  // Inject schemas into page
  const script1 = document.createElement('script');
  script1.type = 'application/ld+json';
  script1.text = JSON.stringify(websiteSchema);
  document.head.appendChild(script1);
  
  const script2 = document.createElement('script');
  script2.type = 'application/ld+json';
  script2.text = JSON.stringify(breadcrumbSchema);
  document.head.appendChild(script2);
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const analytics = new PromptAnalytics();
  injectStructuredData();
  
  // Add page load timing for Core Web Vitals improvement
  if (window.performance) {
    const pageLoadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    analytics.trackEvent('page_loaded', { 
      loadTimeMs: pageLoadTime,
      url: window.location.href
    });
  }
});