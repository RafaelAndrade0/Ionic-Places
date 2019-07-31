import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  NavController,
  ModalController,
  ActionSheetController,
  LoadingController
} from "@ionic/angular";
import { PlacesService } from "../../places.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Place } from "../../place.model";
import { CreateBookingComponent } from "../../../bookings/create-booking/create-booking.component";
import { Subscription } from "rxjs";
import { BookingService } from "src/app/bookings/booking.service";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-place-detail",
  templateUrl: "./place-detail.page.html",
  styleUrls: ["./place-detail.page.scss"]
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  private placesSub: Subscription;
  isBookable = false;

  constructor(
    private navCtrl: NavController,
    private placesService: PlacesService,
    private activatedRoute: ActivatedRoute,
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.placesSub = this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("placeId")) {
        this.navCtrl.navigateBack("/places/tabs/offers");
        return;
      }
      this.placesService
        .getPlaceById(paramMap.get("placeId"))
        .subscribe((place: Place) => {
          this.place = place;
          this.isBookable = place.userId !== this.authService.userId;
        });
      console.log(this.place);
    });
  }

  ngOnDestroy() {
    this.placesSub.unsubscribe();
  }

  onBookPlace() {
    this.actionSheetController
      .create({
        header: "Choose an Action",
        buttons: [
          {
            text: "Select Date",
            handler: () => {
              this.openBookingModal("select");
            }
          },
          {
            text: "Random Date",
            handler: () => {
              this.openBookingModal("random");
            }
          },
          {
            text: "Cancel",
            role: "cancel"
          }
        ]
      })
      .then(actionSheetEl => actionSheetEl.present());
  }

  openBookingModal(mode: "select" | "random") {
    // console.log(mode);
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place, selectedMode: mode }
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData);
        if (resultData.role === "confirm") {
          this.loadingCtrl
            .create({ message: "Booking place..." })
            .then(loadingEl => {
              loadingEl.present();
              console.log(resultData.data, resultData.role);
              const data = resultData.data.bookingData;
              this.bookingService
                .addBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imageUrl,
                  data.firstName,
                  data.lastname,
                  data.guestnumber,
                  data.datefrom,
                  data.dateto
                )
                .subscribe(() => {
                  loadingEl.dismiss();
                  this.router.navigate(["/bookings"]);
                });
            });
        }
      });
  }
}
