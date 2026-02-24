import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ClientService } from '../client.service';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-client-search-dialog',
  templateUrl: './client-search-dialog.component.html',
  styleUrls: ['./client-search-dialog.component.css']
})
export class ClientSearchDialogComponent implements OnInit {

  displayedColumns: string[] = ['codeclient', 'nom', 'siteExploitation', 'action'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<ClientSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private clientService: ClientService
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit(): void {
    this.clientService.afficher().subscribe(clients => {
      this.dataSource.data = clients;
      this.dataSource.paginator = this.paginator;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectClient(client: any): void {
    this.dialogRef.close(client);
  }
} 
