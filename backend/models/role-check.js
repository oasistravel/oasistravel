
// role-check.js
function protectPage(allowedRoles = []) {
  const role = localStorage.getItem("role");
  if (!allowedRoles.includes(role)) {
    window.location.href = "/unauthorized.html";
  }
}
