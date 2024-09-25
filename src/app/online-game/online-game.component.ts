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
  gameCode: string | null = null; // Current game code
  gameCreated = false; // Whether a game has been created
  joiningGame = false; // Flag for joining a game
  isCreator = false; // Whether the player is the game creator
  enteredGameCode: string | null = null; // Stores the game code entered by the player to join
  showPopup = false; // Flag to control visibility of the popup
  popupMessage: string | null = null; // The message to display in the popup

  constructor(private db: AngularFireDatabase, private router: Router) {}

  // Function to create a new game
  createNewGame() {
    const existingCode = localStorage.getItem('createdGameCode');

    // If there's an old game, delete it from Firebase and localStorage
    if (existingCode) {
      this.db.object(`games/${existingCode}`).remove();
      localStorage.removeItem('createdGameCode');
    }

    // Generate a new game code
    this.gameCode = uuidv4();

    // Set the game state in Firebase and store the new game code locally
    this.db.object(`games/${this.gameCode}`).set({
      boardState: null,
      turn: 'white',
    });
    localStorage.setItem('createdGameCode', this.gameCode); // Store new game code locally

    this.isCreator = true; // Mark as creator (white)
    this.gameCreated = true; // Mark game as created
  }

  // Function to join an existing game
  joinGame() {
    if (this.enteredGameCode) {
      // Check if the game exists in Firebase
      this.db
        .object(`games/${this.enteredGameCode}`)
        .valueChanges()
        .subscribe((game) => {
          if (!game) {
            // Show popup if the game does not exist (deleted) and the user is not the creator
            this.popupMessage = 'This game does not exist or has been deleted.';
            this.showPopup = true;
            return;
          }

          const createdCode = localStorage.getItem('createdGameCode');

          // If the player is trying to join their own game
          if (createdCode === this.enteredGameCode) {
            this.gameCode = createdCode;
            this.isCreator = true; // Assign as white (creator)
          } else {
            this.gameCode = this.enteredGameCode; // Join as black
            this.isCreator = false;
          }

          this.gameCreated = true;
        });
    }
  }

  // Function to close the popup
  closePopup() {
    this.showPopup = false;
    this.popupMessage = null;
  }

  // Function to show the input for joining a game
  askForCodeToJoin() {
    this.joiningGame = true; // Show input for game code
  }

  // Function to navigate back to the home page
  backHome() {
    this.router.navigate(['/mainpage']); // Navigate to home page
  }
}
