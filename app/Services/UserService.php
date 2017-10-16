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
use App\Models\Pagos;
use App\Models\Reclamos;
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

            try
            {
                $token = $usuario->createToken('Llegate')->accessToken;

                $usuario->access_token = "Bearer " . $token;

                $rol = Rol::all()->where('id', $usuario->id_rol)->first();

                if ( $rol instanceof Rol )
                    $usuario->id_rol = $rol->nombre;

                if ( strcasecmp( $rol->nombre, 'admin') != 0 ) {

                    $reclamos = Reclamos::ByCopropietario( $copropietario->id );

                    $pagos = Pagos::ByCopropietario( $copropietario->id );

                    $consorcio = Consorcios::all()->where( 'id', '=', $copropietario->id_consorcio )->first();

                    return UserTransformer::detallecopropietario( $usuario, $copropietario, $consorcio, $reclamos, $pagos );

                } else
                    return UserTransformer::detallecopropietario( $usuario, $copropietario, null, null, null );

            }
            catch (\Exception $e)
            {
                return [ 'error' => $e->getMessage() ];
            }
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
    
    public function register( $data )
    {
        $token = null;
        //$nuevousuario = new User();

        $input['uuid'] = '';
        $input['id_rol'] = 2;
        $input['name'] = $data['nombre'];
        $input['email'] = $data['email'];
        $input['password'] = bcrypt( $data[ 'clave' ] );

        $nuevousuario = User::create( $input );

        /*$nuevousuario->uuid = '';
        $nuevousuario->id_rol = 2;
        $nuevousuario->name = $data['nombre'];
        $nuevousuario->email = $data['email'];
        $nuevousuario->password = bcrypt( $data[ 'clave' ] );*/

        if ( $nuevousuario != null )
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
                    $rol = Rol::all()->where('id', $usuario->id_rol)->first();

                    if ( $rol instanceof Rol )
                        $usuario->id_rol = $rol->nombre;

                    return UserTransformer::detallecopropietario($usuario, $inquilino, $consorcio, null, null);
                }

            }
            catch ( \Exception $e)
            {

                return [ 'error' => $e->getMessage() ];

            }
        }

        return [ 'error' => "Ha ocurrido un error" ];
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
            		$copropietario->id_user = $usuario->id;
                        $copropietario->save();
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