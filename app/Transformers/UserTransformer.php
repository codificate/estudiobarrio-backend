<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 02/08/17
 * Time: 01:09 AM
 */

namespace App\Transformers;


class UserTransformer
{
    public static function nuevocopropietario( $copropietario )
    {
        $response = [
            'id' => $copropietario->uuid,
            'nombre' => $copropietario->nombre,
            'email' => $copropietario->email
        ];

        return $response;
    }

    public static function copropietarioactualizado( $copropietario )
    {
        $response = new \stdClass;

        $response = [
            'id' => $copropietario->uuid,
            'nombre' => $copropietario->nombre,
            'email' => $copropietario->email,
            'consorcio' => $copropietario->id_consorcio,
            'piso' => $copropietario->piso,
            'telefono' => $copropietario->telefono,
        ];

        return $response;
    }

    public static function detallecopropietario( $copropietario, $consorcio, $reclamos )
    {
        $response = new \stdClass;

        $response->id = $copropietario->uuid;
        $response->nombre = $copropietario->nombre;
        $response->email = $copropietario->email;
        $response->piso = $copropietario->piso;
        $response->telefono = $copropietario->telefono;

        if ( $consorcio != null )
        {
            $response->id_consorcio = $consorcio->uuid;
            $response->consorcio = $consorcio->nombre;
        }

        if ( is_array( $reclamos ) )
            $response->reclamos = $reclamos;

        return $response;
    }
}