<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 08/07/17
 * Time: 07:44 PM
 */

namespace App\Models;

use Webpatser\Uuid\Uuid;
use Illuminate\Database\Eloquent\Model;


class Reclamos extends Model
{
    

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'uuid', 'fecha', 'id_copropietario', 'tipo_reclamo', 'estado', 'id_consorcio',
        'interno', 'proveedor', 'fechaSeguimiento', 'infoAdicional'
    ];


    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['fecha', 'fechaSeguimiento', 'created_at', 'updated_at'];



    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function coproppietario()
    {
        return $this->hasMany('App\Models\Copropietarios', 'id', 'id_copropietario');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function consorcio()
    {
        return $this->hasMany('App\Models\Consorcios', 'id', 'id_consorcio');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function tipoReclamo()
    {
        return $this->hasMany('App\Models\Tiposreclamo', 'id', 'tipo_reclamo');
    }

    /**
     * @param $uuid
     */
    public function setUuidAttribute($uuid)
    {
        $this->attributes['uuid'] = Uuid::generate(4);
    }

}