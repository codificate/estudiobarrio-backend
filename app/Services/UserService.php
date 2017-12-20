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
use App\Models\Tiposcopropietario;
use App\Models\Pagos;
use App\Models\Reclamos;
use App\Models\Unidad;
use App\Models\Rol;
use App\Transformers\UserTransformer;
use App\User;

class UserService
{

    public function detailUser( $usuario )
    {
        $copropietario =  Copropietarios::all()->where( 'id_user', $usuario->id )->first();

        if ( $copropietario instanceof  Copropietarios && $copropietario != null)
        {

            /* try
            { */
                $token = $usuario->createToken('Llegate')->accessToken;

                $usuario->access_token = "Bearer " . $token;

                $rol = Rol::all()->where('id', $usuario->id_rol)->first();

                if ( $rol instanceof Rol )
                    $usuario->id_rol = $rol->nombre;

                if ( strcasecmp( $rol->nombre, 'admin') != 0 ) {

                    $tipocopropietario = Tiposcopropietario::all()->where( 'id', $copropietario->tipocopropietario )->first();

                    $copropietario->tipocopropietario = $tipocopropietario->nombre;

                    $reclamos = Reclamos::ByCopropietario( $copropietario->id );

                    $pagos = Pagos::ByCopropietario( $copropietario->id );

                    $unidades = Unidad::Detail( $copropietario->id );

                    return UserTransformer::detallecopropietario( $usuario, $copropietario, $unidades, $reclamos, $pagos );

                } else
                    return UserTransformer::detallecopropietario( $usuario, $copropietario, null, null, null );

            /* }
            catch (\Exception $e)
            {
                return [ 'error' => $e->getMessage() ];
            } */
        }
    }

    public function copropietariosByConsorcio( $uuid )
    {

        $consorcios = Consorcios::all()->where( 'uuid', $uuid )->first();

        $copropietarios = Copropietarios::all()->where( 'id_consorcio', $consorcios->id )->all();

        return UserTransformer::copropietariosporconsorcio( $copropietarios );

    }

    public function detailCopropietarioByUuid( $uuid )
    {
        $copropietario =  Copropietarios::all()->where( 'uuid', $uuid )->first();

        if ( $copropietario instanceof  Copropietarios && $copropietario != null)
        {
            try
            {
                $usuario = User::all()->where('id', $copropietario->id_user)->first();

                $token = $usuario->createToken('Llegate')->accessToken;

                $usuario->access_token = "Bearer " . $token;

                $rol = Rol::all()->where('id', $usuario->id_rol)->first();

                $reclamos = Reclamos::ByCopropietario( $copropietario->id );

                $pagos = Pagos::ByCopropietario( $copropietario->id );

                $consorcio = Consorcios::all()->where( 'id', '=', $copropietario->id_consorcio )->first();

                return UserTransformer::detallecopropietario( $usuario, $copropietario, $consorcio, $reclamos, $pagos );
            }
            catch (\Exception $e)
            {
                return [ 'error' => $e->getMessage() ];
            }

        }
    }

    public function detailUserByUuid( $uuid )
    {
        $user = User::all()->where( 'uuid', $uuid )->first();

        if ( $user instanceof User && $user != null)
        {

            try
            {

                $token = $user->createToken('Llegate')->accessToken;

                $user->access_token = "Bearer " . $token;

                $rol = Rol::all()->where('id', $user->id_rol)->first();

                if ( $rol instanceof Rol )
                    $user->id_rol = $rol->nombre;

                return UserTransformer::detalleusuario($user);

            } catch (\Exception $e)
            {
                return [ 'error' => $e->getMessage() ];
            }
        }
    }

    public function detailUserByEmail( $email )
    {
        $user = User::all()->where( 'email', $email )->first();

        if ( $user instanceof User && $user != null)
        {
            return UserTransformer::detalleusuario($user);
        }
        else
        {
          return [ 'error' => 'Parece que este usuario aun no existe' ];
        }
    }

