<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 22/08/17
 * Time: 11:35 PM
 */

namespace App\Models;

use DB;
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

    public function scopeByCopropietario( $query, $copropietario )
    {

        $result = null;

        $query =    "select p.uuid id, p.fecha, p.monto, p.comentario, t.uuid id_movimiento, ".
                    "t.movimiento, b.uuid id_banco, b.banco, p.estado ".
                    "from pagos p ".
                    "left join tipos_movimiento t on p.tipo_movimiento = t.id ".
                    "left join bancos b on p.id_banco = b.id ".
                    "where p.id_copropietario =  " . $copropietario . " order by p.fecha desc";

        try
        {

            $result = DB::select(DB::raw($query));

        }catch (\Exception $e)
        {
            $result = $e->getMessage();
        }

        return $result;
    }

    public function scopeByConsorcio($query, $id)
    {
        $result = null;

        $query ="select p.uuid id, p.fecha, p.comentario, co.nombre, co.email, co.telefono, ".
                "b.banco, p.monto, p.estado ".
                "from pagos p ".
                "left join copropietarios co on p.id_copropietario = co.id and co.id_consorcio = " . $id . " " .
                "left join bancos b on p.id_banco = b.id order by p.fecha desc";

        try
        {

            $result = DB::select(DB::raw($query));

        }
        catch (\Exception $e)
        {
            $result = $e->getMessage();
        }

        return $result;
    }

    public function scopeCreatedAtLastMonth( $query )
    {

        $result = null;

        $query = 
            "select p.uuid id, p.fecha, p.monto, p.comentario, t.uuid id_movimiento, ".
            "t.movimiento, b.uuid id_banco, b.banco, p.estado ".
            "from pagos p ".
            "left join tipos_movimiento t on p.tipo_movimiento = t.id ".
            "left join bancos b on p.id_banco = b.id ".
            "where p.fecha BETWEEN CONCAT( YEAR( CURRENT_DATE ), CONCAT( '-', CONCAT( MONTH( CURRENT_DATE ) - 3 , CONCAT( '-', DAY(CURRENT_DATE()) ) ) ) ) AND CURRENT_DATE()  " .
            "order by p.fecha desc";

        try
        {

            $result = DB::select(DB::raw($query));

        }catch (\Exception $e)
        {
            $result = $e->getMessage();
        }

        return $result;
    }

}