import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnChanges, OnDestroy, output,
  signal, SimpleChanges, viewChild,
} from '@angular/core';
import {basicSetup, EditorView} from 'codemirror';
import {html} from '@codemirror/lang-html';
import {css} from '@codemirror/lang-css';
import {javascript} from '@codemirror/lang-javascript';
import {EditorSelection, EditorState, StateEffect} from '@codemirror/state';
import {githubDark, githubLight} from '@uiw/codemirror-theme-github';
import {debounceTime, distinctUntilChanged, Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'features-code-editor',
  imports: [],
  templateUrl: './code-editor.html',
  styleUrl: './code-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeEditor implements AfterViewInit, OnChanges, OnDestroy {
  editorRef = viewChild<ElementRef>('editorRef');

  codeChange = output<string>();

  language = input<'html' | 'css' | 'javascript'>('html');
  code = input<string>('');
  theme = input<'light' | 'dark'>('light');
  fontSize = input<number>(14);
  fontFamily = input<string>('JetBrains Mono, monospace');

  private destroy$ = new Subject<void>();
  private codeChangeSubject = new Subject<string>();

  private editor = signal<EditorView | null>(null);

  constructor() {
    this.codeChangeSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      ).subscribe(code => {
      this.codeChange.emit(code);
    });
  }

  ngAfterViewInit() {
    this.createEditor();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['language'] || changes['theme'] || changes['fontSize'] || changes['fontFamily'])
      && this.editor()) {
      queueMicrotask(() => this.updateEditor());
    }

    if (changes['code'] && this.editor() && !this.editor()?.hasFocus) {
      this.updateCode();
    }
  }

  ngOnDestroy() {
    this.editor()?.destroy();
    this.editor.set(null);

    this.destroy$.next();
    this.codeChangeSubject.complete();
  }

  private createEditor() {
    if (!this.editorRef()?.nativeElement) return;

    const state = EditorState.create({
      doc: this.code(),
      extensions: this.getExtensions()
    });

    this.editor.set(new EditorView({
      state,
      parent: this.editorRef()?.nativeElement
    }));
  }

  private updateEditor() {
    if (!this.editor()) return;

    this.editor()?.dispatch({
      effects: StateEffect.reconfigure.of(this.getExtensions())
    });
  }

  private updateCode() {
    const editor = this.editor();
    if (!editor) return;

    const currentCode = editor.state.doc.toString();
    const newCode = this.code();

    if (currentCode === newCode) return;

    const currentSelection = editor.state.selection;

    const newSelection = EditorSelection.create(
      currentSelection.ranges.map(range =>
        EditorSelection.range(
          Math.min(range.anchor, newCode.length),
          Math.min(range.head, newCode.length)
        )
      ),
      currentSelection.mainIndex
    );

    const transaction = editor.state.update({
      changes: {from: 0, to: currentCode.length, insert: newCode},
      selection: newSelection
    });

    editor.dispatch(transaction);
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
        this.codeChangeSubject.next(v.state.doc.toString());
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
          fontSize: `${this.fontSize()}px`,
        },
        '.cm-scroller': {
          overflow: 'auto',
          height: '100%',
          minHeight: '6.25rem',
          fontFamily: this.fontFamily(),
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
