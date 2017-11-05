<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 08/07/17
 * Time: 07:44 PM
 */

namespace App\Models;

use DB;
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

    public function scopeByCopropietario($query, $copropietario)
    {
        $resutl = null;

        $query = 
            "select re.id, re.uuid, DATE( re.fecha ) fecha, tr.reclamo tipo, ".
            "er.valor estado, re.infoAdicional descripcion ".
            "from reclamos re, copropietarios co, tipos_reclamo tr, estadoreclamos er ".
            "where re.id_copropietario = co.id and co.id = " . $copropietario . " and re.tipo_reclamo = tr.id ".
            "and re.estado = er.id order by re.fecha desc";

        $reclamos = [];

        try
        {
            $result = DB::select(DB::raw($query));

            if ( is_array( $result ) )
            {
                foreach ( $result as $reclamo )
                {
                    $fotosreclamo = FotosReclamos::all()->where('id_reclamo', $reclamo->id)->first();
                    if ( $fotosreclamo instanceof FotosReclamos )
                    {
                        $reclamo->fotos = array( $fotosreclamo->principal, $fotosreclamo->secundaria );
                    }

                    $reclamo->id = $reclamo->uuid;

                    unset( $reclamo->uuid );
                    array_push( $reclamos, $reclamo );
                }
            }

        }catch (\Exception $e)
        {
            $reclamos = $e->getMessage();
        }

        return $reclamos;
    }

    public function scopeById($query, $id)
    {
        $resutl = null;

        $query = "select re.uuid id, DATE( re.fecha ) fecha, con.nombre, tr.reclamo tipo, er.valor estado, ".
            "re.infoAdicional descripcion from ".
            "reclamos re, consorcios con, copropietarios co, tipos_reclamo tr, estadoreclamos er where ".
            "re.id_copropietario = co.id and re.id = " . $id. " and re.tipo_reclamo = tr.id and ".
            "re.id_consorcio = con.id and re.estado = er.id";

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

        $query = " select re.uuid id, DATE( re.fecha ) fecha, co.nombre, co.email, co.telefono, tr.reclamo tipo, er.valor estado,".
            " re.infoAdicional descripcion from reclamos re ".
            " left join copropietarios co on re.id_copropietario = co.id " .
            " left join tipos_reclamo tr on re.tipo_reclamo = tr.id ".
            " left join estadoreclamos er on re.estado = er.id " .
            " where co.id_consorcio = " . $id . " and re.id_consorcio = " . $id . " order by re.fecha desc ";

        try
        {

            $result = DB::select(DB::raw($query));

        }catch (\Exception $e)
        {
            $result = $e->getMessage();
        }

        return $result;
    }

    public function scopeCreatedAtLastMonth($query)
    {
        $result = null;

        $query = " select re.uuid id, DATE( re.fecha ) fecha, co.nombre, co.email, co.telefono, tr.reclamo tipo, er.valor estado,".
            " re.infoAdicional descripcion from reclamos re ".
            " left join copropietarios co on re.id_copropietario = co.id " .
            " left join tipos_reclamo tr on re.tipo_reclamo = tr.id ".
            " left join estadoreclamos er on re.estado = er.id " .
            " where DATE( re.fecha ) BETWEEN CONCAT( YEAR( CURRENT_DATE ), CONCAT( '-', CONCAT( MONTH( CURRENT_DATE ) - 3 , CONCAT( '-', DAY(CURRENT_DATE()) ) ) ) ) AND CURRENT_DATE()".
            " order by re.fecha desc ";

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