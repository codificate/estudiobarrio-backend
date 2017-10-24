<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 09/07/17
 * Time: 11:06 PM
 */

namespace App\Transformers;


class TipoMovimientoTransformer extends Optimus
{
    public static function transformCollection( $data )
    {
        $response = [];

        if ( !empty( $data ) )
        {

            foreach ( $data as $x )
            {

                $obj = new \stdClass;
                $obj->id = $x->uuid;
                $obj->nombre = $x->movimiento;

                array_push( $response, $obj );
            }

            $response = TipoMovimientoTransformer::orderByNombre( $response );

        }

        return $response;
    }
}