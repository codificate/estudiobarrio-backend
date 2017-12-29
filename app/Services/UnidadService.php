<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 07/08/17
 * Time: 11:31 PM
 */

namespace App\Services;

use App\Models\FotosReclamos;
use App\Transformers\ReclamoTransformer;
use Symfony\Component\HttpFoundation\File\File;
use App\Models\Estadoreclamos;
use App\Models\Reclamos;
use App\Models\Consorcios;
use App\Models\Unidad;
use App\Models\Copropietarios;
use App\Models\Tiposreclamo;
use App\Models\Unidad;
use App\Utils\Victorinox;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UnidadService
{

    public function add( $data )
    {
        try
        {
            $copropietario =  Copropietarios::all()->where( 'uuid', $data['copropietario'] )->first();

            $unidades = [];

            $nuevaunidad = new Unidad();
            $nuevaunidad->uuid = '';
            $nuevaunidad->piso = $data[ 'piso' ];
            $nuevaunidad->departamento = $data[ 'departamento' ];
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

              return $unidadcreada;

            }


        } catch (\Exception $e)
        {
            return [ 'error' => $e->getMessage() ];
        }
    }

    public function addPhotos( $data )
    {
        $reclamo = null;
        $fotossubidas = [];

        if ( Victorinox::isValidUuid( $data['reclamo'] ) )
        {
            $reclamo = Reclamos::all()->where( 'uuid', $data['reclamo'] )->first();

            if ( $reclamo instanceof Reclamos )
            {
                $path = public_path()  . '/' . $data['reclamo'];

                $fotossubidas['primerafoto'] = $this->storePhoto( $data['primerafoto'], $path );

                //array_push( $fotossubidas, $this->storePhoto( $data['primerafoto'], $path ) );

                sleep(2);

                $fotossubidas[ 'segundafoto' ] = $this->storePhoto( $data[ 'segundafoto' ], $path );

                //array_push( $fotossubidas, $this->storePhoto( $data[ 'segundafoto' ], $path ) );
            }
            else
            {
                array_push( $fotossubidas, array( 'error' => 'Al parecer no existe este reclamo' ) );
            }

            if ( !key_exists( 'error', $fotossubidas ) )
            {
                $fotos = new FotosReclamos();
                $fotos->id_reclamo = $reclamo->id;
                $fotos->principal = $fotossubidas['primerafoto'];
                $fotos->secundaria = $fotossubidas['segundafoto'];

                try
                {
                    $fotos->save();
                }
                catch (\Exception $e)
                {
                    $fotossubidas = [];
                    array_push( $fotossubidas, array( 'error' => $e->getMessage() ) );
                }
            }
        }
        else
        {
            array_push( $fotossubidas, array( 'error' => 'Al parecer no existe este reclamo' ) );
        }

        return $fotossubidas;
    }

    public function storePhoto( UploadedFile $file, $path )
    {
        $photo = null;

        try
        {
            $photo = time() . '.' . $file->getClientOriginalExtension();

            $file->move( $path, $photo);
        }
        catch (\Exception $e)
        {
            $photo = array( 'error' => $e->getMessage() );
        }

        return $photo;
    }

    public function getByConsorcio( $uuid )
    {
        $byConsorcio = null;

        $consorcio = Consorcios::all()->where( 'uuid', '=', $uuid )->first();

        if ( $consorcio instanceof Consorcios && $consorcio != null )
        {
            $byConsorcio = Reclamos::ByConsorcio( $consorcio->id );
        }

        return $byConsorcio;
    }

    public function getByCopropietario( $id )
    {
        $byCopropietario = null;

        $copropietario = Copropietarios::all()->where( 'uuid', '=', $id )->first();

        if ( $copropietario instanceof Copropietarios && $copropietario != null )
        {
            $byCopropietario = Reclamos::ByCopropietario( $copropietario->id );
        }

        return $byCopropietario;
    }

    public function getLastCreated()
    {
        return Reclamos::CreatedAtLastMonth();
    }

    public function chageEstadoReclamo( $reclamoid, $estadoid )
    {
        $reclamo = Reclamos::all()->where( 'uuid', $reclamoid )->first();
        $estadoreclamo = Estadoreclamos::all()->where('uuid', $estadoid)->first();
        $tipo =  Tiposreclamo::all()->where( 'id', $reclamo->tipo_reclamo )->first();
        $fotos = FotosReclamos::all()->where( 'id_reclamo', $reclamo->id )->first();
        $copropietario = Copropietarios::all()->where( 'id', '=', $reclamo->id_copropietario )->first();

        if ( $copropietario->email == '' || $copropietario->email == null )
        {
            $usuario = User::all()->where( 'id', '=', $copropietario->id_user )->first();
            $copropietario->nombre = $usuario->nombre;
            $copropietario->email = $usuario->email;
        }

        $reclamo->estado = $estadoreclamo->id;

        try
        {

          if ( $reclamo->save() )
          {

              $response = new \stdClass;

              $response->uuid = $reclamo->uuid;

              $explodeuuid = explode('-', $reclamo->uuid);
              $response->id = substr( $explodeuuid[0], 2, strlen($explodeuuid[0]));

              $response->estado = $estadoreclamo->valor;
              $response->nombre = $copropietario->nombre;
              $response->telefono = $copropietario->telefono;
              $response->email = $copropietario->email;
              $response->tipo = $tipo->reclamo;
              $response->descripcion = $reclamo->infoAdicional;
              $response->fecha = date_format( date_create( $reclamo->fecha ), 'Y-m-d' );

              if ( $fotos instanceof FotosReclamos && $fotos != null )
              {
                  $response->fotos = [ $fotos->principal, $fotos->secundaria ];
              }

              return $response;
          }

        }
        catch (Exception $e)
        {
            return [ 'error' => $e->getMessage() ];
        }

    }

}
