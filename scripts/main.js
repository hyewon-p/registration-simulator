var limitTime;

function login(e) {
  e.preventDefault();
  limitTime = e.target.limitTime.value;
  localStorage.setItem("limitTime", limitTime);
  location.href = "./help.html";
  return;
}

var loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", login);
