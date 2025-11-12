import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent {
  heroImage: SafeStyle;

  constructor(
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    const imageUrl = 'https://images.unsplash.com/photo-1579684385127-6c1793435b9a?auto=format&fit=crop&w=1170&q=80';
    this.heroImage = this.sanitizer.bypassSecurityTrustStyle(`url(${imageUrl})`);
  }

  handleScheduleClick(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/schedule']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}