var img= document.querySelector("img");
var ar=["http://i.imgur.com/K3mPv14.jpg","http://i.imgur.com/SBEmFpv.jpg","http://i.imgur.com/emvhOnb.jpg","http://i.imgur.com/2LSMCmJ.jpg","http://i.imgur.com/TVGe0Ef.jpg"];
var i=1;
setInterval(function()
{	
		img.src=ar[i];
	
		i++;
		if(i>4)
		{
		i=0;
		}
	

},5000);
;	
		