<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 02/08/17
 * Time: 12:43 AM
 */

namespace App\Http\Controllers;

use App\Models\FotosReclamos;
use App\Models\Pagos;
use App\Models\Rol;
use App\Services\UserService;
use App\Utils\General;
use App\Models\Consorcios;
use App\Models\Copropietarios;
use App\Models\Reclamos;
use App\User;
use App\Transformers\UserTransformer;
use App\Validations\UsuariosValidations;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;


class CopropietariosController extends Controller
{

    public function todos()
    {
        $todos = [];

        $general = new General();

        $copropietarios = Copropietarios::all();

        foreach ( $copropietarios as $copropietario )
        {
            $reclamosbycopropietario = Reclamos::ByCopropietario( $copropietario->id );

            $consorcio = Consorcios::all()->where( 'id', '=', $copropietario->id_consorcio )->first();

            array_push( $todos, UserTransformer::detallecopropietario( $copropietario, $consorcio, $reclamosbycopropietario ) );
        }

        return $general->responseSuccessAPI( $todos );

    }

    public function byConsorcio(Request $request, $uuid)
    {
        $response = null;
        $general = new General();
        $service = new UserService();

        return $service->copropietariosByConsorcio( $uuid );

    }

    public function login()
    {
        $response = null;
        $general = new General();
        $service = new UserService();

        if ( Auth::attempt( [ 'email' => request('email'), 'password' => request('password') ] ) )
        {
            $response = null;
            $usuario = Auth::user();

            $rol = Rol::all()->where('id', $usuario->id_rol)->first();

            /**
             * Si el rol del usuario logueado es copropietario
             */

            if ( strcasecmp( $rol->nombre, 'admin') != 0 )
            {
                $response = $service->detailUser( $usuario );
            }
            else
            {
                /**
                 * Si el rol del usuario logueado es admin
                 */

                $response = $service->detailUserByUuid( $usuario->uuid );
            }

            if ( !is_array( $response ) )
                return $general->responseSuccessAPI( $response );
            else
                return $general->responseErrorAPI( $response, 500 );
        }
        else
        {
            $copropietario =  Copropietarios::all()->where( 'email', request('email') )->first();

            if ( $copropietario instanceof  Copropietarios && $copropietario != null)
            {
                return $general->responseErrorAPI( array( 'error' => "Por favor actualiza tu clave para iniciar sesion" ) , 502 );
            }
            else
            {
                return $general->responseErrorAPI( array( 'error' => "Al parecer aun no te haz dado de alta!" ), 501 );
            }
        }
    }

    public function detailInfo(Request $request, $uuid)
    {
        $general = new General();
        $service = new UserService();

        $response = $service->detailCopropietarioByUuid( $uuid );

        if ( is_object( $response ) )
        {
            return $general->responseSuccessAPI( $response );
        }
        else
        {
            return $general->responseErrorAPI( $response, 500 );
        }
    }
    
    public function signUp (Request $request)
    {
        $data = $request->all();
        $general = new General();
        $service = new UserService();
        $validator = UsuariosValidations::nuevoUsuario( $data );

        if( $validator->fails() )
        {
            return $general->responseErrorAPI( $validator->messages()->first(), 505 );
        }
        else
        {
            $response = $service->register( $data );

            if ( !is_array( $response ) )
            {
                return $general->responseSuccessAPI( $response );
            }
            else
            {
                return $general->responseErrorAPI( $response, 504 );
            }
        }
    }
    
    public function forgotPassword(Request $request)
    {
        $data = $request->all();
        $general = new General();
        $service = new UserService();
        $validator = UsuariosValidations::cambiarClave( $data );

        if( $validator->fails() )
        {
            return $general->responseErrorAPI( $validator->messages()->first() );
        }
        else
        {
            $response = $service->createUserFromCopropietarioEmail( $data );

            if ( !is_array( $response ) )
            {
                return $general->responseSuccessAPI( $response );
            }
            else
            {
                return $general->responseErrorAPI( $response, 503 );
            }
        }
    }

    public function updateInfo (Request $request, $uuid)
    {
        $general = new General();

        $copropietario =  Copropietarios::all()->where( 'uuid', $uuid )->first();

        if ( $copropietario instanceof  Copropietarios && $copropietario != null)
        {
            try
            {
                $data = $request->all();

                if ( array_key_exists( 'consorcio', $data ) )
                {
                    $consorcio = Consorcios::all()->where( 'uuid', '=', $data['consorcio'] )->first();

                    $copropietario->id_consorcio = $consorcio->id;
                }

                if ( array_key_exists( 'piso', $data ) )
                {
                    $copropietario->piso = $data['piso'];
                }

                if ( array_key_exists( 'departamento', $data ) )
                {
                    $copropietario->departamento = $data['departamento'];
                }

                if ( array_key_exists( 'nombre', $data ) )
                {
                    $copropietario->nombre = $data['nombre'];
                }

                if ( array_key_exists( 'email', $data ) )
                {
                    $copropietario->email = $data['email'];
                }

                if ( array_key_exists( 'clave', $data ) )
                {
                    $copropietario->password = bcrypt($data['clave']);
                }

                if ( array_key_exists( 'telefono', $data ) )
                {
                    $copropietario->telefono = $data['telefono'];
                }

                if( $copropietario->save() )
                {
                
               	    $usuario = User::all()->where('id', $copropietario->id_user)->first();
               	    
               	    $usuario->name = $copropietario->nombre;
               	    $usuario->email = $copropietario->email;
               	    
               	    try
               	    {
               	    
               	    	if ( $usuario->save() )
	               	{
	               	    
	               		$reclamosbycopropietario = Reclamos::ByCopropietario( $copropietario->id );
	                    
	                    	$pagos = Pagos::ByCopropietario( $copropietario->id );
	
	                    	$consorcio = Consorcios::all()->where( 'id', '=', $copropietario->id_consorcio )->first();
	
	                    	return $general->responseSuccessAPI( 
	                    		UserTransformer::detallecopropietario( 
	                    			$usuario, 
	                    			$copropietario, 
	                    			$consorcio, 
	                    			$reclamosbycopropietario, 
	                    			$pagos 
	                    		) 
	                    	);
	               	    
	               	}
               	    
               	    } catch ( \Exception $e )
               	    {
               	    	return $general->responseErrorAPI( $e->getMessage(), 500 );
               	    }	       	    
                }
                
            } catch ( \Exception $e )
            {
                return $general->responseErrorAPI( $e->getMessage(), 500 );
            }
        }
    }
}