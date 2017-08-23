<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 22/08/17
 * Time: 11:35 PM
 */

namespace App\Models;


use Webpatser\Uuid\Uuid;
use Illuminate\Database\Eloquent\Model;


class Pagos extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'uuid', 'id_copropietario', 'fecha',
        'id_banco', 'tipo_movimiento', 'monto',
        'id_adjunto', 'comentario', 'estado'
    ];


    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['dateStamp', 'created_at', 'updated_at'];

    /**
     * @param $uuid
     */
    public function setUuidAttribute($uuid)
    {
        $this->attributes['uuid'] = Uuid::generate(4);
    }

}