import { Component, NgZone, OnInit } from "@angular/core";
import * as geolocation from '@nativescript/geolocation';

@Component({
    selector: "Location",
    templateUrl: './location.component.html'
})
export class LocationComponent implements OnInit {

    public latitude: number;
    public longitude: number;
    private watchId: number;

    public constructor(private zone: NgZone) {
        this.latitude = 0;
        this.longitude = 0;
    }
    ngOnInit(): void {
        geolocation.enableLocationRequest();
        geolocation.getCurrentLocation({maximumAge: 5000, timeout: 20000 });
    }
    getUserLocation() {
        // get Users current position
    
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            global.player.setLocation(this.longitude, this.latitude)
            console.log("position longtidue: ", this.longitude, "and position latitude: ", this.latitude)
            console.log("If we grab from the global player object (longitude, latitude): ", global.player.getLocation)
          });
        }else{
          console.log("User not allowed")
        }
      }


    private getDeviceLocation(): Promise<any> {
        return new Promise((resolve, reject) => {
            geolocation.enableLocationRequest().then(() => {
                geolocation.getCurrentLocation({timeout: 10000}).then(location => {
                    resolve(location);
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }

    public updateLocation() {
        this.getDeviceLocation().then(result => {
            this.latitude = result.latitude;
            this.longitude = result.longitude;
            console.log("Current position information; Latitude: ", this.latitude, "and Longitude: ", this.longitude)
            global.player.setLocation(this.longitude, this.latitude)
            console.log("If we grab from the global player object (longitude, latitude): ", global.player.getLocation())
        }, error => {
            console.error(error);
        });
    }

    public startWatchingLocation() {
        this.watchId = geolocation.watchLocation(location => {
            if(location) {
                this.zone.run(() => {
                    this.latitude = location.latitude;
                    this.longitude = location.longitude;
                    global.player.setLocation(this.longitude, this.latitude)
                    console.log("We are currently watching location")
                });
            }
        }, error => {
            console.error(error);
        }, { updateDistance: 1, minimumUpdateTime: 1000 });
    }

    public stopWatchingLocation() {
        if(this.watchId) {
            geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

}