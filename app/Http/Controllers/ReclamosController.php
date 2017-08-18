<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 02/08/17
 * Time: 12:43 AM
 */

namespace App\Http\Controllers;

use App\Services\ReclamosService;
use App\Utils\General;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Validations\ReclamosValidation;

class ReclamosController extends Controller
{
    public function save(Request $request)
    {
        $data = $request->all();
        $general = new General();
        $service = new ReclamosService();

        $validator = ReclamosValidation::nuevoReclamo( $data );

        if( $validator->fails() )
            return $general->responseErrorAPI( $validator );
        else
        {
            $response = $service->add( $data );

            if ( is_array( $response ) && array_key_exists( 'error', $response ) )
                return $general->responseErrorAPI( $response );
            else
                return $general->responseSuccessAPI( $response );
        }
    }
    
    public function savePhotos(Request $request)
    {
        $fotossubidas = [];
        
        $data = $request->all();
        $general = new General();
        $service = new ReclamosService();

        $validator = ReclamosValidation::fotoValida( $data );

        if( $validator->fails() )
            return $general->responseErrorAPI( $validator );
        else
        {
            $fotossubidas = $service->addPhotos($data);

            if ( key_exists( 'error', $fotossubidas ) )
            {
                return $general->responseErrorAPI( $fotossubidas );
            }
            else
            {
                return $general->responseSuccessAPI( $fotossubidas );
            }
        }
    }
}