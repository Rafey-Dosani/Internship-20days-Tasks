<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Contracts\View\View;

class DashboardController extends Controller
{
    public function index(): View
    {
        return view('dashboard', [
            'categoryCount' => Category::query()->count(),
            'productCount' => Product::query()->count(),
            'recentProducts' => Product::query()
                ->with('category')
                ->latest('id')
                ->limit(5)
                ->get(),
        ]);
    }
}
