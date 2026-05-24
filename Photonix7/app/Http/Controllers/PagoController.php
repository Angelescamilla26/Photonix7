<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Preference\PreferenceClient;

class PagoController extends Controller
{
    public function crearPreferencia(Request $request)
    {
        try {

            MercadoPagoConfig::setAccessToken(env('MP_ACCESS_TOKEN'));

            $client = new PreferenceClient();

            $items = [];

            foreach ($request->cart as $product) {
                $items[] = [
                    "title" => $product['name'],
                    "quantity" => (int) $product['quantity'],
                    "unit_price" => (float) $product['price']
                ];
            }

            $preference = [
                "items" => [
                    [
                        "title" => "Producto de prueba",
                        "quantity" => 1,
                        "unit_price" => 100
                    ]
                ],
                "back_urls" => [
                    "success" => "http://127.0.0.1:8000/pago-exitoso",
                    "failure" => "http://127.0.0.1:8000/pago-fallido",
                    "pending" => "http://127.0.0.1:8000/pago-pendiente"
                ],
                "auto_return" => "approved"
            ];

            $preference = $client->create($preference);

            return response()->json([
                "init_point" => $preference->init_point
            ]);
        } catch (\MercadoPago\Exceptions\MPApiException $e) {

            return response()->json([
                "message" => "Error API MercadoPago",
                "status" => $e->getApiResponse()->getStatusCode(),
                "response" => $e->getApiResponse()->getContent()
            ], 500);
        } catch (\Exception $e) {

            return response()->json([
                "message" => "Error general",
                "error" => $e->getMessage()
            ], 500);
        }
    }
}
