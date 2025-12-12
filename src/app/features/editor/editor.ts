import {
  ChangeDetectionStrategy,
  Component, ElementRef, signal,
  ViewChild,
} from '@angular/core';
import {CodeEditor} from './components/code-editor/code-editor';
import {MwResizer} from '../../shared/directives/mw-resizer';

@Component({
  selector: 'features-editor',
  imports: [
    CodeEditor,
    MwResizer
  ],
  templateUrl: './editor.html',
  styleUrl: './editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Editor {
  @ViewChild('previewIframe') previewIframe!: ElementRef<HTMLIFrameElement>;

  htmlCode = signal(`<h1>Hello World</h1>`);
  cssCode = signal(`h1 { color: red; }`);
  jsCode = signal(`console.log("Hello from JS")`);

  theme = signal<'light' | 'dark'>('dark');

  updatePreview() {
    const iframeDoc = this.previewIframe.nativeElement.contentDocument!;
    const html = this.htmlCode();
    const css = `<style>${this.cssCode()}</style>`;
    const js = `<script>${this.jsCode()}<\/script>`;

    iframeDoc.open();
    iframeDoc.write(html + css + js);
    iframeDoc.close();
  }
}
