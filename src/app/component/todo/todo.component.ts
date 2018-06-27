import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

import { TodoService } from '../../service/todo.service';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { Router } from '@angular/router';



@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit, AfterViewChecked {
  
  @ViewChild('scroller') private feedContainer: ElementRef;

  user: Observable<firebase.User>;
  authenticated: boolean = false;
  usuario: string;
  nm: boolean;

  todoListArray: any[];
  constructor(private todoService: TodoService, public afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe(
      (auth) =>{
        if(auth != null){
          this.user = afAuth.authState;
          this.usuario = auth.displayName;
          this.authenticated = true;
          this.router.navigate(['/member']);
        }else{
          this.authenticated = false;
          this.router.navigate(['/login']);
        }
      }
    )

   }

  ngOnInit() {
    this.todoService.getTodoList().snapshotChanges().subscribe(item => {
      this.todoListArray = [];
      item.forEach(element =>{
        let x = element.payload.toJSON();
        x['$key'] = element.key;
        this.todoListArray.push(x);
        this.nm=true;
      });
      
    })
    
  }

  addTodo(itemTitle){
    if(itemTitle.value != ""){
      var date = Date.now();
      this.todoService.addTodo(itemTitle.value, date, this.usuario);
      itemTitle.value = null;
    }
  }

  deleteTodo($key: string){
    if(confirm('¿Desear borrar esta tarea? ')){
      this.todoService.removeTodo($key);
    }
  }

  logout() {
    console.log('logout');
   this.afAuth.auth.signOut()
   .then((result)=>{
     this.authenticated = false;
     this.router.navigate(['/login']);
     console.log('You were logged out successfully!');
   }).catch((error) =>{
     this.authenticated = true;
     console.log('Error signing out: ',error);
   })
 }

 scrollToBottom(): void{
  this.feedContainer.nativeElement.scrollTop = this.feedContainer.nativeElement.scrollHeight;
 }
 ngAfterViewChecked() {
   if(this.nm){
     this.scrollToBottom();
     this.nm = false;
   }
  
  
 }
}
