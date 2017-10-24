<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => 'auth.basic'], function () {
    Route::get('/api/tiporeclamos', 'ConfigController@tipoReclamos');
});*/


Route::get('consorcios', 'ConfigController@consorcios');

Route::post('login', ['as' => 'login', 'uses' => 'CopropietariosController@login'] );
Route::post('copropietario', 'CopropietariosController@signUp');
Route::post('recuperarclave', 'CopropietariosController@forgotPassword');

Route::post('reclamo/fotos', 'ReclamosController@savePhotos');

Route::group([ 'middleware' => 'auth:api' ], function () {

    Route::get('bancos', 'ConfigController@bancos');
    Route::get('estadopagos', 'ConfigController@estadoPagos');
    Route::get('tiporeclamos', 'ConfigController@tipoReclamos');
    Route::get('tipomovimientos', 'ConfigController@tipoMovimieto');
    Route::get('estadoreclamos', 'ConfigController@estadoReclamos');

    Route::get('copropietario/{uuid}', 'CopropietariosController@detailInfo');
    Route::put('copropietario/{uuid}/update', 'CopropietariosController@updateInfo');
    Route::get('copropietarios/byconsorcio/{uuid}', 'CopropietariosController@byConsorcio');

    Route::post('reclamo', 'ReclamosController@save');
    Route::get('reclamo/byconsorcio/{uuid}', 'ReclamosController@byConsorcio');
    Route::get('reclamo/bycopropietario/{uuid}', 'ReclamosController@byCopropietario');

    Route::post('pago', 'PagosController@save');
    Route::get('pago/byconsorcio/{uuid}', 'PagosController@byConsorcio');
    Route::get('pago/bycopropietario/{uuid}', 'PagosController@byCopropietario');

    Route::get('user/{uuid}', 'UserController@detail');

});