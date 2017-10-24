<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 09/07/17
 * Time: 11:18 PM
 */

namespace App\Transformers;


class ConsorciosTransformer extends Optimus
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
                $obj->nombre = $x->nombre;

                array_push( $response, $obj );
            }

            $response = ConsorciosTransformer::orderByNombre( $response );

        }

        return $response;
    }
}