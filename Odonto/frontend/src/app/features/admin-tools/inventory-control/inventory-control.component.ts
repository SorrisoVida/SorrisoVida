import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../../services/navigation.service';

interface InventoryItem {
  id: number;
  name: string;
  supplier: string;
  quantity: number;
  minStock: number;
  status: 'OK' | 'Atenção' | 'Crítico';
}

@Component({
  selector: 'app-inventory-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-control.component.html',
  styleUrls: ['./inventory-control.component.scss']
})
export class InventoryControlComponent {
  public navigationService = inject(NavigationService);

  inventoryItems: InventoryItem[] = [
    { id: 1, name: 'Luvas de Procedimento (Caixa)', supplier: 'DentalShop', quantity: 50, minStock: 20, status: 'OK' },
    { id: 2, name: 'Máscaras Descartáveis (Caixa)', supplier: 'DentalShop', quantity: 25, minStock: 20, status: 'Atenção' },
    { id: 3, name: 'Resina Composta Z350 (Seringa)', supplier: '3M Dental', quantity: 15, minStock: 10, status: 'OK' },
    { id: 4, name: 'Anestésico Lidocaína (Caixa)', supplier: 'Cristália', quantity: 8, minStock: 10, status: 'Crítico' },
    { id: 5, name: 'Agulhas Gengivais (Caixa)', supplier: 'DentalShop', quantity: 30, minStock: 15, status: 'OK' },
    { id: 6, name: 'Alginato (Pote)', supplier: 'DentalPlus', quantity: 12, minStock: 5, status: 'OK' },
  ];
}