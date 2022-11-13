import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  @Input() c_h!: number
  @Input() c_m!: number
  @Input() c_s!: number
  @Input() t_h!: number
  @Input() t_m!: number
  @Input() t_s!: number
  @Input() title!: string
  @Output() setCurrentTimeState = new EventEmitter()
  @Output() setTotalTimeState = new EventEmitter()
  @Output() setTaskName = new EventEmitter()


  currentTimeState!: {h: number, m: number, s: number, taskName: string}
  totalTimeState!: {h: number, m: number, s: number, taskName: string}

  public isStarted: boolean = false;
  public timer?: ReturnType<typeof setTimeout>

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.currentTimeState = { h: 0, m: 0, s: 0, taskName: this.title }
    this.totalTimeState = { h: 0, m: 0, s: 0, taskName: this.title }
  }

  public start() {
    this.isStarted = true
    let seconds = 0;


    this.timer = setInterval(() => {
      this.c_s = ++this.c_s
      if (this.c_s === 60) {
        this.c_s = 0
        this.c_m = ++this.c_m
      }
      if (this.c_m === 60) {
        this.c_m = 0
        this.c_h = ++this.c_h
      }

      this.currentTimeState = { ...this.currentTimeState, h: this.c_h, m: this.c_m, s: this.c_s,  }
      this.setCurrentTimeState.emit(this.currentTimeState)
    }, 1000)
  }

  public stop() {
    this.isStarted = false
    clearInterval(this.timer)

    this.t_h = this.c_h + this.t_h
    this.t_m = this.c_m + this.t_m
    this.t_s = this.c_s + this.t_s

    if (this.t_s >= 60) {
      this.t_m = ++this.t_m
      this.t_s = 0;
    }

    if (this.t_m >= 60) {
      this.t_h = ++this.t_h
      this.t_m = 0;
    }

    this.c_h = 0
    this.c_m = 0
    this.c_s = 0

    this.totalTimeState = { ...this.totalTimeState, h: this.t_h, m: this.t_m, s: this.t_s }
    this.setTotalTimeState.emit(this.totalTimeState)
  }

  public changeTaskName(event: Event) {
    this.setTaskName.emit((event.target as HTMLInputElement).value)
  }

}
