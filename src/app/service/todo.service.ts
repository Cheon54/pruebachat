import { Injectable } from '@angular/core';

import {AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable()
export class TodoService {

  todoList: AngularFireList<any>;

  constructor(private firebasedb: AngularFireDatabase) { }

  getTodoList(){
    this.todoList = this.firebasedb.list('msjes');
    return this.todoList;
  }

  addTodo(title: string, date: number, usuario: string){
    this.todoList.push({
      title: title,
      date: date,
      usuario: usuario
    })
  }

  removeTodo($key: string){
    this.todoList.remove($key);
  }
}
