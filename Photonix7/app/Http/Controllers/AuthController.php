<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Address;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validator = validator($request->all(), [
                'name' => 'required',
                'email' => 'required|email|unique:users',
                'phone' => 'required',
                'street' => 'required',
                'neighborhood' => 'required',
                'city' => 'required',
                'state' => 'required',
                'postal_code' => 'required',
                'country' => 'required',
                'password' => 'required|min:6|confirmed'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Datos inválidos',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'role' => 'cliente'
            ]);

            Address::create([
                'user_id' => $user->id,
                'street' => $request->street,
                'neighborhood' => $request->neighborhood,
                'city' => $request->city,
                'state' => $request->state,
                'postal_code' => $request->postal_code,
                'country' => $request->country
            ]);

            return response()->json(['message' => 'Usuario registrado']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        if (Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Login correcto']);
        }

        return response()->json(['message' => 'Credenciales incorrectas'], 401);
    }
}