    public function register( $data )
    {
        $token = null;

        $input['uuid'] = '';
        $input['id_rol'] = 2;
        $input['name'] = $data['nombre'] . ' ' . $data['apellido'];
        $input['email'] = $data['email'];
        $input['password'] = bcrypt( $data[ 'clave' ] );

        $nuevousuario = User::create( $input );

        if ( $nuevousuario != null )
        {
            $usuario = User::all()->where( 'id', $nuevousuario->id )->first();

            $token = $nuevousuario->createToken('Llegate')->accessToken;

            $usuario->access_token = "Bearer " . $token;

            //try
            //{

                $tiposcopropietario = Tiposcopropietario::all()->where( 'nombre', $data['tipocopropietario'] )->first();

                $copropietario = new Copropietarios();

                $copropietario->UF = '';
                $copropietario->uuid = '';
                $copropietario->id_user = $usuario->id;
                $copropietario->telefono = $data['telefono'];
                $copropietario->tipocopropietario = $tiposcopropietario->id;

                if ($copropietario->save())
                {
                    $inquilino = Copropietarios::all()->where('id', $copropietario->id)->first();
                    $rol = Rol::all()->where('id', $usuario->id_rol)->first();

                    if ( $rol instanceof Rol )
                        $usuario->id_rol = $rol->nombre;

                    if ( is_array( $data['unidad'] ) ) {

                        $unidades = [];

                        foreach ( $data['unidad'] as $key => $unidad ) {

                            $nuevaunidad = new Unidad();
                            $nuevaunidad->uuid = '';
                            $nuevaunidad->piso = $unidad[ 'piso' ];
                            $nuevaunidad->departamento = $unidad[ 'departamento' ];
                            $consorcio = Consorcios::all()->where( 'uuid', $unidad['consorcio'] )->first();
                            $nuevaunidad->id_consorcio = $consorcio->id;
                            $nuevaunidad->id_copropietario = $copropietario->id;

                            if ( $nuevaunidad->save() ) {

                              $unidadcreada = Unidad::all()->where( 'id', $nuevaunidad->id )->first();
                              $unidadcreada->id = $unidadcreada->uuid;
                              $unidadcreada->consorcio = $consorcio->nombre;
                              $unidadcreada->id_consorcio = $unidad['consorcio'];
                              unset( $unidadcreada->id );
                              unset( $unidadcreada->id_consorcio );
                              unset( $unidadcreada->id_copropietario );
                              unset( $unidadcreada->updated_at );
                              unset( $unidadcreada->created_at );

                              array_push( $unidades, $unidadcreada );

                            }

                        }

                    }

                    return UserTransformer::nuevocopropietario( $usuario, $inquilino, $unidades, $tiposcopropietario );
                }

            /*}
            catch ( \Exception $e)
            {

                return [ 'error' => $e->getMessage() ];

            } */
        }

        return [ 'error' => "Ha ocurrido un error" ];
    }

    public function checkIfCopropietarioExistFromEmail( $correo )
    {
        $response = new \stdClass;
        $response->exist = false;

        $copropietario =  Copropietarios::all()->where( 'email', $correo )->first();

        if ( $copropietario instanceof  Copropietarios && $copropietario != null)
        {

            $usuario = User::all()->where( 'email', $correo )->first();
            if( $usuario instanceof User && $usuario != null )
            {
                $response->exist = true;
                $response->id = $usuario->uuid;
            }
            else
            {
                $response->message = "Parece que no existe el usuario con este email.";
            }
        }
        else
        {
            $response->message = "Parece que no existe el usuario con este email.";
        }

        return $response;

    }

    public function changePassword( $data )
    {
        $response = new \stdClass;

        $usuario = User::all()->where( 'uuid', $data['usuario'] )->first();
        if( $usuario instanceof User && $usuario != null )
        {
            $usuario->password = bcrypt( $data[ 'clave' ] );
            $usuario->save();

            $response->ok = true;
            $response->message = "Ya puedes hacer uso de tu nueva clave";
        }
        else
        {
            $response->ok = false;
            $response->message = "Parece que tu usuario no existe.";
        }

        return $response;
    }

    public function createUserFromCopropietarioEmail( $data )
    {
        $token = null;
        $usuario = null;
        $copropietario =  Copropietarios::all()->where( 'email', $data['email'] )->first();

        if ( $copropietario instanceof  Copropietarios && $copropietario != null)
        {

            if ( $copropietario->id_user == null )
            {

            	$usuario = User::all()->where( 'email', $data['email'] )->first();

            	if( $usuario instanceof User && $usuario != null )
            	{
                  $usuario->password = bcrypt( $data[ 'clave' ] );
            	}
            	else
            	{
                	$input['uuid'] = '';
	                $input['id_rol'] = 2;
                	$input['name'] = $copropietario->nombre;
                	$input['email'] = $data['email'];
                	$input['password'] = bcrypt( $data[ 'clave' ] );

                	$nuevousuario = User::create( $input );

                	try
                	{
                    		if ( $nuevousuario != null && $nuevousuario->save() )
                    		{
                        		$usuario = User::all()->where( 'id', $nuevousuario->id )->first();
                        		$copropietario->id_user = $nuevousuario->id;
                        		$copropietario->save();
                    		}
                	}
                	catch ( \Exception $e)
                	{
                    		return [ 'error' => $e->getMessage() ];
                	}
            	}
            }
            else
            {
                $nuevousuario = User::all()->where('id', $copropietario->id_user)->first();;

                $nuevousuario->password = bcrypt( $data[ 'clave' ] );

                try
                {
                    if ( $nuevousuario->save() )
                    {
                        $usuario = User::all()->where( 'id', $nuevousuario->id )->first();
                    }
                }
                catch ( \Exception $e)
                {
                    return [ 'error' => $e->getMessage() ];
                }

            }

            $token = $usuario->createToken('Llegate')->accessToken;

            $usuario->access_token = "Bearer " . $token;

            $reclamos = Reclamos::ByCopropietario( $copropietario->id );

            $pagos = Pagos::ByCopropietario( $copropietario->id );

            $consorcio = Consorcios::all()->where( 'id', '=', $copropietario->id_consorcio )->first();

            $rol = Rol::all()->where('id', $usuario->id_rol)->first();

            if ( $rol instanceof Rol )
                $usuario->id_rol = $rol->nombre;

            return UserTransformer::detallecopropietario( $usuario, $copropietario, $consorcio, $reclamos, $pagos );

        }
        else
            return [ 'error' => "Parece que aun no te haz registrado." ];
    }
}
