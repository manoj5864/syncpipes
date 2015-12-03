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

var fixedUrl = {
    mysqlConnectionServer: "http://localhost:8084/connectToMysql",
    mysqlCreateDB: "http://localhost:8084/createADatabase",
    getTables: "http://localhost:8084/getTables",
    getColumns: "http://localhost:8084/getColumns",
    createTable: "http://localhost:8084/createTable",
    insertRow: "http://localhost:8084/insertRow",
    createEmptyTable: "http://localhost:8084/createEmpltyTable"
};