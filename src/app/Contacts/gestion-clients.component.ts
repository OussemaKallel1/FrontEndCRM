import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientModéle } from '../Modéles/client-modéle';
import { ClientService } from '../Services/client.service';
import { MatDialog } from '@angular/material/dialog';
import { AddClientDialogComponent } from '../add-client-dialog/add-client-dialog.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CoreService } from '../core/core.service';
import { NgToastService } from 'ng-angular-popup';
import { RoleService } from '../Services/Role.service';
import { Role } from '../Modéles/Role';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-gestion-clients',
  templateUrl: './gestion-clients.component.html',
  styleUrls: ['./gestion-clients.component.css'],
})
export class GestionClientsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'nom',
    'prenom',
    'telephone',
    'adresse',
    'email',
    'typeContact',
    'priorite',
    'action',
  ];

  dataSource!: MatTableDataSource<ClientModéle>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  clients: ClientModéle[] = [];

  clientToDelete!: ClientModéle;
  roles: Role[] = [

  ];
  add_contact: string = 'add_contact';
  edit_contact: string = 'edit_contact';
  delete_contact: string = 'delete_contact';
  send_mail_contact: string = 'send_mail_contact';
  call_contact: string = 'call_contact';
  constructor(
    private clientService: ClientService,
    private dialog: MatDialog,
    private coreService: CoreService,
    private toast : NgToastService,
    private roleService : RoleService,
    private toastr: ToastrService
    
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getAllClients().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.log(res)
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  confirmDelete(clients: ClientModéle) {
    $('#deleteModal').modal('show');
    this.clientToDelete = clients;
    
  }

  closeConfirm() {
    $('#deleteModal').modal('hide');
  }

  deleteClient() {
    this.clientService.deleteClient(this.clientToDelete.id).subscribe(() => {
      console.log('deleted');
      this.toastr.success('Le contact a été supprimé avec succès', 'Succès');
      this.closeConfirm();
      this.loadClients();
    });
  }

  openAddEditCltForm() {
    const dialogRef = this.dialog.open(AddClientDialogComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadClients();
        }
      },
    });
  }

  openEditCltForm(data: ClientModéle) {
    const dialogRef = this.dialog.open(AddClientDialogComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadClients();
        }
      },
    });
  }
}
