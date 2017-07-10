<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 02/07/17
 * Time: 07:15 PM
 */

namespace App;

use Webpatser\Uuid\Uuid;
use Illuminate\Database\Eloquent\Model;

class Comentarios extends Model
{
    

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_ref', 'fecha', 'detalle',
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