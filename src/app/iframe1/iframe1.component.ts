import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';

@Component({
  selector: 'app-iframe1',
  templateUrl: './iframe1.component.html',
  styleUrls: ['./iframe1.component.css'],
})
export class Iframe1Component implements AfterViewInit {
  @ViewChild('chessboard', { static: false }) board!: NgxChessBoardView;

  lightDragDisabled = false; // White pieces should start with enabled dragging
  darkDragDisabled = true; // Black pieces disabled until black's turn

  ngAfterViewInit() {
    const savedFEN = localStorage.getItem('iframe1FEN');
    if (savedFEN && this.board) {
      this.board.setFEN(savedFEN); // Load saved game state from localStorage
    }
  }

  makeMove(event: any) {
    const move = event?.move;
    console.log(`Iframe1 sending move: ${move}`);
    window.parent.postMessage(
      { source: 'iframe1', move },
      window.location.origin
    );
    // Save the FEN state after making a move
    this.saveFEN();
  }

  saveFEN() {
    const fen = this.board.getFEN();
    localStorage.setItem('iframe1FEN', fen);
  }

  receiveMessage(event: MessageEvent) {
    if (event.origin !== window.location.origin) return;

    const { move, loadFEN, reset, lightDragDisabled, darkDragDisabled } =
      event.data;
    debugger;
    if (move && event.data.source === 'iframe2') {
      this.board.move(move); // Apply the move coming from iframe2
    }

    if (loadFEN && this.board) {
      this.board.setFEN(loadFEN); // Load saved game state
    }

    if (reset && this.board) {
      this.board.reset(); // Reset the board for a new game
      localStorage.removeItem('iframe1FEN'); // Clear saved FEN
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
