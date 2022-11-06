var geolocation = require("nativescript-geolocation");


export class Location{

    is_tracking = false;
    longitude = 0 //Default value is being at 0,0
    latitude = 0 //Default value is being at 0,0

    constructor(){
        // check if geolocation hasn't been enabled yet
        if (!geolocation.isEnabled()){
            geolocation.enableLocationRequest(); // request for the user to enable it
        }
        this.locationTrack();
    }

    locationTrack(){
        if (geolocation.isEnabled()){
            //Begin tracking the location
            is_tracking = true 

            if (viewModel.is_tracking) { 
                watchID = geolocation.watchLocation(
                    function (location) {
                        if (location) {
                            this.longitude = location.longitude;
                            this.latitude = location.latitude;
                        }
                    }, 
                    function(e){
                        dialogs.alert(e.message);
                    }, 
                    {
                        desiredAccuracy: Accuracy.high, 
                        updateDistance: 5, // 5 meters
                        minimumUpdateTime : 5000 // update every 5 seconds
                    }
                );
            } else {
                geolocation.clearWatch(watchId);
                is_tracking = false
            }
        } else {
            dialongs.alert("Please enable Geolocation");
        }
    }

    stopTracking(){
        this.is_tracking = false;
    }


    getLongitude(){
        return this.longitude;
    }
    getLatitude(){
        return this.latitude;
    }
}