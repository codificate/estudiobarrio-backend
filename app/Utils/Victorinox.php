<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 17/08/17
 * Time: 11:20 PM
 */

namespace App\Utils;


use Webpatser\Uuid\Uuid;

class Victorinox
{

    public static function isValidUuid( $uuid )
    {
        $v4 = '/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i';
        
        return (bool) preg_match( $v4 , $uuid );
    }

}