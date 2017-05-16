import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Headers } from "@angular/http";
import 'rxjs/add/operator/map';
import { Usuario } from "../../Usuario-model";

@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class Registro {

  usuarioARegistrar: Usuario = {
    username: "",
    password: "",
    name: "",
    telefono: "",
    email: ""
  }
  confirmarContrasena: string;
  url: string;
  headers: Headers;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: Http,
              public alertCtrl: AlertController) {
                this.headers = new Headers();
                this.headers.append("X-Parse-REST-API-Key", "restAPIKey");
                this.headers.append("X-Parse-Master-Key", "masterKey");
                this.headers.append("X-Parse-Application-Id", "cineApp");
  }

  irLogin() {
    this.navCtrl.pop();
  }

  registrar() {
    if (this.usuarioARegistrar.password != this.confirmarContrasena) {
      this.alertCtrl.create({
        title: "Error",
        message: "Las contraseñas no coinciden, inténtelo de nuevo",
        buttons: ['Aceptar']
      }).present()
      return;
    }

    this.url = "http://localhost:8080/cineApp/users";

    this.http.post(this.url, this.usuarioARegistrar, { headers: this.headers} )
      .map(res => res.json())
      .subscribe(res =>{
        this.alertCtrl.create({
          title: "Usuario Registrado",
          message: "El usuario se ha registrado exitosamente en la Aplicación. Regresa a la página de Inicio de sesión para ingresar al sistema",
          buttons: [{
            text: "Inicia Sesión",
            handler: ()=>{
              this.navCtrl.pop();
            }
          }]
        }).present()
      }, err => {
        this.alertCtrl.create({
          title: "Error",
          message: err.text(),
          buttons: [{
            text: "Aceptar"
          }]
        }).present();
      })
  }

}
