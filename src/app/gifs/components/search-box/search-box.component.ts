import { Component, ElementRef, ViewChild } from '@angular/core';
import { GifsService } from '../../services/gifs.service';

@Component({
  selector: 'gifs-search-box',
  template:`
    <h5>Buscar: </h5>
    <input type="text"
      class="form-control"
      placeholder="Buscar gifs..."
      (keyup.enter)="searchTag()"
      #txtTagInput
    >
  `
})

export class SearchBoxComponent{

  @ViewChild('txtTagInput')
  public tagInput!: ElementRef<HTMLInputElement>;


  constructor(private gifService: GifsService){}

  /**
   * Busca una etiqueta.
   *
   * Esta función recupera el valor de entrada de la etiqueta desde el elemento nativo tagInput
   * y lo registra en la consola.
   */
  searchTag( ): void{
    let newtag = this.tagInput.nativeElement.value;
    this.gifService.searchTag(newtag);
    this.tagInput.nativeElement.value = '';
  }


  //create a function what print the tag
}