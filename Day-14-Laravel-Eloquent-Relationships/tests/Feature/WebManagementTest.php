<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WebManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_displays_category_and_product_totals(): void
    {
        $category = Category::factory()->create();
        Product::factory()->count(2)->for($category)->create();

        $this->get(route('web.dashboard'))
            ->assertOk()
            ->assertSee('Total categories')
            ->assertSee('Total products')
            ->assertSee('Manage categories')
            ->assertSee('Manage products')
            ->assertSee('class="stat-value">1</div>', false)
            ->assertSee('class="stat-value">2</div>', false);
    }

    public function test_category_pages_show_product_counts_and_forms(): void
    {
        $category = Category::factory()
            ->has(Product::factory()->count(2))
            ->create(['name' => 'Stationery']);

        $this->get(route('web.categories.index'))
            ->assertOk()
            ->assertSee('Stationery')
            ->assertSee('2');

        $this->get(route('web.categories.create'))
            ->assertOk()
            ->assertSee('Create category')
            ->assertSee('name="name"', false)
            ->assertSee('name="_token"', false);

        $this->get(route('web.categories.edit', $category))
            ->assertOk()
            ->assertSee('Stationery')
            ->assertSee('name="_method" value="PUT"', false);
    }

    public function test_category_can_be_created_updated_and_deleted_from_the_web_interface(): void
    {
        $this->from(route('web.categories.create'))
            ->post(route('web.categories.store'), [
                'name' => 'Accessories',
                'description' => 'Useful extras.',
            ])
            ->assertRedirect(route('web.categories.index'))
            ->assertSessionHas('status', 'Category created successfully.');

        $category = Category::query()->where('name', 'Accessories')->firstOrFail();
        $this->assertModelExists($category);

        $this->put(route('web.categories.update', $category), [
            'name' => 'Travel Accessories',
            'description' => 'Essentials for trips.',
        ])
            ->assertRedirect(route('web.categories.index'))
            ->assertSessionHas('status', 'Category updated successfully.');

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Travel Accessories',
        ]);

        $this->delete(route('web.categories.destroy', $category))
            ->assertRedirect(route('web.categories.index'))
            ->assertSessionHas('status', 'Category deleted successfully.');

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_invalid_category_form_input_redirects_with_validation_errors(): void
    {
        Category::factory()->create(['name' => 'Books']);

        $this->from(route('web.categories.create'))
            ->post(route('web.categories.store'), [
                'name' => 'Books',
                'description' => ['invalid'],
            ])
            ->assertRedirect(route('web.categories.create'))
            ->assertSessionHasErrors(['name', 'description']);

        $this->assertDatabaseCount('categories', 1);
    }

    public function test_product_can_be_created_updated_and_deleted_from_the_web_interface(): void
    {
        $category = Category::factory()->create(['name' => 'Lighting']);
        $replacementCategory = Category::factory()->create(['name' => 'Home']);

        $this->get(route('web.products.create'))
            ->assertOk()
            ->assertSee('name="category_id"', false)
            ->assertSee('Lighting');

        $this->from(route('web.products.create'))
            ->post(route('web.products.store'), [
                'category_id' => $category->id,
                'name' => 'Desk Lamp',
                'description' => 'Adjustable task light.',
                'price' => '24.50',
            ])
            ->assertRedirect(route('web.products.index'))
            ->assertSessionHas('status', 'Product created successfully.');

        $product = Product::query()->where('name', 'Desk Lamp')->firstOrFail();
        $this->assertModelExists($product);
        $this->assertSame($category->id, $product->category_id);

        $this->get(route('web.products.index'))
            ->assertOk()
            ->assertSee('Desk Lamp')
            ->assertSee('Lighting')
            ->assertSee('$24.50');

        $this->get(route('web.products.edit', $product))
            ->assertOk()
            ->assertSee('Desk Lamp')
            ->assertSee('Lighting');

        $this->put(route('web.products.update', $product), [
            'category_id' => $replacementCategory->id,
            'name' => 'Reading Lamp',
            'description' => 'Updated product.',
            'price' => '32.00',
        ])
            ->assertRedirect(route('web.products.index'))
            ->assertSessionHas('status', 'Product updated successfully.');

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'category_id' => $replacementCategory->id,
            'name' => 'Reading Lamp',
            'price' => '32.00',
        ]);

        $this->delete(route('web.products.destroy', $product))
            ->assertRedirect(route('web.products.index'))
            ->assertSessionHas('status', 'Product deleted successfully.');

        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }

    public function test_invalid_product_form_input_redirects_with_errors_without_creating_a_product(): void
    {
        $this->from(route('web.products.create'))
            ->post(route('web.products.store'), [
                'category_id' => 9999,
                'name' => '',
                'description' => ['invalid'],
                'price' => '-1',
            ])
            ->assertRedirect(route('web.products.create'))
            ->assertSessionHasErrors(['category_id', 'name', 'description', 'price']);

        $this->assertDatabaseCount('products', 0);
    }

    public function test_product_listing_paginates_database_records(): void
    {
        $category = Category::factory()->create();
        $firstProduct = Product::factory()->for($category)->create(['name' => 'Oldest Product']);
        Product::factory()->count(10)->for($category)->create();
        $latestProduct = Product::factory()->for($category)->create(['name' => 'Newest Product']);

        $this->get(route('web.products.index', ['page' => 2]))
            ->assertOk()
            ->assertSee('Oldest Product')
            ->assertDontSee('Newest Product')
            ->assertSee('aria-current="page"', false);

        $this->assertModelExists($firstProduct);
        $this->assertModelExists($latestProduct);
    }

    public function test_blade_escapes_category_names_in_the_listing(): void
    {
        $category = Category::factory()->create([
            'name' => '<script>alert("x")</script>',
        ]);

        $this->get(route('web.categories.index'))
            ->assertOk()
            ->assertSee('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;', false)
            ->assertDontSee('<script>alert("x")</script>', false);

        $this->assertModelExists($category);
    }
}
