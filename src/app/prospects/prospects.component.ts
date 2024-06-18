import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProspectModéle } from '../Modéles/Prospect-Modéle';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProspectService } from '../Services/Prospect.service';
import { MatDialog } from '@angular/material/dialog';
import { AddProspectDialogComponent } from '../add-prospect-dialog/add-prospect-dialog.component';
import { ClientService } from '../Services/client.service';
import { Router } from '@angular/router';
import { RoleService } from '../Services/Role.service';
import { Role } from '../Modéles/Role';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-prospects',
  templateUrl: './prospects.component.html',
  styleUrls: ['./prospects.component.css'],
})
export class ProspectsComponent implements OnInit {
  displayedColumns: string[] = [
    
    'nom',
    'prenom',
    'note',
    'email',
    'telephone',
    'adresse',
    'statusProspect',
    'action',
  ];
  roles: Role[] = [

  ];
  add_prospect: string = 'add_prospect';
  edit_prospect: string = 'edit_prospect';
  delete_prospect: string = 'delete_prospect';
  send_mail_prospect: string = 'send_mail_prospect';
  add_prospect_client: string = 'add_prospect_client';
  call_prospect: string = 'call_prospect';
  private statusProspect = [
    { value: 'Nouveau', viewValue: 'Nouveau' },
    { value: 'Tentative', viewValue: 'Tentative' },
    { value: 'Qualifié', viewValue: 'Qualifié' },
    { value: 'NonQualifie', viewValue: 'Non qualifié' }
  ];
  dataSource!: MatTableDataSource<ProspectModéle>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  prospect: ProspectModéle[] = [];

  propectToDelete!: ProspectModéle;

  AddClient!: ProspectModéle;

  


  constructor(
    private prospectService: ProspectService,
    private ClientService: ClientService,
    private dialog: MatDialog,
    private route:Router,
    private roleService : RoleService,
    private toastr: ToastrService

  ) {}

  ngOnInit(): void {
    this.loadProspect();
    this.loadRoles()
    console.log("jkjkhk",localStorage.getItem("token"))
  }

  loadProspect() {
    this.prospectService.getAllProspects().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
    });
  }
  getViewValue(value: string): string {
    const status = this.statusProspect.find(status => status.value === value);
    return status ? status.viewValue : 'Inconnu';
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  confirmDelete(prospect: ProspectModéle) {
    $('#deleteModal').modal('show');
    this.propectToDelete = prospect;
  }

  confirmAdd(prospect: ProspectModéle) {
    $('#addClientModal').modal('show');
    this.AddClient = prospect;
  }

  closeConfirm() {
    $('#deleteModal').modal('hide');
  }
  closeConfirmAdd() {
    $('#addClientModal').modal('hide');
  }
  addProspect(){
    const client : any = {
      nom : this.AddClient.nom,
      prenom : this.AddClient.prenom,
      telephone : this.AddClient.telephone,
      adresse : this.AddClient.adresse,
      email : this.AddClient.email,
      typeContact : "Client",
      priorite : "Faible"
    }
    this.ClientService.ajouterClient(client).subscribe(() => {
        this.closeConfirmAdd();
        this.route.navigateByUrl("/dashboad/contact");
    });
  }
  deleteProspect() {
    this.prospectService
      .deleteProspect(this.propectToDelete.id)
      .subscribe(() => {
        console.log('deleted');
        this.toastr.success('Le contact a été supprimé avec succès', 'Succès');
        this.closeConfirm();
        this.loadProspect();
      });
  }

  openAddEditCltForm() {
    const dialogRef = this.dialog.open(AddProspectDialogComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadProspect();
        }
      },
    });
  }
  loadRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (res) => {
        this.roles=res
        console.log(this.roles)
    
      },
    });
  }
  roleAndPermissionExists(permissionName: string): boolean {
    console.log(localStorage.getItem("role"))
    const role = this.roles.find(role => role.name === localStorage.getItem("role")?.toString());
    console.log(role)
    if(localStorage.getItem("role")==="ADMIN"){
      return true
    }
    if (role) {
      console.log(role)
      return role.roles.some(permission => permission.name === permissionName);
    }
    return false;
  }
  openEditCltForm(data: ProspectModéle) {
    const dialogRef = this.dialog.open(AddProspectDialogComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadProspect();
        }
      },
    });
  }
}
