import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiUrlPipe } from '../../../../core/pipes/api-url.pipe';
import { SiteConfig } from '../../../../core/models/site-config.model';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, ApiUrlPipe],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements AfterViewInit {
  @Input() config!: SiteConfig;
  @ViewChild('bgMusic') bgMusic!: ElementRef<HTMLAudioElement>;

  playing = false;

  ngAfterViewInit() {
    const audio = this.bgMusic.nativeElement;
    audio.volume = 0.3;
  }

  toggleMusic() {
    const audio = this.bgMusic.nativeElement;
    if (this.playing) {
      audio.pause();
    } else {
      audio.play();
    }
    this.playing = !this.playing;
  }
}
