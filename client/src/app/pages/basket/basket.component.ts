import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';

import { Basket } from 'src/app/models/basket';
import { BasketItem } from 'src/app/models/basketItem';
import { BasketService } from 'src/app/services/basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss'],
})
export class BasketComponent implements OnInit, OnDestroy {
  private readonly dispose$ = new Subject();
  basket$: Observable<Basket | null> | null = null;
  dataSource: BasketItem[] | undefined = [];
  displayedColumns = ['product', 'price', 'quantity', 'total', 'remove'];

  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
    this.loadBasketItems();
  }

  removeBasketItem(item: BasketItem) {
    this.basketService.removeItemFromBasket(item);
  }

  incrementBasketItem(item: BasketItem) {
    this.basketService.incrementItemQuantity(item);
  }

  decrementBasketItem(item: BasketItem) {
    this.basketService.decrementItemQuantity(item);
  }

  private loadBasketItems() {
    this.basketService.basket$
      .pipe(takeUntil(this.dispose$))
      .subscribe((basket) => (this.dataSource = basket.items));
  }

  ngOnDestroy(): void {
    this.dispose$.complete();
    this.dispose$.next(null);
  }
}
