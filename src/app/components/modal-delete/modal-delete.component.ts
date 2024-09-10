import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-delete',
  standalone: true,
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.css']
})
export class ModalDeleteComponent {
  @Input() set isVisible(value: boolean) {
    this._isVisible = value;
    setTimeout(() => {
      this.showClass = value;
    }, 10);
  }
  get isVisible(): boolean {
    return this._isVisible;
  }
  
  @Input() title: string = 'Confirmar eliminación';
  @Input() message: string = '¿Estás seguro de que deseas eliminar este elemento?';
  @Input() confirmButtonText: string = 'Eliminar';
  @Input() cancelButtonText: string = 'Cancelar';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  private _isVisible: boolean = false;
  showClass: boolean = false;

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}