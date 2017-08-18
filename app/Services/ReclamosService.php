<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 07/08/17
 * Time: 11:31 PM
 */

namespace App\Services;

use App\Models\FotosReclamos;
use Symfony\Component\HttpFoundation\File\File;
use App\Models\Estadoreclamos;
use App\Models\Reclamos;
use App\Models\Consorcios;
use App\Models\Copropietarios;
use App\Models\Tiposreclamo;
use App\Utils\Victorinox;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ReclamosService
{
    
    public function add( $data )
    {
        try
        {
            $copropietario =  Copropietarios::all()->where( 'uuid', $data['copropietario'] )->first();
            $consorcio =  Consorcios::all()->where( 'uuid', $data['consorcio'] )->first();
            $tipo =  Tiposreclamo::all()->where( 'uuid', $data['tipo'] )->first();

            if( ( $copropietario instanceof Copropietarios && $copropietario != null) &&
                ( $consorcio instanceof Consorcios && $consorcio != null) &&
                ( $tipo instanceof Tiposreclamo && $tipo != null) )
            {
                
                $estadoreclamo = Estadoreclamos::all()->where('valor', 'Pendiente')->first();
                
                $reclamo = new Reclamos();

                $reclamo->uuid = '';
                $reclamo->id_copropietario = $copropietario->id;
                $reclamo->tipo_reclamo = $tipo->id;
                $reclamo->id_consorcio = $consorcio->id;
                $reclamo->estado = $estadoreclamo->id;
                $reclamo->infoAdicional = $data['detalle'];

                if ( $reclamo->save() )
                {
                    return Reclamos::ById( $reclamo->id );
                }
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

                array_push( $fotossubidas, $this->storePhoto( $data['primerafoto'], $path ) );

                sleep(3);

                array_push( $fotossubidas, $this->storePhoto( $data[ 'segundafoto' ], $path ) );
            }
            else
            {
                array_push( $fotossubidas, array( 'error' => 'Al parecer no existe este reclamo' ) );
            }

            if ( !key_exists( 'error', $fotossubidas ) )
            {
                $fotos = new FotosReclamos();
                $fotos->id_reclamo = $reclamo->id;
                $fotos->principal = $fotossubidas[0];
                $fotos->secundaria = $fotossubidas[1];

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
}