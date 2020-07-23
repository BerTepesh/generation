
var couples = document.querySelectorAll("#burn-couples span");

var button = document.querySelector("#move");
button.addEventListener("click", animateCouples, false);

let timerInterval = null;



function animateCouples() {
  //couples.style.transform = `rotate(90deg)`;
  let maxTop = 52;
  let maxleft = 150;
  let gutter = 40;
  couples.forEach(function(e, index) {
    var xPos = 10;
    var yPos = 0;
    timerInterval = setInterval(function() {
        e.style.left = xPos + 'px';
        e.style.top = yPos - (index * gutter) + 'px';
       if(yPos <= (maxTop - (index * gutter))) {
         if(yPos == (maxTop - (index * gutter) - 10)) {
           e.style.transform = `rotate(0)`;
         }
         yPos += 1 ;
       } else if(xPos <= 150) {
       if(xPos == 138) {
         e.style.transform = `rotate(90deg)`;
       }
       xPos += 1;
       } else if(yPos <= 150) {
        yPos += 1;
       } else if(yPos >= 150) {
       xPos = 10;
       yPos = 0;
       }
      }, 55);

  });
}
