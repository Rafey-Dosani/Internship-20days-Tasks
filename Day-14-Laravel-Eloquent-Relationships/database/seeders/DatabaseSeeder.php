<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $catalog = [
            [
                'name' => 'Electronics',
                'description' => 'Everyday devices and accessories.',
                'products' => [
                    ['name' => 'Wireless Headphones', 'description' => 'Over-ear headphones with noise cancellation.', 'price' => 89.99],
                    ['name' => 'USB-C Charger', 'description' => 'Compact 30W fast charger.', 'price' => 24.50],
                ],
            ],
            [
                'name' => 'Home and Kitchen',
                'description' => 'Practical essentials for the home.',
                'products' => [
                    ['name' => 'Ceramic Mug Set', 'description' => 'Set of four dishwasher-safe mugs.', 'price' => 18.00],
                    ['name' => 'Cotton Tea Towels', 'description' => 'Absorbent two-piece kitchen towel set.', 'price' => 12.75],
                ],
            ],
            [
                'name' => 'Outdoor',
                'description' => 'Gear for recreation and travel.',
                'products' => [
                    ['name' => 'Insulated Water Bottle', 'description' => 'Reusable stainless-steel bottle.', 'price' => 29.95],
                    ['name' => 'Compact Daypack', 'description' => 'Lightweight backpack for day trips.', 'price' => 54.00],
                ],
            ],
        ];

        foreach ($catalog as $categoryData) {
            $category = Category::query()->firstOrCreate(
                ['name' => $categoryData['name']],
                ['description' => $categoryData['description']],
            );

            foreach ($categoryData['products'] as $productData) {
                $category->products()->firstOrCreate(
                    ['name' => $productData['name']],
                    [
                        'description' => $productData['description'],
                        'price' => $productData['price'],
                    ],
                );
            }
        }
    }
}
