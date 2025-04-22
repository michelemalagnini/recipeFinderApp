import { Injectable } from '@angular/core';
import { HttpClient }    from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FlagService {
     areaToCountry: Record<string,string> = {
        American:   'United States',
        British:    'United Kingdom',
        Canadian:   'Canada',
        Chinese:    'China',
        Croatian:   'Croatia',
        Dutch:      'Netherlands',
        Egyptian:   'Egypt',
        French:     'France',
        Greek:      'Greece',
        Indian:     'India',
        Irish:      'Ireland',
        Italian:    'Italy',
        Jamaican:   'Jamaica',
        Japanese:   'Japan',
        Kenyan:     'Kenya',
        Malaysian:  'Malaysia',
        Mexican:    'Mexico',
        Moroccan:   'Morocco',
        Polish:     'Poland',
        Portuguese: 'Portugal',
        Russian:    'Russia',
        Spanish:    'Spain',
        Thai:       'Thailand',
        Tunisian:   'Tunisia',
        Turkish:    'Turkey',
        Vietnamese: 'Vietnam',
      };

  constructor(private http: HttpClient) {}

  getFlagByArea(area: string): Observable<string> {
    const country = this.areaToCountry[area] ?? area;
    return this.http
      .get<Country[]>(`https://restcountries.com/v3.1/name/${country}?fields=flags`)
      .pipe(
        map(countries => countries[0]?.flags?.png || ''),
        catchError(() => of('assets/default-flag.png'))
      );
  }
}

interface Country {
    flags: {
      png: string;
      svg: string;
      alt?: string;
    };
  }