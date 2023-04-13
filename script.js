document.querySelector('#generate').addEventListener('click', generateGrid);
document.querySelector('#clear').addEventListener('click', clearGrid);
document.querySelector('#draw').addEventListener('click', toggleMode);
document.querySelector('#erase').addEventListener('click', toggleMode);
document.querySelector('#drawing-grid').addEventListener('click', toggleMode);

const colors = document.querySelectorAll('.color');
colors.forEach((color) => {
  color.addEventListener('click', toggleColor);
});

let drawActive = true;
let gridPixels = 400;
let selectedColor = '0000FF';

document.querySelector('#blue').click();
generateGrid();

function toggleColor(){
  colors.forEach((color) => {
    color.style.borderColor = 'grey';
  });
  this.style.borderColor = 'white';
  
  if (this.id == 'blue')
    selectedColor = '0000FF';
  else if (this.id == 'red')
    selectedColor = 'FF0000';
  else if (this.id == 'green')
    selectedColor = '00FF00';
  else
    selectedColor = '000000';
}

function toggleMode(){
  const drawButton = document.querySelector('#draw');
  const eraserButton = document.querySelector('#erase');
  if (drawActive && (this.id == 'erase' || this.id == 'drawing-grid')){
    drawButton.classList.remove("active-button");
    drawButton.classList.add("inactive-button");
    eraserButton.classList.remove("inactive-button");
    eraserButton.classList.add("active-button");
    drawActive = !drawActive;
  }
  else if (!drawActive && (this.id == 'draw' || this.id == 'drawing-grid')){
    drawButton.classList.add("active-button");
    drawButton.classList.remove("inactive-button");
    eraserButton.classList.add("inactive-button");
    eraserButton.classList.remove("active-button");
    drawActive = !drawActive;
  }
}

function clearGrid(){
  const dots = document.querySelectorAll('.dot');
  const grid = document.querySelector('#drawing-grid');
  dots.forEach((dot) => {
    grid.removeChild(dot);
  });
}

function generateGrid(){
  clearGrid();
  let size = document.querySelector('#size').value;
  if (size == 0 || size == null || size == ""){
    console.log("No value within size");
    alert("Min value is 1");
    size = 1;
    document.querySelector('input').value = 1;
  }
  else if (size > 100){
    console.log("Value above 100");
    alert("Max value is 100");
    size = 100;
    document.querySelector('input').value = 100;
  }
  size = gridPixels / size;
  for (let h = 0; h*size < gridPixels; h++){
    for (let w = 0; w*size < gridPixels; w++){
      let div = document.createElement('div');
      div.classList.add('dot');
      div.setAttribute('style', 'height:' + size + 'px; width:' + size + 'px;' + 'background-color: #FFFFFF;');
      div.addEventListener('mouseenter', sketch);
      document.querySelector("#drawing-grid").appendChild(div);
    }
  }
}

function sketch(){
  let targetColor = selectedColor;
  let percent = 0.8;
  if (!drawActive){
    targetColor = 'FFFFFF';
    percent = 0.6;
  }
  
  let newColor = hexColorInterpolate(this.style.backgroundColor,    targetColor, percent);
  this.style.backgroundColor = '#' + newColor;
}

function hexColorInterpolate(color1, color2, percent) {
  const rgb2 = parseInt(color2, 16);
  const color1Slice = color1.slice(4, color1.length - 1);

  let [r1, g1, b1] = color1Slice.split(', ');
  [r1, g1, b1] = [Number(r1), Number(g1), Number(b1)];
  const [r2, g2, b2] = toArray(rgb2);

  const q = 1-percent;
  const rr = Math.round(r1 * percent + r2 * q);
  const rg = Math.round(g1 * percent + g2 * q);
  const rb = Math.round(b1 * percent + b2 * q);

  return Number((rr << 16) + (rg << 8) + rb).toString(16);
}

function toArray(rgb) {
  const r = rgb >> 16;
  const g = (rgb >> 8) % 256;
  const b = rgb % 256;

  return [r, g, b];
}