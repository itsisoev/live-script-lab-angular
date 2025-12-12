import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Editor} from './features/editor/editor';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Editor],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
