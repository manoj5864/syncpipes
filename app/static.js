var toggleLink = function(linkId) {
    $(".nav>li>a").each(function() {
        if(this.id === linkId) $(this).addClass("nav-active");
        else $(this).removeClass("nav-active");
    });
};

var sleep = function(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
};