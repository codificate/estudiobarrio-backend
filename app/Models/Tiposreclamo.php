<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 08/07/17
 * Time: 07:58 PM
 */

namespace App\Models;

use Webpatser\Uuid\Uuid;
use Illuminate\Database\Eloquent\Model;

class Tiposreclamo extends Model
{
    

    protected $table = 'tipos_reclamo';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'uuid', 'reclamo'
    ];


    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['created_at'];

    /**
     * @param $uuid
     */
    public function setUuidAttribute($uuid)
    {
        $this->attributes['uuid'] = Uuid::generate(4);
    }

}