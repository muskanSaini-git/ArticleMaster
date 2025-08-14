// Toast notification service for the application
class ToastService {
  constructor() {
    this.toastContainer = null;
    this.init();
  }

  init() {
    // Create toast container if it doesn't exist
    if (!this.toastContainer) {
      this.toastContainer = document.createElement('div');
      this.toastContainer.id = 'toast-container';
      this.toastContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      `;
      document.body.appendChild(this.toastContainer);
    }
  }

  show(message, type = 'info', duration = 5000) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `modern-toast ${type}`;
    toast.style.cssText = `
      pointer-events: auto;
      min-width: 300px;
      max-width: 400px;
      animation: slideInRight 0.3s ease-out;
    `;

    // Get icon based on type
    const getIcon = () => {
      switch (type) {
        case 'success':
          return '✅';
        case 'error':
          return '❌';
        case 'warning':
          return '⚠️';
        case 'info':
        default:
          return 'ℹ️';
      }
    };

    toast.innerHTML = `
      <div class="modern-toast-content">
        <span style="margin-right: 8px;">${getIcon()}</span>
        <span>${message}</span>
      </div>
      <button class="modern-toast-close" title="Close message" style="
        background: none;
        border: none;
        color: inherit;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
        opacity: 0.7;
        transition: opacity 0.2s;
      ">×</button>
    `;

    // Add close functionality
    const closeBtn = toast.querySelector('.modern-toast-close');
    closeBtn.addEventListener('click', () => {
      this.removeToast(toast);
    });

    // Add to container
    this.toastContainer.appendChild(toast);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(toast);
      }, duration);
    }

    return toast;
  }

  removeToast(toast) {
    if (toast && toast.parentNode) {
      toast.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }

  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  error(message, duration) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration) {
    return this.show(message, 'info', duration);
  }

  clear() {
    if (this.toastContainer) {
      this.toastContainer.innerHTML = '';
    }
  }
}

// Create global instance
const toastService = new ToastService();

// Add to window for global access
if (typeof window !== 'undefined') {
  window.showToast = (message, type, duration) => {
    return toastService.show(message, type, duration);
  };
  
  window.toastService = toastService;
}

export default toastService;
