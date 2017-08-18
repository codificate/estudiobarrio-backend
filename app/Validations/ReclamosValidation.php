<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 07/08/17
 * Time: 11:51 PM
 */

namespace App\Validations;

use Illuminate\Http\UploadedFile;
use Validator;

class ReclamosValidation
{

    static function nuevoReclamo( $data )
    {
        $rules = [];
        $rules['copropietario'] = 'required';
        $rules['consorcio']     = 'required';
        $rules['tipo']          = 'required';

        $validator = Validator::make($data, $rules);
        return $validator;
    }

    static function fotoValida( $data )
    {
        $rules = [];

        if ( isset( $data['primerafoto'] ) && $data[ 'primerafoto' ] instanceof UploadedFile )
            $rules['primerafoto'] = 'image|mimes:jpg,png,jpeg,gif,svg|max:2048';

        if ( isset( $data['segundafoto'] ) && $data[ 'segundafoto' ] instanceof UploadedFile)
            $rules['segundafoto'] = 'image|mimes:jpg,png,jpeg,gif,svg|max:2048';

        $validator = Validator::make($data, $rules);
        return $validator;
    }

}