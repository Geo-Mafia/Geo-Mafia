import { Component, NgZone, OnInit } from "@angular/core";
import * as Geolocation from '@nativescript/angular'
//import * as Geolocation from 'nativescript-geolocation'
import * as Platform from "@angular/common";
//import * as Geolocation from "nativescript-geolocation";

@Component({
    selector: "Location",
    templateUrl: './location.component.html'
})
export class LocationComponent implements OnInit {
    // ngOnInit(): void {
        
    // }

    public latitude: number;
    public longitude: number;
    private watchId: number;

    public constructor(private zone: NgZone) {
        this.latitude = 0;
        this.longitude = 0;
    }
    ngOnInit(): void {
        //this.getDeviceLocation()
        // Geolocation.enableLocationRequest()
    }
    // getUserLocation() {
    //     // get Users current position
    
    //     if (navigator.geolocation) {
    //       navigator.geolocation.getCurrentPosition(position => {
    //         this.latitude = position.coords.latitude;
    //         this.longitude = position.coords.longitude;
    //         console.log("position latitude: ", this.latitude, "and position longitude: ", this.longitude)
    //       });
    //     }else{
    //       console.log("User not allowed")
    //     }
    //   }


    private getDeviceLocation(): Promise<any> {
        return new Promise((resolve, reject) => {
            Geolocation.enableLocationRequest().then(() => {
                Geolocation.getCurrentLocation({timeout: 10000}).then(location => {
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
        }, error => {
            console.error(error);
        });
    }

    public startWatchingLocation() {
        this.watchId = Geolocation.watchLocation(location => {
            if(location) {
                this.zone.run(() => {
                    this.latitude = location.latitude;
                    this.longitude = location.longitude;
                });
            }
        }, error => {
            console.error(error);
        }, { updateDistance: 1, minimumUpdateTime: 1000 });
    }

    public stopWatchingLocation() {
        if(this.watchId) {
            Geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

}