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
	jmb.style.backgroundColor="#e9ecef";
	bdy.style.backgroundColor="white";
	bdy.style.color="black";
	lab.innerHTML="Activate Evil mode";
	lab.style.color="black"
	jmb.style.border="none";

	for(var j=0;j<h4.length;j++)
	{
	h4[j].style.color="black";
	cl[j].style.border="none";
	}
	for(var j=0;j<bt.length;j++)
	{
	bt[j].style.backgroundColor="#007bff";
	}
	}


	else{
	jmb.style.backgroundColor="black";
	bdy.style.backgroundColor="black";
	bdy.style.color="white";
	lab.innerHTML="Evil mode";
	lab.style.color="blue"
	jmb.style.border="1px solid blue";

	for(var j=0;j<h4.length;j++)
	{
	h4[j].style.color="blue";
	cl[j].style.border="1px solid blue";
	}
	for(var j=0;j<bt.length;j++)
	{
	bt[j].style.backgroundColor="blue";
	}
	}
})