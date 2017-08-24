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

        $validator = Validator::make($data, $rules);
        return $validator;
    }
}