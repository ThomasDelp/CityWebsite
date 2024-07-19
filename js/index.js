
var c, currentScrollTop = 0, navbar, sections;
var deep_step = 500
document.addEventListener("DOMContentLoaded", () => {
  navbar = document.getElementById('navbar');
  sections = document.getElementsByTagName('section');
  backScrolling = document.getElementById('back-scrolling');
  barScrolling = document.getElementById('bar-scrolling');
  buttonScrolling = document.getElementById('bar-scrolling-button');


  let incr = 0
  for (let section of sections) {
    section.style.transform = `perspective(500px) translateZ(-${deep_step*incr}px)`;
    incr++
  }
  console.log(sections)
});

document.addEventListener("scroll", () => {
  var a = window.scrollY;
  var b = backScrolling.offsetHeight;
  let part = b/4
  let idChoosen = Math.floor(a/part)

  currentScrollTop = a;
  let incrId = 0
  let incr = 0 - 1 * (a/part)

  for (let section of sections) {
    console.log(incrId-1)
    console.log(idChoosen)
    console.log(incrId)
    section.style.transform = `perspective(500px) translateZ(-${deep_step*incr}px)`;
    if (incrId<idChoosen){
      section.style.opacity = `0`;
      section.style.zIndex  = `0`;
    }else if (incrId<=idChoosen && incrId+1>idChoosen){
      section.style.opacity = `0.5`;
      section.style.zIndex  = `1`;
      section.style.color ='rgba(0,0,0,1)'
    }else{
      section.style.opacity = `0.5`;
      section.style.zIndex  = `0`;
    }
    //if()
    incr++
    incrId++
  }

  let scrollingRatio = a/b
  buttonScrolling.style.marginTop = `${scrollingRatio*barScrolling.offsetHeight}px`;
});

document.addEventListener("click", (e) => {
  var b = backScrolling.offsetHeight;
  let part = b/4
  if (e.target.tagName=="A"){
    console.log(e.target.id)
    switch (e.target.id) {
      case 'section-home' :
        window.scroll(0,0);
        break;
      case 'section-1' :
        window.scroll(0,part);
        break;
      case 'section-2' :
        window.scroll(0,part*2);
        break;
      case 'section-3' :
        window.scroll(0,part*3);
        break;
      
    }
  }
  console.log(e)
})