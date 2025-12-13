import {
  ChangeDetectionStrategy,
  Component, ElementRef, inject, signal, viewChild,
} from '@angular/core';
import {CodeEditor} from './components/code-editor/code-editor';
import {MwResizer} from '../../shared/directives/mw-resizer';
import { LucideAngularModule} from "lucide-angular";
import {UiButton} from "../../shared/ui-components/ui-button/ui-button";
import {Location} from "@angular/common";
import {SettingEditor} from "./components/setting-editor/setting-editor";

@Component({
  selector: 'features-editor',
  imports: [
    CodeEditor,
    MwResizer,
    LucideAngularModule,
    UiButton,
    SettingEditor
  ],
  templateUrl: './editor.html',
  styleUrl: './editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Editor {
  private readonly location = inject(Location);

  previewIframe = viewChild<ElementRef<HTMLIFrameElement>>('previewIframe')

  htmlCode = signal(`<h1>Hello World</h1>`);
  cssCode = signal(`h1 { color: red; }`);
  jsCode = signal(`console.log("Hello from JS")`);

  theme = signal<'light' | 'dark'>('dark');
  fontSize = signal<number>(14);
  fontFamily = signal<string>('JetBrains Mono, monospace');

  isOpenSetting = signal(false);

  goBack() {
    this.location.back();
  }

  openSettingEditor() {
    this.isOpenSetting.set(true);
  }

  updatePreview() {
    const iframeDoc = this.previewIframe()?.nativeElement.contentDocument!;
    const html = this.htmlCode();
    const css = `<style>${this.cssCode()}</style>`;
    const js = `<script>${this.jsCode()}<\/script>`;

    iframeDoc.open();
    iframeDoc.write(html + css + js);
    iframeDoc.close();
  }
}
