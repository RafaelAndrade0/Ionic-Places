import { Injectable } from "@angular/core";
import { Place } from "./place.model";
import { AuthService } from "../auth/auth.service";
import { BehaviorSubject, Observable } from "rxjs";
import { take, map, tap, delay, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    {
      id: "1",
      title: "Itabaiana Mansion",
      description: "Not good, not bad",
      imageUrl:
        "https://www.telegraph.co.uk/content/dam/Travel/Destinations/Europe/United%20Kingdom/London/london-aerial-thames-guide-xlarge.jpg",
      price: 150000,
      avaibleFrom: new Date("2019-01-01"),
      avaibleTo: new Date("2022-12-01"),
      userId: "abc"
    },
    {
      id: "2",
      title: "Aracaju Mansion",
      description: "Its bad",
      imageUrl:
        "https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200",
      price: 10000,
      avaibleFrom: new Date("2019-01-01"),
      avaibleTo: new Date("2022-12-01"),
      userId: "abc"
    },
    {
      id: "3",
      title: "Campo do Brito Mansion",
      description: "Very bad",
      imageUrl:
        "https://www.melhoresdestinos.com.br/wp-content/uploads/2019/02/passagens-aereas-tokyo-capa2019-01.jpg",
      price: 2500,
      avaibleFrom: new Date("2019-01-01"),
      avaibleTo: new Date("2022-12-01"),
      userId: "xyz"
    }
  ]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  getPlaces(): Observable<Place[]> {
    return this._places.asObservable();
  }

  get places(): Observable<Place[]> {
    // return this.placesSubject.next(this._places);
    return this._places.asObservable();
  }

  getPlaceById(id: string): Observable<Place> {
    return this.places.pipe(
      take(1),
      map(places => {
        return { ...places.find(place => place.id === id) };
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generateId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      "http://via.placeholder.com/500x200",
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );

    return this.http
      .post<{ name: string }>(
        "https://ionic-places-project.firebaseio.com/offered-places.json",
        {
          ...newPlace,
          id: null
        }
      )
      .pipe(
        // Cancela a subscription anterior e retorna a nova com a ultima mudança de ({name: string})
        switchMap(responseData => {
          generateId = responseData.name;
          return this.places;
        }),
        take(1),
        tap((places: Place[]) => {
          newPlace.id = generateId;
          this._places.next(places.concat(newPlace));
        })
      );
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places: Place[]) => {
        const updatePlaceIndex = places.findIndex(pl => pl.id === placeId);
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatePlaceIndex];
        updatedPlaces[updatePlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.avaibleFrom,
          oldPlace.avaibleTo,
          oldPlace.userId
        );
        this._places.next(updatedPlaces);
      })
    );
  }
}
