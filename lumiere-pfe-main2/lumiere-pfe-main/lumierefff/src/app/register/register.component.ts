import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    user = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: 'CLIENT' // Default role for external users
    };
    error: string = '';
    success: boolean = false;

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit(): void {
        this.authService.register(this.user.firstname, this.user.lastname, this.user.email, this.user.password, this.user.role)
            .subscribe(
                response => {
                    this.success = true;
                    this.error = '';
                    // Optionally redirect after a few seconds
                    setTimeout(() => {
                        this.router.navigate(['/login']);
                    }, 3000);
                },
                error => {
                    console.error('Registration failed', error);
                    if (error.error && error.error.message) {
                        this.error = error.error.message;
                    } else {
                        this.error = 'Registration failed. Please try again.';
                    }
                    this.success = false;
                }
            );
    }
}
