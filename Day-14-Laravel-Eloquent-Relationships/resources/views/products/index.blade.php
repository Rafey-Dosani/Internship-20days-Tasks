@extends('layouts.app')

@section('title', 'Products')
@section('heading', 'Products')

@section('content')
    <div class="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
            <h1 class="page-title">Products</h1>
            <p class="page-subtitle">Manage the items in your catalog.</p>
        </div>
        <a class="btn btn-primary px-3 py-2" href="{{ route('web.products.create') }}">Add product</a>
    </div>

    <section class="panel">
        <div class="panel-header d-flex align-items-center justify-content-between">
            <div>
                <h2 class="h6 mb-1 fw-bold">All products</h2>
                <p class="small text-secondary mb-0">{{ $products->total() }} products</p>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table">
                <thead>
                <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Category</th>
                    <th scope="col">Description</th>
                    <th scope="col" class="text-end">Price</th>
                    <th scope="col" class="text-end">Actions</th>
                </tr>
                </thead>
                <tbody>
                @forelse ($products as $product)
                    <tr>
                        <td class="fw-semibold">{{ $product->name }}</td>
                        <td><span class="badge rounded-pill text-bg-light border">{{ $product->category->name }}</span></td>
                        <td class="text-secondary">{{ $product->description ?: '—' }}</td>
                        <td class="text-end text-nowrap">${{ number_format((float) $product->price, 2) }}</td>
                        <td>
                            <div class="d-flex justify-content-end gap-2">
                                <a class="btn btn-sm btn-outline-secondary" href="{{ route('web.products.edit', $product) }}">Edit</a>
                                <form method="POST" action="{{ route('web.products.destroy', $product) }}" onsubmit="return confirm('Delete this product?')">
                                    @csrf
                                    @method('DELETE')
                                    <button class="btn btn-sm btn-outline-danger" type="submit">Delete</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr><td class="empty-state" colspan="5">No products yet. Add a product to get started.</td></tr>
                @endforelse
                </tbody>
            </table>
        </div>
        @if ($products->hasPages())
            <div class="panel-body border-top">{{ $products->links('pagination::bootstrap-5') }}</div>
        @endif
    </section>
@endsection
