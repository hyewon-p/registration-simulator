var modal = document.getElementById("myModal");
var btn = document.querySelector("button");
var span = document.getElementsByClassName("close")[0];
var enterButtons = document.getElementsByClassName("enter_button");

timeover = false;

wishList = [];
courseList = [];
limitTime = {
  hour: Number(localStorage.getItem("limitTime").split(":")[0]),
  minute: Number(localStorage.getItem("limitTime").split(":")[1]),
};

var http = new XMLHttpRequest();
http.open("GET", "./courses.json", false);
http.send();
var courses = JSON.parse(http.responseText);

function getWishList() {
  var globalwish = [];
  if (localStorage.getItem("wishlist")) {
    globalwish = localStorage.getItem("wishlist").split(",");
  }
  return globalwish;
}

function syncWishlist() {
  wishList = [];
  var globalwish = getWishList();
  for (var wish of globalwish) {
    courses.find(function findCourse(e) {
      if (e.code == wish) {
        wishList.push(e);
        return;
      }
    });
  }
}

function getIndex(ele) {
  var i = 0;
  while ((ele = ele.previousSibling) != null) {
    i++;
  }
  return i - 1;
}

function upButtonHandler() {
  var wishListIndex = getIndex(this.parentElement.parentElement);
  if (wishListIndex == 0) return;
  var globalwish = getWishList();
  var temp = globalwish[wishListIndex - 1];
  globalwish[wishListIndex - 1] = globalwish[wishListIndex];
  globalwish[wishListIndex] = temp;
  localStorage.setItem("wishlist", globalwish);
  drawWishlist();
}

function downButtonHandler() {
  var wishListIndex = getIndex(this.parentElement.parentElement);
  var globalwish = getWishList();
  if (wishListIndex == globalwish.length - 1) return;
  var temp = globalwish[wishListIndex + 1];
  globalwish[wishListIndex + 1] = globalwish[wishListIndex];
  globalwish[wishListIndex] = temp;
  localStorage.setItem("wishlist", globalwish);
  console.log(globalwish);
  drawWishlist();
}

var wishlistHead =
  "<tr><th>수강신청</th><th>학수번호</th><th>과목명</th><th>학점</th><th>강의시간</th><th>점수</th><th>정렬순서</th></tr>";

function drawWishlist() {
  syncWishlist();
  var inner = "";
  for (var wish of wishList) {
    inner +=
      "<tr id='tr_" +
      wish.code +
      "'><td><button class='enter_button'>Enter</button></td><td class='course_code'>" +
      wish.code +
      "</td><td>" +
      wish.name +
      "</td><td>" +
      wish.credit +
      "</td><td>" +
      wish.time +
      "</td><td>" +
      wish.score +
      "</td><td><button class='up_button'>↑</button><button class='down_button'>↓</button></td></tr>";
  }

  var wishTable = document.getElementById("wishlist_table");
  wishTable.innerHTML = wishlistHead + inner;
  var upButtons = document.getElementsByClassName("up_button");
  for (var button of upButtons) {
    button.addEventListener("click", upButtonHandler);
  }
  var downButtons = document.getElementsByClassName("down_button");
  for (var button of downButtons) {
    button.addEventListener("click", downButtonHandler);
  }
  for (var button of enterButtons) {
    button.addEventListener("click", openModal);
  }
}

drawWishlist();

finalCredit = 0;
finalScore = 0;

var creditSpan = document.getElementById("credit");
var scoreSpan = document.getElementById("score");
updateScore();

function updateScore() {
  creditSpan.innerText = finalCredit;
  scoreSpan.innerText = finalScore;
}

function openModal() {
  var code =
    this.parentElement.parentElement.getElementsByClassName("course_code")[0]
      .innerText;
  var course = courses.find(function findCourse(e) {
    if (e.code == code) {
      return e;
    }
  });

  var currentDate = new Date();
  var currentTime = {
    hour: currentDate.getHours(),
    minute: currentDate.getMinutes(),
    second: currentDate.getSeconds(),
  };

  limitS = (13 - course.score * 0.15) ** 2 * 0.06;

  if (
    currentTime.hour < limitTime.hour ||
    (currentTime.hour == limitTime.hour &&
      currentTime.minute < limitTime.minute)
  ) {
    console.log(
      "아직 수강신청 시간이 되지 않았습니다. \n지정 시간:",
      limitTime.hour + ":" + limitTime.minute,
      "~"
    );
    return;
  } else if (
    currentTime.hour > limitTime.hour ||
    currentTime.minute > limitTime.minute ||
    currentTime.second > limitS
  ) {
    timeover = true;
  } else {
    timeover = false;
  }
  modal.style.display = "block";
  setTimeout(closeModal, 300);
  if (timeover) {
    modal.style.display = "block";
    setTimeout(closeModal, 300);
    this.parentElement.style.color = "blue";
    this.parentElement.innerHTML = "수강대기";
  } else {
    courseList.push(course);
    finalCredit += course.credit;
    finalScore += course.score;
    updateScore();
    drawCourselist();
    this.parentElement.style.color = "red";
    this.parentElement.innerHTML = "신청완료";
  }
  console.log(
    "\n• 현재 시각",
    currentTime.minute + ":" + currentTime.second,
    "\n• 제한 시각",
    limitTime.minute + ":" + limitS
  );
}

function delCourse() {
  var code =
    this.parentElement.parentElement.getElementsByClassName("course_code")[0]
      .innerText;
  for (var i = 0; i < courseList.length; i++) {
    if (courseList[i].code === code) {
      finalCredit -= courseList[i].credit;
      finalScore -= courseList[i].score;
      updateScore();
      courseList.splice(i, 1);
      break;
    }
  }
  document.querySelector("#tr_" + code + ">td").innerHTML =
    "<button class='enter_button'>Enter</button>";
  document
    .querySelector("#tr_" + code + ">td>button")
    .addEventListener("click", openModal);
  drawCourselist();
  timeover = true;
}

function closeModal() {
  modal.style.display = "none";
}

var head =
  "<tr><th>No</th><th>수강삭제</th><th>학수번호</th><th>과목명</th><th>학점</th><th>강의시간</th><th>점수</th></tr>";

function drawCourselist() {
  var inner = "";
  for (var i = 0; i < courseList.length; i++) {
    inner +=
      "<tr><td>" +
      i +
      "</td><td><button class='del_button'>Del</button></td><td class='course_code'>" +
      courseList[i].code +
      "</td><td>" +
      courseList[i].name +
      "</td><td>" +
      courseList[i].credit +
      "</td><td>" +
      courseList[i].time +
      "</td><td>" +
      courseList[i].score +
      "</td></tr>";
  }

  var courseTable = document.getElementById("courselist_table");
  courseTable.innerHTML = head + inner;

  var delButtons = document.getElementsByClassName("del_button");
  for (var button of delButtons) {
    button.addEventListener("click", delCourse);
  }
}
