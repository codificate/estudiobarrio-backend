<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 23/08/17
 * Time: 12:15 AM
 */

namespace App\Validations;

use Validator;

class PagosValidation
{
    /**
     * @param $data mixed
     */
    static function nuevoPago($data)
    {
        $rules = [];
        $rules['copropietario'] = 'required';
        $rules['banco']         = 'required';
        $rules['tipo']          = 'required';
        $rules['monto']         = 'required';
        $rules['unidad']        = 'required';

        $validator = Validator::make($data, $rules);
        return $validator;
    }

    static function archivoValido( $data )
    {
        $rules = [];

        $rules['pago'] = 'required';

        if ( isset( $data['adjunto'] ) && $data[ 'adjunto' ] instanceof UploadedFile )
            $rules['adjunto'] = 'required|mimes:pdf,jpg,png,jpeg,gif,svg|max:2048';

        $validator = Validator::make($data, $rules);
        return $validator;
    }
}
