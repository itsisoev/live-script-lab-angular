import {Directive, ElementRef, HostListener, inject, input, signal} from '@angular/core';

@Directive({
  selector: '[mw-resizer]',
})
export class MwResizer {
  private readonly el = inject(ElementRef);

  horizontal = input<boolean>(true);

  dragging = signal<boolean>(false);
  prevX = signal<number>(0);
  minSize = signal<number>(100);
  prevPos = signal<number>(0);

  prevPanel!: HTMLElement;
  nextPanel!: HTMLElement;

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.dragging.set(true);
    this.prevPos.set(this.horizontal() ? event.clientX : event.clientY);

    this.prevPanel = this.el.nativeElement.previousElementSibling;
    this.nextPanel = this.el.nativeElement.nextElementSibling;

    if (this.horizontal()) {
      this.prevPanel.style.flex = `0 0 ${this.prevPanel.offsetWidth}px`;
      this.nextPanel.style.flex = `0 0 ${this.nextPanel.offsetWidth}px`;
    } else {
      this.prevPanel.style.flex = `0 0 ${this.prevPanel.offsetHeight}px`;
      this.nextPanel.style.flex = `1 1 auto`;
    }

    document.body.style.userSelect = 'none';
    document.body.style.cursor = this.horizontal() ? 'col-resize' : 'row-resize';
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.dragging()) return;

    const delta = this.horizontal() ? event.clientX - this.prevPos() : event.clientY - this.prevPos();

    if (this.horizontal()) {
      const prevWidth = this.prevPanel.offsetWidth + delta;
      const nextWidth = this.nextPanel.offsetWidth - delta;

      if (prevWidth > this.minSize() && nextWidth > this.minSize()) {
        this.prevPanel.style.flex = `0 0 ${prevWidth}px`;
        this.nextPanel.style.flex = `0 0 ${nextWidth}px`;
        this.prevPos.set(event.clientX);
      }
    } else {
      const prevHeight = this.prevPanel.offsetHeight + delta;
      const nextHeight = this.nextPanel.offsetHeight - delta;

      if (prevHeight > this.minSize() && nextHeight > this.minSize()) {
        this.prevPanel.style.flex = `0 0 ${prevHeight}px`;
        this.prevPos.set(event.clientY);
      }
    }
  }


  @HostListener('document:mouseup')
  onMouseUp() {
    this.dragging.set(false);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }
}
