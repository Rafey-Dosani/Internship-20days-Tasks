<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_category_has_many_products_and_products_belong_to_category(): void
    {
        $category = Category::factory()
            ->has(Product::factory()->count(2))
            ->create();

        $this->assertCount(2, $category->products);
        $this->assertSame($category->id, $category->products->first()->category->id);
    }

    public function test_deleting_a_category_cascades_to_its_products(): void
    {
        $category = Category::factory()
            ->has(Product::factory()->count(2))
            ->create();
        $productIds = $category->products->modelKeys();

        $category->delete();

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
        foreach ($productIds as $productId) {
            $this->assertDatabaseMissing('products', ['id' => $productId]);
        }
    }

    public function test_category_endpoints_return_categories_and_their_products(): void
    {
        $category = Category::factory()
            ->has(Product::factory()->count(2))
            ->create(['name' => 'Stationery']);

        $this->getJson('/api/categories')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Stationery')
            ->assertJsonPath('data.0.products_count', 2);

        $this->getJson("/api/categories/{$category->id}")
            ->assertOk()
            ->assertJsonPath('data.name', 'Stationery')
            ->assertJsonCount(2, 'data.products');
    }

    public function test_product_can_be_created_with_a_valid_category(): void
    {
        $category = Category::factory()->create();

        $this->postJson('/api/products', [
            'category_id' => $category->id,
            'name' => 'Desk Lamp',
            'description' => 'Adjustable reading lamp.',
            'price' => '24.50',
        ])
            ->assertCreated()
            ->assertJsonPath('data.name', 'Desk Lamp')
            ->assertJsonPath('data.price', '24.50')
            ->assertJsonPath('data.category.id', $category->id);

        $this->assertDatabaseHas('products', [
            'category_id' => $category->id,
            'name' => 'Desk Lamp',
            'price' => '24.50',
        ]);
    }

    public function test_product_creation_returns_json_validation_errors(): void
    {
        $this->postJson('/api/products', [
            'name' => '',
            'description' => ['invalid'],
            'price' => 'not-a-price',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['category_id', 'name', 'description', 'price']);

        $this->assertDatabaseCount('products', 0);
    }

    public function test_invalid_category_references_are_rejected_on_create_and_update(): void
    {
        $category = Category::factory()->create();
        $product = Product::factory()->for($category)->create();

        $this->postJson('/api/products', [
            'category_id' => 9999,
            'name' => 'New Product',
            'description' => null,
            'price' => '10.00',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('category_id');

        $this->putJson("/api/products/{$product->id}", [
            'category_id' => 9999,
            'name' => 'Updated Product',
            'description' => null,
            'price' => '12.00',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('category_id');

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'category_id' => $category->id,
        ]);
    }

    public function test_product_can_be_updated_with_valid_data(): void
    {
        $product = Product::factory()->create();
        $newCategory = Category::factory()->create();

        $this->putJson("/api/products/{$product->id}", [
            'category_id' => $newCategory->id,
            'name' => 'Updated Product',
            'description' => null,
            'price' => '19.99',
        ])
            ->assertOk()
            ->assertJsonPath('data.name', 'Updated Product')
            ->assertJsonPath('data.category.id', $newCategory->id);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'category_id' => $newCategory->id,
            'name' => 'Updated Product',
            'price' => '19.99',
        ]);
    }

    public function test_product_can_be_partially_updated_with_patch(): void
    {
        $product = Product::factory()->create(['name' => 'Original Product']);

        $this->patchJson("/api/products/{$product->id}", [
            'name' => 'Renamed Product',
        ])
            ->assertOk()
            ->assertJsonPath('data.name', 'Renamed Product')
            ->assertJsonPath('data.category.id', $product->category_id);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Renamed Product',
        ]);
    }

    public function test_products_are_paginated_with_metadata(): void
    {
        Product::factory()->count(12)->create();

        $this->getJson('/api/products?per_page=5&page=2')
            ->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJsonPath('meta.current_page', 2)
            ->assertJsonPath('meta.per_page', 5)
            ->assertJsonPath('meta.total', 12)
            ->assertJsonPath('meta.last_page', 3)
            ->assertJsonStructure(['links' => ['first', 'last', 'prev', 'next']]);
    }

    public function test_product_can_be_retrieved_and_deleted(): void
    {
        $product = Product::factory()->create(['name' => 'Desk Lamp']);

        $this->getJson("/api/products/{$product->id}")
            ->assertOk()
            ->assertJsonPath('data.name', 'Desk Lamp')
            ->assertJsonPath('data.category.id', $product->category_id);

        $this->deleteJson("/api/products/{$product->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }

    public function test_product_updates_return_json_validation_errors_without_changing_the_product(): void
    {
        $product = Product::factory()->create([
            'name' => 'Original Product',
            'price' => '15.00',
        ]);

        $this->putJson("/api/products/{$product->id}", [
            'category_id' => $product->category_id,
            'name' => '',
            'description' => null,
            'price' => '-1',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'price']);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Original Product',
            'price' => '15.00',
        ]);
    }
}
