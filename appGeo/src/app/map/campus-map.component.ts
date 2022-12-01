import { Component, Inject, Injectable, OnInit} from '@angular/core';
import {Bubble} from './map.component'
import {Player, Killer, Civilian} from '../player/player.component'
import { push } from 'nativescript-plugin-firebase';
import { databaseAdd, databaseGet, databaseEventListener, databaseUpdate } from '../../modules/database' //copied over so I can access player variable




@Component({
  selector: 'campusMap',
  templateUrl: './campus-map.component.html',
  styleUrls: ['./campus-map.component.css']
})



export class CampusMap implements OnInit {
  public MapOfCampus: Map<string, Bubble>;
  public display: Bubble; //the CampusMap has a function inside to choose which Bubble the player will see to make things simpler
  public playerlist: Array<Player>;
  public offcampus : Bubble // moved over the offcampus Bubble here

  constructor() {
  //the MapOfCampus will be fully initialized on when called in game class OnInit will need to use getters and setters
    this.MapOfCampus = new Map<string, Bubble>;
    /* ============== Off Campus Bubble ================*/
    var OffCampus = new Bubble()
    OffCampus.init_bubble('The Outside of any assigned Campus Buildings', 0, 0, 0, 0)
    this.offcampus = OffCampus
  }
  ngOnInit() : void {

    /* //Here is a dummy player you can test UI with (change coords to bubble you want):
    var P1 = new Player()
    P1.init(1, 'P1', {longitude: 0, latitude: 0,}, 1) */
    this.playersBubble(global.player)

  }

    addToMap(name: string, toAdd: Bubble){
      //adds a bubble to our mapOfCampus
      this.MapOfCampus.set(name, toAdd);
    }

    playerInBubble(pToCheck: Player){
      //This will be the function to call to check if a player is in a Bubble within our list of Bubbles
      for (let bubb of this.MapOfCampus.values()) {
        this.checkBubble(bubb, pToCheck)
      }

      //console.log("player location is: " + pToCheck.location)

      if(this.display == undefined){
        //for when the first player is found to not be on campus
        this.offcampus.addPlayer(pToCheck)
        this.display = this.offcampus
        this.playerlist = this.offcampus.playerArray
      }else if(!this.display.playerArray.includes(pToCheck) && pToCheck.alive){
        //for when display has changed constantly and this player is offcampus
        this.offcampus.addPlayer(pToCheck)
        this.display = this.offcampus
        this.playerlist = this.offcampus.playerArray
      }
    }


    checkBubble(checkIfIn : Bubble, pToCheck : Player){
      //this is a function that calls on the bubble that is iterated through
      //when this is called on a bubble if true will change the bubble to display to the Player
      if(checkIfIn.inBubble(pToCheck) && checkIfIn.List.has(pToCheck.userID)){
        if (!pToCheck.alive){
          checkIfIn.removePlayer(pToCheck)
          this.display = checkIfIn
          this.playerlist = checkIfIn.playerArray
          return
        }
      } else if(checkIfIn.inBubble(pToCheck) && !checkIfIn.List.has(pToCheck.userID)){ //should have more logic to remove a player that is in said bubble List but not in the bubble boundary
        if (this.offcampus.List.has(pToCheck.userID)){
          this.offcampus.removePlayer(pToCheck)
        }
        if (!pToCheck.alive){
          this.display = checkIfIn
          this.playerlist = checkIfIn.playerArray
          return
        }else {
          checkIfIn.addPlayer(pToCheck)
          this.display = checkIfIn;
          console.log("this is the display: " + this.Display)
          this.playerlist = checkIfIn.playerArray //reassigning our shallow copy of names
          console.log("this is the playerlist: " + this.playerlist)
        }
      } else if(!checkIfIn.inBubble(pToCheck) && checkIfIn.List.has(pToCheck.userID)){
        checkIfIn.removePlayer(pToCheck)
      }
    }
    get Display(){
      return this.display
    }
    get PList(){
      return this.playerlist
    }

