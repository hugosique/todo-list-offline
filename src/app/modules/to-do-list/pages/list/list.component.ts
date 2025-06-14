import { Component, signal } from '@angular/core';

// Components
import { InputAddItemComponent } from '../../components/input-add-item/input-add-item.component';
import { InputListItemComponent } from '../../components/input-list-item/input-list-item.component';

// Interfaces
import { IListItems } from '../../interface/IListItems.interface';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [InputAddItemComponent, InputListItemComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  public addItem = signal(true);

  #setListItems = signal<IListItems[]>(this.#parseItems());
  public getListItems = this.#setListItems.asReadonly();

  #parseItems() {
    return JSON.parse(localStorage.getItem('@my-list') || '[]');
  }

  public getInputAndAddItem(value: IListItems) {
    localStorage.setItem(
      '@my-list',
      JSON.stringify([...this.#setListItems(), value])
    );

    return this.#setListItems.set(this.#parseItems());
  }

  public listItemsStage(value: 'pending' | 'completed') {
    return this.getListItems().filter((el: IListItems) => {
      if (value === 'pending') {
        return !el.checked;
      };

      if (value === 'completed') {
        return el.checked;
      };

      return el;
    });
  }

  public updateItemCheckbox(newItem: { id: string; checked: boolean }) {
    this.#setListItems.update((oldValue: IListItems[]) => {
      oldValue.filter(res => {
        if (res.id === newItem.id) {
          res.checked = newItem.checked;
          return res;
        }

        return res;
      });

      return oldValue;
    });

    return localStorage.setItem('@my-list', JSON.stringify(this.#setListItems()));
  }

  public updateItemText(newItem: { id: string, value: string }) {
    this.#setListItems.update((oldValue: IListItems[]) => {
      oldValue.filter(res => {
        if (res.id === newItem.id) {
          res.value = newItem.value;
          return res;
        }

        return res;
      });

      return oldValue;
    });

    return localStorage.setItem('@my-list', JSON.stringify(this.#setListItems()));
  }

  public deleteItem(id: string) {
    this.#setListItems.update((oldValue: IListItems[]) => {
      return oldValue.filter(el => {
        el.id !== id;
      });
    });

    return localStorage.setItem('@my-list', JSON.stringify(this.#setListItems()));
  }

  public deleteAllItems() {
    localStorage.removeItem('@my-list');
    return this.#setListItems.set(this.#parseItems());
  }
}
