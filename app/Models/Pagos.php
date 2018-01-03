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
        'id_adjunto', 'id_unidad', 'comentario', 'estado'
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

    public function rawQuery( $raw )
    {
        $pagos = [];

        if ( is_array( $raw ) )
        {
            foreach ( $raw as $pago )
            {
                $adjunto = Adjuntos::all()->where('id_pago', $pago->id)->first();
                if ( $adjunto instanceof Adjuntos )
                {
                    $pago->adjunto = $pago->uuid . '/' . $adjunto->nombre;
                }
                else
                {
                    $pago->adjunto = null;
                }

                $explodeuuid = explode('-', $pago->uuid);
                $pago->id = substr( $explodeuuid[0], 2, strlen($explodeuuid[0]));
                array_push( $pagos, $pago );
            }
        }

        return ( is_array( $pagos ) && !empty( $raw ) ) ? $pagos : $raw ;
    }

    public function scopeByCopropietario( $query, $copropietario )
    {

        $result = null;

        $query =    "select p.id, p.uuid, p.fecha, p.monto, p.comentario, t.uuid id_movimiento, ".
                    "t.movimiento, b.uuid id_banco, b.banco, ep.valor estado ".
                    "from pagos p ".
                    "left join tipos_movimiento t on p.tipo_movimiento = t.id ".
                    "left join bancos b on p.id_banco = b.id ".
                    "left join estadopagos ep on p.estado = ep.id ".
                    "where p.id_copropietario =  " . $copropietario . " order by p.fecha desc";

        try
        {

            $result = $this->rawQuery( DB::select( DB::raw( $query ) ) );

        }catch (\Exception $e)
        {
            $result = $e->getMessage();
        }

        return $result;
    }

    public function scopeByConsorcio($query, $id)
    {
        $result = null;

        $query ="select p.id, p.uuid, p.fecha, p.comentario, co.nombre, co.email, co.telefono, t.uuid id_movimiento, ".
                "t.movimiento, b.banco, p.monto, ep.valor estado ".
                "from pagos p ".
                "left join tipos_movimiento t on p.tipo_movimiento = t.id ".
                "left join copropietarios co on p.id_copropietario = co.id " .
                "left join bancos b on p.id_banco = b.id ".
                "left join estadopagos ep on p.estado = ep.id ".
                "where co.id_consorcio = " . $id . " order by p.fecha desc";

        try
        {

            $result = $this->rawQuery( DB::select( DB::raw( $query ) ) );

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
            "select p.id, p.uuid, p.fecha, co.nombre, p.monto, p.comentario, t.uuid id_movimiento, ".
            "t.movimiento, b.uuid id_banco, b.banco, ep.valor estado ".
            "from pagos p ".
            "left join tipos_movimiento t on p.tipo_movimiento = t.id ".
            "left join copropietarios co on p.id_copropietario = co.id " .
            "left join bancos b on p.id_banco = b.id ".
            "left join estadopagos ep on p.estado = ep.id ".
            "order by p.created_at desc ".
            "limit 200";

        try
        {

            $result = $this->rawQuery( DB::select( DB::raw( $query ) ) );

        }catch (\Exception $e)
        {
            $result = $e->getMessage();
        }

        return $result;
    }

}
