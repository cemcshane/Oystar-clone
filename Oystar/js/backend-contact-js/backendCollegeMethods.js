

function addCollegeData(collegeName,satScore, actScore, state, admitRate, schoolSize, city, privateStatus) {
    let collegeDatabase = firebase.database();
    let databasePath = ('colleges/'+collegeName)
    collegeDatabase.ref(databasePath + collegeName).set({
        name: collegeName,
        satScore: satScore,
        actScore: actScore,
        state:state,
        admitRate: admitRate, //helps with displaying later and compareison
        schoolSize: schoolSize,
        city: city,
        privateStatus: privateStatus
    }, (error) => {
        if (error) {
          console.log(error)
          alert("We couldn't complete your request :(")
        } else {
          console.log("Data saved successfully")
        }
      });
      
}

function getCollegeData(collegeName) {
    let collegeDatabase = firebase.database();
    collegeDatabase.child("colleges").child(collegeName).get().then(function(snapshot) {
        if (snapshot.exists()) {
          console.log(snapshot.val());
        }
        else {
          console.log("No data available :(");
        }
      }).catch(function(error) {
        console.error(error);
      });

}




let sampleDate = new Date();
let sampleTime = sampleDate.getTime();
// addConversationThread('Washington University in St Louis', "Greatest school EVER!!", sampleTime, "Overall thoughts")
//addMessage("Washington University in St Louis", '-MWKcjtzAYWOr_DWpEID', 'R8UE8Biv8kahsgjXy4ckFlBbdf22', "Love the food", sampleTime)
//addCollegeData("Clown College", 36, 1800, "Iowa", "6%", 100000, "Clown City", true)
//getCollegeData("Clown College")



