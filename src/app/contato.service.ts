import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Contato } from './contato/Contato';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pageable } from './contato/Pageable';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  url: string = environment.url;

  constructor(
    private httpClient : HttpClient
  ) { }

  salvar(contato: Contato) : Observable<Contato> {
    return this.httpClient.post<Contato>(this.url,contato);
  }

  favoritar(contato:Contato) : Observable<any> {
    return this.httpClient.patch<any>(`${this.url}/${contato.id}`,null);
  }

  listar(page:number,size:number) : Observable<Pageable> {
    const params = new HttpParams()
    .set("page",page)
    .set("size",size)
    return this.httpClient.get<Pageable>(`${this.url}?${params.toString()}`);
  }

  uploadFoto(contato:Contato, formData: FormData) : Observable<any> {
    return this.httpClient.put<any>(`${this.url}/${contato.id}/foto`,formData, {responseType: 'blob' as 'json'});
  }


}
