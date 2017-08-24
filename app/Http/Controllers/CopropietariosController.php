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
use App\Utils\General;
use App\Models\Consorcios;
use App\Models\Copropietarios;
use App\Models\Reclamos;
use App\Transformers\UserTransformer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;


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

    public function login(Request $request)
    {
        $data = $request->all();

        $general = new General();

        if ( array_key_exists( 'email', $data ) )
        {
            $copropietario =  Copropietarios::all()->where( 'email', $data['email'] )->first();

            if ( $copropietario instanceof  Copropietarios && $copropietario != null)
            {

                try
                {
                    $reclamos = Reclamos::ByCopropietario( $copropietario->id );

                    $pagos = Pagos::ByCopropietario( $copropietario->id );

                    $consorcio = Consorcios::all()->where( 'id', '=', $copropietario->id_consorcio )->first();

                    return $general->responseSuccessAPI( UserTransformer::detallecopropietario( $copropietario, $consorcio, $reclamos, $pagos ) );

                } catch (\Exception $e)
                {
                    return $general->responseErrorAPI( $e->getMessage() );
                }
            } else
            {
                return $general->responseErrorAPI( "Al parecer aun no te haz dado de alta!" );
            }

        } else
        {
            return $general->responseErrorAPI( "El campo email no puede estar vacio" );
        }

    }

    public function detailInfo(Request $request, $uuid)
    {
        $general = new General();

        $copropietario =  Copropietarios::all()->where( 'uuid', $uuid )->first();
        
        if ( $copropietario instanceof  Copropietarios && $copropietario != null)
        {
            try
            {

                $reclamos = Reclamos::ByCopropietario( $copropietario->id );

                $pagos = Pagos::ByCopropietario( $copropietario->id );

                $consorcio = Consorcios::all()->where( 'id', '=', $copropietario->id_consorcio )->first();

                return $general->responseSuccessAPI( UserTransformer::detallecopropietario( $copropietario, $consorcio, $reclamos, $pagos ) );
                
            } catch (\Exception $e)
            {
                return $general->responseErrorAPI( $e->getMessage() );
            }
        }
    }
    
    public function signUp (Request $request)
    {
        $data = $request->all();

        try {

            $consorcio =  Consorcios::all()->where( 'uuid', $data['consorcio'] )->first();

            $co = new Copropietarios();
            $co->uuid = '';

            if ( $consorcio instanceof Consorcios and $consorcio != null)
                $co->id_consorcio = $consorcio->id;

            $co->UF = '';
            $co->piso = $data['piso'];
            $co->departamento = $data['departamento'];
            $co->nombre = $data['nombre'];
            $co->password = bcrypt($data['clave']);
            $co->email = $data['email'];
            $co->telefono = $data['telefono'];
            $co->activation_key = '';
            $co->id_estado = 0;

            if ($co->save()) {
                $inquilino = Copropietarios::all()->where('id', $co->id)->first();
                
                return UserTransformer::nuevocopropietario($inquilino);
            }

        } catch ( \Exception $e) {

            return [ 'error' => $e->getMessage() ];

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
                    $reclamosbycopropietario = Reclamos::ByCopropietario( $copropietario->id );

                    $consorcio = Consorcios::all()->where( 'id', '=', $copropietario->id_consorcio )->first();

                    return $general->responseSuccessAPI( UserTransformer::detallecopropietario( $copropietario, $consorcio, $reclamosbycopropietario ) );
                }

            } catch ( \Exception $e )
            {
                return $general->responseErrorAPI( $e->getMessage() );
            }
        }
    }
}