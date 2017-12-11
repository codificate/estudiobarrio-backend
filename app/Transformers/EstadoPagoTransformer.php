<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 09/07/17
 * Time: 10:52 PM
 */

namespace App\Transformers;


class EstadoPagoTransformer extends Optimus
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
                $obj->nombre = $x->valor;

                array_push( $response, $obj );
            }

            $response = EstadoPagoTransformer::orderByNombre( $response );

        }

        return $response;
    }

}
