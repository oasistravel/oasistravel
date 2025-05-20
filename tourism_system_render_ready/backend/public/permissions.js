// roles: admin, editor, viewer, sales
function checkPermission(allowedRoles = []) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !allowedRoles.includes(user.role)) {
    alert('غير مسموح لك بالوصول إلى هذه الصفحة');
    window.location.href = '/dashboard.html';
  }
}

// Example usage per page
// checkPermission(['admin', 'editor']); // call this in each page to restrict