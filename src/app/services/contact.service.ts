// import { Injectable } from '@angular/core';
// import {
//   Firestore,
//   collection,
//   doc,
//   addDoc,
//   getDoc,
//   setDoc,
//   Timestamp,
// } from '@angular/fire/firestore';

// export interface ContactMessage {
//   name: string;
//   email: string;
//   subject: string;
//   message: string;
//   timestamp?: Timestamp;
// }

// interface RateLimitData {
//   count: number;
//   lastSubmission: Timestamp;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class ContactService {
//   private readonly RATE_LIMIT_MAX = 3; // Max submissions per time window
//   private readonly RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

//   constructor(private firestore: Firestore) {}

//   async submitContactForm(formData: ContactMessage): Promise<void> {
//     const clientId = this.getClientId();

//     await this.checkRateLimit(clientId);

//     try {
//       const messageData: ContactMessage = {
//         ...formData,
//         timestamp: Timestamp.now(),
//       };

//       const contactCollection = collection(this.firestore, 'contact-messages');
//       await addDoc(contactCollection, messageData);

//       await this.updateRateLimit(clientId);
//     } catch (error) {
//       console.error('Error submitting contact form:', error);
//       throw new Error('Something went wrong while sending your message.');
//     }
//   }

//   private async checkRateLimit(clientId: string): Promise<void> {
//     const rateLimitDocRef = doc(this.firestore, 'rate-limits', clientId);

//     try {
//       const snapshot = await getDoc(rateLimitDocRef);

//       if (snapshot.exists()) {
//         const data = snapshot.data() as RateLimitData;
//         const now = Date.now();
//         const lastSubmission = data.lastSubmission.toMillis();
//         const count = data.count;

//         const withinWindow = now - lastSubmission < this.RATE_LIMIT_WINDOW_MS;

//         if (withinWindow && count >= this.RATE_LIMIT_MAX) {
//           throw new Error(
//             `Too many submissions. Please wait before sending another message.`
//           );
//         }
//       }
//     } catch (error) {
//       if (
//         error instanceof Error &&
//         error.message.includes('Too many submissions')
//       ) {
//         throw error;
//       }

//       console.warn('Failed to check rate limit:', error);
//     }
//   }

//   private async updateRateLimit(clientId: string): Promise<void> {
//     const rateLimitDocRef = doc(this.firestore, 'rate-limits', clientId);

//     try {
//       const snapshot = await getDoc(rateLimitDocRef);
//       const now = Timestamp.now();

//       if (snapshot.exists()) {
//         const data = snapshot.data() as RateLimitData;
//         const lastSubmission = data.lastSubmission.toMillis();
//         const count = data.count;

//         const withinWindow = Date.now() - lastSubmission < this.RATE_LIMIT_WINDOW_MS;
//         const newCount = withinWindow ? count + 1 : 1;

//         await setDoc(rateLimitDocRef, {
//           count: newCount,
//           lastSubmission: now,
//         });
//       } else {
//         await setDoc(rateLimitDocRef, {
//           count: 1,
//           lastSubmission: now,
//         });
//       }
//     } catch (error) {
//       console.warn('Failed to update rate limit:', error);
//     }
//   }

//   private getClientId(): string {
//     let clientId = localStorage.getItem('portfolio-client-id');
//     if (!clientId) {
//       clientId =
//         'client-' +
//         Math.random().toString(36).substring(2, 10) +
//         '-' +
//         Date.now().toString(36);
//       localStorage.setItem('portfolio-client-id', clientId);
//     }
//     return clientId;
//   }
// }

import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  setDoc,
  Timestamp 
} from '@angular/fire/firestore';

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp?: Timestamp;
}

interface RateLimitData {
  count: number;
  lastSubmission: Timestamp;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly RATE_LIMIT_MAX = 3; // Max submissions per time window
  private readonly RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

  constructor(private firestore: Firestore) {}

