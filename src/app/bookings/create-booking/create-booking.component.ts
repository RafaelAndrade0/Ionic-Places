import { Component, OnInit, Input } from "@angular/core";
import { Place } from "src/app/places/place.model";
import { ModalController } from "@ionic/angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-create-booking",
  templateUrl: "./create-booking.component.html",
  styleUrls: ["./create-booking.component.scss"]
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: "select" | "random";
  startDate: string;
  endDate: string;

  form: FormGroup;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    const avaibleFrom = new Date(this.selectedPlace.avaibleFrom);
    const avaibleTo = new Date(this.selectedPlace.avaibleTo);

    this.form = new FormGroup({
      firstname: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required, Validators.minLength(5)]
      }),
      lastname: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required, Validators.minLength(5)]
      }),
      guestnumber: new FormControl("2", {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      datefrom: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required]
      }),
      dateto: new FormControl(null, {
        updateOn: "change",
        validators: [Validators.required]
      })
    });

    // Random Mode Selected
    if (this.selectedMode == "random") {
      this.startDate = new Date(
        avaibleFrom.getTime() +
          Math.random() *
            (avaibleTo.getTime() -
              7 * 24 * 600 * 60 * 1000 -
              avaibleFrom.getTime())
      ).toISOString();

      this.endDate = new Date(
        new Date(this.startDate).getTime() +
          Math.random() *
            (new Date(this.startDate).getTime() +
              6 * 24 * 60 * 60 * 1000 -
              new Date(this.startDate).getTime())
      ).toISOString();

      this.form.patchValue({
        datefrom: this.startDate,
        dateto: this.endDate
      });
    }
  }

  dismissModal() {
    // console.log("Dismiss");
    this.modalController.dismiss(null, "cancel");
  }

  onBookPlace() {
    if (!this.form.valid) {
      return;
    }
    this.modalController.dismiss(
      {
        bookingData: {
          firstName: this.form.get("firstname").value,
          lastname: this.form.get("lastname").value,
          guestnumber: +this.form.get("guestnumber").value,
          datefrom: new Date(this.form.get("datefrom").value),
          dateto: new Date(this.form.get("dateto").value)
        }
      },
      "confirm"
    );
  }

  onCancel() {
    console.log("Cancel");
  }

  datesValid(): boolean {
    const startDate = new Date(this.form.get("datefrom").value);
    const endDate = new Date(this.form.get("dateto").value);

    return endDate >= startDate;
  }
}
