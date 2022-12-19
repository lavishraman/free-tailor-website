	$(document).ready(function(){
		
   
      $('.items').slick({
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1
      });
    });


(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 56)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 56
  });

})(jQuery); // End of use strict

var hei = 0;
var img;


function loadFile(event){
  let image = document.getElementById('output');
  image.src = URL.createObjectURL(event.target.files[0]);
}

function loadFile1(event){
  let image = document.getElementById('output1');
  image.src = URL.createObjectURL(event.target.files[0]);
}

window.addEventListener("load",function(){
  document.getElementById("form").addEventListener("submit",function(e){
    e.preventDefault();
    hei = document.getElementById("height").value;
    front = document.getElementById("output");
    side = document.getElementById("output1");
    console.log(hei);
    console.log(front);
    loadAndPredict(front,side,hei);
  });
});

async function loadAndPredict(frontImg,sideImg,hei) 
    {
      const net = await bodyPix.load(/** optional arguments, see below **/);

    //img1
      const segmentation1 = await net.segmentPersonParts(frontImg);
      console.log(segmentation1);
      const pixel1 = segmentation1.data; //1d matrix
      const height1 = segmentation1.height; //height of matrix
      const width1 = segmentation1.width; //width of matrix
      const pixel2d1 = matrix(height1,width1,pixel1); //2d matrix
      const realHeight1 = hei; // Height of human in cm

      //img2
      const segmentation2 = await net.segmentPersonParts(sideImg);
      console.log(segmentation2);
      const pixel2 = segmentation2.data; //1d matrix
      const height2 = segmentation2.height; //height of matrix
      const width2 = segmentation2.width; //width of matrix
      const pixel2d2 = matrix(height2,width2,pixel2); //2d matrix
      const realHeight2 = hei; // Height of human in cm

      const s1 = scale(pixel2d1,height1,width1,realHeight1); //scaling factor
      console.log("Scaling Factor",s1);

      const s2 = scale(pixel2d2,height2,width2,realHeight2); 

      const armL = armLength(pixel2d1,height1,width1,s1); 
      console.log("Arm Length",armL);
      const legL = legs(pixel2d1,height1,width1,s1);
      console.log("Leg Length",legL);
      const shoulderL = shoulder(pixel2d1,height1,width1,s1);
      console.log("Shoulder width",shoulderL);

      const frontChestL = frontChest(pixel2d1,height1,width1,s1);
      console.log("Chest front",frontChestL);
      const sideChestL = sideChest(pixel2d2,height2,width2,s2);
      console.log("Chest side",sideChestL);
      const chestCircumL = chestCircum(frontChestL/2,sideChestL/2);
      console.log("Chest Circumference ",chestCircumL);

      const frontWaistL = frontWaist(pixel2d1,height1,width1,s1);
      console.log("Waist front",frontWaistL);
      const sideWaistL = sideWaist(pixel2d2,height2,width2,s2);
      console.log("Waist side",sideWaistL);
      const waistCircumL = waistCircum(frontWaistL/2,sideWaistL/2);
      console.log("Waist Circumference ",waistCircumL);

      const arm = document.getElementById('arm');
      const leg = document.getElementById('leg');
      const shoulders = document.getElementById('shoulder');
      const chest = document.getElementById('chest');
      const waist = document.getElementById('waist');

      arm.innerHTML = "Arm Length: "+armL.toPrecision(4) + " cm";
      leg.innerHTML = "Leg Length: "+legL.toPrecision(4) + " cm";
      shoulders.innerHTML = "Shoulder Length: "+shoulderL.toPrecision(4) + " cm";
      chest.innerHTML = "Chest Circumference: "+chestCircumL.toPrecision(4) + " cm";
      waist.innerHTML = "Waist Circumference: "+waistCircumL.toPrecision(4) + " cm";

      // MASKING
      
      // const canvas = document.getElementById('canvas');
      // const part = await bodyPix.toColoredPartMask(segmentation1);
      // bodyPix.drawMask(canvas,front,part,0.7,0,false);
    
      /*
      const armD = document.getElementById('armD');
      const LegD = document.getElementById('LegD');
      const ShouldD = document.getElementById('ShouldD');
      const scal = document.getElementById('scale');
      scal.innerHTML = "Scaling Factor :- " + s.toPrecision(4) + " px/cm";
      armD.innerHTML = "Arm Length :- " + armL.toPrecision(4) + " cm";
      LegD.innerHTML = "Leg Length :- " + legL.toPrecision(4) + " cm";
      ShouldD.innerHTML = "Shoulder width :- " + shoulderL.toPrecision(4) + " cm";
      */
     const chestSize = HMChest(chestCircumL);
     const waistSize = HMWaist(waistCircumL);
     const chestSizeZara = zaraChest(chestCircumL);
     const waistSizeZara = zaraWaist(waistCircumL);
     const chestSizeMS = marksChest(chestCircumL);
     const waistSizeMS = marksWaist(waistCircumL);

     const hmchest = document.getElementById("chestHM");
     hmchest.innerHTML="Recommended T-Shirt Size : "+chestSize;
    const hmwaist =  document.getElementById("waistHM");
    hmwaist.innerHTML="Recommended Trouser Size : "+waistSize;

    const zarachest = document.getElementById("chestZara");
     zarachest.innerHTML="Recommended T-Shirt Size : "+chestSizeZara;
    const zarawaist =  document.getElementById("waistZara");
    zarawaist.innerHTML="Recommended Trouser Size : "+waistSizeZara;

    const mschest = document.getElementById("chestMS");
     mschest.innerHTML="Recommended T-Shirt Size : "+chestSizeMS;
    const mswaist =  document.getElementById("waistMS");
    mswaist.innerHTML="Recommended Trouser Size : "+waistSizeMS;

    }

    function matrix( rows, cols, pixels)
    {
      var k = 0;
      var arr = [];
      
      // Creates all lines:
      for(var i=0; i < rows; i++){
    
          // Creates an empty line
          arr.push([]);
    
          // Adds cols to the empty line:
          arr[i].push( new Array(cols));
    
          for(var j=0; j < cols; j++){
            // Initializes:
            arr[i][j] = pixels[k++];
          }
      }
    return arr;
    }

    function HMChest(len){
      if(len <= 86){
        return "XS"
      }
      else if(len <= 94){
        return "S";
      }
      else if(len <= 102){
        return "M";
      }
      else if(len <= 110){
        return "L";
      }
      else if(len <= 118){
        return "XL";
      }
      else if(len <= 126){
        return "XXL";
      }
      else{
        return "3XL";
      }
    }

    function HMWaist(len){
      if(len <= 74){
        return "XS"
      }
      else if(len <= 82){
        return "S";
      }
      else if(len <= 90){
        return "M";
      }
      else if(len <= 98.5){
        return "L";
      }
      else if(len <= 107.5){
        return "XL";
      }
      else if(len <= 116.5){
        return "XXL";
      }
      else{
        return "3XL";
      }
    }

    function zaraChest(len)
    {
        if(len <= 94)
        {
            return "S";
        }
        else if(len <= 98)
        {
            return "M";
        }
        else if(len <= 104)
        {
            return "L";
        }
        else if(len <= 110)
        {
            return "XL";
        }
        else
        {
            return "XXL"
        }
    }

    function zaraWaist(len)
    {
        if(len <= 96)
        {
            return "S";
        }
        else if(len <= 100)
        {
            return "M";
        }
        else if(len <= 104)
        {
            return "L";
        }
        else if(len <= 108)
        {
            return "XL";
        }
        else
        {
            return "XXL"
        }
    }

    function marksChest(len)
    {
        if(len <= 94)
        {
            return "S";
        }
        else if(len <= 102)
        {
            return "M";
        }
        else if(len <= 109)
        {
            return "L";
        }
        else if(len <= 117)
        {
            return "XL";
        }
        else
        {
            return "XXL"
        }
    }

    function marksWaist(len)
    {
        if(len <= 81)
        {
            return "S";
        }
        else if(len <= 89)
        {
            return "M";
        }
        else if(len <= 97)
        {
            return "L";
        }
        else if(len <= 104)
        {
            return "XL";
        }
        else if(len <= 112)
        {
            return "XXL"
        }
        else
        {
            return "XXXL";
        }
    }

    

    
    function armLength(arr,h,w,s)
    {
        let armtop_i = Number.MAX_VALUE, armtop_j = 0;
        let elbow_i = -1,elbow_j = 0,armBottomMiddle_i = -1,armBottomMiddle_j = 0;
        let armBottomRight_i = 0, armBottomRight_j = -1;

        for(let i=0;i<h;i++)
        {
            for(let j=0;j<w;j++)
            {
                if(arr[i][j] == 2 || arr[i][j] == 3)
                {
                    if(i<armtop_i)
                    {
                        armtop_i = i;
                        armtop_j = j;
                    }
                }
                if(arr[i][j] == 2 || arr[i][j] == 3)
                {
                    if(i>elbow_i)
                    {
                        elbow_i = i;
                        elbow_j = j;
                    }
                }
                if(arr[i][j] == 6 || arr[i][j] == 7)
                {
                    if(i>armBottomMiddle_i)
                    {
                        armBottomMiddle_i = i;
                        armBottomMiddle_j = j;
                    }
                }
                if(arr[i][j] == 6 || arr[i][j] == 7)
                {
                    if(j>armBottomRight_j)
                    {
                        armBottomRight_i = i;
                        armBottomRight_j = j;
                        //console.log(j);
                    }
                }
            }
        }

        //console.log(armtop_i);
        //console.log(armtop_j);
        //console.log(elbow_i);
        //console.log(elbow_j);
        //console.log(armBottomMiddle_i);
        //console.log(armBottomMiddle_j);
        //console.log(armBottomRight_i);
        //console.log(armBottomRight_j);

        let distT2E = Math.sqrt(Math.pow((armtop_i - elbow_i),2) + Math.pow((armtop_j - elbow_j),2));
        let distE2B;
        if((armBottomMiddle_i - armBottomRight_i) > 30)
        {
            distE2B = Math.sqrt(Math.pow((armBottomMiddle_i - elbow_i),2) + Math.pow((armBottomMiddle_j - elbow_j),2));
        }
        else
        {
            distE2B = Math.sqrt(Math.pow((armBottomRight_i - elbow_i),2) + Math.pow((armBottomRight_j - elbow_j),2));
        }
        let total = distE2B + distT2E;
        total = total * s;
        return total;
    }

    function scale(arr,h,w,realH)
    {
        let headtop_i = Number.MAX_VALUE, bottom_i = -1;
        for(let i=0;i<h;i++)
        {
            for(let j=0;j<w;j++)
            {
                if(arr[i][j] == 1 || arr[i][j] == 0)
                {
                    if(i<headtop_i)
                    {
                        headtop_i = i;
                    }
                }
                if(arr[i][j] == 22 || arr[i][j] == 23)
                {
                    if(i>bottom_i)
                    {
                        bottom_i = i;
                    }
                }
            }
        }
        let height = Math.abs(headtop_i - bottom_i);
        let scaled = realH/height;
        return scaled;
    }

    function legs(arr,h,w,s)
    {
        let legTop_i = Number.MAX_VALUE, legBottom_i = -1;
        for(let i=0;i<h;i++)
        {
            for(let j=0;j<w;j++)
            {
                if(arr[i][j] == 14 || arr[i][j] == 16)
                {
                    if(i<legTop_i)
                    {
                        legTop_i = i;
                    }
                }
                if(arr[i][j] == 18 || arr[i][j] == 20)
                {
                    if(i>legBottom_i)
                    {
                        legBottom_i = i;
                    }
                }
            }
        }
        let LegLength = Math.abs(legTop_i - legBottom_i);
        let ScaledLegLength = LegLength * s;
        return ScaledLegLength;
    }

    function shoulder(arr,h,w,s)
    {
        let shoulderLeft_j = Number.MAX_VALUE, shoulderRight_j = -1;
        for(let i=0;i<h;i++)
        {
            for(let j=0;j<w;j++)
            {
                if(arr[i][j] == 12)
                {
                    if(j<shoulderLeft_j)
                    {
                        shoulderLeft_j = j;
                    }
                    if(j>shoulderRight_j)
                    {
                        shoulderRight_j = j;
                    }
                }
            }
        }
        let shoulderLength = Math.abs(shoulderLeft_j - shoulderRight_j);
        let shoulderScaledLength = shoulderLength * s;
        return shoulderScaledLength;
    }

    function frontChest(arr,h,w,s)
    {
        let headtop_i = Number.MAX_VALUE, headbottom_i = -1;
        for(let i = 0; i < h; i++)
        {
            for(let j = 0; j < w; j++)
            {
                if(arr[i][j] == 0 || arr[i][j] == 1)
                {
                    if(i < headtop_i)
                    {
                        headtop_i = i;
                    }
                    if(i > headbottom_i)
                    {
                        headbottom_i = i;
                    }
                }
            }
        }
        let headsize = headbottom_i - headtop_i;
        let chestRow = headbottom_i + headsize;

        let chestLeft = Number.MAX_VALUE, chestRight = -1;
        for(let j = 0; j < w; j++)
        {
            if(arr[chestRow][j] == 12)
            {
                if(j < chestLeft)
                    chestLeft = j;
                if(j > chestRight)
                    chestRight = j;
            }
        }
        let chestFrontWidth = chestRight - chestLeft;
        let chestScaledFrontWidth = chestFrontWidth * s;
        return chestScaledFrontWidth;
    }

    function sideChest(arr,h,w,s)
    {
        let headtop_i = Number.MAX_VALUE, headbottom_i = -1;
        for(let i = 0; i < h; i++)
        {
            for(let j = 0; j < w; j++)
            {
                if(arr[i][j] == 0 || arr[i][j] == 1)
                {
                    if(i < headtop_i)
                    {
                        headtop_i = i;
                    }
                    if(i > headbottom_i)
                    {
                        headbottom_i = i;
                    }
                }
            }
        }
        let headsize = headbottom_i - headtop_i;
        let chestRow = headbottom_i + headsize;

        let chestLeft = Number.MAX_VALUE, chestRight = -1;
        for(let j = 0; j < w; j++)
        {
            if(arr[chestRow][j] != -1)
            {
                if(j < chestLeft)
                    chestLeft = j;
                if(j > chestRight)
                    chestRight = j;
            }
        }
        let chestSideWidth = chestRight - chestLeft;
        let chestScaledSideWidth = chestSideWidth * s;
        return chestScaledSideWidth;
    }

    function chestCircum(x,y)
    {
        let circum = Math.PI * ((3*x + 3*y) - Math.sqrt((x + 3*y)*(3*x + y)));
        return circum;
    }

    function frontWaist(arr,h,w,s)
    {
        let headtop_i = Number.MAX_VALUE, bottom_i = -1;
        for(let i=0;i<h;i++)
        {
            for(let j=0;j<w;j++)
            {
                if(arr[i][j] == 1 || arr[i][j] == 0)
                {
                    if(i<headtop_i)
                    {
                        headtop_i = i;
                    }
                }
                if(arr[i][j] == 22 || arr[i][j] == 23)
                {
                    if(i>bottom_i)
                    {
                        bottom_i = i;
                    }
                }
            }
        }
        let height = Math.abs(headtop_i - bottom_i);
        let waistFromFoot = height*0.53;
        let waistX = bottom_i - waistFromFoot;
        waistX = Math.ceil(waistX);

        let waistLeft = Number.MAX_VALUE, waistRight = -1;
        for(let j = 0; j < w; j++)
        {
            if(arr[waistX][j] == 12)
            {
                if(j < waistLeft)
                    waistLeft = j;
                if(j > waistRight)
                    waistRight = j;
            }
        }
        waistWidth = (waistRight-waistLeft)*s;
        return waistWidth;
    }

    function sideWaist(arr,h,w,s)
    {
        let headtop_i = Number.MAX_VALUE, bottom_i = -1;
        for(let i=0;i<h;i++)
        {
            for(let j=0;j<w;j++)
            {
                if(arr[i][j] == 1 || arr[i][j] == 0)
                {
                    if(i<headtop_i)
                    {
                        headtop_i = i;
                    }
                }
                if(arr[i][j] == 22 || arr[i][j] == 23)
                {
                    if(i>bottom_i)
                    {
                        bottom_i = i;
                    }
                }
            }
        }
        let height = Math.abs(headtop_i - bottom_i);
        let waistFromFoot = height*0.53;
        let waistX = bottom_i - waistFromFoot;
        waistX = Math.ceil(waistX);

        let waistLeft = Number.MAX_VALUE, waistRight = -1;
        for(let j = 0; j < w; j++)
        {
            if(arr[waistX][j] != -1)
            {
                if(j < waistLeft)
                    waistLeft = j;
                if(j > waistRight)
                    waistRight = j;
            }
        }
        waistWidth = (waistRight-waistLeft)*s;
        return waistWidth;
    }

    function waistCircum(x,y)
    {
        let circum = Math.PI * ((3*x + 3*y) - Math.sqrt((x + 3*y)*(3*x + y)));
        return circum;
    }







