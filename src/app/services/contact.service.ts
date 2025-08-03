import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  getDoc,
  setDoc,
  Timestamp,
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

    await this.checkRateLimit(clientId);

    try {
      const messageData: ContactMessage = {
        ...formData,
        timestamp: Timestamp.now(),
      };

      const contactCollection = collection(this.firestore, 'contact-messages');
      await addDoc(contactCollection, messageData);

      await this.updateRateLimit(clientId);
    } catch (error) {
      console.error('🔥 Error submitting contact form:', error);
      throw new Error('Something went wrong while sending your message.');
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
          throw new Error(
            `Too many submissions. Please wait before sending another message.`
          );
        }
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Too many submissions')
      ) {
        throw error;
      }

      console.warn('⚠️ Failed to check rate limit:', error);
      // Fail open – don't block submission if rate limit check fails
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
        await setDoc(rateLimitDocRef, {
          count: 1,
          lastSubmission: now,
        });
      }
    } catch (error) {
      console.warn('⚠️ Failed to update rate limit:', error);
    }
  }

  private getClientId(): string {
    let clientId = localStorage.getItem('portfolio-client-id');
    if (!clientId) {
      clientId =
        'client-' +
        Math.random().toString(36).substring(2, 10) +
        '-' +
        Date.now().toString(36);
      localStorage.setItem('portfolio-client-id', clientId);
    }
    return clientId;
  }
}
