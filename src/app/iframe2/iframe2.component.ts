import {
  Component,
  ViewChild,
  AfterViewInit,
  Input,
  OnDestroy,
} from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-iframe2',
  templateUrl: './iframe2.component.html',
  styleUrls: ['./iframe2.component.css'],
})
export class Iframe2Component implements AfterViewInit, OnDestroy {
  @ViewChild('chessboard', { static: false }) board!: NgxChessBoardView;

  @Input() onlineMode = false;
  @Input() gameCode: string | null = null;

  lightDragDisabled = true; // White disabled for joiner
  darkDragDisabled = false; // Black enabled for joiner
  firebaseSub!: Subscription;

  constructor(private db: AngularFireDatabase) {}

  ngAfterViewInit() {
    if (this.onlineMode && this.gameCode) {
      // Listen for Firebase game state changes
      this.firebaseSub = this.db
        .object(`games/${this.gameCode}`)
        .valueChanges()
        .subscribe((gameState: any) => {
          if (gameState) {
            this.board.setFEN(gameState.boardState); // Sync the board state

            // Allow black to move only when it's black's turn
            if (gameState.turn === 'black') {
              this.lightDragDisabled = true; // White remains disabled
              this.darkDragDisabled = false; // Enable black dragging
            } else {
              this.lightDragDisabled = true; // White remains disabled
              this.darkDragDisabled = true; // Disable black dragging
            }
          }
        });
    } else {
      // Offline mode: Load from localStorage
      const savedFEN = localStorage.getItem('iframe2FEN');
      if (savedFEN) {
        this.board.setFEN(savedFEN);
      }
      this.board.reverse(); // Rotate the board for black
    }
  }

  makeMove(event: any) {
    const move = event?.move;

    this.saveFEN(); // Save FEN locally for offline mode
    const isCheckMate: boolean = this.board
      .getMoveHistory()
      .some((moveHistory) => moveHistory?.check && moveHistory?.mate);

    if (this.onlineMode && this.gameCode) {
      const currentFEN = this.board.getFEN();

      // Update Firebase with the new move and switch the turn to white
      this.db.object(`games/${this.gameCode}`).update({
        boardState: currentFEN,
        turn: 'white', // Now it's white's turn
      });
    } else {
      // Offline mode: Send the move to the other iframe
      window.parent.postMessage(
        { source: 'iframe2', move, checkmate: isCheckMate },
        window.location.origin
      );
    }
  }

  saveFEN() {
    const fen = this.board.getFEN();
    if (!this.onlineMode) {
      localStorage.setItem('iframe2FEN', fen); // Only save locally in offline mode
    }
  }

  ngOnDestroy() {
    if (this.firebaseSub) {
      this.firebaseSub.unsubscribe();
    }
  }

  ngOnInit() {
    window.addEventListener('message', this.receiveMessage.bind(this), false);
  }

  receiveMessage(event: MessageEvent) {
    if (event.origin !== window.location.origin) return;

    const { move, loadFEN, reset, lightDragDisabled, darkDragDisabled } =
      event.data;

    if (move && event.data.source === 'iframe1') {
      this.board.move(move); // Apply the move coming from iframe1
    }

    if (loadFEN && this.board) {
      this.board.setFEN(loadFEN); // Load saved game state
    }

    if (reset && this.board) {
      this.board.reset(); // Reset the board
      localStorage.removeItem('iframe2FEN');
    }

    if (lightDragDisabled !== undefined) {
      this.lightDragDisabled = lightDragDisabled;
    }

    if (darkDragDisabled !== undefined) {
      this.darkDragDisabled = darkDragDisabled;
    }
  }
}
