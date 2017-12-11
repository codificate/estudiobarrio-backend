<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 23/08/17
 * Time: 12:59 AM
 */

namespace App\Services;

use App\Models\Pagos;
use App\Models\Unidad;
use App\Models\Bancos;
use App\Models\Adjuntos;
use App\Utils\Victorinox;
use App\Models\Consorcios;
use App\Models\Estadopagos;
use App\Models\Copropietarios;
use App\Models\TiposMovimiento;
use Illuminate\Http\UploadedFile;
use App\Transformers\PagosTransformer;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\File\File;


class PagosService
{

    private $copropietario;
    private $unidad;
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
            $pago->id_unidad = $this->unidad->id;
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

    public function chageEstadoPago( $pagoid, $estadoid )
    {
        $pago = Pagos::all()->where( 'uuid', $pagoid )->first();
        $estadopago = Estadopagos::all()->where('uuid', $estadoid)->first();
        $tipo =  TiposMovimiento::all()->where( 'id', $pago->tipo_movimiento )->first();
        $banco = Bancos::all()->where( 'id', $pago->id_banco )->first();
        $copropietario = Copropietarios::all()->where( 'id', $pago->id_copropietario )->first();

        $pago->estado = $estadopago->id;

        try
        {

          if ( $pago->save() )
          {

              $response = new \stdClass;

              $response->banco = $banco->banco;
              $response->comentario = $pago->comentario;
              $response->estado = $estadopago->valor;
              $response->fecha = $pago->fecha;
              $response->id = $pago->uuid;
              $response->id_banco = $banco->uuid;
              $response->id_movimiento = $tipo->uuid;
              $response->monto = $pago->monto;
              $response->movimiento = $tipo->movimiento;
              $response->nombre = $copropietario->nombre;

              return $response;
          }

        }
        catch (Exception $e)
        {
            return [ 'error' => $e->getMessage() ];
        }

    }

    public function validateEscentialFields( $data )
    {
        $validFields = true;

        $this->copropietario =  Copropietarios::all()->where( 'uuid', $data['copropietario'] )->first();

        if ( !$this->copropietario instanceof Copropietarios )
            return array( 'error' => 'Al parecer no existe el copropietario' );

        $this->banco = Bancos::all()->where('uuid', $data['banco'])->first();

        if ( !$this->banco instanceof Bancos)
            return array( 'error' => 'Al parecer no existe el banco seleccionado' );

        $this->tipo = TiposMovimiento::all()->where('uuid', $data['tipo'])->first();

        if ( !$this->tipo instanceof TiposMovimiento)
            return array( 'error' => 'Al parecer no existe el tipo de movimiento seleccionado' );

        $this->unidad = Unidad::all()->where('uuid', $data['unidad'])->first();

        if ( !$this->unidad instanceof Unidad)
            return array( 'error' => 'Al parecer no existe la unidad seleccionada' );

        return $validFields;
    }

    public function addComprobanteDePago( $data )
    {
        $pago = null;
        $archivo = [];

        if ( Victorinox::isValidUuid( $data['pago'] ) )
        {
            $pago = Pagos::all()->where( 'uuid', $data['pago'] )->first();

            if ( $pago instanceof Pagos )
            {
                $path = public_path()  . '/comprobantes/' . $data['pago'];

                $archivo['adjunto'] = $this->storeFile( $data['adjunto'], $path );

                sleep(2);
            }
            else
            {
                array_push( $archivo, array( 'error' => 'Al parecer no existe el pago' ) );
            }

            if ( !key_exists( 'error', $archivo ) )
            {
                $adjunto = new Adjuntos();
                $adjunto->uuid = '';
                $adjunto->id_pago = $pago->id;
                $adjunto->nombre = $archivo['adjunto'];

                try
                {
                    $adjunto->save();
                }
                catch (\Exception $e)
                {
                    $archivo = [];
                    array_push( $archivo, array( 'error' => $e->getMessage() ) );
                }
            }
        }
        else
        {
            array_push( $archivo, array( 'error' => 'Al parecer no existe este pago' ) );
        }

        return $archivo;
    }

    public function storeFile( UploadedFile $file, $path )
    {
        $fileUploaded = null;

        try
        {
            $fileUploaded = time() . '.' . $file->getClientOriginalExtension();

            $file->move( $path, $fileUploaded);
        }
        catch (\Exception $e)
        {
            $fileUploaded = array( 'error' => $e->getMessage() );
        }

        return $fileUploaded;
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

    public function getLastCreated()
    {
        return Pagos::CreatedAtLastMonth();
    }
}
