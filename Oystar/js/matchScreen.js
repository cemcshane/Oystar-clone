$( document ).ready(function() {
    const testType = localStorage["test"];
    const isSAT = (testType=="SAT");
    $(".test-type").text(testType);

    const data = JSON.parse(localStorage["data"]);
    d3.selectAll(".container").data(data).exit().remove();

    $("h3").text(function(i) {
        return data[i].school;
    });

    $("h3").each(function() {
        if($(this).innerWidth() > 511){
            $(this).css("max-width", 511);
            $(this).css("line-height", "100%");
        }
    });

    $(".location").text(function(i) {
        return data[i].city + ", " + data[i].state;
    });
    
    $(".rate").text(function(i) {
        return Math.round(data[i].admitRate) + "%";
    });

    //Taken from https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    $(".size").text(function(i) {
        return numberWithCommas(data[i].schoolSize);
    });

    $(".score").text(function(i) {
        if(isSAT) {
            return data[i].satScore;
        }
        else {
            return data[i].actScore;
        }
    });

    $(".pubpriv").text(function(i) {
        if(data[i].private) {
            return "private";
        }
        else{
            return "public";
        }
    })

    $(".match-percent").text(function(i) {
        return data[i].percentMatch+"%";
    })

});