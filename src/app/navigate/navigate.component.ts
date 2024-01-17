import { Component, Input, Renderer2 } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    MatExpansionModule,
    MatMenuModule,
    MatSlideToggleModule
  ]
})
export class NavigateComponent {

  @Input() title = 'Tut-Ang-Amun';
  
  isExpanded: boolean = false;

  thememode: string = 'light_mode';
  checked: boolean = false;
  private colorTheme: string | null = null;

  constructor(private renderer: Renderer2) {
    this.readColorTheme();
    this.setTheme(this.colorTheme);
  }

  changed(event: MatSlideToggleChange): void {
    this.colorTheme = event.checked ? 'darkMode' : 'lightMode';
    this.setTheme(this.colorTheme);
  }

  private setTheme(theme: string | null) {
    if (theme === null || (theme !== 'lightMode' && theme !== 'darkMode')) theme = 'lightMode';
    if (theme === 'lightMode') {
      this.thememode = 'light_mode';
      this.checked = false;
    } else {
      this.thememode = 'nightlight_round';
      this.checked = true;
    }
    this.renderer.removeClass(document.body, theme === 'lightMode' ? 'darkMode' : 'lightMode');
    this.renderer.addClass(document.body, theme);
    this.saveColorTheme(theme);
  }

  private saveColorTheme(theme: string): void {
    this.colorTheme = theme;
    localStorage.setItem('base-theme', theme);
  }

  private readColorTheme(): void {
    if (localStorage.getItem('base-theme')) {
      this.colorTheme = localStorage.getItem('base-theme');
    } else {
      this.colorTheme = 'lightMode';
    }
  }

}
