import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Comentarios } from './comentarios';

@NgModule({
  declarations: [
    Comentarios,
  ],
  imports: [
    IonicPageModule.forChild(Comentarios),
  ],
  exports: [
    Comentarios
  ]
})
export class ComentariosModule {}
