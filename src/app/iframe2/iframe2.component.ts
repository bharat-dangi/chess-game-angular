import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';

@Component({
  selector: 'app-iframe2',
  templateUrl: './iframe2.component.html',
  styleUrls: ['./iframe2.component.css'],
})
export class Iframe2Component implements AfterViewInit {
  @ViewChild('chessboard', { static: false }) board!: NgxChessBoardView;

  dragDisabled = false; // Initialize dragDisabled to false

  ngAfterViewInit() {
    this.board.reverse(); // Rotate the board for black pieces
  }

  makeMove(event: any) {
    const move = event?.move;
    console.log(`Iframe2 sending move: ${move}`);
    // Send move to main page
    window.parent.postMessage(
      { source: 'iframe2', move },
      window.location.origin
    );
  }

  receiveMessage(event: MessageEvent) {
    if (event.origin !== window.location.origin) return;

    const { move, loadFEN, reset, dragDisabled } = event.data;

    if (move && event.data.source === 'iframe1') {
      console.log(`Iframe2 received move: ${move}`);
      this.board.move(move); // Apply the move coming from iframe1
    }

    if (loadFEN) {
      this.board.setFEN(loadFEN); // Load saved game state
    }

    if (reset) {
      this.board.reset(); // Reset the board for a new game
    }

    if (dragDisabled !== undefined) {
      this.dragDisabled = dragDisabled; // Update dragDisabled state based on message from main page
    }
  }

  ngOnInit() {
    window.addEventListener('message', this.receiveMessage.bind(this), false);
  }
}
