<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 23/08/17
 * Time: 12:59 AM
 */

namespace App\Services;

use App\Models\Bancos;
use App\Models\Consorcios;
use App\Models\Copropietarios;
use App\Models\Pagos;
use App\Models\TiposMovimiento;
use App\Transformers\PagosTransformer;
use App\Utils\Victorinox;

class PagosService
{

    private $copropietario;
    private $banco;
    private $tipo;

    public function add( $data )
    {
        $pagorealizado = null;

        $camposvalidos = $this->validateEscentialFields($data);

        if ( !is_array( $camposvalidos ) )
        {
            $pago = new Pagos();
            $pago->uuid = '';
            $pago->id_copropietario = $this->copropietario->id;
            $pago->fecha = $data['fecha'];
            $pago->id_banco = $this->banco->id;
            $pago->tipo_movimiento = $this->tipo->id;
            $pago->monto = $data['monto'];
            $pago->comentario = $data['comentario'];
            $pago->estado = $data['estado'];

            try
            {
                if ( $pago->save() )
                {
                    $pago = Pagos::all()->where( 'id', $pago->id )->first();

                    $pagorealizado = PagosTransformer::nuevoPago( $pago, $this->banco, $this->tipo );
                }
            }
            catch ( \Exception $e )
            {
                $pagorealizado['error'] = $e->getMessage();
            }
        }
        else
        {
            return $camposvalidos;
        }

        return $pagorealizado;
    }

    public function validateEscentialFields( $data )
    {
        $validFields = true;

        //if ( Victorinox::isValidUuid( $data['copropietario'] ) )
        //{
            $this->copropietario =  Copropietarios::all()->where( 'uuid', $data['copropietario'] )->first();

            if ( !$this->copropietario instanceof Copropietarios )
                return array( 'error' => 'Al parecer no existe el copropietario' );
        //}
        //else
        //    return array( 'error' => 'El ID del copropietario no es valido' );

        //if ( Victorinox::isValidUuid( $data['banco'] ) )
        //{
            $this->banco = Bancos::all()->where('uuid', $data['banco'])->first();

            if ( !$this->banco instanceof Bancos)
                return array( 'error' => 'Al parecer no existe el banco seleccionado' );
        //}
        //else
        //    return array( 'error' => 'El ID del banco no es valido' );

        //if ( Victorinox::isValidUuid( $data['tipo'] ) )
        //{
            $this->tipo = TiposMovimiento::all()->where('uuid', $data['tipo'])->first();

            if ( !$this->tipo instanceof TiposMovimiento)
                return array( 'error' => 'Al parecer no existe el tipo de movimiento seleccionado' );
        //}
        //else
        //    return array( 'error' => 'El ID del tipo de movimiento no es valido' );


        return $validFields;
    }

    public function getByCopropietario( $id )
    {
        $copropietario = Copropietarios::all()->where( 'uuid', '=', $id )->first();

        return Pagos::ByCopropietario( $copropietario->id );
    }

    public function getByConsorcio( $id )
    {
        $consorcio = Consorcios::all()->where( 'uuid', '=', $id )->first();

        return Pagos::ByConsorcio( $consorcio->id );

    }
}