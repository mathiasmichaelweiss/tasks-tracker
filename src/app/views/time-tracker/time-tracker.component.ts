import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as pdfMake from "pdfmake/build/pdfmake";  
import * as pdfFonts from "pdfmake/build/vfs_fonts";  

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs; 

@Component({
  selector: 'app-time-tracker',
  templateUrl: './time-tracker.component.html',
  styleUrls: ['./time-tracker.component.css']
})
export class TimeTrackerComponent implements OnInit {
  public tasks: {
    currentTimeHours: number,
    currentTimeMinutes: number,
    currentTimeSeconds: number,
    title: string,
    totalTimeHours: number,
    totalTimeMinutes: number,
    totalTimeSeconds: number
    dateString: string,
    date: Date
  }[] = [
    {
    currentTimeHours: 0,
    currentTimeMinutes: 0,
    currentTimeSeconds: 0,
    title: '11 nov',
    totalTimeHours: 0,
    totalTimeMinutes: 0,
    totalTimeSeconds: 0,
    dateString: '11 November 2022',
    date: new Date('November 11, 2022 03:24:00')
  },
  {
    currentTimeHours: 0,
    currentTimeMinutes: 0,
    currentTimeSeconds: 0,
    title: '10 nov',
    totalTimeHours: 0,
    totalTimeMinutes: 0,
    totalTimeSeconds: 0,
    dateString: '10 November 2022',
    date: new Date('November 10, 2022 03:24:00')
  }
  ]
   
  public rewritedTask: any

  constructor(@Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit(): void {
    if (this.getLocalStorage()) {
      this.tasks = this.getLocalStorage()
    }
    this.tasks[0].date = new Date('November 11, 2022 03:24:00')
    this.tasks[1].date = new Date('November 10, 2022 03:24:00')
  }

  public setCurrentTimeState(value: {h: number, m: number, s: number, taskName: string}) {
  }

  public setTotalTimeState(value: {h: number, m: number, s: number, taskName: string}) {
    let tsks = this.tasks.map(tsk => {
      if (tsk.title === value.taskName) {
        return {
          ...tsk,
          totalTimeHours: value.h,
          totalTimeMinutes: value.m,
          totalTimeSeconds: value.s,
        }
      }
      return tsk
    })
    this.tasks = tsks

    this.setLocalStorage()
  }

  public createTask() {
    const countOfNewTasks = this.tasks.filter(tsk => tsk.title.split(' ')[0] === 'task' && tsk.title.split(' ')[1] === 'name').length
    
    this.tasks.push({
      title: `task name${countOfNewTasks > 0 ? ' ' + countOfNewTasks : ''}`,
      totalTimeHours: 0,
      totalTimeMinutes: 0,
      totalTimeSeconds: 0,
      currentTimeHours: 0,
      currentTimeMinutes: 0,
      currentTimeSeconds: 0,
      dateString: formatDate(Date.now(),'d MMMM y',this.locale),
      date: new Date(Date.now())
    })

    this.setLocalStorage()
    console.log(this.tasks);
    
  }

  public setTaskName(name: string, idx: number) {
    this.tasks[idx].title = name
    this.setLocalStorage()
  }

  private setLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks))
  }

  private getLocalStorage() {
    if(localStorage.getItem('tasks') !== null) {
      const ls = localStorage.getItem('tasks') as string
      return JSON.parse(ls)
    }
  }

  public getFirstAndLastDates() {
    const toSort = this.tasks
    const sortedDates = [toSort.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].dateString, toSort.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[toSort.length - 1].dateString]

    return sortedDates
  }

  public getDifferenceOfDays() {
    const sortedDates = this.getFirstAndLastDates()
    
    const a = moment([...formatDate(new Date(sortedDates[0]),'YYYY M d',this.locale).split(' ')]);
    const b = moment([...formatDate(new Date(sortedDates[1]),'YYYY M d',this.locale).split(' ')]);
    const days = b.diff(a, 'days');

    return days
  }

  public download() {
    let docDefinition = {  
      content: [  
          {  
              text: 'Tasks Details',  
              style: 'sectionHeader'  
          },  
          {  
              table: {  
                  headerRows: 1,  
                  widths: ['*', 'auto', 'auto'],  
                  body: [  
                      ['Task', 'Time (h:m:s)', 'Created at'],  
                      ...this.tasks.map(p => ([p.title, `${p.totalTimeHours < 10 ? '0' + p.totalTimeHours: p.totalTimeHours }:${p.totalTimeMinutes < 10 ? '0' + p.totalTimeMinutes : p.totalTimeMinutes}:${p.totalTimeSeconds < 10 ? '0' + p.totalTimeSeconds : p.totalTimeSeconds}`, p.dateString]))
                  ],
              },
          },
          {
            text: 'Additional details:',
            style: 'sectionSubheader'
          },
          {  
            text: 
              `Statistics for ${this.getDifferenceOfDays()} days, from ${this.getFirstAndLastDates()[0]} to ${this.getFirstAndLastDates()[1]} November`,   
          },
          {  
            columns: [  
                [{ qr: `${'https://profiler.adesso-group.com/profiler/profiles/2002136705/projects'}`, fit: '100' }],  
                [{ text: '', alignment: 'right', italics: true }],  
            ],
            margin: [0, 25, 0, 0] 
          }, 
      ],
        styles: {  
          sectionHeader: {  
              bold: true,  
              decoration: 'underline',  
              fontSize: 16,  
              margin: [0, 15, 0, 15]  
          },
          sectionSubheader: {
            bold: true,  
            decoration: 'underline',  
            fontSize: 14,  
            margin: [0, 15, 0, 5]   
          },
          mt: {    
            margin: [0, 25, 0, 0]  
          },
          mb: {    
            margin: [0, 0, 0, 15]  
          }  
      } 
    }

    // let docDefinition = {  
    //   content: [  
    //     {
    //       text: "Tasks list",
    //       style: 'sectionHeader'
    //     }
    //   ],

    // }  

    
    
    // this.tasks.forEach(task => {
    //   (docDefinition.content as any).push({
    //     text: task.title,
    //     fontSize: 16, 
    //     bold: true, 
    //     alignment: 'start', 
    //   });
    //   (docDefinition.content as any).push({  
    //     text: `Task time: hours: ${task.totalTimeHours} | minutes: ${task.totalTimeMinutes} | seconds: ${task.totalTimeSeconds}`,  
    //     fontSize: 14,  
    //     alignment: 'start',    
    //   });
    // })
   
    pdfMake.createPdf(docDefinition as any).open();  
    const dd = {
      content: [
        'First paragraph',
        'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
      ] 
    }
  }

}
