var btn=document.querySelector(".custom-control-input");
var lab=document.querySelector("label")
var bdy=document.querySelector("body");
var h4=document.querySelectorAll("h4");
var cl=document.querySelectorAll(".cl");
var tdm=document.querySelectorAll(".para");
var bt=document.querySelectorAll(".btn");
var jmb=document.querySelector(".jumbotron")



btn.addEventListener("click",function(){	
	if(bdy.style.backgroundColor=="black"){
	jmb.style.backgroundColor="rgb(84, 90, 182)";
	bdy.style.backgroundColor="white";
	bdy.classList.toggle('apply');
	bdy.style.color="white";
	lab.innerHTML="Activate Dark mode";
	lab.style.color="white"
	jmb.style.border="none";

	for(var j=0;j<h4.length;j++)
	{
	h4[j].style.color="black";
	cl[j].style.border="none";
	}
	for(var j=0;j<bt.length;j++)
	{
	bt[j].style.backgroundColor="#007bff";
	bt[j].style.color="white";
	}
	}


	else{
	jmb.style.backgroundColor="#212121";
	bdy.style.background="none";
	bdy.style.backgroundColor="black";
	// bdy.style.color="white";
	lab.innerHTML="Dark mode";
	lab.style.color="white"
	jmb.style.border="1px solid blue";

	for(var j=0;j<h4.length;j++)
	{
	h4[j].style.color="#01b7ee";
	// cl[j].style.border="1px solid #01b7ee ";
	}
	for(var j=0;j<bt.length;j++)
	{
	bt[j].style.backgroundColor="black";
	bt[j].style.color="#01b7ee"
	}
	}
})