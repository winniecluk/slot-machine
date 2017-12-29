var setTotal = 10;
var totalQuarters = 10;
var costPerTurn = 1;
var numberOfRectangles = 3;
var amountPerWinnings = 5;
var numberOfRectangles = 3;
var musicRef = {
  'win': 'sounds/win.wav'
  , 'loss': 'sounds/loss.wav'
  , 'spin': 'sounds/spin.wav'
}
var imagesRef = {
  "lemon": {
    value: 0
    , imagePath: "images/lemon.png"
  }
  , "seven": {
    value: 1
    , imagePath: "images/seven.png"
  }
  , "watermelon": {
    value: 2
    , imagePath: "images/watermelon.png"
  }
}

startGame();
function startGame(){
  totalQuarters = setTotal;
  renderRectangles();
  displayQuarters(null);
}

function renderRectangles(){
  var slotMachine = $('.slot-machine');
  slotMachine.empty();
  for (let i = 0; i < numberOfRectangles; i++){
    // see three rectangles next to each other w/ an image
    var randomSlot = getRandomSlot();
    createSlotSpan(randomSlot, $('.slot-machine'));
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
  var span = $('<span><img src=' + imagePath + ' /></span>')
  parent.append(span);
}

function createAudio(key){
  var audioElement = $('<audio src=' + musicRef[key] + '/>');
  audioElement.trigger('play');
}

function displayQuarters(str, amount){
  if (str === 'plus') totalQuarters += amount;
  else if (str === 'minus') totalQuarters -= amount;
  $('span.quarters-display').text(totalQuarters);
}

$('button.lever').on('click', function(e){
  displayQuarters('minus', costPerTurn);
  var value = 0;
  var loss = false;
  var slotMachine = $('.slot-machine');
  slotMachine.empty();
  for (let i = 0; i < numberOfRectangles; i++){
    var randomSlot = getRandomSlot();
    createSlotSpan(randomSlot, $('.slot-machine'));
    var valueOfSlot = randomSlot.value;
    if (loss) continue;
    if (i === 0){
      value = valueOfSlot;
    } else if (valueOfSlot != value){
      loss = true;
    }
  } // closes for loop
  setTimeout(function(){
    if (totalQuarters === 0){
      createAudio('loss');
      $('button.lever').attr('disabled', 'true');
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
  if (display === 'show') $('div.message').removeClass('hide');
  else if (display === 'hide') $('div.message').addClass('hide');
  $('div.message-text').text('You are out of quarters! Replay?');
  $('div.options').html('<button id="replay">Yes</button>');
}

$('body').on('click', '#replay', function(e){
    createMessage('hide');
    $('button.lever').removeAttr('disabled');
    startGame();
});
