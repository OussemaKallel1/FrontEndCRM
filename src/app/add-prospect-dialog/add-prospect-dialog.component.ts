import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProspectService } from '../Services/Prospect.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { ToastrService } from 'ngx-toastr';
import { NgToastService } from 'ng-angular-popup';

declare var $: any;

@Component({
  selector: 'app-add-prospect-dialog',
  templateUrl: './add-prospect-dialog.component.html',
  styleUrls: ['./add-prospect-dialog.component.css']
})
export class AddProspectDialogComponent implements OnInit{
  ProspectForm: FormGroup;
  statusProspect = [
    {value: 'Nouveau', viewValue: 'Nouveau'},
    {value: 'Tentative', viewValue: 'Tentative'},
    {value: 'Qualifié', viewValue: 'Qualifié'},
    {value: 'NonQualifie', viewValue: 'Non qualifié'}
  ];
  constructor(
    private fb: FormBuilder,
    private prospectService: ProspectService,
    private dialogRef: MatDialogRef<AddProspectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private coreService: CoreService,
    private toastr: ToastrService,
    private toast: NgToastService
  ) {
    this.ProspectForm = this.fb.group({
      nom: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(3)]], // Seuls les caractères alphabétiques sont autorisés
      prenom: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(3)]],
      note: ['', ],
      telephone: ['', [Validators.required, Validators.pattern('[0-9]{8,10}')]],
      adresse: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]], 
      statusProspect :  ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.ProspectForm.patchValue(this.data);
    // Surveillance des changements de valeur dans le champ de nom
    this.applyFirstLetterUppercaseValidation('nom');
    this.applyFirstLetterUppercaseValidation('prenom');
    this.applyFirstLetterUppercaseValidation('adresse');
    this.applyFirstLetterUppercaseValidation('note');
  }

  applyFirstLetterUppercaseValidation(fieldName: string): void {
    const control = this.ProspectForm.get(fieldName);
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
    if (this.ProspectForm.valid) {
      if (this.data) {
        this.prospectService
          .updateProspect(this.data.id, this.ProspectForm.value)
          .subscribe({
            next: (val: any) => {
              this.toastr.success('Le prospect a été modifié avec succès', 'Succès');
              this.dialogRef.close(true);
            },
            error: (err: any) => {
              if (err.status === 409) { // Si l'email existe déjà
                this.toastr.error('Cet email existe déjà. Veuillez en utiliser un autre.', 'Erreur');
              } else {
                console.error(err);
                this.toastr.error('Une erreur est survenue. Veuillez réessayer.', 'Erreur');
              }
            },
          });
      } else {
        this.prospectService.ajouterProspect(this.ProspectForm.value).subscribe({
          next: (val: any) => {
            this.toastr.success('Le prospect a été ajouté avec succès', 'Succès');
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            if (err.status === 409) { // Si l'email existe déjà
              this.toastr.error('Cet email existe déjà. Veuillez en utiliser un autre.', 'Erreur');
            } else {
              console.error(err);
              this.toastr.error('Prospect déjà existe', 'Erreur : email existe');
            }
          },
        });
      }
    } else {
      this.toastr.error('Veuillez remplir les champs requis.', 'Erreur');
    }
  }
  
  
}
