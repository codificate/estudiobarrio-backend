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
        $response->id_banco = $banco->uuid;
        $response->banco = $banco->banco;
        $response->id_movimiento = $tipo->uuid;
        $response->movimiento = $tipo->movimiento;
        $response->monto = floatval( $pago->monto );
        $response->comentario = $pago->comentario;

        return $response;
    }
}
