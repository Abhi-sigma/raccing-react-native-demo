Hello Everyone,

### This is my react-native app for the racing demo task.

### Follow these steps to run it on your phone or pc.

https://reactnative.dev/docs/environment-setup

if you are running in on  your device
https://reactnative.dev/docs/running-on-device

And for the most easy one,this is an expo 
which can be accessed through expo app.

  + git clone the repo
    + npm install
    + expo start

    (will need expo app on physical device with usb debugging enabled or AVD running)
    you can also run these command to  run on those respective platforms:

        + expo android
        + expo ios
        + expo web 

Havent tested in ios as I only have a windows machine howevr,the snack given below build a ios version.

I also have uploaded a snack @
https://snack.expo.dev/@abhijit85/reactnative-demo-racing
However,this wont work as the data fetched is blocked by cors.Unless you run a small proxy server 
with allow origin headers or use heroku cors app like this one https://cors-anywhere.herokuapp.com/corsdemo.
No luck getting through chrome.


I have added a temporary url which is replacing the api for now.But this needs,you to go at 
https://cors-anywhere.herokuapp.com/corsdemo and ask temp permissions.

However,running the app for long time wont work as the limits imposed by heroku app gets voilated and it blocks the requests.


Thanks
Abhijit

