<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 09/07/17
 * Time: 08:37 PM
 */

namespace App\Http\Controllers;

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

        $tipos = TipoReclamoTransformer::transformCollection( Tiposreclamo::all( [ 'uuid', 'reclamo' ] ) );

        if ( !$tipos )
        {
            throw new HttpException(400, "Invalid data");
        }

        return response()->json(
            $tipos,
            200
        );
    }

    public function tipoMovimieto()
    {

        $tipos = TipoMovimientoTransformer::transformCollection( TiposMovimiento::all( [ 'uuid', 'movimiento' ] ) );

        if ( !$tipos )
        {
            throw new HttpException(400, "Invalid data");
        }

        return response()->json(
            $tipos,
            200
        );
    }

    public function estadoPagos()
    {

        $estados = EstadoPagoTransformer::transformCollection( Estadopagos::all( [ 'uuid', 'valor' ] ) );

        if ( !$estados )
        {
            throw new HttpException(400, "Invalid data");
        }

        return response()->json(
            $estados,
            200
        );
    }

    public function estadoReclamos()
    {

        $estados = EstadoReclamosTransformer::transformCollection( Estadoreclamos::all( [ 'uuid', 'valor' ] ) );

        if ( !$estados )
        {
            throw new HttpException(400, "Invalid data");
        }

        return response()->json(
            $estados,
            200
        );
    }

    public function bancos()
    {

        $bancos = BancosTransformer::transformCollection( Bancos::all( [ 'uuid', 'banco' ] ) );

        if ( !$bancos )
        {
            throw new HttpException(400, "Invalid data");
        }

        return response()->json(
            $bancos,
            200
        );
    }

    public function consorcios()
    {

        $bancos = ConsorciosTransformer::transformCollection( Consorcios::all( [ 'uuid', 'nombre' ] ) );

        if ( !$bancos )
        {
            throw new HttpException(400, "Invalid data");
        }

        return response()->json(
            $bancos,
            200
        );
    }

}