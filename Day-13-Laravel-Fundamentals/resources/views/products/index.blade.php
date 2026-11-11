@extends('layouts.app')

@section('title', 'Product dashboard')

@section('content')
    <section class="page-heading">
        <div>
            <p class="eyebrow">Inventory management</p>
            <h1>Product dashboard</h1>
            <p class="page-description">Manage your catalog, pricing, and stock in one place.</p>
        </div>
        <a class="button button-primary" href="{{ route('products.create') }}">＋ <span>Add product</span></a>
    </section>

    <section class="summary-grid" aria-label="Inventory summary">
        <article class="summary-card">
            <span class="summary-label">Total products</span>
            <strong>{{ $products->count() }}</strong>
            <span class="summary-note">Products in your catalog</span>
        </article>
        <article class="summary-card">
            <span class="summary-label">Units in stock</span>
            <strong>{{ $products->sum('quantity') }}</strong>
            <span class="summary-note">Across all products</span>
        </article>
    </section>

    <section class="panel">
        <div class="panel-heading">
            <div>
                <h2>All products</h2>
                <p>{{ $products->count() }} {{ \Illuminate\Support\Str::plural('item', $products->count()) }} in your catalog</p>
            </div>
        </div>

        @if ($products->isEmpty())
            <div class="empty-state">
                <div class="empty-icon" aria-hidden="true">□</div>
                <h3>No products yet</h3>
                <p>Add your first product to start managing your inventory.</p>
                <a class="button button-primary" href="{{ route('products.create') }}">Add your first product</a>
            </div>
        @else
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Product</th>
                            <th scope="col">Price</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Last updated</th>
                            <th scope="col" class="actions-heading">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($products as $product)
                            <tr>
                                <td>
                                    <div class="product-name">{{ $product->name }}</div>
                                    @if ($product->description)
                                        <div class="product-description">{{ $product->description }}</div>
                                    @endif
                                </td>
                                <td class="price-cell">${{ number_format((float) $product->price, 2) }}</td>
                                <td><span class="quantity-badge">{{ $product->quantity }}</span></td>
                                <td class="date-cell">{{ $product->updated_at->format('M j, Y') }}</td>
                                <td>
                                    <div class="row-actions">
                                        <a class="button button-secondary button-small" href="{{ route('products.edit', $product) }}">Edit</a>
                                        <form method="POST" action="{{ route('products.destroy', $product) }}" onsubmit="return confirm('Delete this product?')">
                                            @csrf
                                            @method('DELETE')
                                            <button class="button button-danger button-small" type="submit">Delete</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </section>
@endsection
