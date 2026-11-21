@extends('layouts.app')

@section('title', 'Dashboard')
@section('heading', 'Dashboard')

@section('content')
    <div class="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
            <h1 class="page-title">Overview</h1>
            <p class="page-subtitle">A quick look at your product catalog.</p>
        </div>
        <a class="btn btn-primary px-3 py-2" href="{{ route('web.products.create') }}">Add a product</a>
    </div>

    <div class="row g-3 mb-4">
        <div class="col-12 col-md-6">
            <section class="panel stat-card">
                <div class="stat-icon" aria-hidden="true">C</div>
                <div>
                    <div class="stat-label">Total categories</div>
                    <div class="stat-value">{{ number_format($categoryCount) }}</div>
                    <a class="small text-decoration-none" href="{{ route('web.categories.index') }}">Manage categories</a>
                </div>
            </section>
        </div>
        <div class="col-12 col-md-6">
            <section class="panel stat-card">
                <div class="stat-icon" aria-hidden="true">P</div>
                <div>
                    <div class="stat-label">Total products</div>
                    <div class="stat-value">{{ number_format($productCount) }}</div>
                    <a class="small text-decoration-none" href="{{ route('web.products.index') }}">Manage products</a>
                </div>
            </section>
        </div>
    </div>

    <section class="panel">
        <div class="panel-header d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div>
                <h2 class="h6 mb-1 fw-bold">Recently added products</h2>
                <p class="small text-secondary mb-0">The latest items in your catalog.</p>
            </div>
            <a class="btn btn-sm btn-outline-primary" href="{{ route('web.products.index') }}">View all products</a>
        </div>
        <div class="table-responsive">
            <table class="table">
                <thead>
                <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Category</th>
                    <th scope="col" class="text-end">Price</th>
                </tr>
                </thead>
                <tbody>
                @forelse ($recentProducts as $product)
                    <tr>
                        <td class="fw-semibold">{{ $product->name }}</td>
                        <td>{{ $product->category->name }}</td>
                        <td class="text-end">${{ number_format((float) $product->price, 2) }}</td>
                    </tr>
                @empty
                    <tr><td class="empty-state" colspan="3">No products yet. Add your first product to get started.</td></tr>
                @endforelse
                </tbody>
            </table>
        </div>
    </section>
@endsection
