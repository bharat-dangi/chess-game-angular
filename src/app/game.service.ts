// game.service.ts
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private db: AngularFireDatabase) {}

  // Create a new game in Firebase and return the game key as an Observable
  createGame(): Observable<string> {
    const gameRef = this.db.list('games');
    const newGameRef = gameRef.push({
      boardState: '', // Initial board state (FEN format)
      turn: 'white',
      status: 'waiting', // Waiting for another player
    });

    return of(newGameRef.key as string);
  }

  // Join an existing game using game code
  joinGame(gameCode: string): Observable<any> {
    return this.db.object(`games/${gameCode}`).valueChanges();
  }

  // Update the game state after every move
  updateGame(gameCode: string, boardState: string, turn: string) {
    return this.db.object(`games/${gameCode}`).update({
      boardState,
      turn,
    });
  }

  // Listen to game state changes
  getGameUpdates(gameCode: string): Observable<any> {
    return this.db.object(`games/${gameCode}`).valueChanges();
  }
}
