<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_creation_form_is_available(): void
    {
        $this->get(route('products.create'))
            ->assertOk()
            ->assertSee('Add a product')
            ->assertSee('name="name"', false)
            ->assertSee('name="_token"', false);
    }

    public function test_products_index_displays_products(): void
    {
        Product::factory()->create([
            'name' => 'Desk Lamp',
            'description' => 'Adjustable reading lamp',
        ]);

        $this->get(route('products.index'))
            ->assertOk()
            ->assertSee('Desk Lamp')
            ->assertSee('Adjustable reading lamp');
    }

    public function test_product_can_be_created_with_valid_data(): void
    {
        $this->post(route('products.store'), [
            'name' => 'Desk Lamp',
            'description' => 'Adjustable reading lamp',
            'price' => '24.50',
            'quantity' => '8',
        ])
            ->assertRedirect(route('products.index'))
            ->assertSessionHas('success', 'Product added successfully.');

        $this->assertDatabaseHas('products', [
            'name' => 'Desk Lamp',
            'description' => 'Adjustable reading lamp',
            'price' => '24.50',
            'quantity' => 8,
        ]);
    }

    public function test_product_creation_validates_all_inputs(): void
    {
        $this->from(route('products.create'))
            ->post(route('products.store'), [
                'name' => '',
                'description' => ['invalid'],
                'price' => 'not-a-price',
                'quantity' => '-1',
            ])
            ->assertRedirect(route('products.create'))
            ->assertSessionHasErrors(['name', 'description', 'price', 'quantity']);

        $this->assertDatabaseCount('products', 0);
    }

    public function test_existing_product_can_be_edited_and_updated(): void
    {
        $product = Product::factory()->create([
            'name' => 'Old Name',
            'price' => '10.00',
            'quantity' => 2,
        ]);

        $this->get(route('products.edit', $product))
            ->assertOk()
            ->assertSee('Old Name')
            ->assertSee('value="10.00"', false);

        $this->put(route('products.update', $product), [
            'name' => 'New Name',
            'description' => null,
            'price' => '18.75',
            'quantity' => '5',
        ])
            ->assertRedirect(route('products.index'))
            ->assertSessionHas('success', 'Product updated successfully.');

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'New Name',
            'description' => null,
            'price' => '18.75',
            'quantity' => 5,
        ]);
    }

    public function test_product_can_be_deleted(): void
    {
        $product = Product::factory()->create();

        $this->delete(route('products.destroy', $product))
            ->assertRedirect(route('products.index'))
            ->assertSessionHas('success', 'Product deleted successfully.');

        $this->assertDatabaseMissing('products', [
            'id' => $product->id,
        ]);
    }
}
