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
        $rules = [];
        $rules['nombre']        = 'required|max:255';
        $rules['email']         = 'required|email|max:255|unique:users';
        $rules['clave']         = 'required|min:6';
        $rules['confirmarclave']= 'required_with:clave|min:6|max:20';
        $rules['consorcio']     = 'required';

        $validator = Validator::make($data, $rules);
        return $validator;
    }

}