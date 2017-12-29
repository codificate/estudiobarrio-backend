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
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpKernel\Exception\HttpException;

class UnidadController extends Controller
{

    public function save( Request $request )
    {
        $data = $request->all();
        $general = new General();
    }

}
