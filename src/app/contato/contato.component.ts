import { Component, OnInit } from '@angular/core';
import { ContatoService } from '../contato.service';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Contato } from './Contato';
import { MatDialog } from '@angular/material/dialog';
import { ContatoDetalheComponent } from '../contato-detalhe/contato-detalhe.component';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  form: FormGroup;
  contatos : Contato[] = [];
  displayedColumns = ['foto', 'id','nome','email','favorito'];
  totalElementos = 0;
  pagina = 0;
  tamanho = 10;
  pageSizeOptions: number[]=[10];

  constructor(
    private service: ContatoService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.validacaoFormulario();
    this.listarContatos(this.pagina,this.tamanho);
  }

  validacaoFormulario() {
    this.form = this.formBuilder.group({
      nome:['',[Validators.required, Validators.minLength(3)]],
      email:['',[Validators.required,Validators.email]]
    });
  }

  listarContatos(page = 0, size = 10) {
    this.service.listar(this.pagina,this.tamanho).subscribe(data => {
      this.contatos = data.content;
      this.totalElementos = data.totalElements;
      this.pagina = data.number;
    }, error => {
      console.log(error);
    });
  }

  favoritar(contato: Contato) {
    this.service.favoritar(contato).subscribe(data=>{
      contato.favorito = !contato.favorito;
    }, error => {
      console.log(error);
    });
  }

  onSubmit() {
    const contato : Contato = {...this.form.value};
    this.service.salvar(contato)
      .subscribe(data => {
        this.listarContatos();
        this.snackBar.open("Contato salvo com sucesso!","Sucesso", {duration:3000});
        this.form.reset();
      }, objectError => {
        console.log(objectError.errors.error);
      });
  }

  uploadForo(event:any, contato:Contato) {
    const files = event.target.files;
    if(files) {
      const foto = files[0];
      const formData = new FormData();
      formData.append("foto",foto);
      this.service.uploadFoto(contato,formData)
        .subscribe(data => {
          this.listarContatos(this.pagina,this.tamanho);
          console.log(data);
        },error => {
          console.log(error);
        });
    }
  }

  visualizarContato(contato:Contato) {
    this.matDialog.open(ContatoDetalheComponent, {
      width: '400px',
      height: '450px',
      data:contato
    });
  }

  paginar(event:PageEvent) {
    this.pagina = event.pageIndex;
    this.listarContatos(this.pagina,this.tamanho);
  }

  public errorHandling = (control: string, error: string) => {
    return this.form.controls[control].hasError(error);
  }

}
