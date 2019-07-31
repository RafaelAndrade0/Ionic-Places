import { Component, OnInit, OnDestroy } from "@angular/core";
import { BookingService } from "./booking.service";
import { Booking } from "./booking.model";
import { IonItemSliding, LoadingController } from "@ionic/angular";
import { Subscription } from "rxjs";

@Component({
  selector: "app-bookings",
  templateUrl: "./bookings.page.html",
  styleUrls: ["./bookings.page.scss"]
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  loadedBookingsSub: Subscription;
  // loadedBooksStatus = false;

  constructor(
    private bookingsService: BookingService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loadedBookingsSub = this.bookingsService.bookings.subscribe(
      (bookings: Booking[]) => {
        this.loadedBookings = bookings;
        // this.loa;
      }
    );
    console.log(this.loadedBookings);
    // console.log(this.loadedBookings.length <= 0);
  }

  ngOnDestroy() {
    this.loadedBookingsSub.unsubscribe();
  }

  onCancelBooking(bookingId: string, slidingBooking: IonItemSliding) {
    console.log(bookingId);
    console.log(this.loadedBookings);
    slidingBooking.close();
    this.loadingCtrl
      .create({ message: "Canceling the boooking...." })
      .then(loadingEl => {
        loadingEl.present();
        this.bookingsService.cancelBooking(bookingId).subscribe(() => {
          this.loadingCtrl.dismiss();
        });
      });
  }
}
