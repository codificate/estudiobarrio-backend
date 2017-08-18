<?php
/**
 * Created by PhpStorm.
 * User: andres
 * Date: 06/08/17
 * Time: 03:00 PM
 */

namespace App\Utils;


class General
{

    /**
     * @param mixed $data
     * @param int $code
     * @return mixed
     */
    public function responseSuccessAPI($data, $code=200){

        return $this->responseData($data, $code);
    }

    /**
     * @param $message
     * @param bool|false $title
     * @param int $code
     * @return mixed
     */
    public function responseErrorAPI($message, $code=400){
        $response = [
            "code" => $code,
            "message" => $message,
        ];

        return $this->responseData($response, $code);
    }

    /**
     * @param $arr
     * @return mixed
     */
    public function responseData($arr, $code){

        return response()->json($arr, $code);
    }
}