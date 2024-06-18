import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PermissionService } from '../Services/Permission.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-permission-dialog',
  templateUrl: './add-permission-dialog.component.html',
  styleUrls: ['./add-permission-dialog.component.css']
})
export class AddPermissionDialogComponent {
  PermissionForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private dialogRef: MatDialogRef<AddPermissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
  ) {
    this.PermissionForm = this.fb.group({
      name: ['', [Validators.required]], // Seuls les caractères alphabétiques sont autorisés
    });
  }

  ngOnInit(): void {
    this.PermissionForm.patchValue(this.data);
    console.log(this.data)

    // Surveillance des changements de valeur dans le champ de nom
    
    
  }

  // Fonction pour appliquer la validation de la première lettre en majuscule
  applyFirstLetterUppercaseValidation(fieldName: string): void {
    const control = this.PermissionForm.get(fieldName);
    if (control) {
      control.valueChanges.subscribe((value: string) => {
        // Convertir la première lettre en majuscule
        const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
        // Mettre à jour la valeur du champ avec la première lettre en majuscule
        control.setValue(capitalizedValue, { emitEvent: false });
      });
    }
  }

  onFormSubmit() {
    if (this.PermissionForm.valid) {
      if (this.data) {
        this.permissionService
          .updatePermission(this.data.id, this.PermissionForm.value)
          .subscribe({
            next: (val: any) => {
              this.toastr.info('La permissions a été modifié', 'Information');
              this.dialogRef.close(true);
            },

            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        this.permissionService.ajouterPermission(this.PermissionForm.value).subscribe({
          next: (val: any) => {
            this.toastr.success('Nouvelle permission ajoutée avec succès', 'Succès');
            this.dialogRef.close(true);
          },
        });
      }
    } else {
      // Affichage d'un message d'erreur si le formulaire n'est pas valide
      this.toastr.error('Remplir le champ', 'Erreur');
    }
  }
}
