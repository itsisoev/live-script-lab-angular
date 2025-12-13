import {Directive, ElementRef, HostListener, inject, input, signal} from '@angular/core';

@Directive({
  selector: '[mw-resizer]',
})
export class MwResizer {
  private readonly el = inject(ElementRef);

  horizontal = input<boolean>(true);

  dragging = signal<boolean>(false);
  minSize = signal<number>(100);
  prevPos = signal<number>(0);

  prevPanel!: HTMLElement;
  nextPanel!: HTMLElement;


  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onStart(event: MouseEvent | TouchEvent) {
    this.dragging.set(true);

    const client = 'touches' in event ? event.touches[0] : event;
    this.prevPos.set(this.horizontal() ? client.clientX : client.clientY);

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
  @HostListener('document:touchmove', ['$event'])
  onMove(event: MouseEvent | TouchEvent) {
    if (!this.dragging()) return;

    const client = 'touches' in event ? event.touches[0] : event;
    const delta = this.horizontal() ? client.clientX - this.prevPos() : client.clientY - this.prevPos();

    if (this.horizontal()) {
      const prevWidth = this.prevPanel.offsetWidth + delta;
      const nextWidth = this.nextPanel.offsetWidth - delta;

      if (prevWidth > this.minSize() && nextWidth > this.minSize()) {
        this.prevPanel.style.flex = `0 0 ${prevWidth}px`;
        this.nextPanel.style.flex = `0 0 ${nextWidth}px`;
        this.prevPos.set(client.clientX);
      }
    } else {
      const prevHeight = this.prevPanel.offsetHeight + delta;
      const nextHeight = this.nextPanel.offsetHeight - delta;

      if (prevHeight > this.minSize() && nextHeight > this.minSize()) {
        this.prevPanel.style.flex = `0 0 ${prevHeight}px`;
        this.prevPos.set(client.clientY);
      }
    }
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  onEnd() {
    this.dragging.set(false);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }
}
