import { Component } from '@angular/core';
import {AbonnementsServiceService} from '../../services/abonnements-service.service';
import {AuthentificationService} from '../../services/authentification.service';

@Component({
  selector: 'app-show-abonnements',
  templateUrl: './show-abonnements.component.html',
  styleUrl: './show-abonnements.component.css'
})
export class ShowAbonnementsComponent {
  abonnms:any[]=[] ;

  constructor(private  abonnserv :AbonnementsServiceService , private authService: AuthentificationService) {
  }

  ngOnInit(): void {
    this.fetchabonnement();
  }
  fetchabonnement():void {
    this.abonnserv.getAbonn().subscribe(
      (data) => {
        this.abonnms = data ;
      },
      (error) => {
        console.error('Erreur lors de la récupération des abonnements', error);

      }
    )
  }
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getAbonns(): void {
    this.abonnserv.getAbonn().subscribe((data: any[]) => {
      this.abonnms = data;
    });
  }
  onDeleteAbonn(AbonnId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet Abonnement ?')) {
      this.abonnserv.deleteAbonn(AbonnId).subscribe(() => {
        alert('Abonnement supprimé avec succès');
        this.getAbonns(); // Mettre à jour la liste après la suppression
      }, error => {
        console.error('Erreur lors de la suppression de l\'Abonnement', error);
        alert('Une erreur est survenue lors de la suppression.');
      });
    }
  }
}
