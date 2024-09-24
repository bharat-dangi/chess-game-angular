import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements AfterViewInit {
  currentTurn: 'white' | 'black' = 'white';
  gameEnded = false;

  constructor() {
    window.addEventListener('message', this.receiveMessage.bind(this), false);
  }

  // Listen for messages from iframe1 and iframe2
  receiveMessage(event: MessageEvent) {
    if (event.origin !== window.location.origin) return;

    const { source, move, checkmate } = event.data;

    if (checkmate) {
      this.gameEnded = true;
      this.saveGameState(); // Save the game state after the move
    } else if (move) {
      // Forward the move to the other iframe
      if (source === 'iframe1') {
        const iframe2Window = (<HTMLIFrameElement>(
          document.getElementById('iframe2')
        ))?.contentWindow;
        iframe2Window?.postMessage(
          { source: 'iframe1', move },
          window.location.origin
        );
      } else if (source === 'iframe2') {
        const iframe1Window = (<HTMLIFrameElement>(
          document.getElementById('iframe1')
        ))?.contentWindow;
        iframe1Window?.postMessage(
          { source: 'iframe2', move },
          window.location.origin
        );
      }

      // Switch the turn after every move
      this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
      this.updateBoardStatus();

      // Save the game state after the move
      this.saveGameState();
    }
  }

  // Save the current game state to localStorage
  saveGameState() {
    const iframe1Window = (<HTMLIFrameElement>(
      document.getElementById('iframe1')
    ))?.contentWindow;
    const iframe2Window = (<HTMLIFrameElement>(
      document.getElementById('iframe2')
    ))?.contentWindow;

    // Request the FEN states and store them
    iframe1Window?.postMessage({ requestFEN: true }, window.location.origin);
    iframe2Window?.postMessage({ requestFEN: true }, window.location.origin);

    // Store the game state and current turn in localStorage after a short delay to wait for FEN responses
    setTimeout(() => {
      const iframe1FEN = localStorage.getItem('iframe1FEN') || '';
      const iframe2FEN = localStorage.getItem('iframe2FEN') || '';
      const gameState = {
        currentTurn: this.currentTurn,
        iframe1FEN,
        iframe2FEN,
        gameEnded: this.gameEnded,
      };
      localStorage.setItem('chessGameState', JSON.stringify(gameState));
    }, 500); // Adjust this timeout if necessary
  }

  // Load the saved game state from localStorage after view has been initialized
  loadGameState() {
    const savedState = localStorage.getItem('chessGameState');
    if (savedState) {
      const gameState = JSON.parse(savedState);
      this.currentTurn = gameState.currentTurn;
      this.gameEnded = gameState.gameEnded;

      const iframe1Window = (<HTMLIFrameElement>(
        document.getElementById('iframe1')
      ))?.contentWindow;
      const iframe2Window = (<HTMLIFrameElement>(
        document.getElementById('iframe2')
      ))?.contentWindow;

      iframe1Window?.postMessage(
        { loadFEN: gameState.iframe1FEN },
        window.location.origin
      );
      iframe2Window?.postMessage(
        { loadFEN: gameState.iframe2FEN },
        window.location.origin
      );

      this.updateBoardStatus();
    }
  }

  // Clear the game state from localStorage
  clearGameState() {
    localStorage.removeItem('chessGameState');
    localStorage.removeItem('iframe1FEN');
    localStorage.removeItem('iframe2FEN');
  }

  // Update dragDisabled status based on current turn
  updateBoardStatus() {
    const iframe1Window = (<HTMLIFrameElement>(
      document.getElementById('iframe1')
    ))?.contentWindow;
    const iframe2Window = (<HTMLIFrameElement>(
      document.getElementById('iframe2')
    ))?.contentWindow;

    iframe1Window?.postMessage(
      { dragDisabled: this.currentTurn !== 'white' },
      window.location.origin
    );
    iframe2Window?.postMessage(
      { dragDisabled: this.currentTurn !== 'black' },
      window.location.origin
    );
  }

  // Reset the game state and boards
  resetGame() {
    this.gameEnded = false;
    this.clearGameState();

    const iframe1Window = (<HTMLIFrameElement>(
      document.getElementById('iframe1')
    ))?.contentWindow;
    const iframe2Window = (<HTMLIFrameElement>(
      document.getElementById('iframe2')
    ))?.contentWindow;

    iframe1Window?.postMessage({ reset: true }, window.location.origin);
    iframe2Window?.postMessage({ reset: true }, window.location.origin);

    this.currentTurn = 'white'; // Reset to white's turn
    this.updateBoardStatus();
  }

  // Move the iframe logic to ngAfterViewInit to ensure the iframes are loaded
  ngAfterViewInit() {
    this.loadGameState(); // Load saved game state after the view has been initialized
  }
}
