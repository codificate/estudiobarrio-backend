<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 02/07/17
 * Time: 06:52 PM
 */

namespace App\Models;

use Webpatser\Uuid\Uuid;
use Illuminate\Database\Eloquent\Model;


class Adjuntos extends Model
{
    

    protected $table = 'adjuntos';

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