<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 09/07/17
 * Time: 08:37 PM
 */

namespace App\Http\Controllers;


use App\Utils\General;
use App\Models\Bancos;
use App\Models\Consorcios;
use App\Models\Estadopagos;
use App\Models\Estadoreclamos;
use App\Models\TiposMovimiento;
use App\Transformers\BancosTransformer;
use App\Transformers\ConsorciosTransformer;
use App\Transformers\EstadoPagoTransformer;
use App\Transformers\EstadoReclamosTransformer;
use App\Transformers\TipoMovimientoTransformer;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use App\Models\Tiposreclamo;
use App\Transformers\TipoReclamoTransformer;

class ConfigController extends Controller
{

    public function tipoReclamos()
    {

        $general = new General();

        $tipos = TipoReclamoTransformer::transformCollection( Tiposreclamo::all( [ 'uuid', 'reclamo' ] ) );

        if ( !$tipos )
        {
            $general->responseErrorAPI( "Invalid data" );;
        }

        return $general->responseSuccessAPI( $tipos );
    }

    public function tipoMovimieto()
    {

        $general = new General();

        $tipos = TipoMovimientoTransformer::transformCollection( TiposMovimiento::all( [ 'uuid', 'movimiento' ] ) );

        if ( !$tipos )
        {
            $general->responseErrorAPI( "Invalid data" );
        }

        return $general->responseSuccessAPI( $tipos );
    }

    public function estadoPagos()
    {

        $general = new General();
        
        $estados = EstadoPagoTransformer::transformCollection( Estadopagos::all( [ 'uuid', 'valor' ] ) );

        if ( !$estados )
        {
            $general->responseErrorAPI( "Invalid data" );
        }

        return $general->responseSuccessAPI( $estados );
    }

    public function estadoReclamos()
    {
        $general = new General();

        $estados = EstadoReclamosTransformer::transformCollection( Estadoreclamos::all( [ 'uuid', 'valor' ] ) );

        if ( !$estados )
        {
            $general->responseErrorAPI( "Invalid data" );
        }

        return $general->responseSuccessAPI( $estados );
    }

    public function bancos()
    {
        $general = new General();

        $bancos = BancosTransformer::transformCollection( Bancos::all( [ 'uuid', 'banco' ] ) );

        if ( !$bancos )
        {
            $general->responseErrorAPI( "Invalid data" );
        }

        return $general->responseSuccessAPI( $bancos );
    }

    public function consorcios()
    {
        $general = new General();

        $consorcios = ConsorciosTransformer::transformCollection( Consorcios::all( [ 'uuid', 'nombre' ] ) );

        if ( !$consorcios )
        {
            $general->responseErrorAPI( "Invalid data" );
        }

        return $general->responseSuccessAPI( $consorcios );
    }

}