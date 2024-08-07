import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
  standalone: true, 
  imports: [],
  styleUrls: ['./modal-delete.component.css']
})
export class ModalDeleteComponent {
  constructor(public dialogRef: MatDialogRef<ModalDeleteComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
