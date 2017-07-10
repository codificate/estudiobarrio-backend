<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 02/07/17
 * Time: 07:15 PM
 */

namespace App\Models;

use Webpatser\Uuid\Uuid;
use Illuminate\Database\Eloquent\Model;

class Documentos extends Model
{
    

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'uuid', 'id_consorcio', 'fecha', 'descripcion', 'file'
    ];


    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['fecha', 'created_at', 'updated_at'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function consorcio()
    {
        return $this->hasMany('App\Models\Consorcios', 'id', 'id_consorcio');
    }

    /**
     * @param $uuid
     */
    public function setUuidAttribute($uuid)
    {
        $this->attributes['uuid'] = Uuid::generate(4);
    }

}