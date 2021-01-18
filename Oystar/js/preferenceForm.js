$( document ).ready(function() {
    let availableStates = [ 'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY' ];

    availableStates.forEach(function(state) {
        let stateOption = `<option class="state-option" value=${state}>${state}</option>`;
        $('#states-input').append(stateOption);
    });

    let selectedStates = [];
    let xPosition = -95;
    let yPosition = -47;
    let width = 100;
    let height = 52;
    let numStates = 0;    

    let deleteState = function(svg) {
        let stateName = svg.find(".selected-state-text").text();
        const index = selectedStates.indexOf(stateName);
        //remove element from selected states array
        if (index > -1) {
            selectedStates.splice(index, 1);
        }
        availableStates.push(stateName);
        availableStates.sort();
        numStates--;
        if(numStates<10) {
            $('#states-input').width(width+(75*(numStates-1)));
        }
        else {
            $('#states-input').width(width+(75*9));
        }
        height = 52 + (Math.trunc((numStates-1)/10)*45);
        $('#states-input').height(height);

        let dropdownItems = d3.select("#states-input").selectAll(".state-option").data(availableStates);
        dropdownItems
            .attr("value", function(d) {
                return d;
            })
            .text(function(d) {
                return d;
            });
        dropdownItems.enter()
            .append("option")
            .attr("class", "state-option")
            .attr("value", function(d) {
                return d;
            })
            .text(function(d) {
                return d;
            });

        let stateText = d3.selectAll(".selected-state-text").data(selectedStates);
        stateText
            .text(function(d) {
                return d;
            });

        let stateX = d3.selectAll(".selected-state-x").data(selectedStates);
        stateX
            .attr("id", function(d) {
                return d;
            });
        

        let stateSVGs = d3.selectAll(".stateSVG").data(selectedStates);
        stateSVGs.exit().remove();
    }

    $('#states-input').on("change", function() {
        const selection = $('#states-input').val();
        $('option[value="' + $('#states-input').val() + '"]').remove();
        const index = availableStates.indexOf(selection);
        //remove element from available states array
        if (index > -1) {
            availableStates.splice(index, 1);
        }
        selectedStates.push(selection);
        $('#states-input').val('');
        if(numStates<10){
            xPosition = -95 - ((numStates%10)*75);   
        }
        else {
            xPosition = -95 - ((9-(numStates%10))*75);   
        }
        yPosition = 18 + (Math.trunc(numStates/10)*45);

        let svg = $(`<svg class="stateSVG" width="67" height="37">
        <rect class="selected-state-box" width="67" height="37" x="0" y="0"></rect>
        <text class="selected-state-text" width="67" height="37" x="25" y="26">${selection}</text>
        <text id="${selection}"class="selected-state-x" width="67" height="37" x="55" y="27">×</text>
        </svg>`);

        svg.css("margin-left", xPosition);
        svg.css("margin-top", yPosition);
        if(numStates<10) {
            $('#states-input').width(width+(75*numStates));
        }
        else {
            $('#states-input').width(width+(75*9));
        }        
        
        height = 52 + (Math.trunc(numStates/10)*45);
        $('#states-input').height(height);    
        ++numStates;

        $("#states").append(svg);
        $(`#${selection}`).click(function() {
            deleteState($(this).parent());
        })        
    });

    const percentScale = d3.scaleLinear()
        .domain([130, 737])
        .range([0, 100]);

    const admPositionScale = d3.scaleLinear()
        .domain([0, 100])
        .range([130, 737]);

    $("#adm-lower").keyup(function(){
        let value = 25;
        if(!isNaN($(this).val())&&($(this).val()!="")){
            value = $(this).val();
        }
        $("#adm-point1").attr("transform", "translate(" + (admPositionScale(value)-104) + ",0)");
        $("#adm-point1 .point-text").text(value+"%");
    });

    $("#adm-upper").keyup(function(){
        let value = 75;
        if(!isNaN($(this).val())&&($(this).val()!="")){
            value = $(this).val();
        }
        $("#adm-point2").attr("transform", "translate(" + (admPositionScale(value)-104) + ",0)");
        $("#adm-point2 .point-text").text(value+"%");
    });

    $("#adm-point1").draggable({ 
        drag: function( event, ui ) {
            ui.position.left = Math.min( $("#adm-point2").position().left-25, ui.position.left );
            ui.position.left = Math.max( 130, ui.position.left );  
            $("#adm-point1").attr("transform", "translate(" + (ui.position.left-104) + ",0)");
            const percentage = Math.round(percentScale(ui.position.left));
            $("#adm-point1 .point-text").text(percentage+"%");
            $("#adm-lower").val(percentage);
        }
    });

    $("#adm-point2").draggable({ 
        drag: function( event, ui ) {
            ui.position.left = Math.min( 737, ui.position.left );
            ui.position.left = Math.max( $("#adm-point1").position().left+25, ui.position.left );  
            $("#adm-point2").attr("transform", "translate(" + (ui.position.left-104) + ",0)");
            const percentage = Math.round(percentScale(ui.position.left));
            $("#adm-point2 .point-text").text(percentage+"%");
            $("#adm-upper").val(percentage);
        }
    });

    const sizePositionScale = d3.scaleLinear()
        .domain([0, 50000])
        .range([130, 737]);

    const sizeScale = d3.scaleLinear()
        .domain([130, 737])
        .range([0, 50000]);

    //Taken from https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    $("#size-lower").keyup(function(){
        let value = 12500;
        if($(this).val()!=""){
            let checkvalue = $(this).val().replace(",", "");
            if(!isNaN(checkvalue)) {
                value = checkvalue;
                $(this).val(numberWithCommas(value));
            }
        }
        $("#size-point1").attr("transform", "translate(" + (sizePositionScale(value)-104) + ",0)");
        $("#size-point1 .point-text").text(numberWithCommas(value));
    });

    $("#size-upper").keyup(function(){
        let value = 37500;
        if($(this).val()!=""){
            let checkvalue = $(this).val().replace(",", "");
            if(!isNaN(checkvalue)) {
                value = checkvalue;
                $(this).val(numberWithCommas(value));
            }
        }
        $("#size-point2").attr("transform", "translate(" + (sizePositionScale(value)-104) + ",0)");
        $("#size-point2 .point-text").text(numberWithCommas(value));
    });

    $("#size-point1").draggable({ 
        drag: function( event, ui ) {
            ui.position.left = Math.min( $("#size-point2").position().left-25, ui.position.left );
            ui.position.left = Math.max( 130, ui.position.left );  
            $("#size-point1").attr("transform", "translate(" + (ui.position.left-104) + ",0)");
            const sizeVal = numberWithCommas(Math.round(sizeScale(ui.position.left)));
            $("#size-point1 .point-text").text(sizeVal);
            $("#size-lower").val(sizeVal);
        }
    });

    $("#size-point2").draggable({ 
        drag: function( event, ui ) {
            ui.position.left = Math.min( 737, ui.position.left );
            ui.position.left = Math.max( $("#size-point1").position().left+25, ui.position.left );  
            $("#size-point2").attr("transform", "translate(" + (ui.position.left-104) + ",0)");
            const sizeVal = numberWithCommas(Math.round(sizeScale(ui.position.left)));
            $("#size-point2 .point-text").text(sizeVal);
            $("#size-upper").val(sizeVal);
        }
    });

    const SATtoACT = d3.scaleLinear()
        .domain([590, 1600])
        .range([9, 36]);

    const ACTtoSAT = d3.scaleLinear()
        .domain([9, 36])
        .range([590, 1600]);

    let scoreScale = d3.scaleLinear()
        .domain([130, 737])
        .range([590, 1600]);

    let scorePositionScale = d3.scaleLinear()
        .domain([590, 1600])
        .range([130, 737]);

    let lowerDefault = 400;
    let upperDefault = 1200;

    $("input[name='test-type']").change(function() {
        const testType = $("input[name='test-type']:checked").val();
        const upperBound = $("#test-score .spectrum text").text().replace(",", "");
        if(testType=="ACT"){
            scoreScale.range([9, 36]);
            scorePositionScale.domain([9, 36]);
            lowerDefault = 9;
            upperDefault = 36;
            $("#score-lower").attr("placeholder", lowerDefault);
            $("#score-upper").attr("placeholder", upperDefault);
            $("#test-score .spectrum text").text(SATtoACT(upperBound));
        }
        else{
            scoreScale.range([590, 1600]);
            scorePositionScale.domain([590, 1600]);
            lowerDefault = 590;
            upperDefault = 1600;
            $("#score-lower").attr("placeholder", lowerDefault);
            $("#score-upper").attr("placeholder", upperDefault);
            $("#test-score .spectrum text").text(ACTtoSAT(upperBound));
        }
        const leftPtPosition = $("#score-point1 .spectrum-point").position().left-15.75;
        const rightPtPosition = $("#score-point2 .spectrum-point").position().left-16.25;
        $("#score-point1 .point-text").text(Math.round(scoreScale(leftPtPosition)));
        $("#score-point2 .point-text").text(Math.round(scoreScale(rightPtPosition)));
        $("#score-lower").val(Math.round(scoreScale(leftPtPosition)));
        $("#score-upper").val(Math.round(scoreScale(rightPtPosition)));
    })

    $("#score-lower").keyup(function(){
        let value = lowerDefault;
        if(!isNaN($(this).val())&&($(this).val()!="")){
            value = $(this).val();
        }
        $("#score-point1").attr("transform", "translate(" + (scorePositionScale(value)-104) + ",0)");
        $("#score-point1 .point-text").text(value);
    });

    $("#score-upper").keyup(function(){
        let value = upperDefault;
        if(!isNaN($(this).val())&&($(this).val()!="")){
            value = $(this).val();
        }
        $("#score-point2").attr("transform", "translate(" + (scorePositionScale(value)-104) + ",0)");
        $("#score-point2 .point-text").text(value);
    });

    $("#score-point1").draggable({ 
        drag: function( event, ui ) {
            ui.position.left = Math.min( $("#score-point2").position().left-25, ui.position.left );
            ui.position.left = Math.max( 130, ui.position.left );  
            $("#score-point1").attr("transform", "translate(" + (ui.position.left-104) + ",0)");
            const sizeVal = Math.round(scoreScale(ui.position.left));
            $("#score-point1 .point-text").text(sizeVal);
            $("#score-lower").val(sizeVal);
        }
    });

    $("#score-point2").draggable({ 
        drag: function( event, ui ) {
            ui.position.left = Math.min( 737, ui.position.left );
            ui.position.left = Math.max( $("#score-point1").position().left-5, ui.position.left );  
            $("#score-point2").attr("transform", "translate(" + (ui.position.left-104) + ",0)");
            const sizeVal = Math.round(scoreScale(ui.position.left));
            $("#score-point2 .point-text").text(sizeVal);
            $("#score-upper").val(sizeVal);
        }
    });

    // Gets the value of an input field, or the placeholder if the value is empty
    function getFieldData(selector) {
        var value = $(selector).val();
        if (!value) {
            value = $(selector).attr('placeholder');
        }
        return value;
    }

    document.getElementById("submit-button").onclick = function(){
        /*
            TODO: gather user inputs
                -the data should be stored in userData for the matching process
                -whoever is doing the user database should add this user data to the database
        */
        var userData = {
            states: selectedStates,
            admitRate: [+getFieldData("#adm-lower"), +getFieldData("adm-upper")],
            size: [+getFieldData("#size-lower").replace(",", ""), +getFieldData("#size-upper").replace(",", "")],
            testScores: [+getFieldData("#score-lower"), +getFieldData("#score-upper")],
            private: $('#private-schools').is(':checked'),
            public: $('#public-schools').is(':checked')
        };
        // var userData = {
        //     states : ["CA","MA","MO","IL"],
        //     admitRate : [0,25],
        //     size: [2000,8000],
        //     testScores: [1200,1600], //using SAT for parsing -- scale if ACT entered
        //     private: true,
        //     public: false
        // }
                
        let actConversions = [1600,1560,1520,1480,1440,1410,1380,1350,1320,1290,1250,1220,1190,1150,1120,1090,1050,1020,980,950,910,870,820,770,720,680,640,610,580];
       
        if($('#act-button').is(':checked')){
            userData["testScores"][0] = actConversions[36-userData["testScores"][0]+1] + 10;
            userData["testScores"][1] = actConversions[36-userData["testScores"][1]];
        }


        var possibleMatches = [];

        var schoolData = firebase.database();
        var query = schoolData.ref().orderByChild("satCompAvg").startAt(userData["testScores"][0]).endAt(userData["testScores"][1]);
        query.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                //only pulls schools that fit the SAT range to consider
                var school = childSnapshot;

                var name = school.child("name").val();
                var satScore = school.child("satCompAvg").val();
                var actScore = school.child("actComp50").val()
                var state = school.child("state").val();
                var admitRate = school.child("admitRate").val() * 100; //helps with displaying later and compareison
                var schoolSize = school.child("undergradSize").val();
                var city = school.child("city").val();
                var private = school.child("private").val();

                //weights
                const statePro = 0.75;
                const stateCon = 0;

                const admitPro = 1;
                const admitCon = -1;
  
                const sizePro = 1.5;
                const sizeCon = -1.5;
                
                const privPro = 0.75;
                const privCon = 0;

                const satPro = 1.1;

                //match calculation
                var stateMatch = stateCon;
                if(userData["states"].indexOf(state) != -1){
                    stateMatch = statePro;
                }

                var privateMatch = privCon;
                if(private){
                    if(userData["private"]){
                        privateMatch = privPro; //private school and user wanted private
                    }
                }else{
                    if(userData["public"]){
                        privateMatch = privPro; //public school and user wanted public
                    }
                }

                //weights change for distance from range
                var admitMatch = admitPro;
                var rangeMid = (userData["admitRate"][0] + userData["admitRate"][1])/2.0;
                var rangeSize = userData["admitRate"][1] - userData["admitRate"][0];

                if(Math.abs(admitRate - rangeMid) > rangeSize/2.0){ //not within range
                    admitMatch = admitCon+((Math.pow(rangeSize/2,2)*(admitPro-admitCon))/(Math.pow(admitRate-rangeMid,2)));
                }

                var sizeMatch = sizePro
                rangeMid = (userData["size"][0] + userData["size"][1])/2.0;
                rangeSize = userData["size"][1] - userData["size"][0];

                if(Math.abs(schoolSize - rangeMid) > rangeSize/2.0){
                    sizeMatch = sizeCon+((Math.pow(rangeSize/2,2)*(sizePro-sizeCon))/(Math.pow(schoolSize-rangeMid,2)));
                }

                

                //recomends better schools (sat wise) helps with percent match gradation 
                var reachSkew = satPro*(satScore/1000);

                var rawMatchScore = stateMatch + admitMatch + sizeMatch + privateMatch + reachSkew;
                var maxMatch = statePro + admitPro + sizePro + privPro + satPro*(userData["testScores"][1]/1000);
                if(userData["states"].length == 0){
                    maxMatch -= statePro; //no penalty on percentage if student has no prefered states
                }
                var percentMatch = Math.round( (rawMatchScore+3)/(maxMatch+3) * 1000) /10;
                console.log(name + " match "+ percentMatch+" with comps" + " state " + stateMatch + " admit " + admitMatch + " size " + sizeMatch + " priv "+ privateMatch );

                var schoolProfile = {
                    school : name,
                    satScore : Math.round(satScore/10)*10,
                    actScore : actScore,
                    state : state,
                    admitRate : admitRate,
                    schoolSize : schoolSize,
                    city : city,
                    private : private,
                    percentMatch: percentMatch
                }

                possibleMatches.push(schoolProfile);
            });
            /*
                AFTER HERE ALL SCHOOLS HAVE BEEN ADDED TO possibleMatches
            */
            if(possibleMatches.length < 6){
                //this persons SAT criteria was too restrictive to get 6 matches...
            }

            const topMatches = possibleMatches.sort((a, b) => (a.percentMatch < b.percentMatch) ? 1 : -1).slice(0,6)
            console.log(topMatches);
            
            if($('#sat-button').is(':checked')){
                localStorage["test"] = "SAT";
            }
            else {
                localStorage["test"] = "ACT";
            }
            localStorage["data"] = JSON.stringify(topMatches);
            window.location.replace("matchScreen.html");
            
            /*
                this is where the submit button should transition to the 
                other screen to display the data in topMatches
            */
        });
        /*
            Code here will run before the data is finished being pulled and parsed
        */
    };


});