import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from "@ionic/Storage";
import { Http, Headers } from "@angular/http";
import { Registro } from "../registro/registro";
import { HomePage } from "../home/home";
import { Usuario } from "../../Usuario-model";
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {

  usuarioALoguear: Usuario = {
    username: "",
    password: ""
  }

  url: string;
  headers: Headers;
  localStorage: Storage;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public alertCtrl: AlertController) {
    this.headers = new Headers();
    this.headers.append("X-Parse-REST-API-Key", "restAPIKey");
    this.headers.append("X-Parse-Master-Key", "masterKey");
    this.headers.append("X-Parse-Application-Id", "cineApp");
    this.localStorage = new Storage(null);
  }

  irRegistro() {
    this.navCtrl.push(Registro);
  }

  login() {
    if (!(this.usuarioALoguear.username && this.usuarioALoguear.password)) {
      this.alertCtrl.create({ title: "Error", message: "Ningún campo puede ser vacío", buttons: [{ text: "Aceptar" }] })
        .present()
      return;
    }

    this.url = "http://localhost:8080/cineApp/login?username=" + this.usuarioALoguear.username + "&password=" + this.usuarioALoguear.password;

    this.http.get(this.url, { headers: this.headers })
      .subscribe(res => {
        this.localStorage.set('idUsuario', res.json().objectId)
          .then(() => {
            this.navCtrl.setRoot(HomePage);
          })

      }, err => {
        this.alertCtrl.create({
          title: "Error",
          message: "El usuario o la contraseña son incorrectos",
          buttons: [{
            text: "Aceptar"
          }]
        }).present();
      })
  }

}
