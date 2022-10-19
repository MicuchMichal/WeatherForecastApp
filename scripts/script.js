//year
const datum = document.getElementById('date');
let Rok = new Date().getFullYear();
datum.innerHTML = Rok;

const toggleButton = document.querySelector(".toggleButton");
const linksContainer = document.querySelector(".linksContainer");
const links = document.querySelector(".links");

//navbar 
toggleButton.addEventListener('click', function(){
  const containerHeight = linksContainer.getBoundingClientRect().height;
  const linksHeight = links.getBoundingClientRect().height;
  if(containerHeight===0){
    linksContainer.style.height = `${linksHeight}px`;
  }
  else {
    linksContainer.style.height = 0;
  }
})

//fixed navbar
const navbar = document.getElementById("navBar");
const topLink = document.querySelector('.returningButton');

window.addEventListener("scroll", function() {
  const scrollHeight = window.pageYOffset;
  const navHeight = navbar.getBoundingClientRect().height;
  if (scrollHeight > navHeight){
    navbar.classList.add("fixed-nav");
  }
  else {
    navbar.classList.remove("fixed-nav");
  }

  if(scrollHeight > 500){
    topLink.classList.add('show-link');
  }
  else {
    topLink.classList.remove("show-link");
  }
})

//smooth scroll
const scrollLinks = document.querySelectorAll('.scroll-link');

scrollLinks.forEach(function(link){
  link.addEventListener("click", function(event){
    event.preventDefault();
    const id = event.currentTarget.getAttribute('href').slice(1);
    const element = document.getElementById(id);
    const navHeight = navbar.getBoundingClientRect().height;
    const containerHeight = linksContainer.getBoundingClientRect().height;
    const fixedNav = navbar.classList.contains('fixed-nav');
    let position = element.offsetTop - navHeight;

    if(!fixedNav){
      position = position - navHeight;
    }
    if (navHeight > 82){
      position = position + containerHeight;
    }
    window.scrollTo ({
      left: 0,
      top: position,
    })
    linksContainer.style.height = 0;
  })
})

