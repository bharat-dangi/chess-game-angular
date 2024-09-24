import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';

@Component({
  selector: 'app-iframe2',
  templateUrl: './iframe2.component.html',
  styleUrls: ['./iframe2.component.css'],
})
export class Iframe2Component implements AfterViewInit {
  @ViewChild('chessboard', { static: false }) board!: NgxChessBoardView;

  // Disable dragging for white and black pieces separately
  lightDragDisabled = true; // White pieces disabled until white's turn
  darkDragDisabled = false; // Black pieces should start with enabled dragging

  ngAfterViewInit() {
    const savedFEN = localStorage.getItem('iframe2FEN');
    if (savedFEN && this.board) {
      this.board.setFEN(savedFEN); // Load saved game state from localStorage
    }
    // Rotate the board for black pieces
    this.board.reverse();
  }

  makeMove(event: any) {
    const move = event?.move;
    console.log(`Iframe2 sending move: ${move}`);
    window.parent.postMessage(
      { source: 'iframe2', move },
      window.location.origin
    );
    // Save the FEN state after making a move
    this.saveFEN();
  }

  saveFEN() {
    const fen = this.board.getFEN();
    localStorage.setItem('iframe2FEN', fen);
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
      this.board.reset(); // Reset the board for a new game
      localStorage.removeItem('iframe2FEN'); // Clear saved FEN
    }

    if (lightDragDisabled !== undefined) {
      this.lightDragDisabled = lightDragDisabled; // Update lightDragDisabled state
    }

    if (darkDragDisabled !== undefined) {
      this.darkDragDisabled = darkDragDisabled; // Update darkDragDisabled state
    }
  }

  ngOnInit() {
    window.addEventListener('message', this.receiveMessage.bind(this), false);
  }
}
