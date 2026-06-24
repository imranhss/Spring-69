import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, Sidebar, Header, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {



}
