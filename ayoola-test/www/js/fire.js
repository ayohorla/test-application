{

/* ========================
  Variables
======================== */

const FIREBASE_AUTH = firebase.auth();
const FIREBASE_MESSAGING = firebase.messaging();
const FIREBASE_DATABASE = firebase.database();

const signInButton= document.getElementById('sign-in');
const signOutButton= document.getElementById('sign-out');
const subscribeButton =document.getElementById('subscribe');
const unSubscribeButton =document.getElementById('unsubscribe')
const sendNotificationButton = document.getElementById('send-notification-form');
/* ========================
  Event Listeners
======================== */
signInButton.addEventListener('click', signIn);
signOutButton.addEventListener('click', signOut);
subscribeButton.addEventListener('click', subcribeToNotifications);
unSubscribeButton.addEventListener('click', unSubcribeToNotifications);
sendNotificationButton.addEventListener('submit', sendNotification);

FIREBASE_AUTH.onAuthStateChanged(handleAuthStateChanged); 
FIREBASE_MESSAGING.onTokenRefresh(handleTokenRefresh);
/* ========================
  Functions
======================== */
function signIn(){
  FIREBASE_AUTH.signInWithPopup(new firebase.auth.GoogleAuthProvider() );
}
function signOut(){
  FIREBASE_AUTH.signOutWithPopup()
}


function handleAuthStateChanged(user){
  if(user){
    console.log(user);
    signInButton.setAttribute('hiddden', 'true');
    signOutButton.removeAttribute('hidden');

    checkSubscription();
  }else{
    console.log('no user');
    signOutButton.setAttribute('hiddden', 'true');
    signInButton.removeAttribute('hidden');
  }
}

function subscribeToNotifications(){
  FIREBASE_MESSAGING.requestPermission()
  .then(() => handleTokenRefresh())
  .then(() => checkSubscription())
  .catch(() => console.log("user didn't give permission:("));
}
function handleTokenRefresh(){
  return FIREBASE_MESSAGING.getToken()
  .then((token) => {
    FIREBASE_DATABASE.ref('/tokens').push({
      token: token,
      uid: FIREBASE_AUTH.currentUser.uid
    });
  });
}
function unSubcribeToNotifications(){
  FIREBASE_MESSAGING.getToken()
  .then((token)=> FIREBASE_MESSAGING.deleteToken(token))
  .then(() => FIREBASE_DATABASE.ref('/tokens').orderByChild('uid').equalTo(FIREBASE_AUTH.currentUser.uid)
  .once('value'))
  .then((snapshot)=> {
    console.log(snapshot.val());
    const key = object.keys(snapshot.val())[0];
    return FIREBASE_DATABASE.ref('/tokens').child(key).remove();
  })
  .then(() => checkSubscription())
  .catch(() => console.log("unsubscribe failed"));
}

function checkSubscription(){
  FIREBASE_DATABASE.ref('/tokens').orderByChild('uid').equalTo(FIREBASE_AUTH.currentUser.uid)
  .then((snapshot) => {
    if(snapshot.val()){
      subscribeButton.setAttribute('hidden', 'true');
      unSubscribeButton.removeAttribute('hidden');
    } else{
      unSubscribeButton.setAttribute('hidden', 'true');
      subscribeButton.removeAttribute('hidden');
    }
  })
}

function sendNotification(e){
  e.preventDefault();

  const notificationMessage = document.getElementById('notifications-message').value;

  FIREBASE_DATABASE.ref('/notifications').push({
    user: FIREBASE_AUTH.currentUser.displayName,
    message: notificationMessage,
    userProfileImg: FIREBASE_AUTH.currentUser.photoURL
  })
  .then(()=> {
    document.getElementById('notification-message').value='';
  }) 
}

}