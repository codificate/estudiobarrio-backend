<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 02/07/17
 * Time: 07:15 PM
 */

namespace app;
use Webpatser\Uuid\Uuid;


class BusquedasGuardadas extends Model
{
    

    protected $table = 'busquedas_guardadas';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'uuid', 'nombre'
    ];


    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['created_at', 'updated_at'];

    /**
     * @param $uuid
     */
    public function setUuidAttribute($uuid)
    {
        $this->attributes['uuid'] = Uuid::generate(4);
    }

}