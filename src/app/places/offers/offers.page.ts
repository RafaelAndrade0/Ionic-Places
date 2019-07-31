import { Component, OnInit, OnDestroy } from "@angular/core";
import { Place } from "../place.model";
import { PlacesService } from "../places.service";
import { IonItemSliding } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-offers",
  templateUrl: "./offers.page.html",
  styleUrls: ["./offers.page.scss"]
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[];
  private placesSub: Subscription;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private actualRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe((places: Place[]) => {
      console.log(places);
      this.offers = places;
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onEdit(id: string, slidingItem: IonItemSliding) {
    // console.log(id);
    this.router.navigate(["edit", id], {
      relativeTo: this.actualRoute
    });
    slidingItem.close();
  }
}
