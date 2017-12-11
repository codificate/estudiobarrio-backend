<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 02/07/17
 * Time: 07:15 PM
 */

namespace App\Models;

use DB;
use Webpatser\Uuid\Uuid;
use Illuminate\Database\Eloquent\Model;


class Unidad extends Model
{

    protected $table = 'unidad';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'uuid', 'id_consorcio', 'id_copropietario', 'piso', 'departamento'
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

    public function scopeDetail($query, $copropietario)
    {
        $result = null;

        $query =
            "select u.uuid id, c.uuid id_consorcio, c.nombre consorcio, u.piso, ".
            "u.departamento from unidad u left join consorcios c on u.id_consorcio = c.id ".
            "where u.id_copropietario = " . $copropietario ;

        try {

            $result = DB::select(DB::raw($query));

        } catch (\Exception $e) {

            //$result = $e->getMessage();
        }

        return $result;
    }

}
