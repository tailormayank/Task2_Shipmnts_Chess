angular.module("myApp", []).controller("GameController", [
  "$scope",
  function ($scope) {
    //Draw the board game
    $scope.size = 8;
    $scope.widths = [];

    //Draw board
    for (var i = 0; i < $scope.size; i++) {
      $scope.widths.push(i);
    }
  },
]);

$(document).ready(function () {
  //Chess pieces
  var chessPieces = {
    white: {
      king: "&#9812;",
      queen: "&#9813;",
      rook: "&#9814;",
      bishop: "&#9815;",
      archer: "&#x262e;",
      knight: "&#9816;",
      pawn: "&#9817;",
    },
    black: {
      king: "&#9818;",
      queen: "&#9819;",
      rook: "&#9820;",
      bishop: "&#9821;",
      knight: "&#9822;",
      pawn: "&#9823;",
    },
  };

  var player = "white"; //First player

  var select = {
    canMove: false, //Ready to move of not
    piece: "", //Color, type of the piece
    box: "", //Position of the piece
  };

  //Game's history (pieces + positions)
  var historyMoves = [];

  var colorOption = 0;
  var themeOption = 1;
  var archerMoveType = "bishop";
  //Change theme
  $("#theme-option").on("click", function () {
    themeOption === themes.length - 1 ? (themeOption = 0) : themeOption++;

    setTheme();
  });

  //Set up theme
  var setTheme = function () {
    var theme = themes[themeOption];

    $("#theme-option").html(theme.name);

    $("#board").css("border-color", theme.boardBorderColor);
    $(".light-box").css("background", theme.lightBoxColor);
    $(".dark-box").css("background", theme.darkBoxColor);

    $(".option-nav").css("color", theme.optionColor);

    //Option Menu effect
    $(".button").css("color", theme.optionColor);
    $(".button").hover(
      function () {
        $(this).css("color", theme.optionHoverColor);
      },
      function () {
        $(this).css("color", theme.optionColor);
      }
    );
  };

  //Change color
  $("#color-option").on("click", function () {
    colorOption === colors.length - 1 ? (colorOption = 0) : colorOption++;

    setColor();
  });

  var setColor = function () {
    var color = colors[colorOption];

    $("#color-option").html(color.name);

    $(".box").css("color", color["color"]);

    $("#pawn-promotion-option").css("color", color["color"]);

    $("#player").css("color", color["color"]);
  };

  var promotion = {};

  //Set up board game
  $(function () {
    $("#player").html(chessPieces.black.king);

    //Set up color for boxes, chess pieces
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        var box = $("#box-" + i + "-" + j);
        if ((i + j) % 2 !== 0) {
          box.addClass("light-box");
        } else {
          box.addClass("dark-box");
        }
        setNewBoard(box, i, j); //Set up all chess pieces
      }
    }
    setColor();
    setTheme();
  });

  $(function () {

   

    //Pawn promotion event
    $("#pawn-promotion-option .option").on("click", function () {
      var newType = $(this).attr("id");
      promotion.box.html(chessPieces[promotion.color][newType]);
      promotion.box.addClass("placed");
      promotion.box.attr("piece", promotion.color + "-" + newType);

      $("#pawn-promotion-option").addClass("hide");
      $("#game").css("opacity", "1");

      promotion = {};
    });

    //Reset game
    $("#restart-btn").on("click", function () {
      resetGame();
    });

    //Restart when game over
    $("#result").on("click", function () {
      resetGame();
    });

    //Box click event
    $(".box").on("click", function () {
      if ($(this).hasClass("selected")) {
        //Undo to select new box
        $(this).removeClass("selected");

        $(".box").removeClass("suggest");
        select = { canMove: false, piece: "", box: "" };
        return;
      }

      //Select new box
      if (!select.canMove) {
        //Check the right color to play
        if ($(this).attr("piece").indexOf(player) >= 0) {
          //Select a piece to move
          selectPiece($(this));
        }
      }

      //Set up new destination for selected box
      else if (select.canMove) {
        var selectedPieceInfo = select.piece.split("-");
        var color = selectedPieceInfo[0];
        var type = selectedPieceInfo[1];

        //Select new piece to move if 2 colors are the same
        if ($(this).attr("piece").indexOf(color) >= 0) {
          $("#" + select.box).removeClass("selected");
          $(".box").removeClass("suggest");
          //Select a piece to move
          selectPiece($(this));
          return;
        }

        //Can move if it is valid
        if ($(this).hasClass("suggest")) {
          //Save move in history
          var move = {
            previous: {},
            current: {},
          };

          move.previous.piece = select.piece;
          move.previous.box = select.box;

          move.current.piece = $(this).attr("piece");
          move.current.box = $(this).attr("id");

          historyMoves.push(move);

          //Move selected piece successfully
          setPiece($(this), color, type);

          //Delete moved box
          deleteBox($("#" + select.box));

          $(".box").removeClass("suggest");

          select = { canMove: false, piece: "", box: "" };

          //Switch player
          switchPlayer();
        }
      }
    });
  });

  var setNewBoard = function (box, i, j) {
    if (j === 7) {
      if (i === 0 || i === 7) {
        setPiece(box, "white", "rook");
      } else if (i === 1 || i === 6) {
        setPiece(box, "white", "knight");
      } else if (i === 5) {
        setPiece(box, "white", "bishop");
      } else if (i === 3) {
        setPiece(box, "white", "queen");
      } else if (i === 4) {
        setPiece(box, "white", "king");
      } else if (i == 2) {
        setPiece(box, "white", "archer");
      }
    } else if (j === 6) {
      if (i !== 1 && i !== 3) {
        setPiece(box, "white", "pawn");
      }
    } else if (j === 1) {
      setPiece(box, "black", "pawn");
    } else if (j === 0) {
      if (i === 0 || i === 7) {
        setPiece(box, "black", "rook");
      } else if (i === 1 || i === 6) {
        setPiece(box, "black", "knight");
      } else if (i === 2 || i === 5) {
        setPiece(box, "black", "bishop");
      } else if (i === 3) {
        setPiece(box, "black", "queen");
      } else if (i === 4) {
        setPiece(box, "black", "king");
      }
    }
  };
  //Switch player
  var switchPlayer = function () {
    if (player === "black") {
      $("#player").html(chessPieces.white.king);
      player = "white";
    } else {
      $("#player").html(chessPieces.black.king);
      player = "black";
    }
  };

  var setPiece = function (box, color, type) {
    //Check end game (if king is defeated)
    if (box.attr("piece").indexOf("king") >= 0) {
      showWinner(player);

      box.html(chessPieces[color][type]);
      box.addClass("placed");
      box.attr("piece", color + "-" + type);

      return;
    }

    //Check if pawn reached the last line
    var j = parseInt(box.attr("id").charAt(6));
    if (type === "pawn") {
      if ((player === "black" && j === 7) || (player === "white" && j === 0)) {
        $("#game").css("opacity", "0.5");

        var option = $("#pawn-promotion-option");
        option.removeClass("hide");
        option.find("#queen").html(chessPieces[player].queen);
        option.find("#rook").html(chessPieces[player].rook);
        option.find("#knight").html(chessPieces[player].knight);
        option.find("#bishop").html(chessPieces[player].bishop);

        promotion = { box: box, color: color };

        return;
      }
    }

    box.html(chessPieces[color][type]);
    box.addClass("placed");
    box.attr("piece", color + "-" + type);
    if (type === "archer") {
      archerMoveType = archerMoveType === "bishop" ? "rook" : "bishop";
    }
  };

  //Returns possible moves of the selected piece
  var getNextMoves = function(selectedPiece, selectedBox) {
    var selectedPieceInfo = selectedPiece.split('-');
    var color = selectedPieceInfo[0];
    var type = selectedPieceInfo[1];

    var id = selectedBox.split('-');
    var i = parseInt(id[1]);
    var j = parseInt(id[2]);

    var nextMoves = [];

    switch(type) {
       case 'archer':
           var moves;
           if (archerMoveType === 'bishop') {
               moves = [
                   [0, 1], [0, -1], [1, 0], [-1, 0]
               ];
           } else { 
               moves = [
                   [1, 1], [1, -1], [-1, 1], [-1, -1]
                   
               ];
           }
           nextMoves = getQueenMoves(i, j, color, moves);
        break;
         case 'pawn':
               if(color === 'black') {
                    var moves = [
                         [0, 1], [0, 2], [1, 1], [-1, 1]
                    ];
               } else {
                    var moves = [
                         [0, -1], [0, -2], [1, -1], [-1, -1]
                    ];
               }
               nextMoves = getPawnMoves(i, j, color, moves);
               break;
         case 'rook':
               var moves = [
                    [0, 1], [0, -1], [1, 0], [-1, 0]
               ];
               nextMoves = getQueenMoves(i, j, color, moves);
               break;
         case 'knight':
               var moves = [
                    [-1, -2], [-2, -1], [1, -2], [-2, 1],
                    [2, -1], [-1, 2], [2, 1], [1, 2]
               ];
               nextMoves = getKnightMoves(i, j, color, moves);
               break;
         case 'bishop':
               var moves = [
                    [1, 1], [1, -1], [-1, 1], [-1, -1]
               ];
               nextMoves = getQueenMoves(i, j, color, moves);
               break;
         case 'queen':
               var moves1 = [
                    [1, 1], [1, -1], [-1, 1], [-1, -1]
               ];
               var moves2 = [
                    [0, 1], [0, -1], [1, 0], [-1, 0]
               ];
               nextMoves = getQueenMoves(i, j, color, moves1)
                               .concat(getQueenMoves(i, j, color, moves2));
               break;
         case 'king':
               var moves = [
                    [1, 1], [1, -1], [-1, 1], [-1, -1],
                    [0, 1], [0, -1], [1, 0], [-1, 0]
               ];
               nextMoves = getKnightMoves(i, j, color, moves);
               break;
         default: 
               break;
    }
    return nextMoves;
}
});
