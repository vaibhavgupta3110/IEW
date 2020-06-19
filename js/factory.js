ApolloApp.factory('Auth', function(localStorageService, $firebaseAuth){
var user;
var key="interactive-loggedIn";


return{
    init : function(){
        if(localStorageService.isSupported){
            user = localStorageService.get(key)
        }  
    },
    setUser : function(aUser){
        user = aUser;
        localStorageService.set(key, user);
    },
    isLoggedIn : function(){
        if(user)
            return user;
        else{
            if(localStorageService.isSupported){
                user = localStorageService.get(key);
            }
            if(user == null)
                return false;
            else
                return user;
        }
    },
    removeUser : function(){
        firebase.auth().signOut().then(function() {
            localStorageService.remove(key);
            user = false;
        }).catch(function(error) {
            // An error happened.
        });
        
    }
  }
})