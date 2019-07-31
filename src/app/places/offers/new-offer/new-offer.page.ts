import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PlacesService } from "../../places.service";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-new-offer",
  templateUrl: "./new-offer.page.html",
  styleUrls: ["./new-offer.page.scss"]
})
export class NewOfferPage implements OnInit {
  form: FormGroup;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private loaderCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required, Validators.minLength(5)]
      }),
      description: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      price: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required]
      })
    });
  }

  onCreateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loaderCtrl.create({ message: "Creating place..." }).then(loadingEl => {
      loadingEl.present();
      this.placesService
        .addPlace(
          this.form.get("title").value,
          this.form.get("description").value,
          this.form.get("price").value,
          new Date(this.form.get("dateFrom").value),
          new Date(this.form.get("dateTo").value)
        )
        .subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigate(["/places/tabs/offers"]);
        });
    });
  }
}
