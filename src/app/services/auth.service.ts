import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$!: Observable<import('@angular/fire/auth').User | null>;
  
  
  constructor(private auth: Auth) {
    this.user$ = user(this.auth);
  }

  async signIn(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async signOut() {
    await signOut(this.auth);
  }

  isAdmin(): Observable<boolean> {
    return this.user$.pipe(
      map(user => {
        if (!user) return false;
        return user.email === 'sisodia.kshitijsingh@gmail.com';
      })
    );
  }
}
