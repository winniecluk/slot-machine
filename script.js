// set total of quarters
var setTotal = 10;
var totalQuarters = setTotal;
var costPerTurn = 1;
var amountPerWinnings = 5;
var numberOfRectangles = 3;
var musicRef = {
  'win': 'sounds/win.wav'
  , 'loss': 'sounds/loss.wav'
  , 'spin': 'sounds/spin.wav'
}
var imagesRef = {
  'lemon': {
    value: 0
    , imagePath: 'images/lemon.png'
  }
  , 'seven': {
    value: 1
    , imagePath: 'images/seven.png'
  }
  , 'watermelon': {
    value: 2
    , imagePath: 'images/watermelon.png'
  }
}

startGame();
function startGame(){
  totalQuarters = setTotal;
  renderRectangles();
  displayQuarters(null);
}

// see three rectangles next to each other w/ an image
function renderRectangles(){
  document.querySelector('.slot-machine').innerHTML = '';
  for (let i = 0; i < numberOfRectangles; i++){
    var randomSlot = getRandomSlot();
    createSlotSpan(randomSlot, document.querySelector('.slot-machine'));
  }
}

function getRandomSlot(){
  var arrKeys = Object.keys(imagesRef);
  var randomIdx = Math.floor(Math.random() * arrKeys.length);
  var randomKey = arrKeys[randomIdx];
  return imagesRef[randomKey];
}

function createSlotSpan(randomSlot, parent){
  var imagePath = randomSlot.imagePath;
  var span = document.createElement('span');
  span.innerHTML = '<img src=' + imagePath + ' />';
  parent.appendChild(span);
}

function createAudio(key){
  var audioElement = document.createElement('audio');
  audioElement.src = musicRef[key];
  audioElement.play();
}

function displayQuarters(str, amount){
  if (str === 'plus') totalQuarters += amount;
  else if (str === 'minus') totalQuarters -= amount;
  document.querySelector('span.quarters-display').textContent = totalQuarters;
}

// pull the handle
document.querySelector('button.lever').addEventListener('click', function(e){
  // put a quarter in, quarter should be deducted from total
  displayQuarters('minus', costPerTurn);
  // images on the three rectangles spins and music plays
  var value = 0;
  var loss = false;
  document.querySelector('.slot-machine').innerHTML = '';
  for (let i = 0; i < numberOfRectangles; i++){
    var randomSlot = getRandomSlot();
    createSlotSpan(randomSlot, document.querySelector('.slot-machine'));
    var valueOfSlot = randomSlot.value;
    if (loss) continue;
    if (i === 0){
      value = valueOfSlot;
    } else if (valueOfSlot != value){
      loss = true;
    }
  } // closes for loop
  setTimeout(function(){
    // if there is match, we win more quarters and play again
    // if we are out of quarters, we cannot play
      if (totalQuarters === 0){
        createAudio('loss');
        document.querySelector('button.lever').setAttribute('disabled', 'true');
        createMessage('show');
        // display message
      } else if (!loss){
        displayQuarters('plus', amountPerWinnings);
        createAudio('win');
      } else {
        createAudio('spin');
      }
  }, 200);
});

function createMessage(display){
  if (display === 'show') document.querySelector('div.message').classList.remove('hide');
  else if (display === 'hide') document.querySelector('div.message').classList.add('hide');
  document.querySelector('div.message-text').textContent = 'You are out of quarters! Replay?';
  document.querySelector('div.options').innerHTML = '<button id="replay">Yes</button>';
}

document.addEventListener('click', function(e){
  if (e.target.id === 'replay'){
    createMessage('hide');
    document.querySelector('button.lever').removeAttribute('disabled');
    startGame();
  };
})
