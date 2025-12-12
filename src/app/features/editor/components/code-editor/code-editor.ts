import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnChanges, output,
  signal, SimpleChanges,
  ViewChild
} from '@angular/core';
import {basicSetup, EditorView} from 'codemirror';
import {html} from '@codemirror/lang-html';
import {css} from '@codemirror/lang-css';
import {javascript} from '@codemirror/lang-javascript';
import {EditorState} from '@codemirror/state';
import {githubDark, githubLight} from '@uiw/codemirror-theme-github';

@Component({
  selector: 'features-code-editor',
  imports: [],
  templateUrl: './code-editor.html',
  styleUrl: './code-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeEditor implements AfterViewInit, OnChanges {
  @ViewChild('editorRef') editorRef!: ElementRef;

  codeChange = output<string>();

  language = input<'html' | 'css' | 'javascript'>('html');
  code = input<string>('');
  theme = input<'light' | 'dark'>('light');

  private editor = signal<EditorView | null>(null);

  ngAfterViewInit() {
    this.createEditor();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['language'] || changes['theme']) && this.editor()) {
      setTimeout(() => this.updateEditor(), 0);
    }

    if (changes['code'] && this.editor && !this.editor()?.hasFocus) {
      this.updateCode();
    }
  }

  private createEditor() {
    const state = EditorState.create({
      doc: this.code(),
      extensions: this.getExtensions()
    });

    this.editor.set(new EditorView({
      state,
      parent: this.editorRef.nativeElement
    }));
  }

  private updateEditor() {
    if (!this.editor) return;

    const newState = EditorState.create({
      doc: this.code(),
      extensions: this.getExtensions()
    });

    this.editor()?.setState(newState);
  }


  private updateCode() {
    if (!this.editor) return;

    const currentCode = this.editor()?.state.doc.toString();
    if (currentCode !== this.code()) {
      const transaction = this.editor()?.state.update({
        changes: {
          from: 0,
          to: currentCode?.length,
          insert: this.code()
        }
      });

      if (transaction) {
        this.editor()?.dispatch(transaction);
      }

    }
  }

  private getExtensions() {
    let languageExtension;
    switch (this.language()) {
      case 'html':
        languageExtension = html();
        break;
      case 'css':
        languageExtension = css();
        break;
      case 'javascript':
        languageExtension = javascript();
        break;
      default:
        languageExtension = html();
    }

    const theme = this.theme() === 'dark' ? githubDark : githubLight;

    const updateListener = EditorView.updateListener.of((v) => {
      if (v.docChanged) {
        this.codeChange.emit(v.state.doc.toString());
      }
    });

    return [
      basicSetup,
      languageExtension,
      theme,
      updateListener,
      EditorView.lineWrapping,
      EditorView.theme({
        '&': {
          height: '100%',
          fontSize: '0.875rem',
        },
        '.cm-scroller': {
          overflow: 'auto',
          height: '100%',
          minHeight: '6.25rem',
          fontFamily: "'SF Mono', Monaco, 'Courier New', monospace",
          lineHeight: '1.6'
        },
        '.cm-gutters': {
          backgroundColor: this.theme() === 'dark' ? '#0d1117' : '#f6f8fa',
          color: this.theme() === 'dark' ? '#8b949e' : '#57606a',
          borderRight: `0.0625rem solid ${this.theme() === 'dark' ? '#30363d' : '#d0d7de'}`
        },
        '.cm-lineNumbers .cm-gutterElement': {
          padding: '0 0.5rem'
        },
        '.cm-activeLineGutter': {
          backgroundColor: this.theme() === 'dark' ? '#161b22' : '#eaeef2'
        },
        '.cm-activeLine': {
          backgroundColor: this.theme() === 'dark' ? 'rgba(110, 118, 129, 0.1)' : 'rgba(175, 184, 193, 0.2)'
        }
      }),

    ];
  }

}
