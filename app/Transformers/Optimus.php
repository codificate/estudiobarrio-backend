<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 23/10/17
 * Time: 11:57 PM
 */

namespace App\Transformers;

class Optimus
{
    public static function orderByNombre($response)
    {
        usort($response, function($a, $b)
        {
            return strcmp($a->nombre, $b->nombre);
        });

        return $response;
    }
}