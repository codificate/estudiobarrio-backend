<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 09/07/17
 * Time: 11:18 PM
 */

namespace App\Transformers;


class ConsorciosTransformer
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
                    'nombre' => $x->nombre
                ];
            }

        }

        return $response;
    }
}