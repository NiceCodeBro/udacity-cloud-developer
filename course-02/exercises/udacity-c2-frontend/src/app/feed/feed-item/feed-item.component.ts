import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/api/api.service';
import { FeedItem } from '../models/feed-item.model';
import { FeedProviderService } from '../services/feed.provider.service';

@Component({
  selector: 'app-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedItemComponent implements OnInit {
  @Input() feedItem: FeedItem;
  @ViewChild('imgCmp') imgCmp: any;
  
  constructor(private api: ApiService, private feed: FeedProviderService ) { }

  ngOnInit() {
    const a  = this.api.getFilteredImg('/filteredimage', this.feedItem.url);
    a.then(blob => {
      const reader = new FileReader();
      reader.readAsDataURL(blob); 
      reader.onloadend = () => {
        this.imgCmp.src = reader.result;
      }
    } ).
    catch(c=> console.log(c))
  }
}
