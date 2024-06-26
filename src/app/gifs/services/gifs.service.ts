import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  public gifList: Gif[] = [];

  private _tagHistory: string[] = [];
  private apiKey: string = 'i2Ta5u4KOQIZMY6D3jYdHxppSgf4smSO';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalstorage();
  }

  /**
   * Obtiene el historial de etiquetas.
   *
   * @returns Un arreglo que contiene una copia del historial de etiquetas.
   */
  get tagHistory(): string[] {
    return [...this._tagHistory];
  }

  /**
   * Organiza el historial de etiquetas.
   *
   * @param tag La etiqueta que se va a organizar en el historial.
   */
  private organizeHistory(tag: string): void {
    // Convertir la etiqueta a minúsculas
    tag = tag.toLowerCase();

    // Eliminar la etiqueta antigua del historial, si ya existe
    if (this._tagHistory.includes(tag)) {
      this._tagHistory = this._tagHistory.filter((oldTag) => oldTag !== tag);
    }

    // Agregar la etiqueta al principio del historial
    this._tagHistory.unshift(tag);

    // Limitar el historial a las últimas 10 etiquetas
    this._tagHistory = this._tagHistory.slice(0, 10);

    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagHistory));
  }

  /**
   * Carga el historial desde el almacenamiento local y realiza una búsqueda con el primer elemento del historial si existe.
   * Si no hay historial almacenado o está vacío, la función termina sin realizar ninguna acción.
   */
  private loadLocalstorage(): void {
    // Verifica si hay historial almacenado en el localStorage y si no está vacío
    if (
      localStorage.getItem('history') === null ||
      localStorage.getItem('history') === ''
    ) {
      return; // Termina la función si no hay historial almacenado o está vacío
    }

    // Carga el historial almacenado del localStorage y lo convierte de JSON a objeto
    this._tagHistory = JSON.parse(localStorage.getItem('history')!);

    // Verifica si el historial cargado tiene elementos
    if (this._tagHistory.length === 0) return; // Termina la función si el historial está vacío

    // Realiza una búsqueda utilizando el primer elemento del historial cargado
    this.searchTag(this._tagHistory[0]!);
  }

  /**
   * Busca una etiqueta y la agrega al inicio del historial de etiquetas.
   *
   * @param tag La etiqueta que se va a buscar y agregar.
   */
  public searchTag(tag: string): void {
    // Si la etiqueta está vacía, no hacer nada
    if (tag.length === 0) return;

    // Organizar el historial con la nueva etiqueta
    this.organizeHistory(tag);

    // Imprimir el historial actualizado en la consola
    console.log(this._tagHistory);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('q', tag)
      .set('limit', '20');

    this.http
      .get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe((res) => {
        this.gifList = res.data;
      });
  }
}
