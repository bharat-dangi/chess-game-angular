import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-online-game',
  templateUrl: './online-game.component.html',
  styleUrls: ['./online-game.component.css'],
})
export class OnlineGameComponent {
  gameCode: string | null = null;
  gameCreated = false;
  joiningGame = false;
  isCreator = false;
  enteredGameCode: string | null = null;

  constructor(private db: AngularFireDatabase, private router: Router) {} // Inject Router

  // Function to create a new game
  createNewGame() {
    this.gameCode = uuidv4();
    this.db.object(`games/${this.gameCode}`).set({
      boardState: null,
      turn: 'white',
    });
    this.isCreator = true;
    this.gameCreated = true;
  }

  // Function to handle the process of joining an existing game
  askForCodeToJoin() {
    this.joiningGame = true;
  }

  // Function to join an existing game once code is entered
  joinGame() {
    if (this.enteredGameCode) {
      this.gameCode = this.enteredGameCode;
      this.gameCreated = true;
      this.isCreator = false;
    }
  }

  // Function to navigate back to the main page
  backHome() {
    this.router.navigate(['/mainpage']); // Navigate to the main page
  }
}
