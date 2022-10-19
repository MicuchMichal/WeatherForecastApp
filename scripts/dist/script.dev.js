"use strict";

//year
var datum = document.getElementById('date');
var Rok = new Date().getFullYear();
datum.innerHTML = Rok;
var toggleButton = document.querySelector(".toggleButton");
var linksContainer = document.querySelector(".linksContainer");
var links = document.querySelector(".links"); //navbar 

toggleButton.addEventListener('click', function () {
  var containerHeight = linksContainer.getBoundingClientRect().height;
  var linksHeight = links.getBoundingClientRect().height;

  if (containerHeight === 0) {
    linksContainer.style.height = "".concat(linksHeight, "px");
  } else {
    linksContainer.style.height = 0;
  }
}); //fixed navbar

var navbar = document.getElementById("navBar");
var topLink = document.querySelector('.returningButton');
window.addEventListener("scroll", function () {
  var scrollHeight = window.pageYOffset;
  var navHeight = navbar.getBoundingClientRect().height;

  if (scrollHeight > navHeight) {
    navbar.classList.add("fixed-nav");
  } else {
    navbar.classList.remove("fixed-nav");
  }

  if (scrollHeight > 500) {
    topLink.classList.add('show-link');
  } else {
    topLink.classList.remove("show-link");
  }
}); //smooth scroll

var scrollLinks = document.querySelectorAll('.scroll-link');
scrollLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    var id = event.currentTarget.getAttribute('href').slice(1);
    var element = document.getElementById(id);
    var navHeight = navbar.getBoundingClientRect().height;
    var containerHeight = linksContainer.getBoundingClientRect().height;
    var fixedNav = navbar.classList.contains('fixed-nav');
    var position = element.offsetTop - navHeight;

    if (!fixedNav) {
      position = position - navHeight;
    }

    if (navHeight > 82) {
      position = position + containerHeight;
    }

    window.scrollTo({
      left: 0,
      top: position
    });
    linksContainer.style.height = 0;
  });
});