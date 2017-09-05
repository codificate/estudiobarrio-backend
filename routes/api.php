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

Route::group([ 'middleware' => 'auth:api' ], function () {

    Route::get('tiporeclamos', 'ConfigController@tipoReclamos');
    Route::get('tipomovimientos', 'ConfigController@tipoMovimieto');
    Route::get('estadopagos', 'ConfigController@estadoPagos');
    Route::get('estadoreclamos', 'ConfigController@estadoReclamos');
    Route::get('bancos', 'ConfigController@bancos');

    Route::put('copropietario/{uuid}/update', 'CopropietariosController@updateInfo');
    Route::post('copropietario/{uuid}', 'CopropietariosController@detailInfo');
    Route::get('copropietarios', 'CopropietariosController@todos');

    Route::post('reclamo', 'ReclamosController@save');
    Route::post('reclamo/fotos', 'ReclamosController@savePhotos');
    Route::get('reclamo/byconsorcio/{uuid}', 'ReclamosController@byConsorcio');

    Route::post('pago', 'PagosController@save');

});