<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 09/07/17
 * Time: 10:57 PM
 */

namespace App\Transformers;


class BancosTransformer extends Optimus
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
                $obj->nombre = $x->banco;

                array_push( $response, $obj );
            }

            $response = BancosTransformer::orderByNombre( $response );

        }

        return $response;
    }

}