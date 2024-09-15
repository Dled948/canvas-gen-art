// Set up the initial canvas
var cnv  = document.getElementById('Drawing');
responsiveCanvas(cnv);
var c = setPixelDensity(cnv);
var s = new scene();
draw()

function scene() {
    this.period = 3;
    this.step = 0;

    this.update = function() {
        dims = cnv.getBoundingClientRect();
        styling = getComputedStyle(cnv,null);
        vertBord = parseInt(styling.getPropertyValue('border-top-width')) + parseInt(styling.getPropertyValue('border-bottom-width'));
        horzBord = parseInt(styling.getPropertyValue('border-left-width')) + parseInt(styling.getPropertyValue('border-right-width'));
        this.width = dims.width - horzBord;
        this.height = dims.height - vertBord;

        //console.log(JSON.stringify(dims, null, 4));
        //console.log(JSON.stringify(styling, null, 4));
        //console.log(`width: ${this.width}, height: ${this.height}`)
    }

    this.update();
}
function draw() {
    // Clear the canvas and draw constant elements
    c.clearRect(0,0,s.width,s.height);

    // top triangle
    c.beginPath();
    c.moveTo(s.width/2, 0);
    c.lineTo(s.width, 0);
    c.lineTo(s.width, s.height/2);
    c.closePath();
    c.fillStyle = "rgb(0 0 0)";
    c.fill();

    // bottom triangle
    c.beginPath();
    c.moveTo(0,s.height/2);
    c.lineTo(0,s.height);
    c.lineTo(s.width/2, s.height);
    c.closePath();
    c.fill();

    // Update timestep
    const now = new Date();
    time = now.getSeconds() + now.getMilliseconds() / 1000;
    s.step = time % s.period

    // Draw blue square
    let half = s.period/2;
    let modStep = easeInOutCubic(1 - Math.abs(s.step - half)/half)*s.period;
    let posx = s.width / 2 / s.period * modStep;
    let posy = s.height / 2 / s.period * modStep;
    c.fillStyle = "rgb(0 0 200 / 50%)";
    c.fillRect(posx, posy, s.width/2, s.height/2);

    // Draw red square
    modStep = easeInOutCubic(Math.abs(s.step - half)/half) *s.period;  
    posx = s.width / 2 / s.period * modStep;
    posy = s.height / 2 / s.period * modStep;
    c.fillStyle = "rgb(200 0 0 / 50%)";
    c.fillRect(posx,posy,s.width/2, s.height/2);
    requestAnimationFrame(draw);
}

// Resize the canvas to the window size
window.addEventListener('resize', function() {
    responsiveCanvas(cnv);
    c = setPixelDensity(cnv);
    s.update();
});

/**
 * Easing function for square movement
 * 
 * @param {number} x input number, between 0 and 1
 * @returns {number} x, smoothed using a cubic function
 */
function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/**
 * Set the pixel density of our <canvas>.
 * 
 * @param {object} canvas Our target <canvas> element.
 */
function setPixelDensity(canvas) {
    // Get the device pixel ratio.
    let pixelRatio = window.devicePixelRatio;
	
    // Optionally print it to the console (if interested).
		//console.log(`Device Pixel Ratio: ${pixelRatio}`);

    // Remove any existing CSS which is fixing the display size of the canvas
    canvas.style.removeProperty('width');
    canvas.style.removeProperty('height');

    // Get the actual screen (or CSS) size of the canvas.
    let sizeOnScreen = canvas.getBoundingClientRect();
    //console.log(`sizeonscreen width: ${sizeOnScreen.width}`)
    //console.log(`sizeonscreen height: ${sizeOnScreen.height}`)

    // Set our canvas size equal to that of the screen size x the pixel ratio.
    canvas.width = sizeOnScreen.width * pixelRatio;
    canvas.height = sizeOnScreen.height * pixelRatio;

    // Shrink back down the canvas CSS size by the pixel ratio, thereby 'compressing' the pixels.
    canvas.style.width = (canvas.width / pixelRatio) + 'px';
    canvas.style.height = (canvas.height / pixelRatio) + 'px';
    
    // Fetch the context.
    let context = canvas.getContext('2d');

    // Scale all canvas operations by the pixelRatio, so you don't have to calculate these manually.
    context.scale(pixelRatio, pixelRatio);

    // Return the modified context.
    return context;
}

/**
 * Make our <canvas> responsive to screen size.
 * 
 * @param {object} canvas Our target <canvas> element.
 */
function responsiveCanvas(canvas) {
    const size = Math.min(window.innerHeight, window.innerWidth);
    //console.log(`minimum of window dimensions: ${size}`);
    canvas.width = size;
    canvas.height = size;
}