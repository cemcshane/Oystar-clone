function addMessage(collegeName, conversationId, title, userId, text, timestamp) {
    let collegeDatabase = firebase.database();
    let newPostKey = collegeDatabase.ref().child('collegeMessages/'+collegeName+"/"+conversationId+"/").push().key;
    let databasePath = ('collegeMessages/'+collegeName+"/"+conversationId+"/"+newPostKey)
    collegeDatabase.ref(databasePath).set({
        userId: userId,
        text:text,
        timestamp:timestamp,
        title:title

}, (error) => {
    if (error) {
      console.log(error)
      alert("We couldn't complete your request :(")
    } else {
      console.log("Comment uploaded!")
    }
  });
}

function deleteMessage(collegeName, conversationId, postId) {
    let collegeDatabase = firebase.database().ref('collegeMessages/'+collegeName+"/"+conversationId+"/"+postId);
    collegeDatabase.remove().then(function() {
        console.log("Remove succeeded.")
      })
      .catch(function(error) {
        console.log("Remove failed: " + error.message)
      });
}

function updateMessage(collegeName, userId, conversationId, title, text, postId) {
    let collegeDatabase = firebase.database();
    let databasePath = ('collegeComments/'+collegeName+"/"+conversationId+"/"+postId)
    collegeDatabase.ref(databasePath).update({
        title: title,
        text: text,
        postId
    }, (error) => {
        if (error) {
          console.log(error)
          alert("We couldn't complete your request :(")
        } else {
          console.log("Data saved successfully")
        }
      });
    // Get a key for a new Post.
  }

function addConversationThread(collegeName, lastMessage, lastMessageTimeStamp, subject) {
    
    let collegeDatabase = firebase.database();
    let newPostKey = collegeDatabase.ref().child('collegeComments/'+collegeName).push().key;
    let databasePath = ('collegeComments/'+collegeName+"/"+newPostKey)
    collegeDatabase.ref(databasePath).set({
        subject: subject,
        lastMessage: lastMessage,
        lastMessageTimeStamp: lastMessageTimeStamp,

}, (error) => {
    if (error) {
      console.log(error)
      alert("We couldn't complete your request :(")
    } else {
      console.log("Data saved successfully")
    }
  });
}