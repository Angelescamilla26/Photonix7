<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $credenciales = $request->only('email', 'password');

        if (Auth::attempt($credenciales)) {

            $request->session()->regenerate();

            return response()->json([
                "success" => true,
            ]);
        }

        return response()->json([
            "success" => false,
            "message" => "Credenciales incorrectas"
        ], 401);
    }
}