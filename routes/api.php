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

Route::get('consorcios', 'ConfigController@consorcios');

Route::post('login', ['as' => 'login', 'uses' => 'CopropietariosController@login'] );
Route::post('copropietario', 'CopropietariosController@signUp');
Route::get('copropietario/checkbyemail', 'CopropietariosController@checkIfExistByEmail');
Route::post('recuperarclave', 'CopropietariosController@forgotPassword');
Route::put('notificarcambioclave', 'ElCarteroController@recuperarClave');

Route::post('reclamo/fotos', 'ReclamosController@savePhotos');
Route::post('pago/adjunto', 'PagosController@saveComprobante');

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
    Route::get('reclamos/recientes', 'ReclamosController@getLastReclamosCreated');
    Route::get('reclamo/bycopropietario/{uuid}', 'ReclamosController@byCopropietario');
    Route::put('reclamo/changeEstado/{reclamoid}/{estadoid}', 'ReclamosController@updateEstado');

    Route::post('pago', 'PagosController@save');
    Route::get('pago/recientes', 'PagosController@getLastPagosCreated');
    Route::get('pago/byconsorcio/{uuid}', 'PagosController@byConsorcio');
    Route::get('pago/bycopropietario/{uuid}', 'PagosController@byCopropietario');
    Route::put('pago/changeEstado/{pagoid}/{estadoid}', 'PagosController@updateEstado');

    Route::get('user/{uuid}', 'UserController@detail');

});
