export function showToast(message, type = 'info') {
  // Remove toasts anteriores do mesmo tipo
  const existingToasts = document.querySelectorAll(`.toast-${type}`);
  existingToasts.forEach(toast => toast.remove());

  // Cria o novo toast
  const toast = document.createElement('div');
  toast.className = `toast toast-top toast-end z-50 toast-${type}`;

  const alert = document.createElement('div');
  alert.className = `alert ${getAlertClass(type)}`;
  
  const content = document.createElement('span');
  content.textContent = message;
  
  alert.appendChild(content);
  toast.appendChild(alert);
  document.body.appendChild(toast);

  // Remove após 3 segundos
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function getAlertClass(type) {
  const classes = {
    error: 'alert-error',
    warn: 'alert-warning',
    info: 'alert-info',
    success: 'alert-success'
  };
  return classes[type] || 'alert-info';
} 