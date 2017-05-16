import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  ToastController
} from 'ionic-angular';
import { Http, Headers } from "@angular/http";
import { Storage } from "@ionic/Storage";


@IonicPage()
@Component({
  selector: 'page-comentarios',
  templateUrl: 'comentarios.html',
})
export class Comentarios {

  headers: Headers;
  url: string;
  comentarios: any[];
  idUsuario: string;
  localStorage: Storage;
  comentariosCompletos: any[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public http: Http,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
    this.headers = new Headers();
    this.headers.append("X-Parse-REST-API-Key", "restAPIKey");
    this.headers.append("X-Parse-Master-Key", "masterKey");
    this.headers.append("X-Parse-Application-Id", "cineApp");

    this.localStorage = new Storage(null);

    this.localStorage.get('idUsuario')
      .then((valor) => {
        this.idUsuario = valor;
        this.getComentarios(null);
      })
  }

  getComentarios(refresher) {
    this.comentariosCompletos = [];
    this.url = 'http://localhost:8080/cineApp/classes/comentarios?where={"userId":"'+this.idUsuario+'"}';
    this.http.get(this.url, { headers: this.headers })
      .map(res => res.json())
      .subscribe(res => {
        this.comentarios = res.results;
        this.getInfoPelicula();

        if (refresher !== null)
          refresher.complete()

      }, err => {
        this.alertCtrl.create({
          title: "Error",
          message: "Hubo un error al cargar los datos, inténtelo más tarde",
          buttons: [{ text: "Aceptar" }]
        });
      })
  }

  getInfoPelicula(){
    let localUrl;
    for(let comentario of this.comentarios){
      localUrl = 'http://localhost:8080/cineApp/classes/listaPeliculas?where={"objectId":"'+comentario.peliculaId+'"}';
      this.http.get(localUrl, {headers: this.headers})
        .map(res=>res.json())
        .subscribe(res=>{
          this.comentariosCompletos.push({titulo: comentario.titulo,
                                          comentario: comentario.comentario,
                                          idComentario: comentario.objectId,
                                          idPelicula: comentario.peliculaId,
                                          idUsuario: this.idUsuario,
                                          tituloPelicula: res.results[0].titulo,
                                          imagenPelicula: res.results[0].image })
        })
    }
  }

  editComentario(comentario) {
    this.alertCtrl.create({
      title: "Editar Comentario",
      message: "Modifica tu comentario aquí",
      inputs: [
        {
          name: "titulo",
          placeholder: "Título",
          value: comentario.titulo
        },
        {
          name: "comentario",
          placeholder: "Comentario",
          value: comentario.comentario
        }
      ],
      buttons: [
        {
          text: "Cancelar"
        },
        {
          text: "Guardar",
          handler: data => {
            this.url = 'http://localhost:8080/cineApp/classes/comentarios/' + comentario.idComentario;

            this.http.put(this.url, 
            {
              peliculaId: comentario.idPelicula,
              userId: comentario.idUsuario,
              comentario: data.comentario,
              titulo: data.titulo 
            }, { headers: this.headers })
              .map(res => res.json())
              .subscribe(
              res => {
                this.toastCtrl.create({
                  message: "El comentario se ha actualizado",
                  duration: 3000,
                  position: "middle"
                }).present()
                this.getComentarios(null);
              },
              err => {
                this.toastCtrl.create({
                  message: "Ha ocurrido un error, inténtelo de nuevo",
                  duration: 3000,
                  position: "middle"
                }).present()
              }
              )
          }
        }
      ]
    }).present();
  }

  deleteComentario(comentario) {
    this.alertCtrl.create({
      title: "Eliminar Comentario",
      message: "¿Estás seguro de eliminar este comentario?",
      buttons: [
        { text: "No" },
        {
          text: "Si",
          handler: () => {
            this.url = 'http://localhost:8080/cineApp/classes/comentarios/' + comentario.idComentario;
            this.http.delete(this.url, { headers: this.headers })
              .map(res => res.json())
              .subscribe(
              res => {
                this.toastCtrl.create({
                  message: "El comentario se ha eliminado",
                  duration: 3000,
                  position: "middle"
                }).present()
                this.getComentarios(null);
              }, err => {
                this.toastCtrl.create({
                  message: "Ha ocurrido un error, inténtelo de nuevo",
                  duration: 3000,
                  position: "middle"
                }).present()
              }
              )

          }
        }
      ]
    }).present()
  }



  

}
