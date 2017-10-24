<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 09/07/17
 * Time: 10:37 PM
 */

namespace App\Transformers;


class TipoReclamoTransformer extends Optimus
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
                $obj->nombre = $x->reclamo;

                array_push( $response, $obj );
            }

            $response = TipoReclamoTransformer::orderByNombre( $response );
            
        }

        return $response;
    }
}