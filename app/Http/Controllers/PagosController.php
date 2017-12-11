<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 23/08/17
 * Time: 12:01 AM
 */

namespace App\Http\Controllers;

use App\Models\Pagos;
use App\Services\PagosService;
use App\Utils\General;
use App\Validations\PagosValidation;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PagosController
{

    public function save( Request $request )
    {
        $data = $request->all();
        $general = new General();
        $service = new PagosService();

        $validator = PagosValidation::nuevoPago( $data );

        if ( $validator->fails() )
            return $general->responseErrorAPI( $validator );
        else
        {
            $pago = $service->add( $data );

            if ( is_array( $pago ) )
                return $general->responseErrorAPI( $pago['error'] );
            else
                return $general->responseSuccessAPI( $pago );
        }
    }

    public function saveComprobante(Request $request)
    {

        $data = $request->all();
        $general = new General();
        $service = new PagosService();

        $validator = PagosValidation::archivoValido( $data );

        if ( $validator->fails() )
            return $general->responseErrorAPI( $validator );
        else
        {
            $comprobante = $service->addComprobanteDePago( $data );

            if ( is_array( $comprobante ) && key_exists('error', $comprobante ) )
                return $general->responseErrorAPI( $comprobante['error'] );
            else
                return $general->responseSuccessAPI( $comprobante );
        }

    }

    public function byConsorcio( Request $request, $uuid )
    {
        $general = new General();
        $service = new PagosService();

        return $general->responseSuccessAPI( $service->getByConsorcio( $uuid ) );

    }

    public function byCopropietario( Request $request, $uuid )
    {
        $general = new General();
        $service = new PagosService();

        return $general->responseSuccessAPI( $service->getByCopropietario( $uuid ) );

    }

    public function getLastPagosCreated( Request $request )
    {
        $general = new General();
        $service = new PagosService();

        return $general->responseSuccessAPI( $service->getLastCreated() );

    }

    public function updateEstado( Request $request, $pagoid, $estadoid )
    {
        $general = new General();
        $service = new PagosService();

        $change = $service->chageEstadoPago( $pagoid, $estadoid );

        if ( !is_array( $change ) )
        {
            return $general->responseSuccessAPI( $change );
        }
        else
        {
            return $general->responseErrorAPI( "Algo ha salido mal", 500 );
        }
    }

}
