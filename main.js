function Ball() {
    var color = "";
    this.setColor = function (newColor) {
        color = newColor;
    };
    this.getColor = function () {
        return color;
    };
    this.areEquals = function (ball) {
        return color == ball.getColor();
    };
    this.matched = false;
    this.match = function () {
        this.matched = true;
    };
}

function Game() {
    var game = this;
    var won = false;
    var gameEnded = false;
    this.balls = [];
    this.maxBalls = 4;
    this.lines = 8;
    this.colors = [
        "white",
        "black",
        "yellow",
        "red",
        "blue",
        "green",
        "purple",
        "orange"];
    this.start = function () {
        var container = $('#container');
        game.drawUI(container);
        game.generatePassword();
        game.setInterfaceEvents();
    };
    this.generatePassword = function () {
        for (var i = 0; i < this.maxBalls; i++) {
            var color = this.colors[parseInt(Math.random() * this.colors.length, 10)];
            var ball = new Ball();
            ball.setColor(color);
            this.balls.push(ball);
        }
    };
    this.drawUI = function (container) {
        var firstLine = true;
        for (var i = 0; i < this.lines; i++) {
            var lineClass = "line ";
            var lineHtml = "";
            if (firstLine) {
                lineClass += "active ";
                firstLine = false;
            }
            for (j = 0; j < this.maxBalls; j++) {
                lineHtml += '<div class="ball" attr-color="0"></div>';
            }
            var line = '<div class="' + lineClass + '" attr-line="' + i + '"><div class="number">'+ (i+1)+'</div>' + lineHtml + '</div>';
            container.prepend(line);
        }
    };
    this.setInterfaceEvents = function () {
        $("#reset").click(function (e) {
            e.preventDefault();
            game.reset();
        });
        $(".ball").click(function (e) {
            e.preventDefault();
            if ($(this).parents().hasClass('active')) {
                var color = parseInt($(this).attr('attr-color'), 10);
                var oldColor = game.colors[color];
                $(this).removeClass(oldColor);
                color += 1;
                if (color >= game.colors.length) {
                    color = 0;
                }
                var newColor = game.colors[color];
                $(this).addClass(newColor);
                $(this).attr('attr-color', color);
            }
        });
        $("#submit").unbind('click').click(function (e) {
            e.preventDefault();
            var line = $('.line.active');
            if (line.hasClass('active') && !gameEnded) {
                var password = [];
                var hiddenColors = {};
                game.balls.forEach(function (ball, key) {
                    if (hiddenColors[ball.getColor()] === undefined) {
                        hiddenColors[ball.getColor()] = 0;
                    }
                    hiddenColors[ball.getColor()]++;
                });

                line.find('.ball').each(function (key, ball) {
                    var obj = new Ball();
                    var colorNumber = parseInt($(ball).attr('attr-color'), 10);
                    var ballColor = game.colors[colorNumber];
                    obj.setColor(ballColor);
                    password.push(obj);
                });
                var perfectMatches = game.getPerfectMatches(password);
                for (var key in perfectMatches) {
                    hiddenColors[perfectMatches[key]]--;
                }
                var normalMatches = 0;
                password.forEach(function (ball, key) {
                    if (perfectMatches[key] === undefined) {
                        game.balls.forEach(function (hiddenBall, hiddenKey) {
                            if (perfectMatches[hiddenKey] === undefined) {
                                if (hiddenBall.getColor() == ball.getColor() && hiddenColors[hiddenBall.getColor()] > 0) {
                                    hiddenColors[hiddenBall.getColor()]--;
                                    normalMatches++;
                                }
                            }
                        });
                    }
                });
                if (Object.keys(perfectMatches).length == game.balls.length) {
                    game.userWin();
                }
                var totalResults = 0;
                var lineResult = "";
                for (var key in perfectMatches) {
                    lineResult += '<div class="result red"></div>';
                    totalResults++;
                }
                for (var i = 0; i < normalMatches; i++) {
                    lineResult += '<div class="result white"></div>';
                    totalResults++;
                }
                for (var i = 0; i < game.maxBalls - totalResults; i++) {
                    lineResult += '<div class="result gray"></div>';
                }
                var results = '<div class="results">' + lineResult + '</div>';
                line.append(results);
                line.removeClass('active');
                var newLineNumber = parseInt(line.attr('attr-line'), 10) + 1;
                if (newLineNumber >= game.lines && !won) {
                    game.userLose();
                    return;
                }
                var newActiveLine = $('.line[attr-line="' + newLineNumber + '"]');
                newActiveLine.addClass('active');
            }
        });
    };
    this.getPerfectMatches = function (password) {
        var matches = {};
        password.forEach(function (ball, key) {
            if (game.balls[key].getColor() == ball.getColor()) {
                matches[key] = ball.getColor();
            }
        });
        return matches;
    };
    this.userWin = function () {
        alert("YOU WON");
        won = true;
    };
    this.userLose = function () {
        alert("YOU LOSE");
        var line = $('.line.active');
        line.removeClass('active');
        gameEnded = true;
    };
    this.reset = function () {
        won = false;
        gameEnded = false;
        game.balls = [];
        $('.line').remove();
        var container = $('#container');
        game.drawUI(container);
        game.generatePassword();
        game.setInterfaceEvents();
    };
}

$(document).ready(function () {
    var game = new Game();
    game.start();
    
    $("#empezar").click(function (e) {
            e.preventDefault();
            $(this).css("display: none;");
            $('#container').css("display: inherit;");
    });
    
});
