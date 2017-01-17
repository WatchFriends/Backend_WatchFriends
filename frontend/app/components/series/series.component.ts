import {Component, Input} from '@angular/core';
import {ApiService, UserService} from '../../services';
import {Page, Series} from '../../models';

@Component({
    templateUrl: './series.component.html',
    styleUrls: ['./series.component.scss'],
    selector: 'wfseries'
})
export class Wfseries {
    @Input() series: Series[];
    @Input() page: number;
    @Input() totalPages: number;
    @Input() apiUrl: string;

    constructor(private api: ApiService) {
    }

    changeFollowed(series) {
        if (!series.following_change_active) {
            series.following = !series.following
            series.following_change_active = 1;
            this.api.updateFollowedSeries(series.id, {following: series.following}).subscribe(ok => series.following_change_active = undefined);
            this.api.addEvent({follow: series.following});
        }
    }

    loadmore() {
        if (this.page < this.totalPages) {
            this.api.get(`api/${this.apiUrl}/${++this.page}`).subscribe((value: Page) => {
                console.log(`${this.apiUrl}/${this.page}`);
                this.series = this.series.concat(value.results);
                this.totalPages = value.total_pages;
                // this.totalResults = value.total_results;
            });
        }
    }
}