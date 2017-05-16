import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  ToastController
} from 'ionic-angular';
import { Http, Headers } from "@angular/http";
import { Storage } from "@ionic/Storage";
import { Comentarios } from "../comentarios/comentarios";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  headers: Headers;
  url: string;
  peliculas: any[];
  idUsuario: string;
  localStorage: Storage;
  stars: any[];

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
        this.getPeliculas(null);
      })
  }

  getPeliculas(refresher) {
    this.url = 'http://localhost:8080/cineApp/classes/listaPeliculas';
    this.http.get(this.url, { headers: this.headers })
      .map(res => res.json())
      .subscribe(res => {
        this.peliculas = res.results;

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


  getStars(number) {
    return new Array(number);
  }

  addFavoritos(pelicula, action) {
    this.url = 'http://localhost:8080/cineApp/classes/listaPeliculas/' + pelicula.objectId;
    let mensaje;
    if (action) {
      mensaje = "Pelicula añadida a favoritos"
    } else mensaje = "Pelicula eliminada de favoritos"

    this.http.put(this.url, {
      titulo: pelicula.titulo,
      genero: pelicula.genero,
      rating: pelicula.rating,
      image: pelicula.image,
      favorita: action
    }, { headers: this.headers })
      .map(res => res.json())
      .subscribe(res => {
        this.getPeliculas(null);
        this.toastCtrl.create({
          message: mensaje,
          duration: 2000,
          position: 'bottom'
        }).present()
      }, err => {
        this.toastCtrl.create({
          message: "Ocurrió un error. La palícula no fue añadida",
          duration: 3000,
          position: 'bottom'
        }).present()
      })
  }

  addComentario(pelicula) {
    this.alertCtrl.create({
      title: "Añadir comentario",
      message: "Escribe lo que piensas sobre esta película",
      inputs: [{
        name: "titulo",
        placeholder: "Título"
      },{
        name: "comentario",
        placeholder: "Ingresa tu comentario"
      }],
      buttons: [{
        text: "Cancelar"
      }, {
        text: "Comentar",
        handler: data => {
          let loading = this.loadingCtrl.create({ content: "cargando" });
          loading.present();
          this.url = "http://localhost:8080/cineApp/classes/comentarios";

          this.http
            .post(this.url,
            {
              peliculaId: pelicula.objectId,
              userId: this.idUsuario,
              titulo: data.titulo,
              comentario: data.comentario
            },
            { headers: this.headers })
            .map(res => res.json())
            .subscribe(res => {
              loading.dismiss();
              this.toastCtrl.create({
                message: "El comentario se ha añadido exitosamente",
                duration: 3000,
                position: "middle"
              }).present();
            }, err => {
              loading.dismiss();
              this.toastCtrl.create({
                message: "Ha ocurrido un error, inténtelo de nuevo",
                duration: 3000,
                position: "middle"
              }).present();
            })
        }
      }]
    }).present()
  }

  irComentarios() {
    this.navCtrl.push(Comentarios);
  }

}
