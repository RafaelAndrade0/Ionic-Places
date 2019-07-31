import { Injectable } from "@angular/core";
import { Booking } from "./booking.model";
import { BehaviorSubject, Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { take, map, delay, tap } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class BookingService {
  private _bookins = new BehaviorSubject<Booking[]>([
    // {
    //   id: "xyz",
    //   placeId: "1",
    //   placeTitle: "Itabaiana Mansion",
    //   guestNumber: 2,
    //   userId: "abc"
    // },
    // {
    //   id: "qwe",
    //   placeId: "2",
    //   placeTitle: "Aracaju Mansion",
    //   guestNumber: 4,
    //   userId: "abc"
    // },
    // {
    //   id: "asd",
    //   placeId: "3",
    //   placeTitle: "Campo do Brito Mansion",
    //   guestNumber: 5,
    //   userId: "abc"
    // }
  ]);

  constructor(private authService: AuthService) {}

  get bookings(): Observable<Booking[]> {
    return this._bookins.asObservable();
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      guestNumber,
      firstName,
      lastName,
      dateFrom,
      dateTo
    );
    return this.bookings.pipe(
      take(1),
      delay(500),
      tap((bookings_: Booking[]) => {
        this._bookins.next(bookings_.concat(newBooking));
      })
    );
  }

  cancelBooking(bookingId: string) {
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap((bookings_: Booking[]) => {
        this._bookins.next(bookings_.filter(b => b.id !== bookingId));
      })
    );
  }
}