  async submitContactForm(formData: ContactMessage): Promise<void> {
    const clientId = this.getClientId();

    // Check rate limit before attempting submission
    await this.checkRateLimit(clientId);

    try {
      // Validate and sanitize data to match Firestore security rules
      const messageData: ContactMessage = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        subject: formData.subject.trim(), 
        message: formData.message.trim(),
        timestamp: Timestamp.now(),
      };

      // Client-side validation to match Firestore security rules
      this.validateContactMessage(messageData);

      const contactCollection = collection(this.firestore, 'contact-messages');
      await addDoc(contactCollection, messageData);

      // Update rate limit only after successful submission
      await this.updateRateLimit(clientId);
      
      console.log('✅ Contact form submitted successfully');
    } catch (error: any) {
      console.error('🔥 Error submitting contact form:', error);
      
      // Provide user-friendly error messages
      if (error.message?.includes('Missing or insufficient permissions')) {
        throw new Error('Unable to submit your message at this time. Please try again later.');
      } else if (error.message?.includes('Too many submissions')) {
        throw error; // Re-throw rate limit errors as-is
      } else {
        throw new Error('Something went wrong while sending your message. Please try again.');
      }
    }
  }

  private validateContactMessage(data: ContactMessage): void {
    const { name, email, subject, message } = data;

    // Validate name (2-100 characters as per Firestore rules)
    if (!name || name.length < 2 || name.length > 100) {
      throw new Error('Name must be between 2 and 100 characters');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Validate subject (5-200 characters as per Firestore rules)  
    if (!subject || subject.length < 2 || subject.length > 200) {
      throw new Error('Subject must be between 5 and 200 characters');
    }

    // Validate message (10-1000 characters as per Firestore rules)
    if (!message || message.length < 10 || message.length > 1000) {
      throw new Error('Message must be between 10 and 1000 characters');
    }
  }

  private async checkRateLimit(clientId: string): Promise<void> {
    const rateLimitDocRef = doc(this.firestore, 'rate-limits', clientId);

    try {
      const snapshot = await getDoc(rateLimitDocRef);

      if (snapshot.exists()) {
        const data = snapshot.data() as RateLimitData;
        const now = Date.now();
        const lastSubmission = data.lastSubmission.toMillis();
        const count = data.count;

        const withinWindow = now - lastSubmission < this.RATE_LIMIT_WINDOW_MS;

        if (withinWindow && count >= this.RATE_LIMIT_MAX) {
          const timeRemaining = Math.ceil((this.RATE_LIMIT_WINDOW_MS - (now - lastSubmission)) / (1000 * 60));
          throw new Error(
            `Too many submissions. Please wait ${timeRemaining} minutes before sending another message.`
          );
        }
      }
    } catch (error: any) {
      if (error.message?.includes('Too many submissions')) {
        throw error; // Re-throw rate limit errors
      }
      
      // Log but don't block submission if rate limit check fails
      console.warn('⚠️ Failed to check rate limit:', error);
    }
  }

  private async updateRateLimit(clientId: string): Promise<void> {
    const rateLimitDocRef = doc(this.firestore, 'rate-limits', clientId);

    try {
      const snapshot = await getDoc(rateLimitDocRef);
      const now = Timestamp.now();

      if (snapshot.exists()) {
        const data = snapshot.data() as RateLimitData;
        const lastSubmission = data.lastSubmission.toMillis();
        const count = data.count;

        const withinWindow = Date.now() - lastSubmission < this.RATE_LIMIT_WINDOW_MS;
        const newCount = withinWindow ? count + 1 : 1;

        await setDoc(rateLimitDocRef, {
          count: newCount,
          lastSubmission: now,
        });
      } else {
        // Create new rate limit document for first-time users
        await setDoc(rateLimitDocRef, {
          count: 1,
          lastSubmission: now,
        });
      }
    } catch (error) {
      // Don't fail the entire submission if rate limit update fails
      console.warn('⚠️ Failed to update rate limit:', error);
    }
  }

  private getClientId(): string {
    let clientId = localStorage.getItem('portfolio-client-id');
    if (!clientId) {
      clientId = 'client-' + 
                 Math.random().toString(36).substring(2, 10) + 
                 '-' + 
                 Date.now().toString(36);
      localStorage.setItem('portfolio-client-id', clientId);
    }
    return clientId;
  }
}

