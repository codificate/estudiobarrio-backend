<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 29/08/17
 * Time: 01:24 AM
 */

namespace App\Services;


use App\Models\Consorcios;
use App\Models\Copropietarios;
use App\Transformers\UserTransformer;
use App\User;

class UserService
{
    
    public function register( $data )
    {
        $token = null;
        $nuevousuario = new User();

        $nuevousuario->uuid = '';
        $nuevousuario->id_rol = 2;
        $nuevousuario->name = $data['nombre'];
        $nuevousuario->email = $data['email'];
        $nuevousuario->password = bcrypt( $data[ 'clave' ] );

        if ( $nuevousuario->save() )
        {
            $usuario = User::all()->where( 'id', $nuevousuario->id )->first();

            $token = $nuevousuario->createToken('Llegate')->accessToken;

            $usuario->access_token = "Bearer " . $token;

            try
            {

                $consorcio =  Consorcios::all()->where( 'uuid', $data['consorcio'] )->first();

                $copropietario = new Copropietarios();

                if ( $consorcio instanceof Consorcios and $consorcio != null)
                    $copropietario->id_consorcio = $consorcio->id;
                else
                    return [ 'error' => 'Parece que no existe el consorcio indicado' ];

                $copropietario->uuid = '';
                $copropietario->UF = '';
                $copropietario->piso = $data['piso'];
                $copropietario->departamento = $data['departamento'];
                $copropietario->telefono = $data['telefono'];
                $copropietario->id_user = $usuario->id;

                if ($copropietario->save())
                {
                    $inquilino = Copropietarios::all()->where('id', $copropietario->id)->first();

                    return UserTransformer::nuevocopropietario($usuario, $inquilino, $consorcio, null, null);
                }

            }
            catch ( \Exception $e)
            {

                return [ 'error' => $e->getMessage() ];

            }
        }
    }
}