// var subjectTable = document.getElementsByClassName("subject_table");

var http = new XMLHttpRequest();

http.open("GET", "./courses.json", false);
http.send();

var courses = JSON.parse(http.responseText);

var head =
  "<tr><th>장바구니담기</th><th>학수번호</th><th>과목명</th><th>학점</th><th>강의시간</th><th>점수</th></tr>";

function getWishList() {
  var globalwish = [];
  if (localStorage.getItem("wishlist")) {
    globalwish = localStorage.getItem("wishlist").split(",");
  }
  return globalwish;
}

function addWish() {
  var globalwish = getWishList();
  var code =
    this.parentElement.parentElement.getElementsByClassName("course_code")[0]
      .innerText;
  if (globalwish.includes(code)) {
    return;
  }
  globalwish.push(code);
  localStorage.setItem("wishlist", globalwish);
  drawWishlist();
}

function draw(e) {
  e.preventDefault();
  var inner = "";
  for (var course of courses) {
    if (course.name.includes(e.target.course_name.value)) {
      inner +=
        "<tr><td><button class='add_button'>Add</button></td><td class='course_code'>" +
        course.code +
        "</td><td>" +
        course.name +
        "</td><td>" +
        course.credit +
        "</td><td>" +
        course.time +
        "</td><td>" +
        course.score +
        "</td></tr>";
    }
  }

  var subjectTable = document.getElementById("subject_table");
  subjectTable.innerHTML = head + inner;
  var addButtons = document.getElementsByClassName("add_button");
  for (var button of addButtons) {
    button.addEventListener("click", addWish);
  }
}

var searchButton = document.getElementById("wishList_search");

var searchForm = document.getElementById("main_partial_search");
searchForm.addEventListener("submit", draw);

function deleteWish() {
  var globalwish = getWishList();
  var code =
    this.parentElement.parentElement.getElementsByClassName("course_code")[0]
      .innerText;
  for (var i = 0; i < globalwish.length; i++) {
    if (globalwish[i] === code) {
      globalwish.splice(i, 1);
      break;
    }
  }
  localStorage.setItem("wishlist", globalwish);
  drawWishlist();
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
  drawWishlist();
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

var wishlistHead =
  "<tr><th>삭제</th><th>학수번호</th><th>과목명</th><th>학점</th><th>강의시간</th><th>점수</th><th>정렬순서</th></tr>";

function drawWishlist() {
  syncWishlist();
  var inner = "";
  for (var wish of wishList) {
    inner +=
      "<tr id='tr_" +
      wish.code +
      "'><td><button class='del_button'>Del</button></td><td class='course_code'>" +
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
  var delButtons = document.getElementsByClassName("del_button");
  for (var button of delButtons) {
    button.addEventListener("click", deleteWish);
  }
}
drawWishlist();
