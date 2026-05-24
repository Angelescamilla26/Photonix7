<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $totalOrders = $user->orders()->count();
        $totalSpent = $user->orders()->where('status', '!=', 'cancelado')->sum('total');
        $ordersInTransit = $user->orders()->whereIn('status', ['procesando', 'enviado'])->count();
        
        // Si no tienes reseñas, comenta la siguiente línea y usa 0
        // $averageRating = $user->reviews()->avg('rating') ?? 0;
        $averageRating = 0; // Temporal

        $recentOrders = $user->orders()
            ->with('items.product')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->order_number,
                    'product' => optional($order->items->first())->product->name ?? 'Producto',
                    'date' => $order->created_at->format('Y-m-d'),
                    'total' => $order->total,
                    'status' => $order->status,
                ];
            });

        // Datos para la gráfica (últimos 6 meses)
        $chartData = $this->getMonthlyOrders($user);

        return response()->json([
            'user' => [
                'name' => $user->name,
                'email' => $user->email
            ],
            'stats' => [
                'total_orders' => $totalOrders,
                'total_spent' => $totalSpent,
                'orders_in_transit' => $ordersInTransit,
                'average_rating' => round($averageRating, 1)
            ],
            'recent_orders' => $recentOrders,
            'chart' => $chartData
        ]);
    }

    private function getMonthlyOrders($user)
    {
        $months = [];
        $counts = [];

        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $months[] = $date->format('M');
            $count = $user->orders()
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
            $counts[] = $count;
        }

        return [
            'labels' => $months,
            'data' => $counts,
        ];
    }
}