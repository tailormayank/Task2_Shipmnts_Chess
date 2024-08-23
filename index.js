	//Chess pieces
	var chessPieces = {
        'white': {
             'king': '&#9812;',
             'queen': '&#9813;',
             'rook': '&#9814;',
             'bishop': '&#9815;',
             'archer':'&#x262e;',
             'knight': '&#9816;',
             'pawn': '&#9817;'
        },
        'black': {
             'king': '&#9818;',
             'queen': '&#9819;',
             'rook': '&#9820;',
             'bishop': '&#9821;',
             'knight': '&#9822;',
             'pawn': '&#9823;'
        }
   };

   var player = 'white'; //First player

   var select = {
    canMove: false, //Ready to move of not
    piece: '',      //Color, type of the piece
    box: ''         //Position of the piece
}

//Game's history (pieces + positions)
var historyMoves = [];

angular.module('myApp', []).controller('GameController', ['$scope', function($scope) {
	
	//Draw the board game
    $scope.size = 8;
    $scope.widths = [];

    //Draw board
    for(var i = 0; i < $scope.size; i++) { 
        $scope.widths.push(i);
    }
	
}]);


var colorOption = 0;
var themeOption = 1;
var archerMoveType = 'bishop'; 
//Change theme
$('#theme-option').on('click', function() {
    themeOption === themes.length - 1 ? themeOption = 0 : themeOption++;
    
    setTheme();
});

//Set up theme
var setTheme = function() {
    var theme = themes[themeOption];
    
    $('#theme-option').html(theme.name);
    
    $('#board').css('border-color', theme.boardBorderColor);
    $('.light-box').css('background', theme.lightBoxColor);
    $('.dark-box').css('background', theme.darkBoxColor);
    
    $('.option-nav').css('color', theme.optionColor);
    
    //Option Menu effect
    $('.button').css('color', theme.optionColor);
    $('.button').hover(
        function() {
            $(this).css('color', theme.optionHoverColor);
        }, function() {
            $(this).css('color', theme.optionColor);
        }
    );
}

//Change color
$('#color-option').on('click', function() {
   colorOption === colors.length - 1 ? colorOption = 0 : colorOption++;
    
    setColor();
});

var setColor = function() {
    var color = colors[colorOption];
    
    $('#color-option').html(color.name);
    
    $('.box').css('color', color['color']);
    
    $('#pawn-promotion-option').css('color', color['color']);
    
    $('#player').css('color', color['color']);
}

var promotion = {};

//Set up board game
$(function() {		 
    $('#player').html(chessPieces.black.king);

     //Set up color for boxes, chess pieces
     for(var i = 0; i < 8; i++) {
          for(var j = 0; j < 8; j++) {
                var box = $('#box-' + i + '-' + j);
                if((i + j) % 2 !== 0) {
                     box.addClass('light-box');
                } else {
                     box.addClass('dark-box');
                }
                setNewBoard(box, i, j); //Set up all chess pieces
          }
     }
     setColor();
     setTheme();
});