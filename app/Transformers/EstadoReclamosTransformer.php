<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 09/07/17
 * Time: 11:23 PM
 */

namespace App\Transformers;


class EstadoReclamosTransformer extends Optimus
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

            $response = EstadoReclamosTransformer::orderByNombre( $response );

        }

        return $response;
    }
}