<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 20/08/17
 * Time: 10:25 PM
 */

namespace App\Transformers;


class ReclamoTransformer
{
    public static function nuevoReclamo( $reclamo )
    {
        $response = new \stdClass;

        $response->id = $reclamo->id;
        $response->fecha = $reclamo->fecha;
        $response->nombre = $reclamo->nombre;
        $response->tipo = $reclamo->tipo;
        $response->estado = $reclamo->estado;
        $response->descripcion = $reclamo->descripcion;

        return $response;
    }
}