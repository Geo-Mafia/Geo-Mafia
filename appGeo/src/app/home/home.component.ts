import { Component, OnInit, NgZone } from '@angular/core'
import {Bubble} from '../map/map.component'
import {Player} from '../player/player.component'
import {CampusMap} from '../map/campus-map.component'
import { Chat } from '../chat/chat.component'
import { Game } from '../game/game.component'
import { GameRules } from '../game/game-rules.component'
import { Observable } from 'rxjs'

import { Router } from '@angular/router'
import { GoogleLogin } from 'nativescript-google-login';
import * as application from "@nativescript/core/application";
import { isIOS } from "@nativescript/core/platform";
import { ChatComponent } from "../chat/chat.component";
import { firebase } from "@nativescript/firebase"
import { databaseAdd, databaseEventListener, databaseGet } from "../../modules/database"
import { toUIString } from '@nativescript/core/utils/types'

const VOTE_OPEN_PATH = "src/settings/voteOpen"

@Component({
  selector: 'Home',
  moduleId: module.id,
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit {

  text : string = "Google Sign-In";

  public isKiller: Boolean
  public votingOpen: Boolean
  public component_isLoggedIn: Boolean
  public is_component_loggedIn: Observable<Boolean>
  public is_component_not_loggedIn: Observable<Boolean>

  public game: Game


  textChange() {
    if (global.isLoggedIn) {
      this.text = "You are logged in as: " + global.player.username;
    }
    else {
      this.text = "Google Sign-In";
    }
  }

  constructor(private router: Router, private zone: NgZone) {
    // Use the component constructor to inject providers.
    if(global.loggedIn){
      this.is_component_loggedIn = new Observable(observer=>observer.next(true));
      this.is_component_not_loggedIn = new Observable(observer=>observer.next(false));
    }
    else{
      this.is_component_loggedIn = new Observable(observer=>observer.next(false));
      this.is_component_not_loggedIn = new Observable(observer=>observer.next(true));
    }
  }

  ngOnInit(): void {
    this.isKiller = true;   //This information should be received from Database with Player Info!!!
    this.votingOpen = false; //This information should be received from Database with Game Info!!!
    console.log("Can we see this when we exit the page and then come back inside the page")
    // Init your component properties here.
    // Going to initialize a list of bubbles here;
    var map = new CampusMap();
    /*===================================================
    ===============  Left edge Of Campus  ===============
    =====================================================*/
    var Crerar =  new Bubble()
    Crerar.init_bubble('Crerar', 41.7901331, 41.7909298, -87.6025138, -87.6031023)
    map.addToMap(Crerar.id, Crerar)
    var Bookstore = new Bubble()
    Bookstore.init_bubble('Bookstore', 41.7896584,41.7899199,-87.6013954,-87.6018721)
    map.addToMap(Bookstore.id, Bookstore)
    var GeoLab = new Bubble()
    GeoLab.init_bubble('Hinds Lab',41.790033,41.7905151, -87.601432,-87.601902)
    map.addToMap(GeoLab.id, GeoLab)
    var Kovler = new Bubble()
    Kovler.init_bubble('Kovler',41.7896546,41.7901571, -87.6032333, -87.6035022)
    map.addToMap(Kovler.id, Kovler)
    var Cobb = new Bubble()
    Cobb.init_bubble('Cobb Hall', 41.78873284336094,41.789193407299585, -87.60080074965704, -87.60109790155668)
    map.addToMap(Cobb.id, Cobb)
    var Godspeed = new Bubble()
    Godspeed.init_bubble('Godspeed Hall', 41.78803035339906, 41.78872707776446, -87.60088472281471, -87.60104646075854)
    map.addToMap(Godspeed.id, Godspeed)
    var Weiboldt = new Bubble()
    Weiboldt.init_bubble('Weiboldt Hall', 41.78787764605307, 41.78805759030377, -87.60003025716154, -87.60107505494783)
    map.addToMap(Weiboldt.id, Weiboldt)
    var Harper = new Bubble()
    Harper.init_bubble('Harper', 41.78787887161209,41.78804486314529, -87.60003380475374, -87.59904541075865)
    map.addToMap(Harper.id, Harper)
    var SSRB = new Bubble()
    SSRB.init_bubble('Social Science Research Building', 41.787870404730164, 41.78810639259473, -87.59904755141109, -87.59856475382136)
    map.addToMap(SSRB.id, SSRB)
    var Foster = new Bubble()
    Foster.init_bubble('Foster', 41.78788540398485, 41.78802439690993, -87.5985057451996, -87.5981677868868)
    map.addToMap(Foster.id, Foster)
    var Kelly = new Bubble()
    Kelly.init_bubble('Kelly Hall', 41.78803794291792, 41.78826373694554, -87.5983570325124, -87.59820670697455)
    map.addToMap(Kelly.id, Kelly)
    var Green = new Bubble()
    Green.init_bubble('Green Hall', 41.78826779798602, 41.78854069904136, -87.5983722829261, -87.5981914565545)
    map.addToMap(Green.id, Green)
    var Beecher = new Bubble()
    Beecher.init_bubble('Beecher Hall', 41.78854557226837, 41.78877217670895, -87.5983690149796, -87.59821433217978)
    map.addToMap(Beecher.id, Beecher)
  /*====================================================
    ===============      Main Quad       ===============
    =====================================================*/
    var Swift = new Bubble()
    Swift.init_bubble('Swift Hall', 41.788907975672046, 41.78904808130821, -87.60036636374055, -87.59989007707196)
    map.addToMap(Swift.id, Swift)
    var Rosenwald = new Bubble()
    Rosenwald.init_bubble('Rosenwald', 41.78873530279073, 41.78905848600595, -87.59938500787865, -87.598959824466)
    map.addToMap(Rosenwald.id, Rosenwald)
    var Walker = new Bubble()
    Walker.init_bubble('Walker', 41.78892947918222, 41.78905995625953, -87.59892579480838, -87.59845756459619)
    map.addToMap(Walker.id, Walker)
    var Levi = new Bubble()
    Levi.init_bubble('Levi', 41.78933092826373, 41.789818107683395, -87.60100028500295, -87.60083917063466)
    map.addToMap(Levi.id, Levi)
    var Stats = new Bubble()
    Stats.init_bubble('Department of Statistics', 41.78992857090686, 41.790248548444424, -87.60111296928174, -87.60090423120408)
    map.addToMap(Stats.id, Stats)
    var Jones = new Bubble()
    Jones.init_bubble('George Herbert Jones Lab', 41.790097847928905, 41.7902414431898, -87.60091315948378, -87.60048810392563)
    map.addToMap(Jones.id, Jones)
    var Kent = new Bubble()
    Kent.init_bubble('Kent Chemical Labratory', 41.790094586277, 41.79026477113039, -87.60049367850799, -87.5997965747976)
    map.addToMap(Kent.id, Kent)
    var Ryerson = new Bubble()
    Ryerson.init_bubble('Ryerson Labratory', 41.7900746546891, 41.790474818480675, -87.59944699468637, -87.59890617381372)
    map.addToMap(Ryerson.id, Ryerson)
    var Eckhart = new Bubble()
    Eckhart.init_bubble('Eckhart Hall', 41.790131498351116, 41.79026285331647, -87.5988957181088, -87.59828293253321)
    map.addToMap(Eckhart.id, Eckhart)
    var Math = new Bubble()
    Math.init_bubble('Department of Mathematics', 41.79013282694458, 41.79046274079153, -87.59842846907647, -87.59827925417663)
    map.addToMap(Math.id, Math)
  /*====================================================
    =============== Huthinson Courtyard ================
    =====================================================*/
    var Mandel = new Bubble()
    Mandel.init_bubble('Mandel Hall', 41.79047125804421, 41.790845761929916, -87.59851991880222, -87.59826333492133)
    map.addToMap(Mandel.id, Mandel)
    var Reynolds = new Bubble()
    Reynolds.init_bubble('Reynolds Club', 41.790902240119586, 41.791320103364384, -87.59842988418312, -87.59821327584288)
    map.addToMap(Reynolds.id, Reynolds)
    var Hutch = new Bubble()
    Hutch.init_bubble('Hutchinson Commons', 41.791062794397824, 41.791311923847616, -87.59901336949609, -87.59844883657237)
    map.addToMap(Hutch.id, Hutch)
    var Erman = new Bubble()
    Erman.init_bubble('Erman Biology Center', 41.790688698459014, 41.79097309932546, -87.59929357432024, -87.59909224317552)
    map.addToMap(Erman.id, Erman)
    var Zoology = new Bubble()
    Zoology.init_bubble('Zoology Building', 41.79114229290444, 41.79128616359785, -87.59953981536984, -87.59909849668664)
    map.addToMap(Zoology.id, Zoology)
  /*======================================================
    ===============  Snell-Hitchcock Quad  ===============
    =====================================================*/
    var Searle = new Bubble()
    Searle.init_bubble('Searle Chemical Labratory', 41.79029542829623, 41.79087001455218, -87.60111259389959, -87.60086990270749)
    map.addToMap(Searle.id, Searle)
    var Culver = new Bubble()
    Culver.init_bubble('Culver Hall', 41.790680821569424, 41.79096031641998, -87.60027420070915, -87.60006316412604)
    map.addToMap(Culver.id, Culver)
    var Anatomy = new Bubble()
    Anatomy.init_bubble('Anatomy Building', 41.79115358055861, 41.79129032503934, -87.60029561621472, -87.59984198880483)
    map.addToMap(Anatomy.id, Anatomy)
  /*======================================================
    ===============  Rightside Campus  ===============
    =====================================================*/
    var OI = new Bubble()
    OI.init_bubble('Oriental Institute Museum', 41.789055778700316, 41.78947414800614, -87.59786499022391, -87.59717501543359)
    map.addToMap(OI.id, OI)
    var Saieh = new Bubble()
    Saieh.init_bubble('Saieh Hall', 41.78973263158367, 41.789961693521086, -87.59779067848177, -87.59665270800141)
    map.addToMap(Saieh.id, Saieh)
    var Ida = new Bubble()
    Ida.init_bubble('Ida Noyes Hall', 41.78797132569856, 41.78844816068627, -87.59601945707244, -87.59513854879427)
    map.addToMap(Ida.id, Ida)
    var SemCoOp = new Bubble()
    SemCoOp.init_bubble('Seminary Co-Op', 41.7900054206527, 41.79037245235687, -87.59617761884618, -87.59575794161546)
    map.addToMap(SemCoOp.id, SemCoOp)
    var Gender = new Bubble()
    Gender.init_bubble('Gender Studies', 41.79040456449, 41.790478490192946, -87.59777324956848, -87.59741185812368)
    map.addToMap(Gender.id, Gender)
    var Stevanovich = new Bubble()
    Stevanovich.init_bubble('Stevanovich Center', 41.79053919417777, 41.79065790680171, -87.59777733826961, -87.59735609296916)
    map.addToMap(Stevanovich.id, Stevanovich)
    var OMSA = new Bubble()
    OMSA.init_bubble('Office of Multicultural Student Affairs', 41.790992249688856, 41.79109846160589, -87.59702451987414, -87.59667322211914)
    map.addToMap(OMSA.id, OMSA)
    var HumDev = new Bubble()
    HumDev.init_bubble('Department of Comparative Human development', 41.79055030818548, 41.79065829822527, -87.59693501040132, -87.59670299933738)
    map.addToMap(HumDev.id, HumDev)
    var Rockefeller = new Bubble()
    Rockefeller.init_bubble('Rockefeller Memorial Chapel', 41.788191090302504, 41.78886712881852, -87.59717774334067, -87.59690548581031)
    map.addToMap(Rockefeller.id, Rockefeller)
  /*=====================================================
    ============  Upper Left edge Of Campus  ============
    =====================================================*/
    var Biophsych = new Bubble()
    Biophsych.init_bubble('Biophsychological Research Building', 41.791478105272255, 41.79166534851611, -87.60240605684479, -87.60191905442913)
    map.addToMap(Biophsych.id, Biophsych)
    var Eckhardt = new Bubble()
    Eckhardt.init_bubble('Eckhardt Research Center', 41.79151814559273, 41.79233542780551, -87.60191782527353, -87.60154979221284)
    map.addToMap(Eckhardt.id, Eckhardt)
    var Accelerator = new Bubble()
    Accelerator.init_bubble('Accelerator Building', 41.79237699013718, 41.79306743696009, -87.60195548287713, -87.60152840086867)
    map.addToMap(Accelerator.id, Accelerator)
    var HighEnergy = new Bubble()
    HighEnergy.init_bubble('High Energy Physics Building', 41.79264582103395, 41.79298262582012, -87.60224966511103, -87.60201559126132)
    map.addToMap(HighEnergy.id, HighEnergy)
    var LASR = new Bubble()
    LASR.init_bubble('Laboratory for Astrophysics and Space Research', 41.792685837536865, 41.792999299278435, -87.60276254031527, -87.60232570185688)
    map.addToMap(LASR.id, LASR)
    var BSLC = new Bubble()
    BSLC.init_bubble('Biological Science Learning Center', 41.791464733965704, 41.79237261576532, -87.60300938036198, -87.60260746273312)
    map.addToMap(BSLC.id, BSLC)
    var Knapp = new Bubble()
    Knapp.init_bubble('Knapp Center for Biomedical Discovery', 41.79156543098144, 41.79236708118708, -87.60356458150598, -87.60317787482943)
    map.addToMap(Knapp.id, Knapp)
    var ChildDev = new Bubble()
    ChildDev.init_bubble('Child Development Center', 41.79240024732296, 41.7928159712823, -87.60438262739004, -87.60396167389088)
    map.addToMap(ChildDev.id, ChildDev)
    var Rat = new Bubble()
    Rat.init_bubble('Gerald Ratner Athletics Center', 41.79401485028083, 41.79481631758213, -87.60207882042498, -87.60150127318984)
    map.addToMap(Rat.id, Rat)
  /*=====================================================
    ============         Middle Campus       ============
    =====================================================*/
    var Reg = new Bubble()
    Reg.init_bubble('Regenstein Library', 41.79162175767265, 41.7925937062588, -87.60056702968167, -87.59928217871722)
    map.addToMap(Reg.id, Reg)
    var Egg = new Bubble()
    Egg.init_bubble('Mansueto Library', 41.79164696689978, 41.79222397538862, -87.60110801958244, -87.60064216718709)
    map.addToMap(Egg.id, Egg)
    var Bart = new Bubble()
    Bart.init_bubble('Bartlett Dining Commons', 41.79169738532276, 41.79225758737193, -87.59868483560665, -87.59829787756857)
    map.addToMap(Bart.id, Bart)
  /*=====================================================
    ============         Campus North        ============
    =====================================================*/
    var Smart = new Bubble()
    Smart.init_bubble('Smart Museum of Art', 41.79333610935577, 41.79380672604715, -87.60044478532541, -87.59995176880177)
    map.addToMap(Smart.id, Smart)
    var Cochrane = new Bubble()
    Cochrane.init_bubble('Cochrane Woods Art Center', 41.79392228949504, 41.79408280732593, -87.6004496556978, -87.59989794319294)
    map.addToMap(Cochrane.id, Cochrane)
    var CourtTheater = new Bubble()
    CourtTheater.init_bubble('Court Theater', 41.79391655670865, 41.79407994094032, -87.6011147864995, -87.6006207442913)
    map.addToMap(CourtTheater.id, CourtTheater)
    var Young = new Bubble()
    Young.init_bubble('Young Memorial Building', 41.79335474107759, 41.79348086338102, -87.6011416993126, -87.60074569660875)
    map.addToMap(Young.id, Young)
    var Crown = new Bubble()
    Crown.init_bubble('Henry Crown Field House', 41.793339028392296, 41.79378587312735, -87.59960775739765, -87.59828084183424)
    map.addToMap(Crown.id, Crown)
    var Baker = new Bubble()
    Baker.init_bubble('Baker Dining Commons', 41.7942721479437, 41.794523718778, -87.59953771248885, -87.59919214770814)
    map.addToMap(Baker.id, Baker)
  /*======================================================
    ============        South of Campus       ============
    =====================================================*/
    var OneOne = new Bubble()
    OneOne.init_bubble('1155 Building', 41.78529357540907, 41.785756466852106, -87.59769493232231, -87.59657828430436)
    // apparently the name of the building
    //hmm there is an issue unsure if this solves
    map.addToMap(OneOne.NameOfBubble, OneOne)
    var Wood = new Bubble()
    Wood.init_bubble('Woodlawn Dining Commons', 41.7843253848919, 41.78499369091889, -87.59655145653353, -87.59694874737818)
    map.addToMap(Wood.NameOfBubble, Wood)
    var Cathey = new Bubble()
    Cathey.init_bubble('Cathey Dining Commons', 41.78503215478304, 41.78516718947996, -87.6006043094919, -87.60001013244997)
    map.addToMap(Cathey.NameOfBubble, Cathey)
    var Logan = new Bubble()
    Logan.init_bubble('Logan Center for the Arts', 41.78492308961849, 41.78572860709568, -87.60414884277488, -87.60337903726452)
    map.addToMap(Logan.NameOfBubble, Logan)
    var Taft = new Bubble()
    Taft.init_bubble('Taft House/ Midway Studios', 41.78529045276358, 41.7856788604663, -87.60330975476859, -87.60298900247261)
    map.addToMap(Taft.NameOfBubble, Taft)
    var gameRules = new GameRules();
    this.game = new Game(gameRules, map, null)

    console.log("init");
    if(isIOS) {
      console.log("ios");
      let v =  setTimeout(()=>{
                     GoogleLogin.init({
                          google: {
                              initialize: true,
                              clientId: "822883682757-pdkj0u99hgj6sc5qrnegr57q1o9d860b.apps.googleusercontent.com",
                              serverClientId: "",
                              isRequestAuthCode: true
                          },
                          viewController: application.ios.rootController
                      });
                  clearTimeout(v)
              },500)
      }

    databaseEventListener(VOTE_OPEN_PATH, this.updateVoteOpenDatabase.bind(this))
  }

  login() {
    if (global.loggedIn) {
      this.zone.run(() => this.component_isLoggedIn = true)
      this.is_component_loggedIn = new Observable(observer=>observer.next(true));
      this.is_component_not_loggedIn = new Observable(observer=>observer.next(false));

      let options = {
        title: "Error",
        message: "You already are signed in as: " + global.player.username,
        okButtonText: "OK"
      }
      alert(options);
    }
    else {
      GoogleLogin.login(result=>{

        if (result["code"] != -2) {

          //console.log(result);
          let userID : string = result["id"];
          //console.log('/game/users/' + userID)
          firebase.getValue('/game/users/' + userID)
          .then(res =>{
            //new registration
            if(res["value"] == null) {
              //console.log("in new registration");
              //console.log(res);
              global.player.userIDString = result["id"];
              //global.player.username = result["displayName"];
              global.player.email = result["userToken"];


              //admin if the player is the first one registered
              databaseGet("game/users").then(res0 => {

                //no player in the game
                if (res0 == null) {
                  global.player.isAdmin = true;
                }
                //double checking there IS a player thus not admin
                else if ((Object.keys(res0).length) != 0) {
                  global.player.isAdmin = false;
                }

                let location = 0; //TODO: change location to be actual later

                //TODO UPDATE USERID NUMBER
                global.player.init(0, result["displayName"], location, 1);
                global.player.databasePath = "/game/users/" + global.player.userIDString;
                this.zone.run(() => this.component_isLoggedIn = true)
                this.is_component_loggedIn = new Observable(observer=>observer.next(true));
                this.is_component_not_loggedIn = new Observable(observer=>observer.next(false));
                //console.log(global.player);

                databaseAdd('/game/users/' + userID, global.player)
                global.result = result;

              })

            }
            //already exists
            else {
              global.player = res["value"];
              console.log("user already exists, will not add new data but will pull from the database");
              //console.log(global.player);
              global.result = res;
              this.zone.run(() => this.component_isLoggedIn = true)
              this.is_component_loggedIn = new Observable(observer=>observer.next(true));
              this.is_component_not_loggedIn = new Observable(observer=>observer.next(false));
            }
          }).then(res2 => {
            if(global.player.username != "") {
              global.loggedIn = true;
              this.zone.run(() => this.component_isLoggedIn = true)
              this.is_component_loggedIn = new Observable(observer=>observer.next(true));
              this.is_component_not_loggedIn = new Observable(observer=>observer.next(false));
              console.log(global.loggedIn);
            }
          }).then(res3 => {
            this.textChange();
          })
          .catch(error => {
            console.log("error: " + error);
          });
        }
      });
    }

    if(global.player.isadmin == true) {
      databaseEventListener("src/game/gameStarted", this.startGameDatabase.bind(this))
    }
  }

  updateVoteOpenDatabase(data: object) {
    this.votingOpen = data["value"]
  }

  startGameDatabase(data: object) {
    const hasStarted = data["value"]

    if(hasStarted) {
      this.game.startGame()
    }
  }


}
