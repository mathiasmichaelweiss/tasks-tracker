import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-play-stop-btn',
  templateUrl: './play-stop-btn.component.html',
  styleUrls: ['./play-stop-btn.component.css']
})
export class PlayStopBtnComponent implements OnInit {
  @Input() icon!: 'plus' | 'play' | 'stop' | 'save' | 'download'
  @Input() text?: string
  constructor() { }

  ngOnInit(): void {
  }

}
