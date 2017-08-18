<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 18/08/17
 * Time: 01:31 AM
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FotosReclamos extends Model
{
    protected $table = 'fotosreclamos';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [ 'id_reclamo', 'principal', 'secundaria' ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['created_at', 'updated_at'];

}