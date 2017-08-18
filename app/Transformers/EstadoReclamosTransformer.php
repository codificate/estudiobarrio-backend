<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 09/07/17
 * Time: 11:23 PM
 */

namespace App\Transformers;


class EstadoReclamosTransformer
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
                    'nombre' => $x->valor
                ];
            }

        }

        return $response;
    }
}