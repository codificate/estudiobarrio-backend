<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 23/08/17
 * Time: 03:38 AM
 */

namespace App\Transformers;


class PagosTransformer
{
    public static function nuevoPago( $pago, $banco, $tipo )
    {
        $response = new \stdClass;

        $response->id = $pago->uuid;
        $response->fecha = $pago->fecha;
        $response->banco = $banco->banco;
        $response->tipo = $tipo->movimiento;
        $response->monto = $pago->monto;
        $response->comentario = $pago->comentario;

        return $response;
    }
}