import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ClientService } from '../Services/client.service';
import { ToastrService } from 'ngx-toastr';

declare var $: any;


@Component({
  selector: 'app-add-client-dialog',
  templateUrl: './add-client-dialog.component.html',
  styleUrls: ['./add-client-dialog.component.css'],
})
export class AddClientDialogComponent implements OnInit {
  ClientForm: FormGroup;
  priorite = [
    {value: 'Faible', viewValue: 'Faible'},
    {value: 'Moyenne', viewValue: 'Moyenne'},
    {value: 'Élevée', viewValue: 'Élevée'}
  ];
  typeContact = [
    {value: 'Fournisseur', viewValue: 'Fournisseur'},
    {value: 'Partenaire', viewValue: 'Partenaire'},
    {value: 'Client', viewValue: 'Client'}
  ];
  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private dialogRef: MatDialogRef<AddClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
  ) {
    this.ClientForm = this.fb.group({
      nom: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(3)]], // Seuls les caractères alphabétiques sont autorisés
      prenom: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(3)]], // Seuls les caractères alphabétiques sont autorisés
      telephone: ['', [Validators.required, Validators.pattern('[0-9]{8,10}')]], // Format numérique de 8 à 10 chiffres
      adresse: ['', [Validators.required, Validators.minLength(5)]], // Exiger une longueur
      email: ['', [Validators.required, Validators.email]],
      typeContact : ['', [Validators.required]],
      priorite : ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.ClientForm.patchValue(this.data);
    console.log(this.data)

    // Surveillance des changements de valeur dans le champ de nom
    this.applyFirstLetterUppercaseValidation('nom');
    this.applyFirstLetterUppercaseValidation('prenom');
    this.applyFirstLetterUppercaseValidation('adresse');
  }

  // Fonction pour appliquer la validation de la première lettre en majuscule
  applyFirstLetterUppercaseValidation(fieldName: string): void {
    const control = this.ClientForm.get(fieldName);
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
    if (this.ClientForm.valid) {
      if (this.data) {
        this.clientService.updateClient(this.data.id, this.ClientForm.value).subscribe({
          next: (val: any) => {
            this.toastr.success('Le contact a été modifié avec succès', 'Succès');
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            if (err.status === 409) { // Si l'email existe déjà
              this.toastr.error('Cet email existe déjà. Veuillez en utiliser un autre.', 'Erreur');
            } else {
              console.error(err);
              this.toastr.error('Une erreur est survenue. Veuillez réessayer.', 'Erreur');
            }
          }
        });
      } else {
        this.clientService.ajouterClient(this.ClientForm.value).subscribe({
          next: (val: any) => {
            this.toastr.success('Le contact a été ajouté avec succès', 'Succès');
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            if (err.status === 409) { // Si l'email existe déjà
              this.toastr.error('Cet email existe déjà. Veuillez en utiliser un autre.', 'Erreur');
            } else {
              console.error(err);
              this.toastr.error('Contact déjà existe', 'Erreur : email existe');
            }
          }
        });
      }
    } else {
      this.toastr.error('Veuillez remplir tous les champs correctement', 'Erreur');
    }
  }
  
}
