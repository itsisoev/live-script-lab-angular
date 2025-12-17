import {
  ChangeDetectionStrategy,
  Component, effect, ElementRef, inject, signal, viewChild,
} from '@angular/core';
import {CodeEditor} from './components/code-editor/code-editor';
import {MwResizer} from '@shared/directives/mw-resizer';
import {LucideAngularModule} from "lucide-angular";
import {UiButton} from "@shared/ui-components/ui-button/ui-button";
import {Location} from "@angular/common";
import {SettingEditor} from "./components/setting-editor/setting-editor";

const LOCAL_STORAGE_KEYS = {
  html: 'codelab-html-code',
  css: 'codelab-css-code',
  js: 'codelab-js-code'
};

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

  isHorizontal = signal<boolean>(true);

  constructor() {
    if (window.innerWidth <= 768) {
      this.isHorizontal.set(false);
    }

    this.htmlCode.set(localStorage.getItem(LOCAL_STORAGE_KEYS.html) || `<h1>Hello World</h1>`);
    this.cssCode.set(localStorage.getItem(LOCAL_STORAGE_KEYS.css) || `h1 { color: red; }`);
    this.jsCode.set(localStorage.getItem(LOCAL_STORAGE_KEYS.js) || `console.log("Hello from JS")`);

    queueMicrotask(() => this.updatePreview());

    effect(() => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.html, this.htmlCode());
      this.updatePreview();
    });

    effect(() => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.css, this.cssCode());
      this.updatePreview();
    });

    effect(() => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.js, this.jsCode());
      this.updatePreview();
    });
  }

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

  copyHtml() {
    navigator.clipboard.writeText(this.htmlCode())
      .then(() => {
        console.log('HTML скопирован!');
      })
      .catch(err => {
        console.error('Ошибка копирования:', err);
      });
  }

  copyCss() {
    navigator.clipboard.writeText(this.cssCode())
      .then(() => {
        console.log('CSS скопирован!');
      })
      .catch(err => {
        console.error('Ошибка копирования:', err);
      });
  }

  copyJs() {
    navigator.clipboard.writeText(this.jsCode())
      .then(() => {
        console.log('JS скопирован!');
      })
      .catch(err => {
        console.error('Ошибка копирования:', err);
      });
  }
}
