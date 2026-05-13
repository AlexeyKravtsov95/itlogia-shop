import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DefaultResponseType} from "../../../types/default.type";
import {LoginResponseType} from "../../../types/login.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    passwordRepeat: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    agree: [false, [Validators.requiredTrue]],
  })

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  signup(): void {
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;
    const passwordRepeat = this.signupForm.value.passwordRepeat;
    if (this.signupForm.valid && email && password && passwordRepeat) {
      this.authService.signup(email, password, passwordRepeat)
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }

            const loginResponse = data as LoginResponseType;
            if (!(loginResponse).accessToken || !(loginResponse).refreshToken || !(loginResponse).userId) {
              error = "Ошибка регистрации";
            }

            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }
            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;
            this._snackBar.open("Успешная регистрация");
            this.router.navigate(['/']).then();
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open("Ошибка регистрации");
            }
          }
        })
    }
  }
}
