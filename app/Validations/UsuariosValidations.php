<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 04/09/17
 * Time: 03:09 AM
 */

namespace App\Validations;


use Validator;

class UsuariosValidations
{
    static function nuevoUsuario( $data )
    {

        $messages = array(
            'nombre.required' => 'El campo nombre no puede estar vacío',
            'nombre.max' => 'El campo nombre no puede tener mas de 60 caracteres',
            'email.required' => 'El campo email no puede estar vacío',
            'email.email' => 'El campo email no tiene una direccion de correo valida',
            'email.unique' => 'Este email ya existe en nuestra base de datos',
            'clave.required' => 'El campo clave no puede estar vacío',
            'clave.min' => 'La clave debe tener un minimo de 6 caracteres',
            'confirmarclave.required' => 'Debe confirmar la clave',
            'confirmarclave.same' => 'Las claves no coinciden',
            'confirmarclave.min' => 'La clave debe tener un minimo de 6 caracteres',
            'consorcio.required' => 'Debe seleccionar un consorcio',
        );
        
        $rules = [];
        $rules['nombre']        = 'required|max:60';
        $rules['email']         = 'required|email|max:255|unique:users';
        $rules['clave']         = 'required|min:6';
        $rules['confirmarclave']= 'required|same:clave|min:6|max:20';
        $rules['consorcio']     = 'required';

        $validator = Validator::make($data, $rules, $messages);
        return $validator;
    }

}