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
    public static function copropietariosporconsorcio( $copropietarios )
    {
        $response = [];

        foreach ( $copropietarios as $copropietario )
        {

            $co = new \stdClass;

            $co->id = $copropietario->uuid;
            $co->piso = $copropietario->piso;
            $co->nombre = $copropietario->nombre;
            $co->email = $copropietario->email;
            $co->depto = $copropietario->departamento;
            $co->tlfno = $copropietario->telefono;

            array_push( $response, $co );
        }

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

    public static function detalleusuario( $usuario )
    {
        $response = new \stdClass;

        $response->id = $usuario->uuid;
        $response->rol = $usuario->id_rol;
        $response->nombre = $usuario->name;
        $response->email = $usuario->email;
        $response->token = $usuario->access_token;

        return $response;
    }

    public static function recuperarClave( $usuario )
    {
        $response = new \stdClass;

        $response->nombre = $usuario->name;
        $response->email = $usuario->email;

        unset( $usuario );

        return $response;
    }

    public static function nuevocopropietario( $usuario, $copropietario, $unidades, $tiposcopropietario )
    {
        $response = new \stdClass;

        $response->id = $copropietario->uuid;
        $response->id_usuario = $usuario->uuid;
        $response->rol = $usuario->id_rol;
        $response->nombre = $usuario->name;
        $response->email = $usuario->email;
        $response->telefono = $copropietario->telefono;
        $response->tipocopropietario = $tiposcopropietario->nombre;

        if ( $unidades != null )
        {
            $response->unidades = $unidades;
        }

        $response->token = $usuario->access_token;

        return $response;
    }

    public static function detallecopropietario( $usuario, $copropietario, $unidades, $reclamos, $pagos )
    {
        $response = new \stdClass;

        $response->id = $copropietario->uuid;
        $response->id_usuario = $usuario->uuid;
        $response->rol = $usuario->id_rol;
        $response->nombre = $usuario->name;
        $response->email = $usuario->email;
        $response->telefono = $copropietario->telefono;

        if ( $unidades != null ) { $response->unidades = $unidades; }

        if ( is_array( $reclamos ) && $reclamos != null )
            $response->reclamos = $reclamos;

        if ( is_array( $pagos ) && $pagos != null )
            $response->pagos = $pagos;

        $response->token = $usuario->access_token;

        return $response;
    }
}