    //for use in snapshot; returns the bubble a player is in
    playersBubble(player : Player) {
          /*===================================================
      ===============  Left edge Of Campus  ===============
      =====================================================*/
      var Crerar =  new Bubble()
      Crerar.init_bubble('Crerar', -87.6025138, -87.6031023, 41.7901331, 41.7909298)
      this.addToMap(Crerar.id, Crerar)
      var Bookstore = new Bubble()
      Bookstore.init_bubble('Bookstore',-87.6013954,-87.6018721, 41.7896584,41.7899199)
      this.addToMap(Bookstore.id, Bookstore)
      var GeoLab = new Bubble()
      GeoLab.init_bubble('Hinds Lab', -87.601432,-87.601902, 41.790033,41.7905151)
      this.addToMap(GeoLab.id, GeoLab)
      var Kovler = new Bubble()
      Kovler.init_bubble('Kovler', -87.6032333, -87.6035022, 41.7896546,41.7901571)
      this.addToMap(Kovler.id, Kovler)
      var Cobb = new Bubble()
      Cobb.init_bubble('Cobb Hall', -87.60080074965704, -87.60109790155668, 41.78873284336094,41.789193407299585)
      this.addToMap(Cobb.id, Cobb)
      var Godspeed = new Bubble()
      Godspeed.init_bubble('Godspeed Hall', -87.60088472281471, -87.60104646075854, 41.78803035339906, 41.78872707776446)
      this.addToMap(Godspeed.id, Godspeed)
      var Weiboldt = new Bubble()
      Weiboldt.init_bubble('Weiboldt Hall', -87.60003025716154, -87.60107505494783, 41.78787764605307, 41.78805759030377)
      this.addToMap(Weiboldt.id, Weiboldt)
      var Harper = new Bubble()
      Harper.init_bubble('Harper', -87.60003380475374, -87.59904541075865, 41.78787887161209,41.78804486314529)
      this.addToMap(Harper.id, Harper)
      var SSRB = new Bubble()
      SSRB.init_bubble('Social Science Research Building', -87.59904755141109, -87.59856475382136, 41.787870404730164, 41.78810639259473)
      this.addToMap(SSRB.id, SSRB)
      var Foster = new Bubble()
      Foster.init_bubble('Foster', -87.5985057451996, -87.5981677868868, 41.78788540398485, 41.78802439690993)
      this.addToMap(Foster.id, Foster)
      var Kelly = new Bubble()
      Kelly.init_bubble('Kelly Hall', -87.5983570325124, -87.59820670697455, 41.78803794291792, 41.78826373694554)
      this.addToMap(Kelly.id, Kelly)
      var Green = new Bubble()
      Green.init_bubble('Green Hall', -87.5983722829261, -87.5981914565545, 41.78826779798602, 41.78854069904136)
      this.addToMap(Green.id, Green)
      var Beecher = new Bubble()
      Beecher.init_bubble('Beecher Hall', -87.5983690149796, -87.59821433217978, 41.78854557226837, 41.78877217670895)
      this.addToMap(Beecher.id, Beecher)
    /*====================================================
      ===============      Main Quad       ===============
      =====================================================*/
      var Swift = new Bubble()
      Swift.init_bubble('Swift Hall', -87.60036636374055, -87.59989007707196, 41.788907975672046, 41.78904808130821)
      this.addToMap(Swift.id, Swift)
      var Rosenwald = new Bubble()
      Rosenwald.init_bubble('Rosenwald', -87.59938500787865, -87.598959824466, 41.78873530279073, 41.78905848600595)
      this.addToMap(Rosenwald.id, Rosenwald)
      var Walker = new Bubble()
      Walker.init_bubble('Walker', -87.59892579480838, -87.59845756459619, 41.78892947918222, 41.78905995625953)
      this.addToMap(Walker.id, Walker)
      var Levi = new Bubble()
      Levi.init_bubble('Levi', -87.60100028500295, -87.60083917063466, 41.78933092826373, 41.789818107683395)
      this.addToMap(Levi.id, Levi)
      var Stats = new Bubble()
      Stats.init_bubble('Department of Statistics', -87.60111296928174, -87.60090423120408, 41.78992857090686, 41.790248548444424)
      this.addToMap(Stats.id, Stats)
      var Jones = new Bubble()
      Jones.init_bubble('George Herbert Jones Lab', -87.60091315948378, -87.60048810392563, 41.790097847928905, 41.7902414431898)
      this.addToMap(Jones.id, Jones)
      var Kent = new Bubble()
      Kent.init_bubble('Kent Chemical Labratory', -87.60049367850799, -87.5997965747976, 41.790094586277, 41.79026477113039)
      this.addToMap(Kent.id, Kent)
      var Ryerson = new Bubble()
      Ryerson.init_bubble('Ryerson Labratory', -87.59944699468637, -87.59890617381372, 41.7900746546891, 41.790474818480675)
      this.addToMap(Ryerson.id, Ryerson)
      var Eckhart = new Bubble()
      Eckhart.init_bubble('Eckhart Hall', -87.5988957181088, -87.59828293253321, 41.790131498351116, 41.79026285331647)
      this.addToMap(Eckhart.id, Eckhart)
      var Math = new Bubble()
      Math.init_bubble('Department of Mathematics', -87.59842846907647, -87.59827925417663, 41.79013282694458, 41.79046274079153)
      this.addToMap(Math.id, Math)
    /*====================================================
      =============== Huthinson Courtyard ================
      =====================================================*/
      var Mandel = new Bubble()
      Mandel.init_bubble('Mandel Hall', -87.59851991880222, -87.59826333492133, 41.79047125804421, 41.790845761929916)
      this.addToMap(Mandel.id, Mandel)
      var Reynolds = new Bubble()
      Reynolds.init_bubble('Reynolds Club', -87.59842988418312, -87.59821327584288, 41.790902240119586, 41.791320103364384)
      this.addToMap(Reynolds.id, Reynolds)
      var Hutch = new Bubble()
      Hutch.init_bubble('Hutchinson Commons', -87.59901336949609, -87.59844883657237, 41.791062794397824, 41.791311923847616)
      this.addToMap(Hutch.id, Hutch)
      var Erman = new Bubble()
      Erman.init_bubble('Erman Biology Center', -87.59929357432024, -87.59909224317552, 41.790688698459014, 41.79097309932546)
      this.addToMap(Erman.id, Erman)
      var Zoology = new Bubble()
      Zoology.init_bubble('Zoology Building', -87.59953981536984, -87.59909849668664, 41.79114229290444, 41.79128616359785)
      this.addToMap(Zoology.id, Zoology)
    /*======================================================
      ===============  Snell-Hitchcock Quad  ===============
      =====================================================*/
      var Searle = new Bubble()
      Searle.init_bubble('Searle Chemical Labratory', -87.60111259389959, -87.60086990270749, 41.79029542829623, 41.79087001455218)
      this.addToMap(Searle.id, Searle)
      var Culver = new Bubble()
      Culver.init_bubble('Culver Hall', -87.60027420070915, -87.60006316412604, 41.790680821569424, 41.79096031641998)
      this.addToMap(Culver.id, Culver)
      var Anatomy = new Bubble()
      Anatomy.init_bubble('Anatomy Building', -87.60029561621472, -87.59984198880483, 41.79115358055861, 41.79129032503934)
      this.addToMap(Anatomy.id, Anatomy)
    /*======================================================
      ===============  Rightside Campus  ===============
      =====================================================*/
      var OI = new Bubble()
      OI.init_bubble('Oriental Institute Museum', -87.59786499022391, -87.59717501543359, 41.789055778700316, 41.78947414800614)
      this.addToMap(OI.id, OI)
      var Saieh = new Bubble()
      Saieh.init_bubble('Saieh Hall', -87.59779067848177, -87.59665270800141, 41.78973263158367, 41.789961693521086)
      this.addToMap(Saieh.id, Saieh)
      var Ida = new Bubble()
      Ida.init_bubble('Ida Noyes Hall', -87.59601945707244, -87.59513854879427, 41.78797132569856, 41.78844816068627)
      this.addToMap(Ida.id, Ida)
      var SemCoOp = new Bubble()
      SemCoOp.init_bubble('Seminary Co-Op', -87.59617761884618, -87.59575794161546, 41.7900054206527, 41.79037245235687)
      this.addToMap(SemCoOp.id, SemCoOp)
      var Gender = new Bubble()
      Gender.init_bubble('Gender Studies', -87.59777324956848, -87.59741185812368, 41.79040456449, 41.790478490192946)
      this.addToMap(Gender.id, Gender)
      var Stevanovich = new Bubble()
      Stevanovich.init_bubble('Stevanovich Center', -87.59777733826961, -87.59735609296916, 41.79053919417777, 41.79065790680171)
      this.addToMap(Stevanovich.id, Stevanovich)
      var OMSA = new Bubble()
      OMSA.init_bubble('Office of Multicultural Student Affairs', -87.59702451987414, -87.59667322211914, 41.790992249688856, 41.79109846160589)
      this.addToMap(OMSA.id, OMSA)
      var HumDev = new Bubble()
      HumDev.init_bubble('Department of Comparative Human development', -87.59693501040132, -87.59670299933738, 41.79055030818548, 41.79065829822527)
      this.addToMap(HumDev.id, HumDev)
      var Rockefeller = new Bubble()
      Rockefeller.init_bubble('Rockefeller Memorial Chapel', -87.59717774334067, -87.59690548581031, 41.788191090302504, 41.78886712881852)
      this.addToMap(Rockefeller.id, Rockefeller)
    /*=====================================================
      ============  Upper Left edge Of Campus  ============
      =====================================================*/
      var Biophsych = new Bubble()
      Biophsych.init_bubble('Biophsychological Research Building', -87.60240605684479, -87.60191905442913, 41.791478105272255, 41.79166534851611)
      this.addToMap(Biophsych.id, Biophsych)
      var Eckhardt = new Bubble()
      Eckhardt.init_bubble('Eckhardt Research Center', -87.60191782527353, -87.60154979221284, 41.79151814559273, 41.79233542780551)
      this.addToMap(Eckhardt.id, Eckhardt)
      var Accelerator = new Bubble()
      Accelerator.init_bubble('Accelerator Building', -87.60195548287713, -87.60152840086867, 41.79237699013718, 41.79306743696009)
      this.addToMap(Accelerator.id, Accelerator)
      var HighEnergy = new Bubble()
      HighEnergy.init_bubble('High Energy Physics Building', -87.60224966511103, -87.60201559126132, 41.79264582103395, 41.79298262582012)
      this.addToMap(HighEnergy.id, HighEnergy)
      var LASR = new Bubble()
      LASR.init_bubble('Laboratory for Astrophysics and Space Research', -87.60276254031527, -87.60232570185688, 41.792685837536865, 41.792999299278435)
      this.addToMap(LASR.id, LASR)
      var BSLC = new Bubble()
      BSLC.init_bubble('Biological Science Learning Center', -87.60300938036198, -87.60260746273312, 41.791464733965704, 41.79237261576532)
      this.addToMap(BSLC.id, BSLC)
      var Knapp = new Bubble()
      Knapp.init_bubble('Knapp Center for Biomedical Discovery', -87.60356458150598, -87.60317787482943, 41.79156543098144, 41.79236708118708)
      this.addToMap(Knapp.id, Knapp)
      var ChildDev = new Bubble()
      ChildDev.init_bubble('Child Development Center', -87.60438262739004, -87.60396167389088, 41.79240024732296, 41.7928159712823)
      this.addToMap(ChildDev.id, ChildDev)
      var Rat = new Bubble()
      Rat.init_bubble('Gerald Ratner Athletics Center', -87.60207882042498, -87.60150127318984, 41.79401485028083, 41.79481631758213)
      this.addToMap(Rat.id, Rat)
    /*=====================================================
      ============         Middle Campus       ============
      =====================================================*/
      var Reg = new Bubble()
      Reg.init_bubble('Regenstein Library', -87.60056702968167, -87.59928217871722, 41.79162175767265, 41.7925937062588)
      this.addToMap(Reg.id, Reg)
      var Egg = new Bubble()
      Egg.init_bubble('Mansueto Library', -87.60110801958244, -87.60064216718709, 41.79164696689978, 41.79222397538862)
      this.addToMap(Egg.id, Egg)
      var Bart = new Bubble()
      Bart.init_bubble('Bartlett Dining Commons', -87.59868483560665, -87.59829787756857, 41.79169738532276, 41.79225758737193)
      this.addToMap(Bart.id, Bart)
    /*=====================================================
      ============         Campus North        ============
      =====================================================*/
      var Smart = new Bubble()
      Smart.init_bubble('Smart Museum of Art', -87.60044478532541, -87.59995176880177, 41.79333610935577, 41.79380672604715)
      this.addToMap(Smart.id, Smart)
      var Cochrane = new Bubble()
      Cochrane.init_bubble('Cochrane Woods Art Center', -87.6004496556978, -87.59989794319294, 41.79392228949504, 41.79408280732593)
      this.addToMap(Cochrane.id, Cochrane)
      var CourtTheater = new Bubble()
      CourtTheater.init_bubble('Court Theater', -87.6011147864995, -87.6006207442913, 41.79391655670865, 41.79407994094032)
      this.addToMap(CourtTheater.id, CourtTheater)
      var Young = new Bubble()
      Young.init_bubble('Young Memorial Building', -87.6011416993126, -87.60074569660875, 41.79335474107759, 41.79348086338102)
      this.addToMap(Young.id, Young)
      var Crown = new Bubble()
      Crown.init_bubble('Henry Crown Field House', -87.59960775739765, -87.59828084183424, 41.793339028392296, 41.79378587312735)
      this.addToMap(Crown.id, Crown)
      var Baker = new Bubble()
      Baker.init_bubble('Baker Dining Commons', -87.59953771248885, -87.59919214770814, 41.7942721479437, 41.794523718778)
      this.addToMap(Baker.id, Baker)
    /*======================================================
      ============        South of Campus       ============
      =====================================================*/
      var OneOne = new Bubble()
      OneOne.init_bubble('1155 Building', -87.59769493232231, -87.59657828430436, 41.78529357540907, 41.785756466852106)
      // apparently the name of the building
      //hmm there is an issue unsure if this solves
      this.addToMap(OneOne.NameOfBubble, OneOne)
      var Wood = new Bubble()
      Wood.init_bubble('Woodlawn Dining Commons', -87.59655145653353, -87.59694874737818, 41.7843253848919, 41.78499369091889)
      this.addToMap(Wood.NameOfBubble, Wood)
      var Cathey = new Bubble()
      Cathey.init_bubble('Cathey Dining Commons', -87.6006043094919, -87.60001013244997, 41.78503215478304, 41.78516718947996)
      this.addToMap(Cathey.NameOfBubble, Cathey)
      var Logan = new Bubble()
      Logan.init_bubble('Logan Center for the Arts', -87.60414884277488, -87.60337903726452, 41.78492308961849, 41.78572860709568)
      this.addToMap(Logan.NameOfBubble, Logan)
      var Taft = new Bubble()
      Taft.init_bubble('Taft House/ Midway Studios', -87.60330975476859, -87.60298900247261, 41.78529045276358, 41.7856788604663)
      this.addToMap(Taft.NameOfBubble, Taft)

      if(global.playerlist){
        /*if a global playerlist exists
        takes in the global playerlists values to set up the map*/
        for (let user of global.playerlist.values()) {
          //console.log("User location is: " + user.location)
          this.playerInBubble(user)
        }
      }

      //console.log("player location is: ", player.location)
      this.playerInBubble(player)
      return this.Display
    }
}

export default CampusMap;
