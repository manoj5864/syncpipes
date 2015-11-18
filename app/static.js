var toggleLink = function(linkId) {
    $(".nav>li>a").each(function() {
        if(this.id === linkId) $(this).addClass("nav-active");
        else $(this).removeClass("nav-active");
    });
};