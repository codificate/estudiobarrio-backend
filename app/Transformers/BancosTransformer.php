<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 09/07/17
 * Time: 10:57 PM
 */

namespace App\Transformers;


class BancosTransformer
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
                    'nombre' => $x->banco
                ];
            }

        }

        return $response;
    }

}