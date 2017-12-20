<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 09/07/17
 * Time: 08:37 PM
 */

namespace App\Http\Controllers;


use App\Utils\General;
use Illuminate\Http\Request;
use App\Services\UserService;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ElCarteroController extends Controller
{

    public function recuperarClave( Request $request )
    {
        $data = $request->all();
        $general = new General();
        $service = new UserService();

        $user = $service->detailUserByEmail( $data['email'] );
        $retrievepassword_endpoint_ = "estudiobarrio.plexarg.com/cambiarclave?u=" . $user->id;

        Mail::send( 'emails.retrievepassword',
        [ 'nombre' => $user->nombre,
          'url' => $retrievepassword_endpoint_ ], function ($message) use ($user)
        {
            $message->from('andres92898@gmail.com', 'Estudio Barrio');
            $message->to( $user->email );
            $message->subject("Recupera tu clave");
        });

        $response = new \stdClass;

        $response->ok = true;
        $response->message = "Se te ha enviado un correo, para que puedas recuperar tu clave.";

        return $general->responseSuccessAPI( $response );
    }

    public function cambiarEstadoReclamo( $reclamo )
    {
        if ( $reclamo->email != '' )
        {
            $email = $reclamo->email;
            Mail::send( 'emails.cambiarestadoreclamo',
              [ 'nombre'  => $reclamo->nombre,
                'estado'  => $reclamo->estado,
                'tipo'    => $reclamo->tipo,
                'descripcion' => $reclamo->descripcion ], function ($message) use ($email)
                {
                    $message->from('andres92898@gmail.com', 'Estudio Barrio');
                    $message->to( $email );
                    $message->subject("Cambio del estado del reclamo");
                });
        }
    }

    public function cambiarEstadoPago( $pago )
    {
        if ( $pago->email != '' )
        {
            $email = $pago->email;
            Mail::send( 'emails.cambiarestadopago',
              [ 'nombre' => $pago->nombre,
                'estado' => $pago->estado,
                'tipo'    => $pago->tipo,
                'descripcion' => $pago->comentario  ], function ($message) use ($email)
                {
                    $message->from('andres92898@gmail.com', 'Estudio Barrio');
                    $message->to( $email );
                    $message->subject("Cambio del estado de pago");
                });
        }
    }

}
