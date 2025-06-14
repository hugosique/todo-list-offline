import { Component, signal } from '@angular/core';
import Swal from 'sweetalert2';

// Components
import { InputAddItemComponent } from '../../components/input-add-item/input-add-item.component';
import { InputListItemComponent } from '../../components/input-list-item/input-list-item.component';

// Interfaces
import { IListItems } from '../../interface/IListItems.interface';

// ENUM
import { ELocalStorage } from '../../enum/ELocalStorage.enum';


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
    return JSON.parse(localStorage.getItem(ELocalStorage.MY_LIST) || '[]');
  }

  #updateLocalStorage() {
    return localStorage.setItem(
      ELocalStorage.MY_LIST,
      JSON.stringify(this.#setListItems())
    );
  }

  public getInputAndAddItem(value: IListItems) {
    localStorage.setItem(
      ELocalStorage.MY_LIST,
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

    return this.#updateLocalStorage();
  }

  public deleteItem(id: string) {
    Swal.fire({
      title: "Deletar item?",
      text: "Você não poderá reverter isso!",
      // icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      // confirmButtonColor: "#3085d6",
      // cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar item"
    }).then((result) => {
      if (result.isConfirmed) {
        this.#setListItems.update((oldValue: IListItems[]) => {
          return oldValue.filter(el => {
            return el.id !== id;
          });
        });

        return this.#updateLocalStorage();
      };
    });
  }

  public deleteAllItems() {
    Swal.fire({
      title: "Deletar todos os items?",
      text: "Você não poderá reverter isso!",
      // icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      // confirmButtonColor: "#3085d6",
      // cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar todos"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem(ELocalStorage.MY_LIST);
        return this.#setListItems.set(this.#parseItems());
      }
    });
  }
}
