<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 09/07/17
 * Time: 10:37 PM
 */

namespace App\Transformers;


class TipoReclamoTransformer
{
    public static function transformCollection( $data )
    {
        $response = [];

        if ( !empty( $data ) )
        {

            foreach ( $data as $x )
            {
                $response [] = [
                    'id' => $x->uuid,
                    'nombre' => $x->reclamo
                ];
            }
            
        }

        return $response;
    }
}