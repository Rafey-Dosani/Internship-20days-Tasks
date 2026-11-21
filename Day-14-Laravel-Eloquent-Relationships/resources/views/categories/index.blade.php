@extends('layouts.app')

@section('title', 'Categories')
@section('heading', 'Categories')

@section('content')
    <div class="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
            <h1 class="page-title">Categories</h1>
            <p class="page-subtitle">Organize products into clear groups.</p>
        </div>
        <a class="btn btn-primary px-3 py-2" href="{{ route('web.categories.create') }}">Add category</a>
    </div>

    <section class="panel">
        <div class="panel-header d-flex align-items-center justify-content-between">
            <div>
                <h2 class="h6 mb-1 fw-bold">All categories</h2>
                <p class="small text-secondary mb-0">{{ $categories->total() }} categories</p>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table">
                <thead>
                <tr>
                    <th scope="col">Category</th>
                    <th scope="col">Description</th>
                    <th scope="col">Products</th>
                    <th scope="col" class="text-end">Actions</th>
                </tr>
                </thead>
                <tbody>
                @forelse ($categories as $category)
                    <tr>
                        <td class="fw-semibold">{{ $category->name }}</td>
                        <td class="text-secondary">{{ $category->description ?: '—' }}</td>
                        <td><span class="badge rounded-pill text-bg-light border">{{ $category->products_count }}</span></td>
                        <td>
                            <div class="d-flex justify-content-end gap-2">
                                <a class="btn btn-sm btn-outline-secondary" href="{{ route('web.categories.edit', $category) }}">Edit</a>
                                <form method="POST" action="{{ route('web.categories.destroy', $category) }}" onsubmit="return confirm('Delete this category and its products?')">
                                    @csrf
                                    @method('DELETE')
                                    <button class="btn btn-sm btn-outline-danger" type="submit">Delete</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr><td class="empty-state" colspan="4">No categories yet. Create a category before adding products.</td></tr>
                @endforelse
                </tbody>
            </table>
        </div>
        @if ($categories->hasPages())
            <div class="panel-body border-top">{{ $categories->links('pagination::bootstrap-5') }}</div>
        @endif
    </section>
@endsection
