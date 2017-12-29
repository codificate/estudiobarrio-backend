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
            $consorcio = Consorcios::all()->where( 'uuid', $data['consorcio'] )->first();
            $nuevaunidad->id_consorcio = $consorcio->id;
            $nuevaunidad->id_copropietario = $copropietario->id;

            if ( $nuevaunidad->save() ) {

              $unidadcreada = Unidad::all()->where( 'id', $nuevaunidad->id )->first();
              $unidadcreada->id = $unidadcreada->uuid;
              $unidadcreada->consorcio = $consorcio->nombre;
              $unidadcreada->id_consorcio = $data['consorcio'];
              unset( $unidadcreada->id );
              unset( $unidadcreada->id_consorcio );
              unset( $unidadcreada->id_copropietario );
              unset( $unidadcreada->updated_at );
              unset( $unidadcreada->created_at );

              return $unidadcreada;

            }

        }
        catch (\Exception $e)
        {
            return [ 'error' => $e->getMessage() ];
        }
    }
}
