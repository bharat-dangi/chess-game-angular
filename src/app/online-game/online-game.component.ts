import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-online-game',
  templateUrl: './online-game.component.html',
  styleUrls: ['./online-game.component.css'],
})
export class OnlineGameComponent {
  gameCode: string = '';
  currentBoardState: string = '';
  isGameCreated: boolean = false;
  isJoined: boolean = false;
  currentPlayer: 'white' | 'black' | null = null;

  constructor(private db: AngularFireDatabase) {}

  createGame() {
    const gameRef = this.db.list('games');
    const newGameRef = gameRef.push({
      boardState: '', // Initial board state (FEN)
      turn: 'white',
      status: 'waiting',
    });

    this.gameCode = newGameRef.key as string;
    this.isGameCreated = true;
    this.currentPlayer = 'white'; // The creator is always white
  }

  joinGame(code: string) {
    this.gameCode = code;
    this.isJoined = true;
    this.currentPlayer = 'black'; // The joining player is black

    // Start listening to board changes
    this.db
      .object(`games/${code}`)
      .valueChanges()
      .subscribe((game: any) => {
        if (game) {
          this.currentBoardState = game.boardState;
        }
      });
  }

  onMoveMade(event: any) {
    if (this.currentPlayer) {
      const move = event.move;
      const updatedFEN = event.fen;

      // Update the game in Firebase with the new board state and change turn
      this.db.object(`games/${this.gameCode}`).update({
        boardState: updatedFEN,
        turn: this.currentPlayer === 'white' ? 'black' : 'white',
      });
    }
  }
}
