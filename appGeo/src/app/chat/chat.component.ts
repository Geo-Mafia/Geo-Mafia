import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'Chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class Chat implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

export class Message{
}
