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
  selector: 'app-iframe1',
  templateUrl: './iframe1.component.html',
  styleUrls: ['./iframe1.component.css'],
})
export class Iframe1Component implements AfterViewInit, OnDestroy {
  @ViewChild('chessboard', { static: false }) board!: NgxChessBoardView;

  @Input() onlineMode = false;
  @Input() gameCode: string | null = null;

  lightDragDisabled = false; // White starts enabled
  darkDragDisabled = true; // Black starts disabled
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

            // Enable/disable drag based on the turn
            if (gameState.turn === 'white') {
              this.lightDragDisabled = false;
              this.darkDragDisabled = true;
            } else {
              this.lightDragDisabled = true;
              this.darkDragDisabled = false;
            }
          }
        });
    } else {
      // Offline mode: Load from localStorage
      const savedFEN = localStorage.getItem('iframe1FEN');
      if (savedFEN) {
        this.board.setFEN(savedFEN);
      }
    }
  }

  makeMove(event: any) {
    const move = event?.move;
    console.log(`Iframe1 (White) making move: ${move}`);

    this.saveFEN(); // Save FEN locally for offline mode

    if (this.onlineMode && this.gameCode) {
      const currentFEN = this.board.getFEN();

      // Update Firebase with the new move and switch the turn to black
      this.db.object(`games/${this.gameCode}`).update({
        boardState: currentFEN,
        turn: 'black',
      });
    } else {
      // Offline mode: Send the move to the other iframe
      window.parent.postMessage(
        { source: 'iframe1', move },
        window.location.origin
      );
    }
  }

  saveFEN() {
    const fen = this.board.getFEN();
    if (!this.onlineMode) {
      localStorage.setItem('iframe1FEN', fen); // Only save locally in offline mode
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

    if (move && event.data.source === 'iframe2') {
      this.board.move(move); // Apply the move coming from iframe2
    }

    if (loadFEN && this.board) {
      this.board.setFEN(loadFEN); // Load saved game state
    }

    if (reset && this.board) {
      this.board.reset(); // Reset the board
      localStorage.removeItem('iframe1FEN');
    }

    if (lightDragDisabled !== undefined) {
      this.lightDragDisabled = lightDragDisabled;
    }

    if (darkDragDisabled !== undefined) {
      this.darkDragDisabled = darkDragDisabled;
    }
  }
}
