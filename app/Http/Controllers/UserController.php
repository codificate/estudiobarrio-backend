<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 15/10/17
 * Time: 10:46 AM
 */

namespace App\Http\Controllers;


use App\Services\UserService;
use App\Utils\General;
use Illuminate\Http\Request;

class UserController
{

    public function detail(Request $request, $uuid)
    {
        $general = new General();
        $service = new UserService();

        $response = $service->detailUserByUuid( $uuid );

        if ( is_object( $response ) )
        {
            return $general->responseSuccessAPI( $response );
        }
        else
        {
            return $general->responseErrorAPI( $response, 500 );
        }
    }
}