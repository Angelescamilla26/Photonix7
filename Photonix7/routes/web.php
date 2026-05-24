<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
//use PhpParser\Node\Name;
//use App\Http\Controllers\AuthController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\DashboardController;



/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout']);
Route::post('/register', [RegisterController::class, 'register']);
Route::get('/dashboard-data', [DashboardController::class, 'index'])
    ->middleware('auth');

Route::get('/', function () {
    return view('welcome');
})->name('welcome');

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/tienda', function () {
    return view('tienda');
})->name('tienda');

Route::get('/nosotros', function () {
    return view('nosotros');
})->name('nosotros');

Route::get('/login', function () {
    return view('login');
})->name('login');

Route::get('/vehiculo', function () {
    return view('vehiculo');
})->name('vehiculo');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

//require __DIR__.'/auth.php';


Route::middleware('auth')->get('/api/user', function (Request $request) {
    return $request->user();
});

Route::post('/crear-preferencia', [App\Http\Controllers\PagoController::class, 'crearPreferencia'])
    ->middleware('auth');
