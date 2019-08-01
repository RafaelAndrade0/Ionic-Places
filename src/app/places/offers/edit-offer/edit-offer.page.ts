import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PlacesService } from "../../places.service";
import {
  NavController,
  LoadingController,
  AlertController
} from "@ionic/angular";
import { Place } from "../../place.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-edit-offer",
  templateUrl: "./edit-offer.page.html",
  styleUrls: ["./edit-offer.page.scss"]
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  form: FormGroup;
  private offersSub: Subscription;
  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.offersSub = this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("placeId")) {
        this.navCtrl.navigateBack("/places/tabs/offers");
        return;
      }
      this.isLoading = true;
      this.placesService.getPlaceById(paramMap.get("placeId")).subscribe(
        (place: Place) => {
          this.place = place;
          this.form = new FormGroup({
            title: new FormControl(this.place.title, {
              updateOn: "blur",
              validators: [Validators.required, Validators.minLength(5)]
            }),
            description: new FormControl(this.place.description, {
              updateOn: "blur",
              validators: [Validators.required, Validators.maxLength(30)]
            })
          });
          this.isLoading = false;
        },
        error => {
          // console.log(error);
          this.alertCtrl
            .create({
              header: "Ooops! Something went wrong",
              message: "Place could not be fetched! ):",
              buttons: [
                {
                  text: "Go Back!",
                  role: "ok",
                  handler: () => {
                    this.router.navigate(["/places/tabs/offers"]);
                  }
                }
              ]
            })
            .then(alertEl => {
              alertEl.present();
            });
        }
      );
    });
  }

  ngOnDestroy() {
    this.offersSub.unsubscribe();
  }

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({ message: "Updating Place..." })
      .then(loadingEl => {
        loadingEl.present();
        this.placesService
          .updatePlace(
            this.place.id,
            this.form.get("title").value,
            this.form.get("description").value
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(["/places/tabs/offers"]);
          });
      });
  }
}
