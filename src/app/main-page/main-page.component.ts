import { Component } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent {
  currentTurn: 'white' | 'black' = 'white';

  constructor() {
    window.addEventListener('message', this.receiveMessage.bind(this), false);
  }

  // Listen for messages from iframe1 and iframe2
  receiveMessage(event: MessageEvent) {
    if (event.origin !== window.location.origin) return;

    const { source, move } = event.data;

    if (move) {
      // Forward the move to the other iframe
      if (source === 'iframe1') {
        const iframe2Window = (<HTMLIFrameElement>(
          document.getElementById('iframe2')
        )).contentWindow;
        iframe2Window?.postMessage(
          { source: 'iframe1', move },
          window.location.origin
        );
      } else if (source === 'iframe2') {
        const iframe1Window = (<HTMLIFrameElement>(
          document.getElementById('iframe1')
        )).contentWindow;
        iframe1Window?.postMessage(
          { source: 'iframe2', move },
          window.location.origin
        );
      }
    }
  }
}
