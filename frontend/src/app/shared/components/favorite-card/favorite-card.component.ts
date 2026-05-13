import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {CartType} from "../../../types/cart.type";
import {DefaultResponseType} from "../../../types/default.type";
import {environment} from "../../../../environments/environment";
import {FavoriteType} from "../../../types/favorite.type";
import {FavoriteService} from "../../services/favorite.service";

@Component({
  selector: 'favorite-card',
  templateUrl: './favorite-card.component.html',
  styleUrls: ['./favorite-card.component.scss']
})
export class FavoriteCardComponent implements OnInit {

  count: number = 1;
  countInCart: number = 0;
  serverStaticPath = environment.serverStaticPath;
  @Input() product!: FavoriteType;
  @Output() favoriteRemoved = new EventEmitter<string>();

  constructor(private cartService: CartService,
              private favoriteService: FavoriteService,) {
  }

  ngOnInit(): void {
    this.cartService.getCart()
      .subscribe((cartData: CartType | DefaultResponseType) => {
        if ((cartData as DefaultResponseType).error !== undefined) {
          throw new Error((cartData as DefaultResponseType).message);
        }

        const cartDataResponse = cartData as CartType;

        if (cartDataResponse) {
          const productInCart = cartDataResponse.items.find(item => item.product.id === this.product.id)
          if (productInCart) {
            this.countInCart = productInCart.quantity;
            this.count = this.countInCart;
          }
        }
      });
  }

  addToCart(product: FavoriteType) {
    this.cartService.updateCart(product.id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.countInCart = this.count;
      })
  }

  removeFromCart(product: FavoriteType) {
    this.cartService.updateCart(product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.countInCart = 0;
        this.count = 1;
      })
  }

  updateCount(product: FavoriteType, value: number) {
    this.count = value;
    if (this.countInCart) {
      this.cartService.updateCart(product.id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          this.countInCart = this.count;
        });
    }
  }

  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          throw new Error(data.message);
        }

        this.favoriteRemoved.emit(id)
      })
  }
}
