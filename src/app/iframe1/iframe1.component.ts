import { Component, ViewChild } from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';

@Component({
  selector: 'app-iframe1',
  templateUrl: './iframe1.component.html',
  styleUrls: ['./iframe1.component.css'],
})
export class Iframe1Component {
  @ViewChild('chessboard', { static: false }) board!: NgxChessBoardView;

  dragDisabled = false; // Initialize dragDisabled to false

  makeMove(event: any) {
    const move = event?.move;
    console.log(`Iframe1 sending move: ${move}`);
    // Send move to main page
    window.parent.postMessage(
      { source: 'iframe1', move },
      window.location.origin
    );
  }

  receiveMessage(event: MessageEvent) {
    if (event.origin !== window.location.origin) return;

    const { move, loadFEN, reset, dragDisabled } = event.data;

    if (move && event.data.source === 'iframe2') {
      console.log(`Iframe1 received move: ${move}`);
      this.board.move(move); // Apply the move coming from iframe2
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
